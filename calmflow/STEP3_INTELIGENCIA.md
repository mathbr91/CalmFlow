# 🧠 Step 3 - Inteligência da API: Técnicas Inteligentes

## ✨ Implementação Concluída

A API agora é **inteligente** - quando o usuário registra uma emergência, recebe automaticamente:
1. **Técnica Sugerida** - Instruções passo a passo baseadas no sintoma
2. **Disclaimer Jurídico** - Aviso obrigatório em todas as respostas

---

## 📁 Arquivos Criados/Modificados

### ✅ 1. `suporte/utils.py` (NOVO)
Arquivo com:
- **DISCLAIMER_EMERGENCIA** - Texto jurídico reutilizável
- **TECNICAS_SINTOMA** - Dicionário mapeando sintomas → técnicas
- **obter_tecnica_por_sintoma()** - Função auxiliar
- **DADOS_SOS** - Mock data de hospitais e números de emergência
- **obter_dados_sos()** - Função para retornar dados de SOS

### ✅ 2. `suporte/serializers.py` (ATUALIZADO)
- Campo `tecnica_sugerida` (read-only, calculado automaticamente)
- Campo `disclaimer` (read-only)
- Métodos `get_tecnica_sugerida()` e `get_disclaimer()`

### ✅ 3. `suporte/views.py` (ATUALIZADO)
- Nova função `sos_endpoint()` com @api_view
- Documentação melhorada
- Lógica preservada e melhorada

### ✅ 4. `suporte/urls.py` (ATUALIZADO)
- Nova rota: `path('sos/', sos_endpoint, name='sos')`

---

## 🧠 Lógica de Técnicas por Sintoma

### 🫀 Sintoma: Peito (Palpitação)
**Técnica**: Relaxamento Muscular Progressivo
```json
{
  "titulo": "🫀 Técnica de Relaxamento Muscular Progressivo",
  "descricao": "Libere tensão acumulada focando em grupos musculares específicos.",
  "passos": [
    "1️⃣ Encontre um lugar calmo...",
    "2️⃣ Comece pelos OMBROS...",
    "3️⃣ BRAÇOS: Aperte os punhos...",
    "4️⃣ PEITO: Inspira profundo...",
    "5️⃣ Repita cada grupo 3 vezes...",
    "6️⃣ Notará que o peito/coração vai desacelerando...",
    "⏱️ Tempo total: 5-10 minutos"
  ],
  "dica": "Esta técnica diminui a ativação do sistema nervoso..."
}
```

### 🌬️ Sintoma: Respiração (Falta de Ar)
**Técnica**: Respiração Quadrada (4-4-4-4)
```json
{
  "titulo": "🌬️ Técnica de Respiração Quadrada (4-4-4-4)",
  "descricao": "Padrão de respiração que acalma o sistema nervoso rapidamente.",
  "passos": [
    "1️⃣ Respire PROFUNDAMENTE pelo nariz contando até 4",
    "2️⃣ SEGURE a respiração por 4 segundos",
    "3️⃣ Expire LENTAMENTE pela boca contando até 4",
    "4️⃣ SEGURE (vazio) por 4 segundos",
    "5️⃣ Repita este ciclo 5-10 vezes (3-5 minutos)",
    "6️⃣ Você deve sentir os batimentos do coração desacelerando",
    "💡 Dica: Imagine um quadrado enquanto respira em cada lado"
  ],
  "dica": "Se sentir tontura, respire na velocidade natural..."
}
```

### 😨 Sintoma: Medo
### 🌀 Sintoma: Confusão
**Técnica**: Aterramento 5-4-3-2-1
```json
{
  "titulo": "🌍 Técnica de Aterramento 5-4-3-2-1",
  "descricao": "Conecte-se ao presente usando seus 5 sentidos...",
  "passos": [
    "👀 VER (5 coisas): Nomeie 5 objetos que você vê...",
    "👂 OUVIR (4 sons): Escute 4 sons à sua volta...",
    "🤚 TOCAR (3 texturas): Toque 3 objetos...",
    "👅 SABOREAR (2 sabores): Identifique 2 sabores...",
    "👃 CHEIRAR (1 aroma): Sinta o aroma de algo...",
    "✅ Pronto! Você está ANCORADO no presente...",
    "⏱️ Tempo total: 5-10 minutos"
  ],
  "dica": "Esta técnica reduz a ativação do medo..."
}
```

### 🧘 Sintoma: Outro
**Técnica**: Respiração Consciente (Universal)

---

## 📡 Exemplos de Requisições e Respostas

### 1️⃣ Criar Emergência com Sintoma "Respiração"

**Request:**
```bash
POST /api/v1/emergencias/
Content-Type: application/json

{
  "sintoma_principal": "respiracao",
  "ambiente_seguro": true
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "usuario": null,
  "usuario_nome": "Anônimo",
  "sintoma_principal": "respiracao",
  "sintoma_display": "Dificuldade de Respirar 😤",
  "ambiente_seguro": true,
  "criado_em": "2026-03-09T14:32:15Z",
  "tecnica_sugerida": {
    "titulo": "🌬️ Técnica de Respiração Quadrada (4-4-4-4)",
    "descricao": "Padrão de respiração que acalma o sistema nervoso rapidamente.",
    "passos": [
      "1️⃣ Respire PROFUNDAMENTE pelo nariz contando até 4",
      "2️⃣ SEGURE a respiração por 4 segundos",
      "3️⃣ Expire LENTAMENTE pela boca contando até 4",
      "4️⃣ SEGURE (vazio) por 4 segundos",
      "5️⃣ Repita este ciclo 5-10 vezes (3-5 minutos)",
      "6️⃣ Você deve sentir os batimentos do coração desacelerando",
      "💡 Dica: Imagine um quadrado enquanto respira em cada lado"
    ],
    "dica": "Se sentir tontura, respire na velocidade natural e tente novamente mais devagar."
  },
  "disclaimer": "⚠️ DISCLAIMER: Este conteúdo é apenas para fins informativos e não substitui aconselhamento médico profissional. Em caso de emergência real ou risco de harm, entre em contato com serviços de emergência (CVV: 188 ou 911) ou procure atendimento hospitalar imediatamente."
}
```

---

### 2️⃣ Acessar Endpoint SOS

**Request:**
```bash
GET /api/v1/sos/
# Sem autenticação necessária! 🚨
```

**Response (200 OK):**
```json
{
  "status": "SOS - Emergency Support",
  "urgencia": "🚨 Se você está em risco imediato, ligue para 911",
  "disclaimer": "⚠️ DISCLAIMER: Este conteúdo é apenas para fins informativos...",
  "numeros_emergencia": {
    "cvv": {
      "numero": "188",
      "descricao": "Centro de Valorização da Vida",
      "disponivel": "24 horas por dia, 7 dias por semana",
      "tipo": "Prevenção ao suicídio - Escuta especializada",
      "acesso": "Ligue de forma anônima"
    },
    "emergencia_medica": {
      "numero": "911",
      "descricao": "Emergência Médica",
      "disponivel": "24 horas",
      "tipo": "Ambulância e atendimento emergencial",
      "acesso": "Ligue imediatamente"
    }
  },
  "hospitais_proximos": [
    {
      "nome": "Hospital Clínico Central",
      "endereco": "Avenida Paulista, 1000 - São Paulo, SP",
      "telefone": "(11) 3000-1000",
      "distancia": "2.3 km",
      "tempo_medio": "15 min",
      "servicos": ["Pronto Socorro", "UTI", "Psicologia", "Urgência 24h"]
    },
    {
      "nome": "Instituto de Saúde Mental",
      "endereco": "Rua Augusta, 500 - São Paulo, SP",
      "telefone": "(11) 3100-5000",
      "distancia": "3.5 km",
      "tempo_medio": "25 min",
      "servicos": ["Atendimento Psiquiátrico", "Terapia", "Acolhimento 24h"]
    },
    {
      "nome": "Hospital de Medicina de Urgência",
      "endereco": "Rua da Consolação, 800 - São Paulo, SP",
      "telefone": "(11) 3200-9999",
      "distancia": "1.8 km",
      "tempo_medio": "10 min",
      "servicos": ["Pronto Socorro", "Atendimento Rápido", "Cardiologia"]
    }
  ],
  "tecnica_rapida": {
    "titulo": "🌬️ Respire - Técnica Rápida de 1 Minuto",
    "instrucoes": [
      "1. Respire fundo pelo nariz contando até 4",
      "2. Segure por 4 segundos",
      "3. Expire pela boca contando até 4",
      "4. Segure vazio por 4 segundos",
      "5. Repita 5 vezes"
    ],
    "duracao": "~2 minutos"
  }
}
```

---

### 3️⃣ Criar Emergência com Sintoma "Peito" (Autenticado)

**Request:**
```bash
POST /api/v1/emergencias/
Authorization: Token abc123def456
Content-Type: application/json

{
  "sintoma_principal": "peito",
  "ambiente_seguro": false
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "usuario": 1,
  "usuario_nome": "joao_silva",
  "sintoma_principal": "peito",
  "sintoma_display": "Aperto no Peito 🫀",
  "ambiente_seguro": false,
  "criado_em": "2026-03-09T14:35:22Z",
  "tecnica_sugerida": {
    "titulo": "🫀 Técnica de Relaxamento Muscular Progressivo",
    "descricao": "Libere tensão acumulada focando em grupos musculares específicos.",
    "passos": [
      "1️⃣ Encontre um lugar calmo e confortável para sentar ou deitar.",
      "2️⃣ Comece pelos OMBROS: Levante-os até os ouvidos, segure por 5 segundos, solte.",
      "3️⃣ BRAÇOS: Aperte os punhos firmemente por 5 segundos, depois relaxe completamente.",
      "4️⃣ PEITO: Inspira profundo, segura a respiração por 5 segundos, expira lentamente.",
      "5️⃣ Repita cada grupo 3 vezes até sentir alívio da tensão.",
      "6️⃣ Notará que o peito/coração vai desacelerando naturalmente.",
      "⏱️ Tempo total: 5-10 minutos"
    ],
    "dica": "Esta técnica diminui a ativação do sistema nervoso e reduz a frequência cardíaca."
  },
  "disclaimer": "⚠️ DISCLAIMER: Este conteúdo é apenas para fins informativos e não substitui aconselhamento médico profissional. Em caso de emergência real ou risco de harm, entre em contato com serviços de emergência (CVV: 188 ou 911) ou procure atendimento hospitalar imediatamente."
}
```

---

## 🧪 Testando com Python/Requests

```python
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# 1️⃣ Teste SOS (sem autenticação)
print("=== Testando SOS ===")
response = requests.get(f"{BASE_URL}/sos/")
print(json.dumps(response.json(), indent=2, ensure_ascii=False))

# 2️⃣ Criar emergência anônima
print("\n=== Criando Emergência Anônima ===")
payload = {
    "sintoma_principal": "respiracao",
    "ambiente_seguro": True
}
response = requests.post(f"{BASE_URL}/emergencias/", json=payload)
print(json.dumps(response.json(), indent=2, ensure_ascii=False))

# 3️⃣ Com autenticação (após criar token)
print("\n=== Criando Emergência Autenticado ===")
headers = {"Authorization": "Token seu_token_aqui"}
payload = {
    "sintoma_principal": "medo",
    "ambiente_seguro": False
}
response = requests.post(
    f"{BASE_URL}/emergencias/", 
    json=payload,
    headers=headers
)
print(json.dumps(response.json(), indent=2, ensure_ascii=False))
```

---

## 📊 Diagrama de Fluxo

```
┌─────────────────────────────────────┐
│  Usuário tem Emergência Emocional   │
└──────────┬──────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ POST /api/v1/emergencias/            │
│ {                                    │
│   "sintoma_principal": "...",        │
│   "ambiente_seguro": bool            │
│ }                                    │
└──────────┬──────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Django salva no banco                │
│ Database: suporte_emergencia         │
└──────────┬──────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ EmergenciaSerializer                 │
│ - get_tecnica_sugerida()             │
│   → obter_tecnica_por_sintoma()      │
│   → TECNICAS_SINTOMA[sintoma]        │
│ - get_disclaimer()                   │
│   → DISCLAIMER_EMERGENCIA            │
└──────────┬──────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Response JSON (201 Created)          │
│ - tecnica_sugerida: {...}   ✨       │
│ - disclaimer: "⚠️..."       ✨       │
│ - usuario_nome: str         ✨       │
└──────────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Usuário recebe TÉCNICA + AVISO       │
│ Pode executar passos imediatamente   │
└──────────────────────────────────────┘
```

---

## 🔍 Detalhes Técnicos

### Arquivo: `suporte/utils.py`
- **DISCLAIMER_EMERGENCIA**: Texto jurídico que aparece em TODA resposta de emergência
- **TECNICAS_SINTOMA**: Dicionário com 5 técnicas mapeadas
  - `peito` → Relaxamento Muscular Progressivo
  - `respiracao` → Respiração Quadrada
  - `medo` → Aterramento 5-4-3-2-1
  - `confusao` → Aterramento 5-4-3-2-1
  - `outro` → Respiração Consciente
- **DADOS_SOS**: Mock data com 3 hospitais próximos

### Serializer: `EmergenciaSerializer.get_tecnica_sugerida()`
```python
def get_tecnica_sugerida(self, obj):
    return obter_tecnica_por_sintoma(obj.sintoma_principal)
```
- Consultado automaticamente ao serializar
- Não precisa ser armazenado no banco (calculado na resposta)

### Endpoint: `/api/v1/sos/`
- ✅ Acessível SEM autenticação
- ✅ Retorna números de emergência + hospitais
- ✅ Inclui técnica rápida de 1 minuto
- ✅ Response é json/dict (não ModelViewSet)

---

## ✅ Próximos Passos (MVP)

- [ ] Integrar com API real de hospitais (Google Maps)
- [ ] Adicionar autenticação JWT
- [ ] Criar testes unitários para técnicas
- [ ] Persistir histórico de emergências
- [ ] Dashboard de análise de padrões
- [ ] Notificações em tempo real
- [ ] Frontend React com interface amigável

---

**Status**: Inteligência + Técnicas Sugeridas ✅ Completo!
