"""
Serializers para autenticação e registro de usuários.
Utiliza djangorestframework-simplejwt para tokens JWT.
"""

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserProfile


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
        ]

