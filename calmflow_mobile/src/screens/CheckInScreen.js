/**
 * ✅ CHECK-IN SCREEN
 * Formulário de 8 perguntas para avaliar bem-estar
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography } from '../themes';
import { LoadingOverlay, Disclaimer } from '../components';
import { apiService } from '../services/ApiService';

const QUESTIONS_PER_DAY = 8;
const DAYS_WITHOUT_REPEAT = 31;
const EXPECTED_POOL_SIZE = QUESTIONS_PER_DAY * DAYS_WITHOUT_REPEAT;

const DAY_CONTEXTS = [
  'ao acordar hoje',
  'no inicio da manha',
  'durante a manha',
  'no fim da manha',
  'logo apos o almoco',
  'no meio da tarde',
  'no fim da tarde',
  'no inicio da noite',
  'antes de dormir',
  'apos uma tarefa importante',
  'apos uma conversa marcante',
  'apos tempo em redes sociais',
  'apos uma pausa curta',
  'apos uma refeicao',
  'apos um deslocamento',
  'apos atividade fisica',
  'apos um momento de silencio',
  'apos ouvir musica',
  'apos lidar com um imprevisto',
  'apos finalizar uma meta',
  'quando se compara com outras pessoas',
  'quando pensa no futuro',
  'quando lembra de algo do passado',
  'quando esta com muita demanda',
  'quando percebe seu corpo cansado',
  'quando nota os pensamentos acelerados',
  'quando sente necessidade de apoio',
  'quando esta em ambiente barulhento',
  'quando tem um momento de calma',
  'quando algo da errado',
  'quando algo da certo',
];

const CATEGORY_DEFINITIONS = [
  {
    key: 'sono',
    label: 'Sono',
    emoji: '😴',
    templates: [
      'Como esteve seu sono {context}',
      'Seu descanso foi reparador {context}',
      'Ao observar a qualidade do sono {context}, qual foi sua percepcao',
      'Seu corpo pareceu recuperado pelo sono {context}',
    ],
    scaleDescription: 'De 0 (nao descansei) a 10 (descansei muito bem)',
    textPlaceholder: 'Comente algo sobre sono, despertares ou descanso.',
    choiceOptions: [
      { value: 'restaurador', label: 'Restaurador', description: 'Acordei recuperado' },
      { value: 'regular', label: 'Regular', description: 'Recuperacao parcial' },
      { value: 'fragmentado', label: 'Fragmentado', description: 'Muitos despertares' },
      { value: 'insuficiente', label: 'Insuficiente', description: 'Dormir nao foi suficiente' },
    ],
  },
  {
    key: 'humor',
    label: 'Humor',
    emoji: '🙂',
    templates: [
      'Como voce descreveria seu humor {context}',
      'Seu estado emocional predominante {context} foi qual',
      'Seu humor esteve mais estavel ou mais oscilante {context}',
      'Ao olhar para seu dia, para onde seu humor pendia {context}',
    ],
    scaleDescription: 'De 0 (muito baixo) a 10 (muito positivo)',
    textPlaceholder: 'Descreva em uma frase curta o seu humor hoje.',
    choiceOptions: [
      { value: 'positivo', label: 'Positivo', description: 'Predominio de bem-estar' },
      { value: 'neutro', label: 'Neutro', description: 'Sem grande variacao' },
      { value: 'instavel', label: 'Instavel', description: 'Oscilacoes importantes' },
      { value: 'baixo', label: 'Baixo', description: 'Humor reduzido' },
    ],
  },
  {
    key: 'fisico',
    label: 'Fisico',
    emoji: '🫀',
    templates: [
      'Como seu corpo respondeu {context}',
      'Que sinais fisicos voce percebeu {context}',
      'Ao observar tensao, respiracao e energia {context}, como estava',
      'Seu corpo pediu mais cuidado {context}',
    ],
    scaleDescription: 'De 0 (muito confortavel) a 10 (muito desconfortavel)',
    textPlaceholder: 'Descreva sinais fisicos percebidos hoje.',
    choiceOptions: [
      { value: 'relaxado', label: 'Relaxado', description: 'Corpo em conforto' },
      { value: 'tenso', label: 'Tenso', description: 'Rigidez ou aperto' },
      { value: 'agitado', label: 'Agitado', description: 'Inquietacao corporal' },
      { value: 'dolorido', label: 'Dolorido', description: 'Dor ou desconforto' },
    ],
  },
  {
    key: 'social',
    label: 'Social',
    emoji: '🤝',
    templates: [
      'Como voce percebeu suas relacoes sociais {context}',
      'Seu sentimento de conexao com outras pessoas {context} foi qual',
      'A qualidade das suas interacoes sociais {context} foi como',
      'Ao olhar para apoio e pertencimento {context}, como voce se sentiu',
    ],
    scaleDescription: 'De 0 (muito isolado) a 10 (muito conectado)',
    textPlaceholder: 'Comente uma interacao social marcante do dia.',
    choiceOptions: [
      { value: 'conectado', label: 'Conectado', description: 'Interacoes nutritivas' },
      { value: 'neutro', label: 'Neutro', description: 'Interacoes funcionais' },
      { value: 'distante', label: 'Distante', description: 'Pouca proximidade emocional' },
      { value: 'isolado', label: 'Isolado', description: 'Sem suporte percebido' },
    ],
  },
  {
    key: 'gratidao',
    label: 'Gratidao',
    emoji: '🙏',
    templates: [
      'Foi facil reconhecer algo bom {context}',
      'Quao conectado voce se sentiu com gratidao {context}',
      'Ao olhar para o dia {context}, quanto valor voce percebeu',
      'A pratica de gratidao teve impacto {context}',
    ],
    scaleDescription: 'De 0 (nao consegui perceber) a 10 (percebi muito)',
    textPlaceholder: 'Cite algo concreto pelo qual voce sente gratidao hoje.',
    choiceOptions: [
      { value: 'clara', label: 'Clara', description: 'Percebi varios pontos positivos' },
      { value: 'pontual', label: 'Pontual', description: 'Percebi algo especifico' },
      { value: 'dificil', label: 'Dificil', description: 'Foi complicado reconhecer' },
      { value: 'ausente', label: 'Ausente', description: 'Nao consegui acessar gratidao' },
    ],
  },
  {
    key: 'trabalho',
    label: 'Trabalho',
    emoji: '💼',
    templates: [
      'Como o trabalho ou estudos impactaram voce {context}',
      'Seu nivel de pressao nas tarefas {context} foi qual',
      'Ao pensar nas demandas de trabalho {context}, como voce ficou',
      'Seu ritmo de produtividade e cobranca interna {context} foi como',
    ],
    scaleDescription: 'De 0 (sem pressao) a 10 (pressao muito alta)',
    textPlaceholder: 'Escreva o principal fator de pressao ou satisfacao nas tarefas.',
    choiceOptions: [
      { value: 'leve', label: 'Leve', description: 'Demanda sob controle' },
      { value: 'moderado', label: 'Moderado', description: 'Exigente, mas gerenciavel' },
      { value: 'alto', label: 'Alto', description: 'Impactando energia e humor' },
      { value: 'sobrecarregado', label: 'Sobrecarregado', description: 'Peso muito grande no dia' },
    ],
  },
  {
    key: 'foco',
    label: 'Foco',
    emoji: '🎯',
    templates: [
      'Como esteve seu foco cognitivo {context}',
      'Sua concentracao em tarefas {context} foi como',
      'Quao facil foi sustentar atencao {context}',
      'No aspecto mental, seu foco {context} se manteve',
    ],
    scaleDescription: 'De 0 (muito disperso) a 10 (muito focado)',
    textPlaceholder: 'Conte o que mais ajudou ou atrapalhou sua concentracao.',
    choiceOptions: [
      { value: 'alto', label: 'Alto', description: 'Concentracao consistente' },
      { value: 'medio', label: 'Medio', description: 'Com algumas oscilacoes' },
      { value: 'baixo', label: 'Baixo', description: 'Dificuldade frequente' },
      { value: 'quebrado', label: 'Quebrado', description: 'Muitas interrupcoes internas' },
    ],
  },
  {
    key: 'nutricao',
    label: 'Nutricao',
    emoji: '🍽️',
    templates: [
      'Como voce cuidou da sua nutricao e nutricao emocional {context}',
      'Suas escolhas de autocuidado e alimentacao {context} foram suficientes',
      'Seu repertorio de cuidado interno e energia nutricional {context} esteve presente',
      'Ao avaliar pausas, limites e alimentacao {context}, como foi',
    ],
    scaleDescription: 'De 0 (nao cuidei de mim) a 10 (cuidei muito bem)',
    textPlaceholder: 'Descreva um gesto de autocuidado emocional praticado hoje.',
    choiceOptions: [
      { value: 'consistente', label: 'Consistente', description: 'Cuidados bem aplicados' },
      { value: 'parcial', label: 'Parcial', description: 'Cuidei de alguns pontos' },
      { value: 'minimo', label: 'Minimo', description: 'Pouco cuidado emocional' },
      { value: 'ausente', label: 'Ausente', description: 'Sem autocuidado no periodo' },
    ],
  },
];

const buildQuestionByType = (definition, prompt, dayIndex) => {
  const typeSelector = dayIndex % 3;
  const baseId = `${definition.key}_${String(dayIndex + 1).padStart(2, '0')}`;

  if (typeSelector === 0) {
    return {
      id: `${baseId}_scale`,
      groupKey: definition.key,
      groupLabel: definition.label,
      type: 'scale',
      emoji: definition.emoji,
      question: prompt,
      description: definition.scaleDescription,
      min: 0,
      max: 10,
    };
  }

  if (typeSelector === 1) {
    return {
      id: `${baseId}_choice`,
      groupKey: definition.key,
      groupLabel: definition.label,
      type: 'choice',
      emoji: definition.emoji,
      question: prompt,
      options: definition.choiceOptions,
    };
  }

  return {
    id: `${baseId}_text`,
    groupKey: definition.key,
    groupLabel: definition.label,
    type: 'text',
    emoji: definition.emoji,
    question: prompt,
    placeholder: definition.textPlaceholder,
  };
};

const QUESTION_GROUPS = CATEGORY_DEFINITIONS.reduce((accumulator, definition) => {
  accumulator[definition.key] = DAY_CONTEXTS.map((context, dayIndex) => {
    const template = definition.templates[dayIndex % definition.templates.length];
    const prompt = template.replace('{context}', context);
    return buildQuestionByType(definition, prompt, dayIndex);
  });
  return accumulator;
}, {});

const OPTIONAL_POOL = Object.values(QUESTION_GROUPS).flat();

if (OPTIONAL_POOL.length !== EXPECTED_POOL_SIZE) {
  throw new Error(`OPTIONAL_POOL precisa ter exatamente ${EXPECTED_POOL_SIZE} perguntas.`);
}

const createSeededRandom = (seed) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const shuffleWithSeed = (array, seed) => {
  const rng = createSeededRandom(seed);
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getMonthSeed = (date = new Date()) => {
  return Number(`${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`);
};

const getDailyQuestionSet = (date = new Date()) => {
  const daySlot = Math.min(Math.max(date.getDate(), 1), DAYS_WITHOUT_REPEAT) - 1;
  const monthSeed = getMonthSeed(date);

  const questions = CATEGORY_DEFINITIONS.map((definition, index) => {
    const shuffledGroup = shuffleWithSeed(QUESTION_GROUPS[definition.key], monthSeed + index + 1);
    return shuffledGroup[daySlot];
  });

  return shuffleWithSeed(questions, monthSeed + daySlot + 99);
};

export const CheckInScreen = ({ navigation }) => {
  // Seleciona 8 perguntas por dia, sem repeticao total ao longo de 31 dias.
  const [activeQuestions] = useState(() => {
    return getDailyQuestionSet();
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [dailyStatusLoading, setDailyStatusLoading] = useState(true);
  const [alreadyCheckedInToday, setAlreadyCheckedInToday] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [smartMessage, setSmartMessage] = useState(null);
  const [showSmartModal, setShowSmartModal] = useState(false);

  useEffect(() => {
    const checkDailyStatus = async () => {
      try {
        const response = await apiService.getCheckIns();
        const payload = response?.data ?? response;
        const checkIns = Array.isArray(payload) ? payload : (payload?.results || []);
        const today = new Date().toDateString();
        const hasTodayEntry = checkIns.some((item) => new Date(item.criado_em).toDateString() === today);
        setAlreadyCheckedInToday(hasTodayEntry);
      } catch (error) {
        console.error('[CheckInScreen] Erro ao verificar check-in do dia:', error);
      } finally {
        setDailyStatusLoading(false);
      }
    };

    checkDailyStatus();
  }, []);

  const getResponseByGroup = (groupKey) => {
    const question = activeQuestions.find((item) => item.groupKey === groupKey);
    return question ? responses[question.id] : undefined;
  };

  const mapHumorToClima = (humorResponse) => {
    if (typeof humorResponse === 'number') {
      if (humorResponse >= 8) return 'ensolarado';
      if (humorResponse >= 5) return 'nublado';
      if (humorResponse >= 3) return 'neblina';
      return 'tempestuoso';
    }

    const choiceMap = {
      positivo: 'ensolarado',
      neutro: 'nublado',
      instavel: 'neblina',
      baixo: 'tempestuoso',
    };

    return choiceMap[humorResponse] || 'nublado';
  };

  const buildCheckInPayload = () => {
    const humorResponse = getResponseByGroup('humor');
    const trabalhoResponse = getResponseByGroup('trabalho');
    const focoResponse = getResponseByGroup('foco');
    const fisicoResponse = getResponseByGroup('fisico');
    const sonoResponse = getResponseByGroup('sono');
    const nutricaoResponse = getResponseByGroup('nutricao');
    const socialResponse = getResponseByGroup('social');

    const numericNoiseCandidate = [trabalhoResponse, focoResponse, sonoResponse].find(
      (value) => typeof value === 'number'
    );
    const numericSelfCareCandidate = [nutricaoResponse, focoResponse, humorResponse].find(
      (value) => typeof value === 'number'
    );

    const notasExtra = activeQuestions
      .map((question) => {
        const value = responses[question.id];
        if (value === undefined || value === null || value === '') {
          return null;
        }
        return `${question.groupLabel} - ${question.question}: ${value}`;
      })
      .filter(Boolean);

    let gatilho = 'desconhecido';
    if (trabalhoResponse) gatilho = 'trabalho';
    else if (sonoResponse) gatilho = 'sono';
    else if (socialResponse) gatilho = 'relacionamento';
    else if (fisicoResponse || nutricaoResponse) gatilho = 'saude';

    return {
      clima_interno: mapHumorToClima(humorResponse),
      nivel_ruido: numericNoiseCandidate !== undefined ? Math.min(Math.max(numericNoiseCandidate, 1), 10) : 5,
      gatilho,
      auto_eficacia: numericSelfCareCandidate !== undefined ? Math.min(Math.max(numericSelfCareCandidate, 0), 10) : 5,
      sintomas: typeof fisicoResponse === 'string' ? fisicoResponse : String(fisicoResponse || ''),
      notas: notasExtra.join('\n\n'),
    };
  };

  const generateSmartMessage = (payload) => {
    const messages = [];

    // Verificar nível de ruído mental alto
    if (payload.nivel_ruido > 8) {
      messages.push({
        type: 'high_noise',
        title: '🧠 Mente Acelerada Detectada',
        message: 'Percebemos que sua mente está acelerada. Que tal fazer a técnica de emergência agora?',
        action: 'Fazer Respiração',
        actionType: 'breathing',
      });
    }

    // Verificar palavras-chave nas notas
    if (payload.notas) {
      const notes = payload.notas.toLowerCase();
      const keywords = {
        sono: ['sono', 'cansad', 'dormir', 'insônia'],
        trabalho: ['trabalho', 'estresse', 'pressão', 'tarefa'],
        cansaço: ['cansad', 'fadiga', 'exaust', 'energia baixa'],
      };

      for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => notes.includes(word))) {
          if (category === 'sono') {
            messages.push({
              type: 'sleep_tip',
              title: '😴 Dica de Higiene do Sono',
              message: 'Para melhorar seu sono: mantenha horários regulares, evite telas 1h antes de dormir, e crie um ritual relaxante.',
              action: 'Entendi',
              actionType: 'dismiss',
            });
          } else if (category === 'trabalho') {
            messages.push({
              type: 'work_tip',
              title: '💼 Dica de Organização',
              message: 'Para lidar com estresse no trabalho: faça pausas de 5min a cada hora, priorize tarefas importantes e pratique respiração profunda.',
              action: 'Entendi',
              actionType: 'dismiss',
            });
          } else if (category === 'cansaço') {
            messages.push({
              type: 'energy_tip',
              title: '⚡ Dica de Energia',
              message: 'Para combater o cansaço: faça exercícios leves, mantenha-se hidratado, e considere uma pequena soneca de 20 minutos.',
              action: 'Entendi',
              actionType: 'dismiss',
            });
          }
          break; // Só uma mensagem por categoria
        }
      }
    }

    return messages.length > 0 ? messages[0] : null;
  };

  const handleSmartAction = () => {
    if (smartMessage?.actionType === 'breathing') {
      // Fechar modal e voltar para home onde o modal de respiração será aberto
      setShowSmartModal(false);
      navigation.replace('Home', { showCheckInSuccess: true, showBreathingModal: true });
    } else {
      // Apenas fechar modal e mostrar sucesso
      setShowSmartModal(false);
      setCompleted(true);
      setTimeout(() => {
        navigation.replace('Home', { showCheckInSuccess: true });
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentQuestion < activeQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTextInput('');
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevQuestion = activeQuestions[currentQuestion - 1];
      setTextInput(responses[prevQuestion.id] || '');
    }
  };

  const handleChoice = async (value) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const questionId = activeQuestions[currentQuestion].id;
    setResponses({
      ...responses,
      [questionId]: value,
    });
    
    handleNext();
  };

  const handleScale = async (value) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const questionId = activeQuestions[currentQuestion].id;
    setResponses({
      ...responses,
      [questionId]: value,
    });
    
    handleNext();
  };

  const handleTextSubmit = async () => {
    const questionId = activeQuestions[currentQuestion].id;
    setResponses({
      ...responses,
      [questionId]: textInput.trim(),
    });
    
    handleNext();
  };

  const handleSubmit = async () => {
    if (alreadyCheckedInToday) {
      return;
    }

    setLoading(true);

    try {
      const payload = buildCheckInPayload();

      await apiService.createCheckIn(payload);
      setAlreadyCheckedInToday(true);
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      // Gerar mensagem inteligente
      const message = generateSmartMessage(payload);
      if (message) {
        setSmartMessage(message);
        setShowSmartModal(true);
      } else {
        setCompleted(true);
        // Volta pra home após 2 segundos
        setTimeout(() => {
          navigation.replace('Home', { showCheckInSuccess: true });
        }, 2000);
      }
    } catch (error) {
      console.error('[CheckInScreen] Erro ao enviar check-in:', error);
      if (error?.backendMessage?.includes('Você já cuidou de si hoje')) {
        setAlreadyCheckedInToday(true);
      }
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
      alert(error?.userMessage || 'Erro ao salvar respostas. Tente novamente.');
      setLoading(false);
    }
  };

  if (dailyStatusLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingOverlay visible={true} message="Verificando sua jornada de hoje..." />
      </SafeAreaView>
    );
  }

  if (alreadyCheckedInToday && !completed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedEmoji}>🌿</Text>
          <Text style={styles.lockedTitle}>Você já cuidou de si hoje!</Text>
          <Text style={styles.lockedText}>Volte amanhã para sua jornada.</Text>
          <TouchableOpacity style={styles.nextButton} onPress={() => navigation.goBack()}>
            <Text style={styles.nextButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (completed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Obrigado!</Text>
          <Text style={styles.successText}>
            Suas respostas foram salvas e ajudarão a personalizar seu suporte.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const journeyDay = Math.min(Math.max(new Date().getDate(), 1), DAYS_WITHOUT_REPEAT);
  const question = activeQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / activeQuestions.length) * 100;

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'choice':
        return (
          <View style={styles.optionsContainer}>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionButton}
                onPress={() => handleChoice(option.value)}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      case 'scale':
        return (
          <View style={styles.scaleContainer}>
            <Text style={styles.scaleDescription}>{question.description}</Text>
            <View style={styles.scaleButtons}>
              {Array.from({ length: question.max - question.min + 1 }, (_, i) => question.min + i).map((value) => (
                <TouchableOpacity
                  key={value}
                  style={styles.scaleButton}
                  onPress={() => handleScale(value)}
                >
                  <Text style={styles.scaleText}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      
      case 'text':
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.textContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={question.placeholder}
                value={textInput}
                onChangeText={setTextInput}
                multiline
                numberOfLines={4}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleTextSubmit}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestion === activeQuestions.length - 1 ? 'Finalizar' : 'Próximo'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Check-in de Bem-estar</Text>
          <Text style={styles.progress}>
            {currentQuestion + 1} de {activeQuestions.length}
          </Text>
          <View style={styles.journeyBadge}>
            <Text style={styles.journeyBadgeText}>Dia {journeyDay} de 31 da sua jornada</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${progress}%` }]}
          />
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.emoji}>{question.emoji}</Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Question Content */}
        {renderQuestionContent()}

        {/* Navigation */}
        {question.type !== 'text' && (
          <View style={styles.navigationContainer}>
            {currentQuestion > 0 && (
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePrevious}
              >
                <Text style={styles.navButtonText}>Anterior</Text>
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNext}
            >
              <Text style={styles.navButtonText}>
                {currentQuestion === activeQuestions.length - 1 ? 'Finalizar' : 'Pular'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Smart Message Modal */}
      <Modal
        visible={showSmartModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSmartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{smartMessage?.title}</Text>
            <Text style={styles.modalMessage}>{smartMessage?.message}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSmartAction}
            >
              <Text style={styles.modalButtonText}>{smartMessage?.action}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      <LoadingOverlay visible={loading} message="Salvando respostas..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  progress: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  journeyBadge: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}20`,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: `${colors.primary}35`,
  },
  journeyBadgeText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.overlayLight,
    borderRadius: 3,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 3,
  },
  questionContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  questionText: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  questionDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionsContainer: {
    marginVertical: spacing.xl,
  },
  optionButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 2,
    borderColor: colors.overlayLight,
  },
  optionLabel: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  optionDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  scaleContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  scaleDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  scaleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scaleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing.xs,
    borderWidth: 2,
    borderColor: colors.overlayLight,
  },
  scaleText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  textContainer: {
    marginVertical: spacing.xl,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: colors.overlayLight,
  },
  nextButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  nextButtonDisabled: {
    backgroundColor: colors.overlayLight,
  },
  nextButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: colors.textSecondary,
  },
  navigationContainer: {
    flexDirection: 'row',
    marginTop: spacing.xl,
  },
  navButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.overlayLight,
  },
  navButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  lockedEmoji: {
    fontSize: 72,
    marginBottom: spacing.lg,
  },
  lockedTitle: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  lockedText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h1,
    color: colors.success,
    marginBottom: spacing.md,
  },
  successText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
