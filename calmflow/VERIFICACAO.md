# 🧪 Verificação de Setup - CalmFlow

Script para validar se tudo está funcionando corretamente.

## ✅ Checklist de Verificação

### 1. Ambiente Virtual
```bash
# Ativar venv
.\venv\Scripts\activate

# Verificar se o prompt muestra (venv)
# Esperado: (venv) PS C:\Users\marco\OneDrive\Área de Trabalho\AppRespiração\calmflow>
```

### 2. Dependências Instaladas
```bash
pip list | grep -E "Django|djangorestframework|django-cors"
```

**Esperado:**
```
Django                    4.2.11
djangorestframework       3.14.0
django-cors-headers      4.3.1
python-decouple           3.8
python-dateutil           2.8.2
pytz                     2024.1
```

### 3. Banco de Dados
```bash
# Verificar se arquivo existe
ls -la db.sqlite3
```

**Esperado:** Arquivo `db.sqlite3` presente (~128 KB aproximadamente)

### 4. Executar Testes de Verificação
```bash
python manage.py check
```

**Esperado:**
```
System check identified no issues (0 silenced).
```

### 5. Listar Migrações
```bash
python manage.py showmigrations
```

**Esperado:**
- auth
- contenttypes
- admin
- sessions
- suporte (✅ com marcas de OK)

### 6. Testar Servidor
```bash
python manage.py runserver
```

**Esperado:** Output similar a:
```
Watching for file changes with StatReloader
Quit the command with CTRL-BREAK.
Starting development server at http://127.0.0.1:8000/
Django version 4.2.11, using settings 'calmflow.settings'
```

### 7. Verificar Endpoints da API
Abrir browser e acessar:

- **Admin**: http://localhost:8000/admin
  - Login: (criar com `python manage.py createsuperuser`)

- **API Root**: http://localhost:8000/api/v1/
  - **Esperado**: JSON com links para endpoints

- **Emergências**: http://localhost:8000/api/v1/emergencias/
  - **Esperado**: 401 Unauthorized (requer autenticação)

- **Check-ins**: http://localhost:8000/api/v1/check-ins/
  - **Esperado**: 401 Unauthorized (requer autenticação)

## 🔧 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'django'"
```bash
# Certificar que venv está ativado
.\venv\Scripts\activate
# Reinstalar
pip install -r requirements.txt
```

### Erro: "db.sqlite3 locked"
```bash
# Deletar db.sqlite3
rm db.sqlite3
# Recriar banco
python manage.py migrate
```

### Porta 8000 já em uso
```bash
# Usar outra porta
python manage.py runserver 8001
```

### Erro ao criar superusuário
```bash
# Certificar migração completa
python manage.py migrate
# Depois tentar criar
python manage.py createsuperuser
```

## 📊 Estrutura de Dados Verificada

### Tabelas Criadas
```sql
-- Django Core
sqlite_sequence
django_admin_logentry
django_content_type
django_migrations
django_session
auth_group_permissions
auth_permission
auth_group
auth_user_groups
auth_user_user_permissions
auth_user

-- CalmFlow
suporte_emergencia
suporte_checkin
```

## ✨ Tudo OK?

Se passou em todos os testes, o projeto está 100% pronto para:
- ✅ Desenvolvimento de endpoints
- ✅ Criação de testes
- ✅ Implementação de lógica de negócio
- ✅ Deploy local

---
Execute os testes regularmente durante desenvolvimento para garantir integridade!
