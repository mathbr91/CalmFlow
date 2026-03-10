"""
Serializers para os modelos do CalmFlow.
Utilizados para validação e transformação dos dados da API.
Suporte multiidioma para disclaimers jurídicos.
"""

from rest_framework import serializers
from .models import CheckIn, Emergencia
from .utils import obter_tecnica_por_sintoma, obter_disclaimer_jurídico


def detectar_idioma_da_request(request):
    """
    Detecta o idioma preferido do cliente.
    
    Prioridade:
    1. Parâmetro ?lang=pt-br na URL
    2. Header Accept-Language
    3. Padrão: 'pt-br'
    
    Args:
        request: DRF request object
        
    Returns:
        str: Código de idioma (ex: 'pt-br', 'en-us')
    """
    # 1. Verificar parâmetro de query
    idioma = request.query_params.get('lang', '').lower()
    if idioma:
        return idioma
    
    # 2. Verificar header Accept-Language
    accept_language = request.META.get('HTTP_ACCEPT_LANGUAGE', '')
    if accept_language:
        # formato típico: "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
        # Extrair o primeiro idioma
        idioma = accept_language.split(',')[0].split(';')[0].strip().lower()
        if idioma:
            # Converter pt/en para pt-br/en-us
            if idioma.startswith('pt'):
                return 'pt-br'
            elif idioma.startswith('en'):
                return 'en-us'
            return idioma
    
    # 3. Padrão
    return 'pt-br'



class CheckInSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source='usuario.username', read_only=True)
    clima_display = serializers.CharField(source='get_clima_internal_display', read_only=True)
    gatilho_display = serializers.CharField(source='get_gatilho_display', read_only=True)
    
    class Meta:
        model = CheckIn
        fields = [
            'id',
            'usuario',
            'usuario_nome',
            'clima_interno',
            'clima_display',
            'nivel_ruido',
            'gatilho',
            'gatilho_display',
            'auto_eficacia',
            'sintomas',
            'notas',
            'criado_em',
        ]
        read_only_fields = [
            'id',
            'criado_em',
            'usuario',
            'clima_display',
            'gatilho_display',
        ]


class EmergenciaSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.SerializerMethodField()
    sintoma_display = serializers.CharField(source='get_sintoma_principal_display', read_only=True)
    tecnica_sugerida = serializers.SerializerMethodField()
    disclaimer = serializers.SerializerMethodField()
    
    class Meta:
        model = Emergencia
        fields = [
            'id',
            'usuario',
            'usuario_nome',
            'sintoma_principal',
            'sintoma_display',
            'ambiente_seguro',
            'criado_em',
            'tecnica_sugerida',
            'disclaimer',
        ]
        read_only_fields = [
            'id',
            'criado_em',
            'usuario_nome',
            'sintoma_display',
            'tecnica_sugerida',
            'disclaimer',
        ]
    
    def get_usuario_nome(self, obj):
        """Retorna nome do usuário ou 'Anônimo' se não houver usuário"""
        return obj.usuario.username if obj.usuario else 'Anônimo'
    
    def get_tecnica_sugerida(self, obj):
        """Retorna a técnica de manejo baseada no sintoma"""
        return obter_tecnica_por_sintoma(obj.sintoma_principal)
    
    def get_disclaimer(self, obj):
        """
        Retorna o disclaimer jurídico no idioma apropriado.
        
        Detecta o idioma da request (parâmetro ?lang= ou Accept-Language header).
        """
        # Obter a request do contexto do serializer
        request = self.context.get('request')
        
        # Detectar idioma
        idioma = detectar_idioma_da_request(request) if request else 'pt-br'
        
        # Retornar disclaimer no idioma correto
        return obter_disclaimer_jurídico(idioma)
