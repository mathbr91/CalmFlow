"""
Utilidades para o CalmFlow.
Mapeamento de técnicas de manejo de crise e informações de SOS.
Suporte multiidioma (PT-BR, EN-US).
"""

# Disclaimers jurídicos multiidioma
DISCLAIMERS_JURIDICOS = {
    'pt-br': {
        'titulo': '⚠️ AVISO IMPORTANTE',
        'texto': 'Este aplicativo fornece ferramentas de suporte ao bem-estar e conteúdo informativo, não substituindo diagnóstico, aconselhamento ou tratamento médico/psicológico profissional. Se você está em perigo imediato, em crise ou com pensamentos de auto-extermínio, entre em contato imediatamente com os serviços de emergência, hospitais ou autoridades de saúde da sua região.'
    },
    'en-us': {
        'titulo': '⚠️ IMPORTANT',
        'texto': 'This app provides wellness support tools and informational content only. It is not a substitute for professional medical/psychological advice, diagnosis, or treatment. If you are in immediate danger or experiencing a crisis, please contact your local emergency services or healthcare authorities immediately.'
    },
    'en': {  # Alias para en-us
        'titulo': '⚠️ IMPORTANT',
        'texto': 'This app provides wellness support tools and informational content only. It is not a substitute for professional medical/psychological advice, diagnosis, or treatment. If you are in immediate danger or experiencing a crisis, please contact your local emergency services or healthcare authorities immediately.'
    }
}

# Mapeamento de técnicas por sintoma
TECNICAS_SINTOMA = {
    'peito': {
        'titulo': '🫀 Técnica de Relaxamento Muscular Progressivo',
        'descricao': 'Libere tensão acumulada focando em grupos musculares específicos.',
        'passos': [
            '1️⃣ Encontre um lugar calmo e confortável para sentar ou deitar.',
            '2️⃣ Comece pelos OMBROS: Levante-os até os ouvidos, segure por 5 segundos, solte.',
            '3️⃣ BRAÇOS: Aperte os punhos firmemente por 5 segundos, depois relaxe completamente.',
            '4️⃣ PEITO: Inspira profundo, segura a respiração por 5 segundos, expira lentamente.',
            '5️⃣ Repita cada grupo 3 vezes até sentir alívio da tensão.',
            '6️⃣ Notará que o peito/coração vai desacelerando naturalmente.',
            '⏱️ Tempo total: 5-10 minutos'
        ],
        'dica': 'Esta técnica diminui a ativação do sistema nervoso e reduz a frequência cardíaca.'
    },
    
    'respiracao': {
        'titulo': '🌬️ Técnica de Respiração Quadrada (4-4-4-4)',
        'descricao': 'Padrão de respiração que acalma o sistema nervoso rapidamente.',
        'passos': [
            '1️⃣ Respire PROFUNDAMENTE pelo nariz contando até 4',
            '2️⃣ SEGURE a respiração por 4 segundos',
            '3️⃣ Expire LENTAMENTE pela boca contando até 4',
            '4️⃣ SEGURE (vazio) por 4 segundos',
            '5️⃣ Repita este ciclo 5-10 vezes (3-5 minutos)',
            '6️⃣ Você deve sentir os batimentos do coração desacelerando',
            '💡 Dica: Imagine um quadrado enquanto respira em cada lado'
        ],
        'dica': 'Se sentir tontura, respire na velocidade natural e tente novamente mais devagar.'
    },
    
    'medo': {
        'titulo': '🌍 Técnica de Aterramento 5-4-3-2-1',
        'descricao': 'Conecte-se ao presente usando seus 5 sentidos para reduzir a ansiedade.',
        'passos': [
            '👀 VER (5 coisas): Nomeie 5 objetos que você vê ao seu redor',
            '👂 OUVIR (4 sons): Escute 4 sons à sua volta (ventilador, pássaros, etc)',
            '🤚 TOCAR (3 texturas): Toque 3 objetos com texturas diferentes',
            '👅 SABOREAR (2 sabores): Identifique 2 sabores (goma de mascar, água, etc)',
            '👃 CHEIRAR (1 aroma): Sinta o aroma de algo próximo (flor, café, sabonete)',
            '✅ Pronto! Você está ANCORADO no presente e seguro.',
            '⏱️ Tempo total: 5-10 minutos'
        ],
        'dica': 'Esta técnica reduz a ativação do medo ao focar no "aqui e agora".'
    },
    
    'confusao': {
        'titulo': '🌍 Técnica de Aterramento 5-4-3-2-1',
        'descricao': 'Conecte-se ao presente usando seus 5 sentidos para reduzir confusão.',
        'passos': [
            '👀 VER (5 coisas): Nomeie 5 objetos que você vê ao seu redor',
            '👂 OUVIR (4 sons): Escute 4 sons à sua volta (ventilador, pássaros, etc)',
            '🤚 TOCAR (3 texturas): Toque 3 objetos com texturas diferentes',
            '👅 SABOREAR (2 sabores): Identifique 2 sabores (goma de mascar, água, etc)',
            '👃 CHEIRAR (1 aroma): Sinta o aroma de algo próximo (flor, café, sabonete)',
            '✅ Pronto! Sua mente está clara e você está seguro.',
            '⏱️ Tempo total: 5-10 minutos'
        ],
        'dica': 'Reduz pensamentos acelerados ao ancorar atenção nos sentidos físicos.'
    },

    'outro': {
        'titulo': '🧘 Técnica de Respiração Consciente',
        'descricao': 'Técnica universal para qualquer tipo de crise emocional.',
        'passos': [
            '1️⃣ Sente-se confortavelmente em um local seguro',
            '2️⃣ Coloque uma mão no peito e outra na barriga',
            '3️⃣ Respire lentamente pelo nariz (inspire em 4 segundos)',
            '4️⃣ Segure por 2 segundos',
            '5️⃣ Expire lentamente pela boca (expire em 4 segundos)',
            '6️⃣ Repita por 5-10 minutos',
            '✅ Observe como seu corpo relaxa a cada respiração'
        ],
        'dica': 'A respiração consciente é a base de todas as técnicas de manejo de crise.'
    }
}


def obter_tecnica_por_sintoma(sintoma):
    """
    Retorna a técnica sugerida baseada no sintoma de emergência.
    
    Args:
        sintoma (str): O sintoma principal ('peito', 'respiracao', 'medo', 'confusao', 'outro')
    
    Returns:
        dict: Dicionário com técnica, passos e dicas
    """
    return TECNICAS_SINTOMA.get(sintoma, TECNICAS_SINTOMA['outro'])


def obter_dados_sos():
    """
    Retorna estrutura mínima para o endpoint /sos/.
    Dados geográficos reais (hospitais próximos) serão implementados
    futuramente via GPS + Google Places API.

    Returns:
        dict: Dicionário com instruções de emergência
    """
    return {
        'instrucao': 'Em caso de emergência, entre em contato com os serviços de emergência da sua região.',
        'hospitais_proximos': [],
    }


def obter_disclaimer_jurídico(idioma='pt-br'):
    """
    Retorna o disclaimer jurídico em um idioma específico.
    
    Args:
        idioma (str): Código do idioma ('pt-br', 'en-us', 'en'). 
                     Default: 'pt-br'
    
    Returns:
        str: Texto completo do disclaimer jurídico
        
    Exemplo:
        >>> obter_disclaimer_jurídico('pt-br')
        '⚠️ AVISO IMPORTANTE: Este aplicativo fornece...'
        
        >>> obter_disclaimer_jurídico('en-us')
        '⚠️ IMPORTANT: This app provides...'
    """
    # Padronizar código de idioma (converter para lowercase)
    idioma = idioma.lower().replace('_', '-')
    
    # Se idioma não existe, usar português como padrão
    if idioma not in DISCLAIMERS_JURIDICOS:
        idioma = 'pt-br'
    
    disclaimer = DISCLAIMERS_JURIDICOS[idioma]
    
    # Retornar com título + texto
    return f"{disclaimer['titulo']}: {disclaimer['texto']}"


def obter_disclaimer_estruturado(idioma='pt-br'):
    """
    Retorna o disclaimer jurídico em formato estruturado (dicionário).
    
    Args:
        idioma (str): Código do idioma ('pt-br', 'en-us', 'en'). 
                     Default: 'pt-br'
    
    Returns:
        dict: Dicionário com 'titulo' e 'texto' separados
        
    Exemplo:
        >>> obter_disclaimer_estruturado('pt-br')
        {
            'titulo': '⚠️ AVISO IMPORTANTE',
            'texto': 'Este aplicativo fornece...'
        }
    """
    # Padronizar código de idioma
    idioma = idioma.lower().replace('_', '-')
    
    # Se idioma não existe, usar português como padrão
    if idioma not in DISCLAIMERS_JURIDICOS:
        idioma = 'pt-br'
    
    return DISCLAIMERS_JURIDICOS[idioma]
