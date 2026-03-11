"""
Serializers para autenticação e registro de usuários.
Utiliza djangorestframework-simplejwt para tokens JWT.
"""

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
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
    Valida: email único, senha forte, campos obrigatórios.
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
                'required': True,
                'allow_blank': False,
            },
        }
    
    def validate_email(self, value):
        """Valida se o email é único"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Um usuário com este email já existe."
            )
        return value
    
    def validate_username(self, value):
        """Valida se o username é único"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Um usuário com este nome de usuário já existe."
            )
        return value
    
    def validate(self, data):
        """Valida se as senhas conferem"""
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'As senhas não conferem.'
            })
        return data
    
    def create(self, validated_data):
        """Cria um novo usuário"""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customiza a resposta do token para incluir dados do usuário.
    Adiciona primeiro_nome para UX (saudação personalizada).
    """
    
    def validate(self, attrs):
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
        fields = ['contato_apoio']

