# 🚀 SETUP RÁPIDO - CalmFlow Mobile

## ⚡ Instalação em 5 Minutos

### 1️⃣ Pré-requisitos
```bash
# Node.js 16+ instalado
node --version

# Expo CLI
npm install -g expo-cli
```

### 2️⃣ Instalar Dependências
```bash
cd calmflow_mobile
npm install
```

### 3️⃣ Configurar API
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com seu IP local
# Para Android Emulator: http://10.0.2.2:8000
# Para Device Real: http://192.168.1.XXX:8000
```

### 4️⃣ Rodar Servidor Django
```bash
cd ../calmflow
source venv/bin/activate  # ou venv\Scripts\activate no Windows
python manage.py runserver
```

### 5️⃣ Iniciar App
```bash
cd ../calmflow_mobile
npm start

# Opções:
# - Pressione 'ios' para abrir no simulador iOS
# - Pressione 'android' para abrir no emulador Android
# - Pressione 'w' para abrir no web
```

## 📱 Testando

### Credenciais Demo
```
Email: demo@calmflow.com
Senha: Demo12345
```

### Fluxo de Teste
1. **Login** com credenciais demo
2. **Clique no Botão de Pânico** (verde, círculo grande)
3. **Veja a técnica de respiração** com animação
4. **Clique "Como estou agora?"** para fazer check-in
5. **Responda 8 perguntas** (escala 1-5)
6. **Veja o perfil** clicando em "👤 Meu Perfil"

## 🎨 Estrutura Criada

✅ **5 Screens Completas**
- HomeScreen (Botão de pânico)
- LoginScreen (Autenticação)
- RegisterScreen (Criar conta)
- CheckInScreen (Formulário)
- ProfileScreen (Perfil)

✅ **4 Componentes Reutilizáveis**
- PanicButton (com animação)
- BreathingGuide (com respiração)
- Disclaimer (rodapé legal)
- LoadingOverlay (fade-in)

✅ **3 Serviços**
- ApiService (Axios + JWT)
- StorageService (AsyncStorage)
- Theme (Colors + Typography)

✅ **Design Minimalista**
- Paleta: Azul Sereno + Verde Água
- Typography grande
- Sem menus complexos
- Feedback tátil (vibração)

## 📞 Troubleshooting

### Erro: "Cannot connect to API"
```
→ Verificar Django está rodando: python manage.py runserver
→ Verificar API_BASE_URL em .env
→ Android emulator: use http://10.0.2.2:8000
```

### Erro: "Module not found"
```
→ rm -rf node_modules package-lock.json
→ npm install
```

### Erro: "JWT token expired"
```
→ Fazer logout e login novamente
→ Token refresh automático (5 min)
```

## 🔄 Workflow Recomendado

```bash
# Terminal 1: Django Backend
cd calmflow
.\venv\Scripts\activate
python manage.py runserver

# Terminal 2: React Native Frontend
cd calmflow_mobile
npm start
# Pressione 'a' para Android ou 'i' para iOS
```

## 🎯 O que Fazer Agora

1. **Testar Botão de Pânico** → Deve retornar técnica de respiração
2. **Fazer Check-in** → 8 perguntas devem postar para backend
3. **Logout e Register** → Criar nova conta deve funcionar
4. **Verificar Feedback Tátil** → Celular deve vibrar

## 📦 Próximos Steps

- [ ] Integrar com Analytics Dashboard
- [ ] Salvar histórico de técnicas
- [ ] Notificações push
- [ ] Modo offline
- [ ] Dark mode
- [ ] Deploy na AppStore/PlayStore

---

**Seu app mobile está pronto! 🚀**

Precisa de ajuda? Verifique README.md para documentação completa.
