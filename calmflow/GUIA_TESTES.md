# 📡 Guia de Testes - API CalmFlow

## 🚀 Iniciando o Servidor

```bash
cd "c:\Users\marco\OneDrive\Área de Trabalho\AppRespiração\calmflow"
.\venv\Scripts\activate
python manage.py runserver
```

**Esperado:**
```
Watching for file changes with StatReloader
Quit the command with CTRL-BREAK.
Starting development server at http://127.0.0.1:8000/
```

---

## 🧪 Teste 1: Endpoint SOS (Sem Autenticação)

### Via cURL
```bash
curl -X GET http://localhost:8000/api/v1/sos/ \
  -H "Content-Type: application/json"
```

### Via Postman
1. **Method**: `GET`
2. **URL**: `http://localhost:8000/api/v1/sos/`
3. **Headers**: 
   - `Content-Type: application/json`
4. **Click**: Send

### Resultado Esperado (200 OK)
```json
{
  "status": "SOS - Emergency Support",
  "urgencia": "🚨 Se você está em risco imediato, ligue para 911",
  "disclaimer": "⚠️ DISCLAIMER: ...",
  "numeros_emergencia": {
    "cvv": {
      "numero": "188",
      "descricao": "Centro de Valorização da Vida",
      "disponivel": "24 horas por dia, 7 dias por semana",
      "tipo": "Prevenção ao suicídio - Escuta especializada",
      "acesso": "Ligue de forma anônima"
    },
    ...
  },
  "hospitais_proximos": [...],
  "tecnica_rapida": {...}
}
```

---

## 🧪 Teste 2: Criar Emergência - Sintoma RESPIRAÇÃO

### Via cURL
```bash
curl -X POST http://localhost:8000/api/v1/emergencias/ \
  -H "Content-Type: application/json" \
  -d '{
    "sintoma_principal": "respiracao",
    "ambiente_seguro": true
  }'
```

### Via Postman
1. **Method**: `POST`
2. **URL**: `http://localhost:8000/api/v1/emergencias/`
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (JSON):
```json
{
  "sintoma_principal": "respiracao",
  "ambiente_seguro": true
}
```
5. **Click**: Send

### Resultado Esperado (201 Created)
```json
{
  "id": 1,
  "usuario": null,
  "usuario_nome": "Anônimo",
  "sintoma_principal": "respiracao",
  "sintoma_display": "Dificuldade de Respirar 😤",
  "ambiente_seguro": true,
  "criado_em": "2026-03-09T14:32:15.123456Z",
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

## 🧪 Teste 3: Criar Emergência - Sintoma PEITO

### Via cURL
```bash
curl -X POST http://localhost:8000/api/v1/emergencias/ \
  -H "Content-Type: application/json" \
  -d '{
    "sintoma_principal": "peito",
    "ambiente_seguro": false
  }'
```

### Resultado Esperado
- `tecnica_sugerida` será: **Relaxamento Muscular Progressivo** ✨

---

## 🧪 Teste 4: Criar Emergência - Sintoma MEDO

### Via cURL
```bash
curl -X POST http://localhost:8000/api/v1/emergencias/ \
  -H "Content-Type: application/json" \
  -d '{
    "sintoma_principal": "medo",
    "ambiente_seguro": true
  }'
```

### Resultado Esperado
- `tecnica_sugerida` será: **Aterramento 5-4-3-2-1** ✨

---

## 🧪 Teste 5: Criar Emergência - Sintoma CONFUSÃO

### Via cURL
```bash
curl -X POST http://localhost:8000/api/v1/emergencias/ \
  -H "Content-Type: application/json" \
  -d '{
    "sintoma_principal": "confusao",
    "ambiente_seguro": true
  }'
```

### Resultado Esperado
- `tecnica_sugerida` será: **Aterramento 5-4-3-2-1** ✨

---

## 🧪 Teste 6: Listar Emergências (Requer Autenticação)

### Passo 1: Criar Superusuário
```bash
python manage.py createsuperuser
# Ou use: username=admin, password=admin123, email=admin@test.com
```

### Passo 2: Obter Token de Autenticação
```bash
curl -X POST http://localhost:8000/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Resposta:**
```json
{
  "token": "abc123def456ghi789"
}
```

### Passo 3: Listar Emergências com Token
```bash
curl -X GET http://localhost:8000/api/v1/emergencias/ \
  -H "Authorization: Token abc123def456ghi789"
```

---

## 🧪 Teste 7: Criar Check-in (Requer Autenticação)

### Com Token
```bash
curl -X POST http://localhost:8000/api/v1/check-ins/ \
  -H "Authorization: Token abc123def456ghi789" \
  -H "Content-Type: application/json" \
  -d '{
    "clima_interno": "nublado",
    "nivel_ruido": 6,
    "gatilho": "trabalho",
    "auto_eficacia": 7
  }'
```

### Resultado Esperado (201 Created)
```json
{
  "id": 1,
  "usuario": 1,
  "usuario_nome": "admin",
  "clima_interno": "nublado",
  "clima_display": "Nublado ☁️",
  "nivel_ruido": 6,
  "gatilho": "trabalho",
  "gatilho_display": "Trabalho",
  "auto_eficacia": 7,
  "criado_em": "2026-03-09T15:45:30.123456Z"
}
```

---

## 📊 Tabela de Sintomas e Técnicas

| Sintoma | Campo | Técnica Retornada |
|---------|-------|-------------------|
| Peito 🫀 | `"peito"` | Relaxamento Muscular Progressivo |
| Respiração 😤 | `"respiracao"` | Respiração Quadrada 4-4-4-4 |
| Medo 😨 | `"medo"` | Aterramento 5-4-3-2-1 |
| Confusão 🌀 | `"confusao"` | Aterramento 5-4-3-2-1 |
| Outro | `"outro"` | Respiração Consciente |

---

## ✅ Checklist de Testes

- [ ] `GET /sos/` retorna números CVV + hospitais
- [ ] `POST /emergencias/` (sem auth) cria anônimo
- [ ] `POST /emergencias/` com `peito` retorna Relaxamento
- [ ] `POST /emergencias/` com `respiracao` retorna Respiração Quadrada
- [ ] `POST /emergencias/` com `medo` retorna Aterramento
- [ ] `POST /emergencias/` com `confusao` retorna Aterramento
- [ ] Toda resposta contém `disclaimer`
- [ ] `POST /check-ins/` (com auth) funciona
- [ ] `GET /check-ins/` (com auth) lista apenas do usuário
- [ ] Admin panel mostra registros (http://localhost:8000/admin)

---

## 🔐 Obtendo Token (Alternativa com Admin)

1. Acesse: `http://localhost:8000/admin`
2. Faça login com superusuário
3. Vá para **Tokens** (seção Auth)
4. Clique em seu usuário
5. Copie o token

---

## 🐛 Troubleshooting

### "Connection refused"
```bash
# Certifique-se que o servidor está rodando
python manage.py runserver
```

### "404 Not Found"
```bash
# Verifique a URL está correta
# Deve ser: http://localhost:8000/api/v1/sos/
# NÃO: http://localhost:8000/sos/
```

### "403 Forbidden"
```bash
# Precisa de token para endpoints autenticados
# Use: -H "Authorization: Token seu_token"
```

### "400 Bad Request"
```bash
# Verifique JSON está bem formado
# Use um validador JSON: https://jsonlint.com
```

---

## 📝 Exemplos Python

```python
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# 1. Teste SOS
print("=== SOS ===")
r = requests.get(f"{BASE_URL}/sos/")
print(json.dumps(r.json(), indent=2, ensure_ascii=False))

# 2. Criar Emergência
print("\n=== Criar Emergência ===")
payload = {
    "sintoma_principal": "respiracao",
    "ambiente_seguro": True
}
r = requests.post(f"{BASE_URL}/emergencias/", json=payload)
print(json.dumps(r.json(), indent=2, ensure_ascii=False))

# 3. Com Token
print("\n=== Com Autenticação ===")
headers = {"Authorization": "Token seu_token_aqui"}
payload = {
    "clima_interno": "ensolarado",
    "nivel_ruido": 3,
    "gatilho": "outro",
    "auto_eficacia": 9
}
r = requests.post(
    f"{BASE_URL}/check-ins/",
    json=payload,
    headers=headers
)
print(json.dumps(r.json(), indent=2, ensure_ascii=False))
```

---

**Status**: Testes ✅ Prontos - Inicie o servidor e comece a testar!
