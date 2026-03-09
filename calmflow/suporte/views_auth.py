"""
Views para autenticação e registro de usuários.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers_auth import RegisterSerializer, CustomTokenObtainPairSerializer


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
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'ultimo_nome': user.last_name or '',
                'message': 'Usuário registrado com sucesso! Faça login para continuar.'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
