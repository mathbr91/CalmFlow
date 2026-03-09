# 📱 ARQUITETURA DO CALMFLOW MOBILE

## 🏗️ Estrutura de Pastas Completa

```
CALMFLOW_MOBILE/
│
├── 📄 App.js                    ← Entry point (navegação)
├── 📄 package.json              ← Dependências
├── 📄 babel.config.js           ← Babel config
├── 📄 app.json                  ← Expo config
├── 📄 .env.example              ← Variables de ambiente
│
│
├── 📚 SRC/ (Código da app)
│   │
│   ├── SCREENS/ (5 Telas)
│   │   ├── HomeScreen.js        ← Botão de Pânico + Check-in
│   │   ├── LoginScreen.js       ← Login com JWT
│   │   ├── RegisterScreen.js    ← Criar conta com validações
│   │   ├── CheckInScreen.js     ← Formulário 8 perguntas
│   │   ├── ProfileScreen.js     ← Perfil do usuário
│   │   └── index.js             ← Export all screens
│   │
│   ├── COMPONENTS/ (4 Componentes Reutilizáveis)
│   │   ├── PanicButton.js       ← Círculo grande (60% largura)
│   │   │                           - Animação scale 0.95 on press
│   │   │                           - Loading spinner
│   │   │                           - Shadow effect
│   │   │
│   │   ├── BreathingGuide.js    ← Animação de respiração
│   │   │                           - Ciclo: Inspire 4s → Segure 4s → Expire 4s → Segure 4s
│   │   │                           - Circle scale animation
│   │   │                           - Steps + tips
│   │   │
│   │   ├── Disclaimer.js         ← Aviso jurídico no rodapé
│   │   │                           - Texto PT-BR multiidioma
│   │   │                           - Background amarelo suave
│   │   │
│   │   ├── LoadingOverlay.js    ← Loading com fade-in
│   │   │                           - Animated.View com opacity
│   │   │                           - ActivityIndicator
│   │   │
│   │   └── index.js             ← Export all components
│   │
│   ├── SERVICES/ (APIs e Backend)
│   │   ├── ApiService.js        ← Axios com:
│   │   │                           - JWT Bearer token auto-add
│   │   │                           - Refresh token automático (401)
│   │   │                           - Timeout 10s
│   │   │                           - 8 métodos: register, login, logout, getProfile, createEmergencia, getSos, createCheckIn, getCheckIns
│   │   │
│   │   └── index.js
│   │
│   ├── THEMES/ (Design System)
│   │   ├── colors.js            ← Paleta de cores + typography:
│   │   │                           CORES:
│   │   │                           - primary: #3B5BDB (Azul Sereno)
│   │   │                           - secondary: #20C997 (Verde Água)
│   │   │                           - accent: #FFD43B (Amarelo)
│   │   │                           - background: #F8F9FA
│   │   │                           - surface: #FFFFFF
│   │   │                           - error: #FF6B6B
│   │   │                           - success: #20C997
│   │   │
│   │   │                           TYPOGRAPHY:
│   │   │                           - h1: fontSize 32 (700 weight)
│   │   │                           - h2: fontSize 28 (700 weight)
│   │   │                           - h3: fontSize 24 (600 weight)
│   │   │                           - body: fontSize 16 (400 weight)
│   │   │                           - caption: fontSize 12
│   │   │
│   │   │                           SPACING:
│   │   │                           - xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48
│   │   │
│   │   │                           BORDER RADIUS:
│   │   │                           - sm: 4, md: 8, lg: 12, xl: 16, pill: 9999
│   │   │
│   │   └── index.js             ← Export theme
│   │
│   └── UTILS/ (Utilitários)
│       ├── storage.js           ← AsyncStorage wrapper:
│       │                           - setItem(key, value)
│       │                           - getItem(key)
│       │                           - removeItem(key)
│       │                           - clear()
│       │
│       └── index.js
│
├── 📄 README.md                 ← Documentação completa
├── 📄 SETUP_RAPIDO.md           ← Setup em 5 minutos
└── 📄 ARQUITETURA.md            ← Este arquivo

```

## 🌊 Fluxo de Navegação

```
┌──────────────────────────────────────────────────────────┐
│                    App.js (RootNavigator)                │
│                                                          │
│  1. Verifica AsyncStorage por 'access_token'            │
│  2. Se existe → AppStack                                 │
│  3. Se não → AuthStack                                   │
└──────────────────┬───────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼─────┐          ┌───▼──────┐
    │AuthStack│          │AppStack  │
    └───┬─────┘          └───┬──────┘
        │                    │
    ┌───┴─────────┐      ┌───┴──────────┬──────────┐
    │             │      │              │          │
┌───▼──┐  ┌──────▼──┐ ┌─▼─┐  ┌───────▼┐  ┌────▼───┐
│Login │→ │Register │ │ ┌→│Home │ CheckIn  │Profile │
└──────┘  └─────────┘ │ │ └─────┘  └────────┘  └────────┘
                      │ │      │
                      │ │      └─────┳─→ POST /emergencias/
                      └─┘            │
                       JWT Token    └─────────────────→
                       salvo no           Técnica retornada
                       AsyncStorage
```

## 🧩 Componentes em Detalhe

### PanicButton
```javascript
<PanicButton 
  onPress={handlePanicPress}    // Callback ao clicar
  loading={false}               // Mostra spinner se true
/>

// Renderiza:
// Círculo verde gigante (60% da width)
// Texto "PRECISO DE AJUDA" em h2
// Animação scale 0.95 ao pressionar
// Shadow suave embaixo
```

### BreathingGuide
```javascript
<BreathingGuide technique={response.tecnica_sugerida} />

// technique = {
//   titulo: "🌬️ Técnica de Respiração Quadrada (4-4-4-4)",
//   passos: ["1️⃣ Respire PROFUNDAMENTE...", ...],
//   dica: "Repita de 5-10 vezes"
// }

// Renderiza:
// 1. Título da técnica
// 2. Círculo animado (respira)
// 3. Status: "🌬️ Inspire" / "⏸️ Segure" / "😤 Expire"
// 4. ScrollView com passos
// 5. Dica em box amarelo
```

### LoadingOverlay
```javascript
<LoadingOverlay 
  visible={loading}        // true = mostra, false = esconde
  message="Ativando..." 
/>

// Renderiza:
// - Overlay preto semi-transparente
// - Card branco com ActivityIndicator
// - Mensagem abaixo
// - Fade-in suave de 300ms
// - Bloqueia interações quando visível
```

### Disclaimer
```javascript
<Disclaimer style={{ marginTop: 20 }} />

// Renderiza:
// - Background amarelado (#FFF3BF)
// - Border superior (#FFB700)
// - Título: "⚠️ AVISO IMPORTANTE"
// - Texto em caption (12px)
// - ScrollView para textos longos
```

## 🔌 Endpoints Utilizados

```
┌─────────────────────────────────────────────────────────┐
│ AUTENTICAÇÃO                                            │
├─────────────────────────────────────────────────────────┤
│ POST   /api/v1/register/                                │
│        Body: {email, password, password_confirm, ...}   │
│        Return: {id, email, username, ...}               │
│                                                         │
│ POST   /api/v1/token/                                   │
│        Body: {email, password}                          │
│        Return: {access, refresh, first_name}            │
│        → Salva access + refresh em AsyncStorage         │
│                                                         │
│ POST   /api/v1/token/refresh/                           │
│        Body: {refresh}                                  │
│        Return: {access, refresh}                        │
│                                                         │
│ GET    /api/v1/profile/                                 │
│        Headers: Authorization: Bearer <token>          │
│        Return: {id, email, first_name, ...}             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ APP (Emergência & Check-in)                             │
├─────────────────────────────────────────────────────────┤
│ POST   /api/v1/emergencias/                             │
│        Body: {sintoma_principal, ambiente_seguro}       │
│        Query: ?lang=pt-br (opcional)                    │
│        Return: {                                        │
│          id, usuario, sintoma_display,                  │
│          tecnica_sugerida: { titulo, passos, ... },     │
│          disclaimer: "⚠️ AVISO IMPORTANTE: ..."        │
│        }                                                │
│                                                         │
│ GET    /api/v1/sos/                                     │
│        Query: ?lang=pt-br (opcional)                    │
│        Return: { status, numeros_emergencia, ... }      │
│                                                         │
│ POST   /api/v1/check-ins/                               │
│        Body: {animo, sono, energia, ansiedade, ...}     │
│        Return: {id, usuario, scores, ...}               │
│                                                         │
│ GET    /api/v1/check-ins/                               │
│        Headers: Authorization: Bearer <token>          │
│        Return: [{...}, {...}]  (array)                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🔑 JWT Token Lifecycle

```
┌─ LOGIN ──────────────────────────────────────────┐
│                                                  │
│  1. User enters email + password                 │
│  2. POST /api/v1/token/ → {access, refresh}     │
│  3. ApiService salva em AsyncStorage:            │
│     - access_token (1 hora validade)             │
│     - refresh_token (7 dias validade)            │
│  4. Navigate para HomeScreen                     │
│                                                  │
└──────────────────────────────────────────────────┘

┌─ REQUISIÇÕES ────────────────────────────────────┐
│                                                  │
│  Interceptador de Request:                       │
│  1. Obtém access_token do AsyncStorage           │
│  2. Adiciona: Authorization: Bearer <token>     │
│  3. Envia request                                │
│                                                  │
└──────────────────────────────────────────────────┘

┌─ REFRESH AUTOMÁTICO ─────────────────────────────┐
│                                                  │
│  Se response.status === 401:                     │
│  1. Obtém refresh_token do AsyncStorage          │
│  2. POST /api/v1/token/refresh/ → {access}     │
│  3. Atualiza novo access_token                   │
│  4. Retry da requisição original com novo token │
│                                                  │
└──────────────────────────────────────────────────┘

┌─ LOGOUT ─────────────────────────────────────────┐
│                                                  │
│  1. Remove access_token do AsyncStorage          │
│  2. Remove refresh_token do AsyncStorage         │
│  3. Navigate para LoginScreen                    │
│                                                  │
└──────────────────────────────────────────────────┘
```

## 🎨 Paleta de Cores em Uso

```
PRIMÁRIA (Ações Principais):
┌─────────────────────┐
│ Azul Sereno         │
│ #3B5BDB             │
│ Botões principais   │
│ Links               │
└─────────────────────┘

SECUNDÁRIA (Sucesso/ajuda):
┌─────────────────────┐
│ Verde Água          │
│ #20C997             │
│ Botão Pânico        │
│ Confirmações        │
└─────────────────────┘

AVISOS:
┌─────────────────────┐
│ Amarelo Suave       │
│ #FFD43B / #FFF3BF   │
│ Disclaimer rodapé   │
│ Avisos gentis       │
└─────────────────────┘

NEUTROS:
┌─────────────────────┐
│ Fundo: #F8F9FA      │
│ Surface: #FFFFFF    │
│ Text: #212529       │
│ Light: #8E99A4      │
└─────────────────────┘
```

## 📐 Espaçamento Padrão

```
xs:   4px    └ Gaps mínimos
sm:   8px    └ Componentes pequenos
md:  16px    └ Padrão geral
lg:  24px    └ Seções
xl:  32px    └ Headers
xxl: 48px    └ Grandes divisões
```

## 🧪 Testes Manuais

### Teste 1: Login
```
✅ Inserir email válido
✅ Inserir senha válida
✅ Clique "Entrar"
✅ Deve ir para HomeScreen
✅ Token deve estar em AsyncStorage
```

### Teste 2: Botão de Pânico
```
✅ HomeScreen aberto
✅ Clique no círculo verde grande
✅ Loading overlay deve aparecer
✅ Técnica de respiração deve retornar em <1s
✅ Celular deve vibrar (Haptics)
✅ Animação de respiração deve rodar
```

### Teste 3: Check-in
```
✅ HomeScreen
✅ Clique "Como estou agora?"
✅ 8 perguntas devem aparecer uma por uma
✅ Progress bar deve avançar
✅ Ao final: Success screen
✅ Respostas devem estar no backend
```

### Teste 4: Logout
```
✅ ProfileScreen
✅ Clique "🚪 Fazer Logout"
✅ Tokens devem ser removidos
✅ Deve ir para LoginScreen
✅ Não deve conseguir acessar HomeScreen sem login
```

## 🚀 Próximas Melhorias

- [ ] Autenticação com biometria (Face ID / Touch ID)
- [ ] Analytics dashboard com charts
- [ ] Histórico visualizável
- [ ] Favoritar técnicas
- [ ] Notificações push
- [ ] Modo offline (sync quando online)
- [ ] Dark mode
- [ ] Múltiplos idiomas
- [ ] Exportar dados (PDF)
- [ ] Integração com smartwatch

---

**Architecture Version**: 1.0  
**Last Updated**: Mar 2026  
**Status**: ✅ MVP Pronto  
