"""
Serializers para autenticação e registro de usuários.
Utiliza djangorestframework-simplejwt para tokens JWT.
"""

from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserProfile, PsicologoProfile
from .models import CheckIn


def is_psicologo(user):
    return user.groups.filter(name='Psicologos').exists()


class UserSerializer(serializers.ModelSerializer):
    """Serializer básico de usuário"""
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'date_joined',
        ]
        read_only_fields = ['id', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para registrar novos usuários.
    Valida senha forte e campos obrigatórios.
    Unicidade fica sob responsabilidade do banco.
    """
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        help_text="Deve ter pelo menos 8 caracteres"
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Confirmação da senha"
    )
    
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
        ]
        extra_kwargs = {
            'email': {
                'required': True,
                'allow_blank': False,
            },
            'first_name': {
                'required': True,
                'allow_blank': False,
            },
            'username': {
                'required': False,
                'allow_blank': True,
            },
        }
    
    def validate(self, data):
        """Valida se as senhas conferem"""
        email = (data.get('email') or '').lower().strip()

        # username é sempre idêntico ao email para evitar duplicatas falsas
        if email:
            data['email'] = email
            data['username'] = email

        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'As senhas não conferem.'
            })
        return data
    
    def create(self, validated_data):
        """Cria um novo usuário"""
        validated_data.pop('password_confirm')
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except IntegrityError:
            raise serializers.ValidationError({
                'email': ['Este e-mail já está em uso.']
            })


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customiza a resposta do token para incluir dados do usuário.
    Adiciona primeiro_nome para UX (saudação personalizada).
    """

    DEMO_EMAIL = 'demo@calmflow.com'
    DEMO_PASSWORD = 'Demo12345'

    def _ensure_demo_user(self, username):
        """Ativa provisoriamente o usuário demo para facilitar testes de autenticação."""
        normalized_username = (username or '').lower().strip()
        if normalized_username != self.DEMO_EMAIL:
            return

        user, _ = User.objects.get_or_create(
            username=self.DEMO_EMAIL,
            defaults={
                'email': self.DEMO_EMAIL,
                'first_name': 'Demo',
                'is_active': True,
            }
        )

        user.email = self.DEMO_EMAIL
        user.first_name = user.first_name or 'Demo'
        user.is_active = True
        user.set_password(self.DEMO_PASSWORD)
        user.save(update_fields=['email', 'first_name', 'is_active', 'password'])

    def validate(self, attrs):
        attrs['username'] = (attrs.get('username') or '').lower().strip()
        self._ensure_demo_user(attrs.get('username'))
        data = super().validate(attrs)
        
        # Adiciona informações do usuário na resposta
        user = self.user
        data.update({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'primeiro_nome': user.first_name or user.username,
                'ultimo_nome': user.last_name or '',
            }
        })
        
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer para o perfil estendido do usuário"""
    
    class Meta:
        model = UserProfile
        fields = [
            'contato_apoio',
            'nome_contato_apoio',
            'vinculo_contato_apoio',
            'nome_psicologo',
            'telefone_psicologo',
            'registro_ordem_psicologo',
        ]


class PsicologoRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, allow_blank=False, max_length=150)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    registro_profissional = serializers.CharField(required=True, allow_blank=False, max_length=40)
    especialidade = serializers.CharField(required=False, allow_blank=True, max_length=120)
    telefone = serializers.CharField(required=False, allow_blank=True, max_length=20)

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'As senhas não conferem.'})

        attrs['email'] = attrs['email'].lower().strip()
        attrs['registro_profissional'] = attrs['registro_profissional'].strip()

        if User.objects.filter(username=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'Este e-mail já está em uso.'})

        if PsicologoProfile.objects.filter(registro_profissional__iexact=attrs['registro_profissional']).exists():
            raise serializers.ValidationError({'registro_profissional': 'Este registro profissional já está em uso.'})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')

        email = validated_data['email']
        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=validated_data['first_name'],
            password=password,
        )

        psicologos_group, _ = Group.objects.get_or_create(name='Psicologos')
        user.groups.add(psicologos_group)

        psicologo = PsicologoProfile.objects.create(
            user=user,
            registro_profissional=validated_data['registro_profissional'],
            especialidade=validated_data.get('especialidade', ''),
            telefone=validated_data.get('telefone', ''),
        )

        psicologo.sincronizar_vinculos_por_registro()
        return psicologo


class PsicologoTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        attrs['username'] = (attrs.get('username') or '').lower().strip()
        data = super().validate(attrs)

        if not is_psicologo(self.user):
            raise serializers.ValidationError({'detail': 'Acesso restrito para psicólogos.'})

        psicologo_profile = PsicologoProfile.objects.filter(user=self.user, ativo=True).first()
        if not psicologo_profile:
            raise serializers.ValidationError({'detail': 'Perfil de psicólogo não encontrado ou inativo.'})

        psicologo_profile.sincronizar_vinculos_por_registro()

        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'primeiro_nome': self.user.first_name or self.user.username,
            'is_psicologo': True,
        }
        data['psicologo'] = {
            'registro_profissional': psicologo_profile.registro_profissional,
            'especialidade': psicologo_profile.especialidade,
            'telefone': psicologo_profile.telefone,
        }
        return data


class PsicologoMeSerializer(serializers.ModelSerializer):
    registro_profissional = serializers.CharField(source='psicologo_profile.registro_profissional')
    especialidade = serializers.CharField(source='psicologo_profile.especialidade')
    telefone = serializers.CharField(source='psicologo_profile.telefone')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'registro_profissional', 'especialidade', 'telefone']


class PacienteResumoSerializer(serializers.ModelSerializer):
    """Resumo de um paciente vinculado ao psicólogo."""
    total_checkins = serializers.SerializerMethodField()
    ultimo_checkin = serializers.SerializerMethodField()
    streak_dias = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'email', 'total_checkins', 'ultimo_checkin', 'streak_dias']

    def get_total_checkins(self, user):
        from .models import CheckIn
        return CheckIn.objects.filter(usuario=user).count()

    def get_ultimo_checkin(self, user):
        from .models import CheckIn
        ci = CheckIn.objects.filter(usuario=user).order_by('-criado_em').first()
        return ci.criado_em.isoformat() if ci else None

    def get_streak_dias(self, user):
        from .models import CheckIn, Emergencia
        from django.utils import timezone
        from datetime import timedelta
        datas = set(
            CheckIn.objects.filter(usuario=user).dates('criado_em', 'day', order='DESC')
        ) | set(
            Emergencia.objects.filter(usuario=user).dates('criado_em', 'day', order='DESC')
        )
        if not datas:
            return 0
        today = timezone.localdate()
        if today not in datas:
            return 0
        streak = 1
        ref = today - timedelta(days=1)
        while ref in datas:
            streak += 1
            ref -= timedelta(days=1)
        return streak


class CheckInResumoSerializer(serializers.ModelSerializer):
    """Serializer de check-in para leitura pelo psicólogo."""

    class Meta:
        model = CheckIn
        fields = [
            'id', 'clima_interno', 'nivel_ruido', 'gatilho',
            'auto_eficacia', 'sintomas', 'notas', 'criado_em',
        ]

