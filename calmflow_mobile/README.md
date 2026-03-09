# 📱 CalmFlow Mobile - React Native + Expo

**Frontend minimalista e focado em redução de ansiedade para o app de suporte emocional CalmFlow.**

## 🎨 Design Philosophy

- **Cores Calmantes**: Azul Sereno (#3B5BDB) + Verde Água (#20C997)
- **Typography Grande**: Melhor legibilidade e redução de ansiedade
- **Sem Menus Complexos**: Fluxo linear e intuitivo
- **Feedback Tátil**: Vibração no ritmo da técnica de respiração
- **Disclaimer Discreto**: Presente mas não invasivo

## 📁 Estrutura de Pastas

```
calmflow_mobile/
├── App.js                    # Entry point com navegação
├── package.json             # Dependências
├── .env.example             # Variáveis de ambiente
│
└── src/
    ├── screens/             # Telas principais
    │   ├── HomeScreen.js          # Botão de pânico + check-in
    │   ├── LoginScreen.js         # Autenticação JWT
    │   ├── RegisterScreen.js      # Criar conta
    │   ├── CheckInScreen.js       # Formulário de 8 perguntas
    │   ├── ProfileScreen.js       # Perfil do usuário
    │   └── index.js              # Exporta todas
    │
    ├── components/          # Componentes reutilizáveis
    │   ├── PanicButton.js        # Grande círculo com animação
    │   ├── BreathingGuide.js     # Animação de respiração
    │   ├── Disclaimer.js         # Aviso jurídico
    │   ├── LoadingOverlay.js     # Loading com fade-in
    │   └── index.js             # Exporta todas
    │
    ├── services/            # APIs e serviços
    │   └── ApiService.js        # Axios + interceptadores JWT
    │
    ├── themes/              # Estilos globais
    │   ├── colors.js            # Paleta + typography
    │   └── index.js            # Exporta
    │
    └── utils/               # Utilitários
        └── storage.js           # AsyncStorage wrapper
```

## 🚀 Setup

### 1. Instalar Dependências
```bash
cd calmflow_mobile
npm install
# ou
yarn install
```

### 2. Configurar .env
```bash
cp .env.example .env
# Editar API_BASE_URL com seu IP local
```

### 3. Rodar App (iOS)
```bash
npm run ios
# ou
expo start --ios
```

### 4. Rodar App (Android)
```bash
npm run android
# ou
expo start --android
```

### 5. Web (desenvolvimento)
```bash
npm run web
```

## 🎯 Telas Principais

### 1. **HomeScreen** 🏠
- **Botão de Pânico**: Grande círculo verde centralizado
  - Ao clicar: `POST /api/v1/emergencias/`
  - Retorna: Técnica com descrição + passos
  - Feedback: Vibração + Loading overlay
- **Check-in Secundário**: Botão "Como estou agora?"
  - Abre formulário de 8 perguntas
- **Perfil**: Link discreto para perfil do usuário
- **Disclaimer**: No rodapé em fundo amarelado

### 2. **LoginScreen** 🔐
- Email + Senha
- Armazena JWT Token (access_token + refresh_token)
- Link para "Criar conta"
- Demo credentials para teste

### 3. **RegisterScreen** 📝
- Primeiro Nome + Email + Username + Senha (2x)
- Validações:
  - ✅ Senha mínimo 8 caracteres
  - ✅ Senhas devem coincidir
  - ✅ Email único no backend
  - ✅ Username único no backend
- Auto-login após registro

### 4. **CheckInScreen** ✅
- Formulário progressivo (8 perguntas)
- Cada pergunta é um slide
- Score de 1-5 com botões animados
- Progress bar visual
- `POST /api/v1/check-ins/` ao final
- Success screen com countdown

### 5. **ProfileScreen** 👤
- Mostra dados do usuário
- Stats (emergências, check-ins, dias - para futuro)
- Botão de logout
- Botão de voltar pra home

## 💻 Componentes Reutilizáveis

### `<PanicButton />`
```jsx
<PanicButton 
  onPress={() => console.log('Botão de pânico pressado')}
  loading={false}
/>
```
- Grande círculo com texto "PRECISO DE AJUDA"
- Animação de pressão (scale 0.95)
- Loading spinner

### `<BreathingGuide />`
```jsx
<BreathingGuide technique={technique} />
```
- Anima círculo segundo fases de respiração
- Mostra passos em ScrollView
- Dica opcional

### `<Disclaimer />`
```jsx
<Disclaimer style={customStyle} />
```
- Rodapé com aviso jurídico
- Texto em PT-BR
- Background amarelado

### `<LoadingOverlay />`
```jsx
<LoadingOverlay 
  visible={isLoading}
  message="Carregando..."
/>
```
- Fade-in suave (não jarring)
- Spinner + mensagem
- Bloqueia interações

## 🔌 API Integration

### Endpoints Usado

```bash
# Autenticação
POST   /api/v1/register/          # Criar conta
POST   /api/v1/token/             # Login (JWT)
POST   /api/v1/token/refresh/     # Refresh token
GET    /api/v1/profile/           # Perfil do usuário

# App
POST   /api/v1/emergencias/       # Criar emergência + retorna técnica
GET    /api/v1/sos/               # SOS rápido
POST   /api/v1/check-ins/         # Enviar check-in
GET    /api/v1/check-ins/         # Histórico de check-ins
```

### Token Management

ApiService faz automaticamente:
- ✅ Adiciona `Authorization: Bearer <token>` em todas as requisições
- ✅ Refresh token automático se expirado (401)
- ✅ Remove tokens ao fazer logout
- ✅ Timeout de 10s para todas as requisições

## 🎨 Paleta de Cores

```javascript
// Primárias
primary: '#3B5BDB'           // Azul Sereno
secondary: '#20C997'         // Verde Água
accent: '#FFD43B'            // Amarelo Suave

// Neutros
background: '#F8F9FA'        // Branco + cinzento
surface: '#FFFFFF'           // Branco puro
textPrimary: '#212529'       // Preto suave

// Estados
success: '#20C997'           // Verde
warning: '#FFB700'           // Laranja
error: '#FF6B6B'             // Vermelho
info: '#3B5BDB'              // Azul
```

## 📏 Espaçamentos

```javascript
xs: 4
sm: 8
md: 16
lg: 24
xl: 32
xxl: 48
```

## 🏗️ Arquitetura

```
+------------------+
|   NavigationContainer (App.js)
+------------------+
          |
    +-----+-----+
    |           |
 AuthStack   AppStack
    |           |
+---+---+   +---+---+---+
| Login | |Home|CheckIn|Profile|
|Register|
+-------+   +-----------+-------+

UI Layer:
  Screens (HomeScreen, etc.)
      ↓
  Components (PanicButton, etc.)

Services Layer:
  ApiService (axios + interceptators)
  Storage (AsyncStorage wrapper)

Themes Layer:
  Colors, Typography, Spacing
```

## 🔐 Segurança

- ✅ JWT tokens (access + refresh)
- ✅ Tokens armazenados no AsyncStorage (local phone)
- ✅ Refresh token automático em 401
- ✅ Logout limpa todos os tokens
- ✅ Email validation no backend
- ✅ Password strength no backend

## 📦 Dependências

```json
{
  "react": "18.2.0",
  "react-native": "0.73.2",
  "expo": "~50.0.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "axios": "^1.6.2",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "expo-haptics": "^12.8.1"
}
```

## 🧪 Teste Rápido

### Simulador iOS
```bash
npm run ios
# App abre no simulador
# Login com: demo@calmflow.com / Demo12345
```

### Simulador Android
```bash
npm run android
# App abre no emulador
# Ajustar API_BASE_URL para http://10.0.2.2:8000
```

### Device Real
```bash
npm start
# QR code aparece no terminal
# Scanear com expo app
# Ajustar API_BASE_URL para seu IP local (192.168.x.x)
```

## 🎯 Fluxo de Usuário

```
[Splash]
    ↓
[Checking JWT Token]
    ↓
    ├─ SEM TOKEN → [LoginScreen]
    │              ↓
    │          [Register] ou Login
    │              ↓
    │         [HomeScreen] ✓
    │
    └─ COM TOKEN → [HomeScreen] ✓
                        ↓
                   ┌────┴────┬──────────┐
                   ↓         ↓          ↓
            [Botão Pânico] [Check-in] [Perfil]
                   ↓
            [Técnica Respiração]
                   ↓
            [Voltar Home]
```

## 🚀 Deploy

### Expo Go (Desenvolvimento)
```bash
npm start
# Scanear QR code com Expo Go app
```

### EAS Build (Produção)
```bash
eas build --platform ios --auto-submit
eas build --platform android --auto-submit
```

### TestFlight / Google Play
```bash
eas submit --platform ios
eas submit --platform android
```

## 📝 Próximos Steps

- [ ] Analytics dashboard com charts
- [ ] Histórico de técnicas usadas
- [ ] Favoritar técnicas
- [ ] Notificações push (check-in reminders)
- [ ] Modo offline (salvar respostas localmente)
- [ ] Dark mode
- [ ] Múltiplos idiomas (PT-BR, EN-US, ES)
- [ ] Integração com wearables (Apple Watch, Fitbit)
- [ ] Exportar dados (PDF)

## 📞 Troubleshooting

### Erro de Conexão
```
❌ Network Error: getaddrinfo ENOTFOUND
→ Verificar API_BASE_URL em .env
→ Para Android emulador: usar http://10.0.2.2:8000
→ Para device real: usar http://192.168.x.x:8000 (seu IP)
```

### JWT Inválido
```
❌ 401 Unauthorized
→ Limpar cache: 
  rm -rf node_modules
  npm install
→ Ou fazer logout e login novamente
```

### Build Fails
```
❌ Build error
→ npm expo prebuild --clean
→ npm install
→ npm start
```

## 📄 Licença

MIT License - CalmFlow 2026

---

**Status**: ✅ MVP PRONTO PARA TESTES  
**Stack**: React Native + Expo + Axios + AsyncStorage  
**Design**: Azul Sereno + Verde Água (Minimalista)

🎉 **Pronto para usar! Bora testar?**
