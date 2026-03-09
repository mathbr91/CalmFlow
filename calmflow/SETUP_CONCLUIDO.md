# 🎯 CalmFlow - Setup Concluído

## ✅ Estrutura Criada

```
calmflow/
├── calmflow/                          # Configurações Django
│   ├── settings.py                    # CORS, Timezone (São Paulo), REST Framework
│   ├── urls.py                        # Roteamento principal (DRF Router)
│   ├── wsgi.py
│   ├── asgi.py
│   └── __init__.py
│
├── suporte/                           # App Principal
│   ├── models.py                      # Emergencia + CheckIn (8 perguntas)
│   ├── serializers.py                 # DRF Serializers
│   ├── views.py                       # ViewSets ModelViewSet
│   ├── urls.py                        # Roteamento do app
│   ├── admin.py                       # Admin Config (customizado)
│   ├── apps.py
│   ├── tests.py
│   ├── migrations/                    # ✅ Migrações criadas
│   └── __init__.py
│
├── venv/                              # ✅ Virtual Environment (Criado)
├── manage.py
├── db.sqlite3                         # ✅ Banco criado
├── requirements.txt                   # Django 4.2.11 + DRF + CORS
├── .env.example
├── .gitignore
├── setup.bat                          # Script setup (Windows)
├── setup.sh                           # Script setup (Linux/Mac)
└── README.md
```

## 📦 Dependências Instaladas

- ✅ Django 4.2.11
- ✅ Django Rest Framework 3.14.0
- ✅ django-cors-headers 4.3.1
- ✅ python-decouple 3.8
- ✅ pytz 2024.1

## 🛠️ Configurações Aplicadas

### settings.py
- ✅ **Fuso Horário**: `America/Sao_Paulo` (Brasil)
- ✅ **Idioma**: `pt-br` (Português Brasileiro)
- ✅ **CORS**: Configurado para dev (`localhost:3000` e `localhost:8000`)
- ✅ **REST Framework**: Token Authentication + DRF Permissions
- ✅ **TimeZone Aware**: `USE_TZ = True`

### Modelos Criados

#### 1️⃣ **Emergencia** (Crise)
```
- usuario (FK)
- severidade (1-4: Leve, Moderado, Severo, Crítico)
- descricao
- localizacao (opcional)
- resolvido (bool)
- notas_resolucao
- tempo_criacao, tempo_atualizacao
```

#### 2️⃣ **CheckIn** (Diário com 8 Perguntas)
```
- usuario (FK)
- data_checkin
- pergunta_1_animo (1-10)
- pergunta_2_ansiedade (1-10)
- pergunta_3_sono (1-10)
- pergunta_4_energia (1-10)
- pergunta_5_foco (1-10)
- pergunta_6_relacionamentos (1-10)
- pergunta_7_proposito (1-10)
- pergunta_8_gratidao (texto)
- notas_adicionais
- Método: calcular_score_bem_estar() → Média das 7 escalas
```

## 🚀 Próximos Comandos

### 1. Criar Superusuário (Admin)
```bash
cd "c:\Users\marco\OneDrive\Área de Trabalho\AppRespiração\calmflow"
.\venv\Scripts\activate
python manage.py createsuperuser
```

### 2. Iniciar o Servidor
```bash
python manage.py runserver
```

### 3. Acessar
- **Admin**: http://localhost:8000/admin
- **API**: http://localhost:8000/api/v1/
- **Docs**: http://localhost:8000/api/v1/emergencias/
         http://localhost:8000/api/v1/check-ins/

## 🔌 Endpoints Disponíveis

### Emergências
- `GET /api/v1/emergencias/` - Listar
- `POST /api/v1/emergencias/` - Criar
- `GET|PATCH|DELETE /api/v1/emergencias/{id}/` - Operações

### Check-ins
- `GET /api/v1/check-ins/` - Listar
- `POST /api/v1/check-ins/` - Criar
- `GET|PATCH|DELETE /api/v1/check-ins/{id}/` - Operações

## 📋 Banco de Dados

- **Type**: SQLite (`db.sqlite3`)
- **Status**: ✅ Migrado e pronto
- **Tabelas**: auth, sessions, admin + suporte_emergencia, suporte_checkin

## 🔐 Autenticação

- Token Auth configurado
- Apenas usuários autenticados podem acessar os endpoints
- Cada usuário só vê suas próprias Emergências e CheckIns

## 📝 Próximos Passos (Fases do MVP)

- [ ] Implementar autenticação/login API
- [ ] Criar testes unitários
- [ ] Adicionar filtros e buscas
- [ ] Documentação OpenAPI/Swagger
- [ ] Frontend (React/Vue)
- [ ] Deploy

---
**Status**: MVP Fundação ✅ Pronto para desenvolvimento
