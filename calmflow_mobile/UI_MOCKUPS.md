# 📱 UI/UX MOCKUPS - CalmFlow Mobile

## 🎨 Exemplo Visual das Telas

### HomeScreen - Vista Principal

```
╔══════════════════════════════════════╗
║  Bem-vindo ao CalmFlow               ║
║  Como você está se sentindo agora?   ║
╠══════════════════════════════════════╣
║                                      ║
║                                      ║
║            ┌──────────┐              ║
║            │          │              ║
║            │ PRECISO  │              ║ ← PanicButton
║            │  DE      │              ║   (60% width)
║            │ AJUDA    │              ║
║            │          │              ║
║            └──────────┘              ║
║                                      ║
║                                      ║
╠══════════════════════════════════════╣
║  📝 Como estou agora?                ║ ← CheckIn Button
║  Responda 8 perguntas rápidas       ║
╠══════════════════════════════════════╣
║  👤 Meu Perfil                       ║ ← Profile Button
╠══════════════════════════════════════╣
║ ⚠️ AVISO IMPORTANTE                  ║
║ Este aplicativo fornece ferramentas  ║ ← Disclaimer
║ de suporte ao bem-estar... [+]       ║
╚══════════════════════════════════════╝

CORES:
- Background: #F8F9FA (Cinza suave)
- Botão Pânico: #20C997 (Verde Água)
- Texto primário: #212529 (Preto suave)
- Disclaimer BG: #FFF3BF (Amarelo)
```

### LoginScreen

```
╔══════════════════════════════════════╗
║                                      ║
║          🌊 CALMFLOW                 ║
║  Suporte Emocional ao Seu Alcance    ║
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║ Email                                ║
║ ┌────────────────────────────────┐  ║
║ │ seu@email.com                  │  ║
║ └────────────────────────────────┘  ║
║                                      ║
║ Senha                                ║
║ ┌────────────────────────────────┐  ║
║ │ ••••••••                       │  ║
║ └────────────────────────────────┘  ║
║                                      ║
║ ┌────────────────────────────────┐  ║
║ │  ENTRAR                        │  ║ ← Botão azul
║ └────────────────────────────────┘  ║
║                                      ║
║ Não tem conta? Criar uma agora       ║ ← Link cadastro
║                                      ║
╠══════════════════════════════════════╣
║ 🧪 Teste Rápido                      ║
║ Email: demo@calmflow.com             ║
║ Senha: Demo12345                     ║
╠══════════════════════════════════════╣
║ ⚠️ AVISO IMPORTANTE [+]              ║
╚══════════════════════════════════════╝

INPUT STYLE:
- Border: 2px #D0D0D0
- Border radius: 8px
- Padding: 16px
- Font: 16px
```

### HomeSCreen + Técnica (Após Pânico)

```
╔══════════════════════════════════════╗
║ ✨ Você não está sozinho!            ║
║ Siga a técnica abaixo com calma     ║
╠══════════════════════════════════════╣
║                                      ║
║   🌬️ Técnica de Respiração Quadrada ║ ← Título
║         (4-4-4-4)                   ║
║                                      ║
║          ┌──────────┐               ║
║          │          │               ║
║          │ 🌬️       │               ║ ← Circle animado
║          │ Inspire  │               ║   (scale 0.8 → 1.2)
║          │          │               ║
║          └──────────┘               ║
║                                      ║
╠══════════════════════════════════════╣
║ Passos:                              ║
║                                      ║
║ 1️⃣ Respire PROFUNDAMENTE pelo nariz ║
║    contando até 4                    ║
║                                      ║
║ 2️⃣ SEGURE a respiração por 4        ║
║    segundos                          ║
║                                      ║
║ 3️⃣ Expire LENTAMENTE pela boca      ║
║    contando até 4                    ║
║                                      ║
║ 4️⃣ SEGURE (vazio) por 4 segundos    ║
║                                      ║
║ 5️⃣ Repita este ciclo 5-10 vezes    ║
║                                      ║
╠══════════════════════════════════════╣
║ 💡 Dica: Use para acalmar            ║
║     o sistema nervoso                ║
╠══════════════════════════════════════╣
║ ┌──────────────────────────────────┐ ║
║ │ ↻ VOLTAR AO INÍCIO              │ ║
║ └──────────────────────────────────┘ ║
╠══════════════════════════════════════╣
║ ⚠️ AVISO IMPORTANTE [+]              ║
╚══════════════════════════════════════╝

ANIMAÇÃO:
- Círculo cresce: 0.8 → 1.2 (4s) ao inspirar
- Círculo encolhe: 1.2 → 0.8 (4s) ao expirar
- Texto muda: "Inspire" → "Segure" → "Expire"
- Loop infinito enquanto BreathingGuide ativo

CORES:
- Círculo: #20C997 (Verde Água)
- Texto "Inspire": #212529
```

### CheckInScreen - Pergunta 1/8

```
╔══════════════════════════════════════╗
║ ← Voltar            Check-in 1 de 8  ║
╠══════════════════════════════════════╣
║  ▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ║ ← Progress bar 12.5%
╠══════════════════════════════════════╣
║                                      ║
║            😊                        ║ ← Emoji grande
║                                      ║
║  Como está seu ânimo?                ║ ← Pergunta
║                                      ║
║  De 1 (péssimo) a 5 (ótimo)          ║ ← Descrição
║                                      ║
╠══════════════════════════════════════╣
║  ┌─┐  ┌─┐  ┌─┐  ┌─┐  ┌─┐            ║
║  │1│  │2│  │3│ ★│4│  │5│            ║ ← Score buttons
║  └─┘  └─┘  └─┘  └─┘  └─┘            ║
║   ○    ○    ○    ●    ○             ║    (● = selecionado)
║                                      ║
║ Pular esta pergunta                  ║ ← Skip button
║                                      ║
╚══════════════════════════════════════╝

LAYOUT:
- Score buttons: width 50px, height 50px
- Border radius: 25px (círculo)
- Selecionado: background verde + text branco
- Não selecionado: background branco + border cinza
- Gap entre buttons: 10px
```

### CheckInScreen - Final

```
╔══════════════════════════════════════╗
║                                      ║
║            🎉                        ║ ← Emoji grande
║                                      ║
║          Obrigado!                   ║ ← Título sucesso
║                                      ║
║  Suas respostas foram salvas e       ║
║  ajudarão a personalizar seu         ║
║  suporte.                            ║
║                                      ║
║  [Voltando em... 2s]                 ║ ← Contador
║                                      ║
╚══════════════════════════════════════╝

AÇÃO:
- Auto-redirect para HomeScreen após 2s
- Salvar respostas no backend: POST /api/v1/check-ins/
```

### ProfileScreen

```
╔══════════════════════════════════════╗
║ ← Voltar              Meu Perfil     ║
╠══════════════════════════════════════╣
║                                      ║
║  ┌─────────────┐                     ║
║  │             │  João Silva         ║ ← Avatar + nome
║  │     👤      │  joao@email.com     ║
║  │             │  ID: 42             ║
║  └─────────────┘                     ║
║                                      ║
╠══════════════════════════════════════╣
║  🚨          📝          🔥           ║
║  Emergências Check-ins   Dias        ║
║     --         --        --          ║ ← Stats (futuros)
╠══════════════════════════════════════╣
║  🏠 Voltar ao Início                 ║ ← Action button
╠══════════════════════════════════════╣
║  🚪 Fazer Logout                     ║ ← Danger button
╠══════════════════════════════════════╣
║ ⚠️ AVISO IMPORTANTE [+]              ║
╚══════════════════════════════════════╝

COLORS:
- Action button: #F1F3F5 background
- Danger button: rgba(255,107,107, 0.1) + red text
```

## 🎨 Typography Hierarchy

```
┌─────────────────────────────────────┐
│ H1 - 32px Bold (700)                │ ← Títulos principais
│ "CalmFlow"                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ H2 - 28px Bold (700)                │ ← Headers seções
│ "Bem-vindo ao CalmFlow"             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ H3 - 24px SemiBold (600)            │ ← Subtítulos
│ "Como está seu ânimo?"              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Body - 16px Regular (400)           │ ← Texto normal
│ "Suas respostas foram salvas..."   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ BodySmall - 14px Regular (400)      │ ← Descrições
│ "De 1 (péssimo) a 5 (ótimo)"       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Caption - 12px Regular (400)        │ ← Super pequeno
│ "⚠️ AVISO IMPORTANTE"              │
└─────────────────────────────────────┘
```

## 🎯 Interações Principais

### 1. Botão de Pânico
```
NORMAL: scale 1.0
↓ PRESS
PRESSED: scale 0.95 + haptic feedback
↓ RELEASE
LOADING: Spinner + overlay
↓ SUCCESS (200ms)
REDIRECT: BreathingGuide view
```

### 2. Score Button (Check-in)
```
NORMAL: Border cinza + BG branco
↓ PRESS
SELECTED: BG verde + Text branco + Haptic
↓ AUTO-ADVANCE
NEXT QUESTION: Slide animation
```

### 3. Loading Overlay
```
FADE IN: 0 → 1 (300ms)
STAY: Until request completes
FADE OUT: 1 → 0 (300ms) [Optional]
```

### 4. Link/Button Navigation
```
PRESS: Color escurece um pouco
HAPTIC: Leve feedback tátil
NAVIGATE: Screen push animation
```

## 📐 Espaçamento Padrão

```
┌─────────────────────────────────┐
│ PADDING INTERNA (Telas)         │
│ paddingHorizontal: 16px         │
│ paddingVertical: 24px           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ MARGIN ENTRE SEÇÕES             │
│ marginVertical: 24px            │
│ marginHorizontal: 16px          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ GAPS PEQUENOS (Forms)           │
│ marginBottom: 16px              │
│ marginTop: 8px                  │
└─────────────────────────────────┘
```

## 🎬 Animações

### PanicButton Pressão
```javascript
// Ao pressionar
scale: 1.0 → 0.95 (friction 4, tension 40)

// Ao soltar
scale: 0.95 → 1.0 (friction 4, tension 40)
```

### BreathingGuide Ciclo
```javascript
// Inspire (4 segundos)
scale: 0.8 → 1.2 (linear timing)

// Segure (4 segundos)
scale: 1.2 (sem mudança)

// Expire (4 segundos)
scale: 1.2 → 0.8 (linear timing)

// Segure (4 segundos)
scale: 0.8 (sem mudança)

// Loop infinito
```

### LoadingOverlay Aparição
```javascript
// Aparecer
opacity: 0 → 1 (300ms)
pointerEvents: 'none' → 'auto'

// Desaparecer
opacity: 1 → 0 (300ms)
pointerEvents: 'auto' → 'none'
```

---

**UI/UX Version**: 1.0  
**Design System**: Azul Sereno + Verde Água  
**Mindset**: Minimalista, calmo, acessível  
**Accessibility**: Tipografia grande, cores de alto contraste  

✅ **Pronto para desenvolvimento!**
