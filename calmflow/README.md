# CalmFlow - App de Suporte Emocional

Um aplicativo MVP de suporte emocional e manejo de bem-estar, construído com Django 4.2+ e Django Rest Framework.

## 🎯 Visão Geral

**CalmFlow** é uma plataforma HealthTech focada em:
- 📊 **Diários Estruturados**: Check-in diário com 8 perguntas sobre bem-estar
- 🚨 **Gerenciamento de Crises**: Logs rápidos de emergências emocionais
- 📈 **Acompanhamento**: Histórico e análise do bem-estar emocional

## 📋 Requisitos Técnicos

- Python 3.10+
- Django 4.2.11
- Django Rest Framework 3.14.0
- SQLite (desenvolvimento)

## 🚀 Setup Inicial

### 1. Criar Ambiente Virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 3. Configurações Iniciais

```bash
# Criar arquivo .env baseado no exemplo
cp .env.example .env

# Executar migrations
python manage.py migrate

# Criar superusuário (admin)
python manage.py createsuperuser

# Coletar arquivos estáticos
python manage.py collectstatic --noinput
```

### 4. Iniciando o Servidor

```bash
python manage.py runserver
```

Servidor acessível em: `http://localhost:8000`

## 📚 Estrutura do Projeto

```
calmflow/
├── calmflow/              # Configurações principais
│   ├── settings.py        # Configurações Django
│   ├── urls.py            # Roteamento principal
│   ├── wsgi.py
│   └── asgi.py
├── suporte/               # App principal
│   ├── models.py          # Modelos de dados
│   ├── views.py           # ViewSets da API
│   ├── serializers.py     # Serializers DRF
│   ├── urls.py            # Roteamento da app
│   ├── admin.py           # Configuração admin
│   └── migrations/
├── manage.py
├── requirements.txt
├── .env.example
└── README.md
```

## 🗄️ Modelos de Dados

### Emergencia
Registro rápido de momentos de crise para gestão de bem-estar.

**Campos:**
- `usuario` (FK): Usuário que registrou
- `severidade`: Nível 1-4 (Leve a Crítico)
- `descricao`: Descrição da situação
- `localizacao`: Local do ocorrido (opcional)
- `resolvido`: Status da crise
- `notas_resolucao`: Como foi resolvido

### CheckIn
Diário estruturado com 8 perguntas de bem-estar emocional.

**Campos:**
- `usuario` (FK): Usuário responsável
- `pergunta_1_animo`: Como está seu ânimo? (1-10)
- `pergunta_2_ansiedade`: Nível de ansiedade (1-10)
- `pergunta_3_sono`: Qualidade do sono (1-10)
- `pergunta_4_energia`: Nível de energia (1-10)
- `pergunta_5_foco`: Capacidade de foco (1-10)
- `pergunta_6_relacionamentos`: Qualidade dos relacionamentos (1-10)
- `pergunta_7_proposito`: Sensação de propósito (1-10)
- `pergunta_8_gratidao`: O que você é grato?
- `notas_adicionais`: Reflexões do dia

## 🔌 Endpoints da API

### Authentication
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/logout/` - Logout

### Emergências
- `GET /api/v1/emergencias/` - Listar emergências do usuário
- `POST /api/v1/emergencias/` - Criar nova emergência
- `GET /api/v1/emergencias/{id}/` - Detalhe de uma emergência
- `PATCH /api/v1/emergencias/{id}/` - Atualizar emergência
- `DELETE /api/v1/emergencias/{id}/` - Deletar emergência

### Check-ins
- `GET /api/v1/check-ins/` - Listar check-ins do usuário
- `POST /api/v1/check-ins/` - Criar novo check-in
- `GET /api/v1/check-ins/{id}/` - Detalhe de um check-in
- `PATCH /api/v1/check-ins/{id}/` - Atualizar check-in
- `DELETE /api/v1/check-ins/{id}/` - Deletar check-in

## ⚙️ Configurações Importantes

### Fuso Horário e Idioma
- **Fuso Horário**: `America/Sao_Paulo` (Brasil)
- **Idioma**: Português Brasileiro (`pt-br`)

### CORS
Configurado para aceitar requisições de:
- `http://localhost:3000`
- `http://localhost:8000`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:8000`

Adicionar novas origens no arquivo `.env`

## 🔐 Segurança

- Autenticação via Token
- Permissões: Apenas usuários autenticados
- CORS headers configurados
- CSRF protection ativado
- SQL Injection prevention (ORM do Django)

## 📝 Próximos Passos

- [ ] Implementar autenticação completa
- [ ] Adicionar análises e relatórios
- [ ] Criar frontend React/Vue
- [ ] Implementar notificações
- [ ] Adicionar suporte a múltiplos idiomas
- [ ] Deploy em produção

## 📞 Suporte

Para dúvidas ou sugestões, contate a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para o bem-estar emocional**
