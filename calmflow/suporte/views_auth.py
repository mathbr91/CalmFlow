"""
Views para autenticação e registro de usuários.
"""

import logging
from datetime import timedelta

from django.utils import timezone
from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers_auth import RegisterSerializer, CustomTokenObtainPairSerializer, UserProfileSerializer
from .models import UserProfile, CheckIn, Emergencia

logger = logging.getLogger(__name__)


def obter_dias_ativos(user):
    datas_checkin = set(
        CheckIn.objects.filter(usuario=user)
        .dates('criado_em', 'day', order='DESC')
    )
    datas_emergencia = set(
        Emergencia.objects.filter(usuario=user)
        .dates('criado_em', 'day', order='DESC')
    )
    return datas_checkin | datas_emergencia


def calcular_streak_dias(user):
    dias_ativos = obter_dias_ativos(user)
    if not dias_ativos:
        return 0

    today = timezone.localdate()
    if today not in dias_ativos:
        return 0

    streak = 1
    referencia = today - timedelta(days=1)
    while referencia in dias_ativos:
        streak += 1
        referencia = referencia - timedelta(days=1)

    return streak


def montar_payload_perfil(user, profile):
    dias_ativos = obter_dias_ativos(user)
    today = timezone.localdate()
    total_checkins = len(dias_ativos)
    sessoes_respiracao = Emergencia.objects.filter(usuario=user).count()
    tem_checkin_hoje = today in dias_ativos

    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'contato_apoio': profile.contato_apoio or '',
        'nome_contato_apoio': profile.nome_contato_apoio or '',
        'vinculo_contato_apoio': profile.vinculo_contato_apoio or '',
        'sessoes_respiracao': sessoes_respiracao,
        'total_checkins': total_checkins,
        'streak_dias': calcular_streak_dias(user),
        'tem_checkin_hoje': tem_checkin_hoje,
    }


class RegisterView(APIView):
    """
    View para registrar novos usuários (POST /api/register/).
    
    - Valida email único
    - Valida username único
    - Valida força da senha
    - Retorna os dados do novo usuário
    
    POST /api/register/
    {
        "username": "joao",
        "email": "joao@example.com",
        "first_name": "João",
        "last_name": "Silva",
        "password": "SenhaForte123!",
        "password_confirm": "SenhaForte123!"
    }
    
    Response 201:
    {
        "id": 1,
        "username": "joao",
        "email": "joao@example.com",
        "first_name": "João",
        "ultimo_nome": "Silva",
        "message": "Usuário registrado com sucesso! Faça login para continuar."
    }
    """
    
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        payload = request.data.copy()
        email_normalizado = (payload.get('email') or '').lower().strip()

        if email_normalizado:
            payload['email'] = email_normalizado

        serializer = RegisterSerializer(data=payload)
        
        if serializer.is_valid():
            try:
                user = serializer.save()
            except serializers.ValidationError as exc:
                logger.warning('[RegisterView] falha no save | erros=%s | payload_keys=%s', exc.detail, list(request.data.keys()))
                return Response(exc.detail, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'ultimo_nome': user.last_name or '',
                'message': 'Usuário registrado com sucesso! Faça login para continuar.'
            }, status=status.HTTP_201_CREATED)
        
        errors = dict(serializer.errors)
        username_errors = errors.get('username')
        if username_errors:
            username_msg = ' '.join([str(item) for item in username_errors]).lower()
            if 'already' in username_msg or 'uso' in username_msg or 'exists' in username_msg or 'já' in username_msg:
                errors.pop('username', None)
                errors['email'] = ['Este e-mail já está em uso.']

        logger.warning('[RegisterView] validação falhou | erros=%s | payload_keys=%s', errors, list(request.data.keys()))
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    View customizada para login.
    Retorna access_token, refresh_token + dados do usuário (primeiro_nome).
    
    POST /api/token/
    {
        "username": "joao",
        "password": "SenhaForte123!"
    }
    
    Response 200:
    {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "user": {
            "id": 1,
            "username": "joao",
            "email": "joao@example.com",
            "primeiro_nome": "João",
            "ultimo_nome": "Silva"
        }
    }
    """
    
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    View para retornar o perfil do usuário logado.
    
    GET /api/profile/
    
    Response 200:
    {
        "id": 1,
        "username": "joao",
        "email": "joao@example.com",
        "first_name": "João",
        "ultimo_nome": "Silva",
        "date_joined": "2026-03-09T10:30:00Z"
    }
    """
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'ultimo_nome': user.last_name or '',
        'date_joined': user.date_joined,
    })


class UserProfileView(APIView):
    """
    View para gerenciar o perfil estendido do usuário (contato_apoio).
    
    GET /api/profile-extended/
    Response 200:
    {
        "id": 1,
        "username": "joao",
        "email": "joao@example.com",
        "first_name": "João",
        "contato_apoio": "+55 11 98765-4321"
    }
    
    PUT /api/profile-extended/
    {
        "contato_apoio": "+55 11 98765-4321"
    }
    
    Response 200:
    {
        "id": 1,
        "username": "joao",
        "email": "joao@example.com",
        "first_name": "João",
        "contato_apoio": "+55 11 98765-4321",
        "message": "Perfil atualizado com sucesso!"
    }
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Retorna o perfil do usuário com contato_apoio"""
        user = request.user
        profile, created = UserProfile.objects.get_or_create(usuario=user)

        return Response(montar_payload_perfil(user, profile))
    
    def put(self, request):
        """Atualiza o contato_apoio do usuário"""
        user = request.user
        profile, created = UserProfile.objects.get_or_create(usuario=user)
        
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            payload = montar_payload_perfil(user, profile)
            payload['message'] = 'Perfil atualizado com sucesso!'
            return Response(payload, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
