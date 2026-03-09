# ⚡ QUICK START - CalmFlow API

## 🚀 Iniciar em 30 Segundos

### 1. Ativar Ambiente
```bash
cd "c:\Users\marco\OneDrive\Área de Trabalho\AppRespiração\calmflow"
.\venv\Scripts\activate
```

### 2. Rodar Servidor
```bash
python manage.py runserver
```

### 3. Testar no Browser
```
http://localhost:8000/api/v1/sos/
```

**Pronto!** 🎉 Seu servidor está rodando!

---

## 🧪 Testes Rápidos (30 segundos cada)

### Teste 1: Endpoint SOS
```bash
curl http://localhost:8000/api/v1/sos/
```
✅ Deve retornar JSON com CVV + hospitais

### Teste 2: Criar Emergência - Respiração
```bash
curl -X POST http://localhost:8000/api/v1/emergencias/ \
  -H "Content-Type: application/json" \
  -d {"sintoma_principal": "respiracao", "ambiente_seguro": true}
```
✅ Deve retornar JSON com técnica "Respiração Quadrada" 🌬️

### Teste 3: Criar Emergência - Peito
```bash
curl -X POST http://localhost:8000/api/v1/emergencias/ \
  -H "Content-Type: application/json" \
  -d {"sintoma_principal": "peito", "ambiente_seguro": false}
```
✅ Deve retornar JSON com técnica "Relaxamento Muscular" 🫀

---

## 📊 O que Funciona Agora

✅ **SOS Endpoint** - Números de emergência + hospitais  
✅ **Emergência Inteligente** - Retorna técnica baseada no sintoma  
✅ **Disclaimer Jurídico** - Incluído em toda resposta  
✅ **Usuários Anônimos** - Sem login necessário  
✅ **Admin Panel** - Gerenciar registros  
✅ **Database** - SQLite pronto  

---

## 📁 Arquivos Importantes

| Arquivo | Para quem |
|---------|----------|
| `GUIA_TESTES.md` | QA/Testers - 7 testes detalhados |
| `ARQUITETURA.md` | Tech Lead - Estrutura completa |
| `STEP3_INTELIGENCIA.md` | Developers - Implementação técnica |
| `STEP3_RESUMO.md` | Product - Resumo com exemplos |
| `README.md` | Todos - Overview |

---

## 🎯 Fluxo Prático

1. **POST /emergencias/** com sintoma
2. API salva no banco
3. Serializer gera técnica automaticamente
4. Retorna JSON com passo-a-passo
5. Usuário pratica enquanto aguarda ambulância

---

## ⚠️ Próximas Ações

- [ ] Criar superusuário: `python manage.py createsuperuser`
- [ ] Testar em Postman (mais fácil)
- [ ] Implementar autenticação (STEP 4)
- [ ] Frontend React (STEP 5)

---

**Status**: ✅ Ready to Go!

Dúvidas? Veja GUIA_TESTES.md ou ARQUITETURA.md
