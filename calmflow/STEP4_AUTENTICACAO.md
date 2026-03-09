# 🔐 STEP 4: Autenticação JWT - Documentação Completa

## 📋 Status: ✅ COMPLETO

Autenticação JWT totalmente implementada com segurança, validações e UX personalizada.

---

## 🎯 Requisitos Implementados

| Requisito | Status | Detalhe |
|-----------|--------|---------|
| ✅ JWTAuthentication padrão | Completo | settings.py configurado |
| ✅ Endpoint `/api/token/` | Completo | Login com JWT |
| ✅ Endpoint `/api/token/refresh/` | Completo | Renovar token (7 dias) |
| ✅ Endpoint `/api/register/` | Completo | Criar conta nova |
| ✅ Email único obrigatório | Completo | Validação implementada |
| ✅ Auto-fill de usuario | Completo | CheckIn preenchido automáticamente |
| ✅ Permissões por endpoint | Completo | IsAuthenticated vs AllowAny |
| ✅ Retorno primeiro_nome | Completo | Bônus UX implementado |

---

## 📦 Pacotes Instalados

```
djangorestframework-simplejwt==5.3.1
PyJWT==2.9.0
```

Adicione ao `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

## ⚙️ Configuração (settings.py)

### 1️⃣ INSTALLED_APPS
```python
INSTALLED_APPS = [
    ...
    'rest_framework_simplejwt',  # ← Novo
    ...
]
```

### 2️⃣ REST Framework Config
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # ← JWT!
        'rest_framework.authentication.SessionAuthentication',
    ],
    ...
}
```

### 3️⃣ JWT Configuração
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),      # 1 hora
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),      # 7 dias
    'ROTATE_REFRESH_TOKENS': True,                    # Renovar sempre
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
}
```

---

## 📁 Arquivos Criados/Modificados

### Novos Arquivos
```
suporte/
├── serializers_auth.py        # 🆕 Serializers de autenticação
├── views_auth.py              # 🆕 Views de registro & profile
```

### Modificados
```
calmflow/settings.py            # Adicionada JWTAuthentication
suporte/urls.py                 # Rotas de autenticação
requirements.txt                # djangorestframework-simplejwt
```

---

## 🔌 Endpoints Disponíveis

### 1️⃣ Registro (Público)
```
POST /api/v1/register/

Request:
{
    "username": "joao_silva",
    "email": "joao@example.com",
    "first_name": "João",
    "last_name": "Silva",
    "password": "SenhaForte123!",
    "password_confirm": "SenhaForte123!"
}

Response 201:
{
    "id": 1,
    "username": "joao_silva",
    "email": "joao@example.com",
    "first_name": "João",
    "ultimo_nome": "Silva",
    "message": "Usuário registrado com sucesso! Faça login para continuar."
}
```

**Validações:**
- Email único ✅
- Username único ✅
- Senhas conferem ✅
- Senha forte (8+ chars) ✅

---

### 2️⃣ Login (Público) - 🎁 Retorna primeiro_nome
```
POST /api/v1/token/

Request:
{
    "username": "joao_silva",
    "password": "SenhaForte123!"
}

Response 200:
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",          # 1 hora validade
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",         # 7 dias validade
    "user": {
        "id": 1,
        "username": "joao_silva",
        "email": "joao@example.com",
        "primeiro_nome": "João",        # 🎁 BÔ NUS UX
        "ultimo_nome": "Silva"
    }
}
```

**Uso:**
```bash
# Copiar access_token em: Authorization: Bearer {access_token}
curl -H "Authorization: Bearer eyJ0eXA..." http://localhost:8000/api/v1/check-ins/
```

---

### 3️⃣ Renovar Token (Autenticado)
```
POST /api/v1/token/refresh/

Request:
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response 200:
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",    # Novo access token
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."    # Novo refresh token (rotacionado)
}
```

**Quando usar:**
- Access token expirou (1 hora)?
- Use refresh para obter novo access token
- Refresh válido por 7 dias

---

### 4️⃣ Perfil do Usuário (Autenticado)
```
GET /api/v1/profile/

Headers:
Authorization: Bearer {access_token}

Response 200:
{
    "id": 1,
    "username": "joao_silva",
    "email": "joao@example.com",
    "first_name": "João",
    "ultimo_nome": "Silva",
    "date_joined": "2026-03-09T11:25:17.580189Z"
}
```

---

## 🔒 Segurança & Permissões

### Por Endpoint

| Endpoint | Permissão | Detalhes |
|----------|-----------|----------|
| `POST /register/` | AllowAny | Qualquer um pode se registrar |
| `POST /token/` | AllowAny | Login público |
| `POST /token/refresh/` | AllowAny | Renovar token (sem auth) |
| `GET /profile/` | IsAuthenticated | Usuário logado |
| `POST /check-ins/` | IsAuthenticated | Apenas usuários logados |
| `GET /check-ins/` | IsAuthenticated | Apenas próprios check-ins |
| `POST /emergencias/` | AllowAny | Público (anônimo) |
| `GET /emergencias/` | IsAuthenticated | Apenas do próprio usuário |
| `GET /sos/` | AllowAny | Emergência pública |

### Isolamento de Dados
```python
def get_queryset(self):
    """Usuário só vê seus próprios dados"""
    return CheckIn.objects.filter(usuario=self.request.user)

def perform_create(self, serializer):
    """Auto-fill do usuário logado"""
    serializer.save(usuario=self.request.user)
```

---

## 🧪 Testes (Inclusos)

### Executar Testes
```bash
# Iniciar servidor
python manage.py runserver

# Em outro terminal:

# 1. Teste de Registro
python test_authentication.py

# 2. Teste de Check-ins
python test_checkins.py

# 3. Teste de Validações
python test_validations.py

# 4. Teste de Refresh Token
python test_refresh_token.py
```

### Exemplos de Uso com cURL

#### Registrar
```bash
curl -X POST http://localhost:8000/api/v1/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "novo_usuario",
    "email": "novo@example.com",
    "first_name": "Novo",
    "password": "SenhaForte123!",
    "password_confirm": "SenhaForte123!"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/v1/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "novo_usuario", "password": "SenhaForte123!"}'
```

#### Criar Check-in (com token)
```bash
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."

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

#### Refreshar Token
```bash
REFRESH="eyJ0eXAiOiJKV1QiLCJhbGc..."

curl -X POST http://localhost:8000/api/v1/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "'$REFRESH'"}'
```

---

## 🛡️ Guia de Segurança

### ✅ Melhorias Implementadas

1. **Senhas Hasheadas**: Django usa PBKDF2 + bcrypt
2. **Email Único**: Validate no serializer
3. **Username Único**: Validate no serializer
4. **Tokens Temporários**: Access (1h), Refresh (7d)
5. **Token Rotation**: Refresh automaticamente regenera
6. **CORS Seguro**: Configurado apenas para localhost
7. **Isolamento de Dados**: Queryset filtrado por usuário

### 🔐 Próximos Passos (Recomendado)

- [ ] Usar HTTPS em produção
- [ ] Adicionar rate limiting (DjangoREST throttling)
- [ ] Implementar 2FA (two-factor authentication)
- [ ] Cache de tokens bloqueados (token blacklist)
- [ ] Adicionar CORS_ALLOW_HEADERS completo
- [ ] Configurar SECRETS_KEY variável de ambiente

---

## 📊 Validações Incluídas

### Validador de Força de Senha
```python
# Django validators automáticos:
- MinimumLengthValidator (8 chars mínimo)
- UserAttributeSimilarityValidator
- CommonPasswordValidator
- NumericPasswordValidator
```

### Validações Custom
```python
# Email único
def validate_email(self, value):
    if User.objects.filter(email=value).exists():
        raise ValidationError("Email já existe")

# Senhas conferem
def validate(self, data):
    if data['password'] != data['password_confirm']:
        raise ValidationError("Senhas não conferem")
```

---

## 🎁 Bônus UX Implementado

### Saudação Personalizada
Quando o usuário faz login, retorna `primeiro_nome`:

```python
# Frontend pode usar assim:
const { access_token, user } = loginResponse;
const saudacao = `Olá, ${user.primeiro_nome}, como você se sente hoje?`;
// ← Exibir saudação personalizada
```

Resume a UX: Usuário vê seu nome imediatamente após login! 🎉

---

## 📈 Fluxo de Autenticação Visual

```
┌─────────────────┐
│   Novo Usuário  │
└────────┬────────┘
         │
         ▼
    POST /register/
    (email, password)
         │
         ▼
    ✅ Criar Usuário
    Salvar no BD
         │
         ▼
    ┌─────────────────────┐
    │  Usuário Existente  │
    └────────┬────────────┘
             │
             ▼
        POST /token/
       (username, password)
             │
             ▼
        ✅ Gerar Tokens
        access (1h) + refresh (7d)
        + user data (primeiro_nome)
             │
             ▼
      ┌──────────────────────────┐
      │ Frontend Armazena Token  │
      │ (localStorage/secure)    │
      └────────┬─────────────────┘
               │
               ▼
       GET /api/v1/check-ins/
       Header: Authorization: Bearer {access}
               │
               ▼
           ✅ Sucesso
           Retorna dados do usuário
               │
               ├──► [1h depois]
               │
               ▼
       POST /api/v1/token/refresh/
       Body: {refresh: ...}
               │
               ▼
           ✅ Novo Access Token
           Continua usando API
```

---

## 🐛 Troubleshooting

### Erro: 401 Unauthorized
```
Solução: Token expirou ou não foi enviado
- Verificar header: Authorization: Bearer {token}
- Usar refresh endpoint para novo access token
```

### Erro: 400 Email já existe
```
Solução: Email já registrado
- Use outro email ou recover de conta
```

### Erro: 400 Senhas não conferem
```
Solução: password != password_confirm
- Verificar digitação
- Copiar/colar para evitar espaços
```

### Erro: 403 Permission Denied
```
Solução: Endpoint requer autenticação
- Fazer login para obter token
- Incluir header Authorization: Bearer {token}
```

---

## 📝 Próximas Etapas

### STEP 5: Analytics & Dashboard
- [ ] Padrões de emoções (tabelas por data)
- [ ] Gatilhos mais comuns
- [ ] Score de bem-estar
- [ ] Gráficos de progresso

### STEP 6: Frontend React
- [ ] Tela de login
- [ ] Tela de registro
- [ ] Tela de check-in
- [ ] Dashboard de histórico

---

## 📚 Referências

- [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Django Authentication](https://docs.djangoproject.com/en/4.2/topics/auth/)
- [JWT.io](https://jwt.io/) - Decodificar tokens
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## ✅ Checklist Final STEP 4

- [x] djangorestframework-simplejwt instalado
- [x] settings.py configurado com JWTAuthentication
- [x] Endpoint /api/token/ funcionando
- [x] Endpoint /api/token/refresh/ funcionando
- [x] Endpoint /api/register/ funcionando
- [x] Validação de email único implementada
- [x] Validação de password conferindo
- [x] Auto-fill de usuario em CheckIn
- [x] Permissões aplicadas corretamente
- [x] Primeiro_nome retornado no login
- [x] Profile endpoint criado
- [x] Testes passando
- [x] Documentação completa
- [x] requirements.txt atualizado

---

## 🎊 Status

```
✨ STEP 4 - AUTENTICAÇÃO JWT ✨
Status: 🟢 COMPLETO E TESTADO
Requisitos: 8/8 implementados
Testes: ✅ Todos passando
Segurança: 🔒 Validações completas
UX: 🎁 Bônus implementado
```

---

**Data**: 9 de março de 2026  
**Desenvolvido com**: Django 4.2 + DRF + JWT  
**Próximo**: STEP 5 - Analytics & Dashboard 📊
