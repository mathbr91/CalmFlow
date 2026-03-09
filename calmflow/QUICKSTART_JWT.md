# ⚡ Quick Start - CalmFlow API com Autenticação JWT

## 🚀 Começar em 5 Minutos

### 1️⃣ Registrar Novo Usuário (30 seg)

```bash
curl -X POST http://localhost:8000/api/v1/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "meu_usuario",
    "email": "meu@email.com",
    "first_name": "Meu Nome",
    "last_name": "Sobrenome",
    "password": "MinhaS3nh@Forte!",
    "password_confirm": "MinhaS3nh@Forte!"
  }'
```

**Resposta:**
```json
{
  "id": 1,
  "username": "meu_usuario",
  "email": "meu@email.com",
  "first_name": "Meu Nome",
  "message": "Usuário registrado com sucesso!"
}
```

---

### 2️⃣ Fazer Login (30 seg)

```bash
curl -X POST http://localhost:8000/api/v1/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "meu_usuario",
    "password": "MinhaS3nh@Forte!"
  }'
```

**Resposta:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "meu_usuario",
    "email": "meu@email.com",
    "primeiro_nome": "Meu Nome",
    "ultimo_nome": "Sobrenome"
  }
}
```

✅ **Copie o `access` token!**

---

### 3️⃣ Usar API Protegida (1 min)

```bash
TOKEN="seu_access_token_aqui"

# Criar check-in (usuario auto-preenchido)
curl -X POST http://localhost:8000/api/v1/check-ins/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "clima_interno": "nublado",
    "nivel_ruido": 5,
    "gatilho": "trabalho",
    "auto_eficacia": 7
  }'
```

**Resposta:**
```json
{
  "id": 1,
  "usuario": 1,              ← Auto-preenchido!
  "usuario_nome": "meu_usuario",
  "clima_interno": "nublado",
  "nivel_ruido": 5,
  "gatilho": "trabalho",
  "auto_eficacia": 7,
  "criado_em": "2026-03-09T11:30:00Z"
}
```

✅ **Done!** Seu check-in foi criado e associado ao seu usuário!

---

### 4️⃣ Listar Meus Dados (30 seg)

```bash
TOKEN="seu_access_token_aqui"

# Ver dados do usuário
curl -X GET http://localhost:8000/api/v1/profile/ \
  -H "Authorization: Bearer $TOKEN"
```

```bash
# Ver meus check-ins
curl -X GET http://localhost:8000/api/v1/check-ins/ \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5️⃣ Renovar Token quando Expirar (30 seg)

```bash
REFRESH_TOKEN="seu_refresh_token_aqui"

curl -X POST http://localhost:8000/api/v1/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "'$REFRESH_TOKEN'"}'
```

**Resposta:**
```json
{
  "access": "novo_access_token_aqui",
  "refresh": "novo_refresh_token_aqui"
}
```

---

## 🧠 Conceitos Importantes

### Access Token
- **Validade**: 1 hora
- **Uso**: Incluir em toda request: `Authorization: Bearer {access}`
- **Quando expira**: Use refresh token para obter novo

### Refresh Token
- **Validade**: 7 dias  
- **Uso**: Trocar por novo access token
- **Nunca expira?**: Após 7 dias, faça login novamente

### Isolamento de Dados
- Você **só vê seus próprios** check-ins
- Você **não vê** check-ins de outros users
- Cada request é validado (`usuario=request.user`)

---

## 🔥 Endpoints Rápidos para Testar

```bash
# SEM autenticação (sempre funciona)
curl http://localhost:8000/api/v1/sos/

# COM autenticação (requer token)
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/profile/

# Público - Emergência anônima (sem token)
curl -X POST http://localhost:8000/api/v1/emergencias/ \
  -H "Content-Type: application/json" \
  -d '{"sintoma_principal": "respiracao", "ambiente_seguro": true}'
```

---

## 💻 Usando em Frontend (JavaScript/React)

### Registrar
```javascript
const register = async (userData) => {
  const response = await fetch('http://localhost:8000/api/v1/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Uso:
await register({
  username: 'novo_user',
  email: 'novo@email.com',
  first_name: 'Nome',
  password: 'SenhaForte123!',
  password_confirm: 'SenhaForte123!'
});
```

### Login e Salvar Tokens
```javascript
const login = async (username, password) => {
  const response = await fetch('http://localhost:8000/api/v1/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  
  // Salvar tokens
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  
  // Saudação personalizada 🎁
  console.log(`Olá, ${data.user.primeiro_nome}!`);
  
  return data;
};
```

### Usar API com Token
```javascript
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('access_token');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  if (body) options.body = JSON.stringify(body);
  
  return fetch(`http://localhost:8000${endpoint}`, options)
    .then(r => r.json());
};

// Usar:
const checkIns = await apiCall('/api/v1/check-ins/');
```

### Renovar Token Quando Expirar
```javascript
const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  
  const response = await fetch('http://localhost:8000/api/v1/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refresh_token })
  });
  
  const data = await response.json();
  
  // Atualizar tokens
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  
  return data.access;
};
```

---

## ⚠️ Erros Comuns

### 401 Unauthorized
```
❌ "Authorization header invalid"
✅ Solução: Incluir header: Authorization: Bearer {token}
```

### 400 Email já existe
```
❌ "Um usuário com este email já existe"
✅ Solução: Usar outro email
```

### 400 Senhas não conferem
```
❌ "As senhas não conferem"
✅ Solução: Verificar password e password_confirm
```

### 401 Token expirou
```
❌ "Token is invalid or expired"
✅ Solução: Usar endpoint /api/v1/token/refresh/
```

---

## 📊 Sequência de Uso Típica

```
1. Novo Usuário?
   └─ POST /api/v1/register/
      ✅ Criado

2. Fazer Login
   └─ POST /api/v1/token/
      ✅ Receber: access_token, refresh_token

3. Usar API
   ├─ GET /api/v1/profile/
   ├─ POST /api/v1/check-ins/
   ├─ GET /api/v1/check-ins/
   └─ PATCH /api/v1/check-ins/{id}/
      (todas com: Authorization: Bearer $TOKEN)

4. Token Expirou? (após 1 hora)
   └─ POST /api/v1/token/refresh/
      ✅ Novo access_token

5. Refresh Expirou? (após 7 dias)
   └─ Fazer login novamente
      └─ POST /api/v1/token/
```

---

## 🎁 Resource Bônus

### Ver Dados de SOS (sem login)
```bash
curl http://localhost:8000/api/v1/sos/
```

Retorna:
- CVV: 188
- Emergência médica: 911
- Hospitais próximos (mock)
- Técnica de respiração rápida

### Criar Emergência Anônima (sem login)
```bash
curl -X POST http://localhost:8000/api/v1/emergencias/ \
  -H "Content-Type: application/json" \
  -d '{
    "sintoma_principal": "respiracao",
    "ambiente_seguro": true
  }'
```

Retorna automaticamente:
- Técnica de manejo passo-a-passo
- Disclaimer jurídico
- ID do registro para follow-up

---

## 🔗 Links Úteis

| Recurso | Link |
|---------|------|
| Documentação Completa | `STEP4_AUTENTICACAO.md` |
| Testes | `python test_authentication.py` |
| JWT Decoder | https://jwt.io/ |
| API Docs | `http://localhost:8000/api/v1/` |

---

## ✨ Resumo

```
1️⃣ Registrar: POST /api/v1/register/
2️⃣ Login: POST /api/v1/token/
3️⃣ Usar: GET/POST com Authorization: Bearer {token}
4️⃣ Renovar: POST /api/v1/token/refresh/
5️⃣ Ready to go! 🚀
```

---

**Happy Coding!** 🎉  
Desenvolvido em 9 de março de 2026 🚀
