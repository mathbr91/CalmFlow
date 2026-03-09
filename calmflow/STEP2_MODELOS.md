# 📊 Step 2 - Modelos do Database - CalmFlow

## ✅ Modelos Implementados

### 1️⃣ **Model CheckIn** (Prevenção)

```python
class CheckIn(models.Model):
    usuario: ForeignKey(User) ✓
    clima_interno: CharField(Choices) ✓
        - Ensolarado ☀️
        - Nublado ☁️
        - Tempestuoso ⛈️
        - Neblina 🌫️
    
    nivel_ruido: IntegerField (1-10) ✓
    
    gatilho: CharField(Choices) ✓
        - Trabalho
        - Família
        - Telas/Redes Sociais
        - Falta de Sono
        - Saúde Física
        - Relacionamento
        - Financeiro
        - Desconhecido
        - Outro
    
    auto_eficacia: IntegerField (0-10) ✓
    criado_em: DateTimeField (auto_now_add) ✓
```

**Índices:**
- `usuario + criado_em` (para buscar por usuário e ordenar)
- `clima_interno` (para filtros)
- `gatilho` (para análise de padrões)

---

### 2️⃣ **Model Emergencia** (Ação Rápida)

```python
class Emergencia(models.Model):
    usuario: ForeignKey(User, null=True, blank=True) ✓
        # Permite uso anônimo
    
    sintoma_principal: CharField(Choices) ✓
        - Aperto no Peito 🫀
        - Dificuldade de Respirar 😤
        - Confusão Mental 🌀
        - Medo Intenso 😨
        - Outro
    
    ambiente_seguro: BooleanField (default=True) ✓
    criado_em: DateTimeField (auto_now_add) ✓
```

**Índices:**
- `usuario + criado_em` (para histórico)
- `sintoma_principal` (para análise)
- `ambiente_seguro` (para triagem)

---

## 🔄 Migrações Executadas

### Comando 1: Criar Migrações
```bash
python manage.py makemigrations
```

**Output:**
```
Migrations for 'suporte':
  suporte\migrations\0001_initial.py
    - Create model Emergencia
    - Create model CheckIn
```

### Comando 2: Aplicar Migrações
```bash
python manage.py migrate
```

**Output:**
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, suporte
Running migrations:
  Applying suporte.0001_initial... OK
```

---

## 📁 Arquivos Atualizados

✅ [suporte/models.py](../suporte/models.py)
- CheckIn + Emergencia com fields corretos
- Validators (1-10, 0-10)
- Choices com emojis descritivos
- Meta classes com indexes otimizados

✅ [suporte/admin.py](../suporte/admin.py)
- Admin customizado para CheckIn
- Admin customizado para Emergencia
- Display methods para choices
- Fieldsets bem organizados

✅ [suporte/serializers.py](../suporte/serializers.py)
- CheckInSerializer com display fields
- EmergenciaSerializer com usuario_nome anônimo
- read_only fields nas meta

✅ [suporte/views.py](../suporte/views.py)
- CheckInViewSet (IsAuthenticated)
- EmergenciaViewSet (AllowAny para POST - anônimo)
- Queries filtradas por usuário

✅ [suporte/urls.py](../suporte/urls.py)
- Router registrado corretamente

---

## 🗄️ Tabelas Criadas no Banco

```sql
-- Core Django (já existem)
django_user
django_permission
django_content_type
...

-- CalmFlow (novos)
suporte_checkin
suporte_emergencia
```

### Schema CheckIn
```sql
CREATE TABLE suporte_checkin (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER FOREIGN KEY,
    clima_interno VARCHAR(20) CHOICES,
    nivel_ruido INTEGER CHECK (1 <= nivel_ruido <= 10),
    gatilho VARCHAR(50) CHOICES,
    auto_eficacia INTEGER CHECK (0 <= auto_eficacia <= 10),
    criado_em DATETIME
)
```

### Schema Emergencia
```sql
CREATE TABLE suporte_emergencia (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER FOREIGN KEY (NULLABLE),
    sintoma_principal VARCHAR(50) CHOICES,
    ambiente_seguro BOOLEAN DEFAULT TRUE,
    criado_em DATETIME
)
```

---

## 🔌 Endpoints Prontos

### CheckIn (Prevenção)
```
POST   /api/v1/check-ins/           (Criar novo)
GET    /api/v1/check-ins/           (Listar meus)
GET    /api/v1/check-ins/{id}/      (Detalhe)
PATCH  /api/v1/check-ins/{id}/      (Editar)
DELETE /api/v1/check-ins/{id}/      (Deletar)
```

### Emergencia (Ação Rápida)
```
POST   /api/v1/emergencias/         (Criar - anônimo ou autenticado)
GET    /api/v1/emergencias/         (Listar minha - requer auth)
GET    /api/v1/emergencias/{id}/    (Detalhe)
PATCH  /api/v1/emergencias/{id}/    (Editar)
DELETE /api/v1/emergencias/{id}/    (Deletar)
```

---

## 🔐 Permissões

| Endpoint | Anônimo | Autenticado | Descrição |
|----------|---------|------------|-----------|
| `POST /check-ins/` | ❌ | ✅ | Criar check-in requer login |
| `GET /check-ins/` | ❌ | ✅ | Ver apenas seus check-ins |
| `POST /emergencias/` | ✅ | ✅ | Qualquer um pode criar (rápido) |
| `GET /emergencias/` | ❌ | ✅ | Ver apenas suas emergências |

---

## ✨ Próximos Passos

- [ ] Criar superusuário
- [ ] Testar endpoints com Postman/curl
- [ ] Implementar filtros por data/gatilho
- [ ] Adicionar paginação
- [ ] Criar documentação OpenAPI
- [ ] Testes unitários

---

**Status**: Models + Database ✅ Pronto para API Development
