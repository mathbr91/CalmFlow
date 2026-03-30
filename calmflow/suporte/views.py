"""
Views/Endpoints da API para o CalmFlow.
Implementação dos viewsets para CheckIn e Emergencia com lógica inteligente.
Suporte multiidioma para disclaimers jurídicos.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import CheckIn, Emergencia
from .serializers import CheckInSerializer, EmergenciaSerializer, detectar_idioma_da_request
from .utils import obter_dados_sos, obter_disclaimer_jurídico


class CheckInViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar check-ins de PREVENÇÃO.
    Permite criar, listar, atualizar e deletar monitoramentos diários.
    
    Endpoints:
    - GET /api/v1/check-ins/ - Listar meus check-ins
    - POST /api/v1/check-ins/ - Criar novo check-in
    - GET /api/v1/check-ins/{id}/ - Detalhe
    - PATCH /api/v1/check-ins/{id}/ - Atualizar
    - DELETE /api/v1/check-ins/{id}/ - Deletar
    """
    serializer_class = CheckInSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Retorna apenas os check-ins do usuário logado."""
        return CheckIn.objects.filter(usuario=self.request.user)
    
    def perform_create(self, serializer):
        """Atribui o usuário logado ao criar um check-in."""
        serializer.save(usuario=self.request.user)


class EmergenciaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar emergências de AÇÃO RÁPIDA.
    Permite registro rápido de crises emocionais com técnicas inteligentes.
    
    Quando uma emergência é criada, retorna automaticamente:
    - tecnica_sugerida: Técnica de manejo baseada no sintoma
    - disclaimer: Aviso jurídico obrigatório
    
    Endpoints:
    - GET /api/v1/emergencias/ - Listar minhas emergências
    - POST /api/v1/emergencias/ - Criar nova emergência (pode ser anônima) ✨
    - GET /api/v1/emergencias/{id}/ - Detalhe
    - PATCH /api/v1/emergencias/{id}/ - Atualizar
    - DELETE /api/v1/emergencias/{id}/ - Deletar
    """
    serializer_class = EmergenciaSerializer
    
    def get_queryset(self):
        """Retorna emergências do usuário logado ou anônimas."""
        user = self.request.user
        if user.is_authenticated:
            # Usuários autenticados veem suas próprias emergências
            return Emergencia.objects.filter(usuario=user)
        else:
            # Usuários não autenticados veem apenas emergências anônimas
            return Emergencia.objects.filter(usuario__isnull=True)
    
    def get_permissions(self):
        """Permite acesso anônimo para POST (criar emergências rápidas)."""
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        """
        Atribui o usuário logado ao criar uma emergência.
        Se não houver usuário, deixa como anônimo (usuario=null).
        
        A resposta contém automaticamente:
        - tecnica_sugerida: Instruções passo a passo
        - disclaimer: Aviso jurídico
        """
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(usuario=user)


@api_view(['GET'])
@permission_classes([AllowAny])
def sos_endpoint(request):
    """
    🚨 Endpoint de SOS - Informações de Emergência e Suporte
    
    Retorna:
    - Disclaimer jurídico no idioma do cliente
    - Dica rápida de respiração para acalmar
    
    Acessível para QUALQUER PESSOA (sem autenticação)
    
    Suporta multiidioma via:
    - Parâmetro: ?lang=pt-br ou ?lang=en-us
    - Header: Accept-Language: pt-BR ou en-US
    
    GET /api/v1/sos/
    GET /api/v1/sos/?lang=en-us
    """
    
    # Detectar idioma do cliente
    idioma = detectar_idioma_da_request(request)
    
    # Textos dinâmicos por idioma
    textos_sos = {
        'pt-br': {
            'status': 'SOS - Suporte de Emergência',
            'urgencia': '🚨 Se você está em risco imediato, ligue para 911',
            'tecnica_titulo': '🌬️ Respire - Técnica Rápida de 1 Minuto',
        },
        'en-us': {
            'status': 'SOS - Emergency Support',
            'urgencia': '🚨 If you are in immediate danger, call 911',
            'tecnica_titulo': '🌬️ Breathe - Quick 1-Minute Technique',
        }
    }
    
    # Usar PT-BR como padrão se idioma não existir
    if idioma not in textos_sos:
        idioma = 'pt-br'
    
    textos = textos_sos[idioma]
    
    resposta = {
        'status': textos['status'],
        'idioma': idioma,
        'urgencia': textos['urgencia'],
        'disclaimer': obter_disclaimer_jurídico(idioma),
        'tecnica_rapida': {
            'titulo': textos['tecnica_titulo'],
            'instrucoes': [
                '1. Respire fundo pelo nariz contando até 4',
                '2. Segure por 4 segundos',
                '3. Expire pela boca contando até 4',
                '4. Segure vazio por 4 segundos',
                '5. Repita 5 vezes'
            ] if idioma == 'pt-br' else [
                '1. Breathe deeply through your nose counting to 4',
                '2. Hold for 4 seconds',
                '3. Exhale slowly through your mouth counting to 4',
                '4. Hold empty for 4 seconds',
                '5. Repeat 5 times'
            ],
            'duracao': '~2 minutos' if idioma == 'pt-br' else '~2 minutes'
        }
    }
    
    return Response(resposta, status=status.HTTP_200_OK)
