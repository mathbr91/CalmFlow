# CalmFlow — Design Spec
**Data:** 2026-03-30  
**Status:** Em revisão  
**Autores:** Matheus + equipe CalmFlow

---

## 1. Visão geral

CalmFlow é um app mobile de suporte emocional com comprovação científica para pessoas com ansiedade, depressão e dificuldades emocionais. A proposta é oferecer ferramentas de alívio imediato (botão de pânico, respiração guiada) e de monitoramento contínuo (check-ins diários, histórico de humor), com integração opcional ao psicólogo do usuário.

**Mercados:** Portugal (mercado principal), Brasil, e expansão para mercados de língua inglesa, espanhola e francesa.  
**Idiomas suportados:** Português (PT/BR), Inglês, Espanhol, Francês.

**Stack atual:**
- Backend: Django 4.2 + Django REST Framework + JWT (SimpleJWT)
- Mobile: React Native + Expo (testado via Expo Go)
- Banco: SQLite (dev) → PostgreSQL (produção)
- Build: EAS Build configurado

**Modelo de negócio:** Freemium com revenue share para psicólogos parceiros.

---

## 2. Personas

**Marcos (usuário paciente):** Adulto 25–45 anos com ansiedade ou depressão leve/moderada. Busca ferramentas de autoajuda fora das sessões. Pode ou não ter psicólogo. Usa o app em momentos de crise e no dia a dia.

**Roberto (contato de emergência):** Familiar ou amigo próximo do Marcos. Não usa o app ativamente — recebe alertas por SMS quando Marcos aciona o pânico. Precisa validar a indicação antes de receber alertas.

**Dra. Ana (psicóloga):** Profissional de psicologia com CRP ativo. Usa o painel web, não o app mobile. Indica o CalmFlow para pacientes como ferramenta entre sessões. Tem interesse em acompanhar humor e histórico remotamente. Recebe percentual da mensalidade do paciente vinculado.

---

## 3. Arquitetura do sistema

```
[App Mobile - React Native/Expo]
        |
        | HTTPS (JWT)
        |
[Backend Django - Railway/Render]
        |
   ┌────┴─────┐
   |          |
[PostgreSQL] [Zenvia SMS API]
                    |
            [SMS para Roberto/Paciente]

[Painel Web Psicólogo - React Web]
        |
        | HTTPS (JWT - role: psicologo)
        |
[Backend Django - mesmo servidor]
```

O painel web do psicólogo consome a mesma API do backend, com endpoints protegidos por role `psicologo`. Não há servidor separado.

---

## 4. Módulos e funcionalidades

### 4.1 Autenticação e perfis (já implementado — expandir)

**Roles de usuário:**
- `paciente` — padrão para todos os registros
- `psicologo` — atribuído manualmente via admin ou via fluxo de cadastro separado

**Campos adicionais no UserProfile (expandir modelo existente):**
- `role`: choices `paciente` / `psicologo`
- `crp_numero`: string, apenas para psicólogos
- `codigo_psicologo`: string única de 6 dígitos gerada no cadastro do psicólogo (ex: `ANA-291`)
- `plano`: choices `free` / `premium`
- `stripe_customer_id`: string, para integração de pagamento

---

### 4.2 Contato de emergência + validação por SMS

**Fluxo completo:**

1. No app do Marcos, tela de Perfil → seção "Contato de emergência"
2. Marcos preenche: nome, telefone do Roberto
3. Marcos toca "Cadastrar"
4. **Pop-up vermelho de aviso** aparece com texto:
   > "Atenção: Roberto receberá um SMS do CalmFlow avisando que você o indicou como contato de emergência. Recomendamos que você avise Roberto antes para que não se assuste. O link pode cair no spam — peça para ele verificar."
   > Botões: "Cancelar" | "Enviar mesmo assim"
5. Backend envia SMS para o telefone do Roberto via Zenvia:
   > "Olá Roberto! Marcos te indicou como contato de emergência no app CalmFlow. Para confirmar, acesse: [link de validação]. Você precisará aceitar os termos e cadastrar seu e-mail."
6. Roberto acessa o link (web, sem precisar instalar o app):
   - Exibe nome do Marcos, descrição do que é o CalmFlow
   - Checkbox: "Aceito os termos e política de privacidade"
   - Campo: e-mail do Roberto
   - Botão: "Confirmar participação"
7. Após confirmação, Roberto é cadastrado como `contato_emergencia` no banco
8. Marcos vê status "Confirmado ✓" na tela de perfil

**Quando o pânico é acionado:**
- Se Roberto estiver validado, backend envia SMS: "⚠️ Marcos acionou o botão de emergência no CalmFlow agora. Ele pode precisar de apoio."
- SMS é assíncrono — não bloqueia a experiência do Marcos

**Modelo banco (novo):**
```
ContatoEmergencia
  - paciente: FK → User
  - nome: string
  - telefone: string
  - email: string (preenchido na validação)
  - status: choices pending / confirmado / recusado
  - token_validacao: UUID (expira em 72h)
  - criado_em: datetime
  - confirmado_em: datetime (null)
```

---

### 4.3 Conexão psicólogo-paciente

**Fluxo:**

1. Psicóloga Ana faz cadastro no painel web com role `psicologo`, informa CRP
2. Sistema gera `codigo_psicologo` único (ex: `ANA-291`)
3. Ana passa esse código verbalmente para Marcos: *"meu número no CalmFlow é ANA-291"*
4. Marcos, no app, vai em Perfil → "Conectar com psicólogo" → digita `ANA-291`
5. **Marcos precisa ter plano premium** para fazer essa conexão
   - Se estiver no free: exibe tela de upgrade antes de prosseguir
6. Sistema valida o código, cria vínculo `PacientePsicologo`
7. Ana vê Marcos no painel web imediatamente

**Modelo banco (novo):**
```
PacientePsicologo
  - paciente: FK → User (role=paciente)
  - psicologo: FK → User (role=psicologo)
  - criado_em: datetime
  - ativo: boolean
```

**O que o psicólogo vê no painel web:**
- Lista de pacientes vinculados
- Check-ins dos últimos 30/90 dias (gráfico de humor, nível de ruído, gatilhos)
- Diário emocional (se paciente permitiu compartilhamento)
- Histórico de acionamentos do botão de pânico (data/hora)
- Notificação em tempo real quando paciente aciona pânico

---

### 4.4 Modelo freemium

**Plano Free (sem pagamento):**
- Botão de pânico: ilimitado
- Respiração guiada: ilimitada
- Check-ins: até 3 por dia
- Histórico: últimos 7 dias
- SOS com GPS real
- 1 contato de emergência

**Plano Premium (assinatura mensal):**
- Tudo do free, ilimitado
- Check-ins ilimitados
- Histórico completo (90 dias)
- Analytics de humor (gráficos semanais/mensais, score de bem-estar)
- Diário emocional
- Sons ambiente (chuva, floresta, ondas, branco)
- Conexão com psicólogo (acesso ao histórico pelo profissional)
- Notificações de emergência para o psicólogo
- Suporte prioritário

**Revenue share:**
- Quando paciente premium está vinculado a um psicólogo, X% da mensalidade é repassado ao psicólogo mensalmente
- Percentual a ser definido (sugestão: 15–25%)
- Psicólogo recebe via PIX ou transferência bancária

**Linguagem de transparência recomendada:**
A menção ao revenue share não precisa aparecer na interface do app — fica nos termos de uso, que é onde as lojas e a lei exigem. A linguagem nos termos deve ser simples e neutra, sem criar desconfiança:

> *"Psicólogos cadastrados como parceiros CalmFlow fazem parte do nosso programa de parceria profissional e podem receber benefícios pela indicação e acompanhamento de pacientes através da plataforma."*

Essa formulação é equivalente ao que qualquer clínica, plano de saúde ou laboratório usa — é uma relação comercial normal entre profissionais e plataformas de saúde. Não gera desconfiança porque não aparece em nenhuma tela do fluxo do paciente, apenas nos termos, e é suficiente para estar em conformidade com a LGPD e proteger o CalmFlow juridicamente.

**Integração de pagamento:** RevenueCat (abstrai App Store / Play Store billing) + Stripe para cobranças web/painel do psicólogo.

---

### 4.5 Analytics de humor (novo)

**No app do paciente (tela Histórico — expandir o que existe):**
- Gráfico de linha: nível de ruído mental nos últimos 7/30 dias
- Distribuição de clima interno (pizza: ensolarado/nublado/tempestuoso/neblina)
- Gatilhos mais frequentes (barras horizontais)
- Score de bem-estar semanal (média ponderada de clima + auto-eficácia)

**No painel do psicólogo:**
- Mesmos gráficos, mas para cada paciente vinculado
- Comparativo entre semanas
- Alertas automáticos: se paciente não fez check-in por 5 dias ou teve 3 dias seguidos de humor "tempestuoso"

---

### 4.6 Diário emocional (novo — premium)

**Modelo banco (novo):**
```
DiarioEntrada
  - usuario: FK → User
  - texto: TextField
  - humor_tag: choices (ótimo / bom / neutro / ruim / péssimo)
  - compartilhar_psicologo: boolean (default: true)
  - criado_em: datetime
```

**No app:**
- Tela "Diário" acessível do menu principal
- Editor de texto simples com seletor de humor
- Toggle "Compartilhar com meu psicólogo"
- Listagem cronológica das entradas

---

### 4.7 Sons ambiente (novo — premium)

**Sons incluídos (licença royalty-free via Freesound/Pixabay):**
- Chuva suave
- Floresta com pássaros
- Ondas do mar
- Ruído branco
- Frequência 432Hz (tom meditativo)

**Implementação:**
- `expo-av` para reprodução de áudio
- Sons armazenados localmente no bundle do app (sem streaming, evita dependência de internet)
- Player minimalista: play/pause, volume, timer (5/10/20/30 min)
- Pode tocar simultaneamente com a animação de respiração

---

### 4.8 Notificações push (novo)

**Tipos:**
- Lembrete de check-in diário (horário configurável pelo usuário)
- Confirmação de contato de emergência aceita
- Alerta para psicólogo quando paciente aciona pânico

**Implementação:** `expo-notifications` com backend Django enviando via Expo Push API.

---

### 4.9 SOS com GPS real (substituir mock)

**Substituir `DADOS_SOS` hardcoded em `utils.py` por:**
- Google Places API (ou OpenStreetMap/Nominatim gratuito) consultada com lat/lng do usuário
- Buscar: hospitais, clínicas de saúde mental, serviços de urgência num raio de 10km
- Cache de 24h no backend para evitar custo excessivo de API
- Funciona em qualquer país — Portugal, Brasil, UK, França

**No app:**
- Pedir permissão de localização apenas quando usuário acessa tela SOS
- Exibir lista de até 3 serviços mais próximos com distância e telefone
- Botão "Ligar" abre discador nativo

---

### 4.10 Painel web do psicólogo (novo — React)

**Tecnologia:** React + Vite (separado do app mobile, mesmo domínio em `/psicologo`)

**Telas:**
1. Login / cadastro com CRP
2. Dashboard: lista de pacientes, alertas recentes
3. Perfil do paciente: check-ins, diário, histórico de pânico
4. Configurações: dados bancários para recebimento, código pessoal

**Autenticação:** Mesmo JWT do backend, role `psicologo` valida acesso aos endpoints protegidos.

---

## 5. Gaps técnicos críticos (resolver primeiro)

### 5.1 IP hardcoded no ApiService.js
```javascript
// PROBLEMA ATUAL — linha 35 do ApiService.js:
return 'http://192.168.1.19:8000/api'; // IP da rede local!

// SOLUÇÃO: usar variável de ambiente via app.json extra
// app.json:
"extra": { "API_BASE_URL": "https://api.calmflow.app/api/v1" }

// ApiService.js já lê Constants.expoConfig?.extra?.API_BASE_URL — só falta configurar
```

### 5.2 Números de emergência hardcoded — remover
`utils.py` contém `'numero': '911'` e `'numero': '188'` (CVV Brasil) hardcoded em `DADOS_SOS`. O app será multilíngue (PT, EN, ES, FR) e o mercado principal é Portugal — não existe número universal válido.

**Solução:** remover completamente os números hardcoded de `DADOS_SOS`. O endpoint `/sos/` deve retornar apenas a técnica rápida de respiração e o disclaimer já existente, que usa a formulação correta:

> *"entre em contato imediatamente com os serviços de emergência, hospitais ou autoridades de saúde da sua região"*

Essa frase já está implementada nos disclaimers multiidioma e é a abordagem certa — universal, sem risco de exibir número errado para o país do utilizador. Os dados de hospitais mock também devem ser removidos do `DADOS_SOS` (são de São Paulo e não fazem sentido fora do Brasil). O GPS real (módulo 4.9) substitui essa funcionalidade de forma adequada.

### 5.3 SQLite em produção
`settings.py` usa SQLite. Trocar para PostgreSQL antes do deploy. Railway provisiona PostgreSQL gratuitamente.

### 5.4 SECRET_KEY exposta
Verificar que `.env` não está commitado. O `.gitignore` existe mas confirmar que `SECRET_KEY` e `DATABASE_URL` estão em variáveis de ambiente, não hardcoded.

---

## 6. Deploy — recomendação

**Backend:** Railway (plano gratuito suficiente para MVP)
- PostgreSQL incluso
- Deploy automático via GitHub push
- Variáveis de ambiente via painel

**App mobile:** EAS Build (já configurado) → TestFlight (iOS) e Internal Testing (Android) antes do lançamento público

**Painel web psicólogo:** Vercel (gratuito para React/Vite)

---

## 7. Roadmap de 6 meses

### Mês 1–2: Fundação
- Deploy backend no Railway com PostgreSQL
- Corrigir IP hardcoded, remover números de emergência hardcoded do DADOS_SOS, verificar SECRET_KEY
- Implementar notificações push (Expo Notifications)
- Implementar analytics de humor (os dados já existem, é visualização)
- Testes internos com Expo Go

### Mês 3–4: Diferencial
- Fluxo de contato de emergência com SMS (Zenvia)
- Diário emocional (premium)
- Sons ambiente (premium)
- Conexão psicólogo-paciente via código
- Painel web do psicólogo (MVP: login + lista de pacientes + histórico)

### Mês 5–6: Lançamento
- SOS com GPS real (Google Places ou Nominatim)
- Integração RevenueCat (freemium + assinatura)
- Revenue share: definir percentual, implementar controle no backend
- Política de privacidade e termos de uso (contratar advogado para revisão — obrigatório para App Store/Play Store com app de saúde)
- EAS Build → TestFlight → App Store / Play Store submission
- App Store: categoria "Health & Fitness", subcategoria "Mental Health"

---

## 8. Decisões em aberto

| # | Decisão | Responsável | Prazo sugerido |
|---|---------|-------------|----------------|
| 1 | Percentual do revenue share com psicólogo | Matheus + esposa | Antes do mês 4 |
| 2 | Transparência ao paciente sobre revenue share | Matheus + esposa + advogado | Antes do mês 5 |
| 3 | Preço da mensalidade premium | Matheus | Antes do mês 5 |
| 4 | Nome de domínio definitivo | Matheus | Mês 1 |
| 5 | Google Places vs Nominatim para SOS | Dev | Mês 5 |

---

## 9. Riscos

**Ética/Legal:** O revenue share entre plataforma e psicólogos parceiros é uma prática comercial normal no setor de saúde. Deve constar nos termos de uso com linguagem neutra ("programa de parceria profissional") — sem aparecer na interface do app. Isso é suficiente para conformidade com a LGPD e protege o CalmFlow juridicamente. Recomendado revisar com advogado especializado em saúde digital antes do lançamento.

**App Store review:** Apps de saúde mental passam por revisão mais rigorosa. Exigência de política de privacidade robusta, disclaimer médico e, em alguns casos, evidência de supervisão clínica. Contar com 2–3 semanas de revisão.

**SMS em produção:** Zenvia tem custo por mensagem. Estimar volume e incluir no modelo financeiro.

**Dependência de psicólogo para crescimento:** O canal B2B2C (psicólogo indica para paciente) é o mais eficiente, mas lento no início. Planejar canal B2C paralelo (redes sociais, comunidades de saúde mental).
