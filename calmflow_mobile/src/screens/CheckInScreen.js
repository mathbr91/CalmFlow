/**
 * ✅ CHECK-IN SCREEN
 * Formulário de 8 perguntas para avaliar bem-estar
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography } from '../themes';
import { LoadingOverlay, Disclaimer } from '../components';
import { apiService } from '../services/ApiService';

const QUESTIONS = [
  {
    id: 'clima_interno',
    type: 'choice',
    emoji: '🌤️',
    question: 'Como está seu estado emocional interno?',
    options: [
      { value: 'ensolarado', label: 'Ensolarado ☀️', description: 'Calmo e positivo' },
      { value: 'nublado', label: 'Nublado ☁️', description: 'Neutro ou um pouco ansioso' },
      { value: 'tempestuoso', label: 'Tempestuoso ⛈️', description: 'Muito ansioso ou agitado' },
      { value: 'neblina', label: 'Neblina 🌫️', description: 'Confuso ou desorientado' },
    ],
  },
  {
    id: 'nivel_ruido',
    type: 'scale',
    emoji: '🧠',
    question: 'Qual é o nível de "ruído mental"?',
    description: 'De 1 (silencioso) a 10 (caótico)',
    min: 1,
    max: 10,
  },
  {
    id: 'gatilho',
    type: 'choice',
    emoji: '⚡',
    question: 'Qual foi o gatilho principal do seu estado?',
    options: [
      { value: 'trabalho', label: 'Trabalho' },
      { value: 'familia', label: 'Família' },
      { value: 'telas', label: 'Telas/Redes Sociais' },
      { value: 'sono', label: 'Falta de Sono' },
      { value: 'saude', label: 'Saúde Física' },
      { value: 'relacionamento', label: 'Relacionamento' },
      { value: 'financeiro', label: 'Financeiro' },
      { value: 'desconhecido', label: 'Desconhecido' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'auto_eficacia',
    type: 'scale',
    emoji: '💪',
    question: 'Nível de confiança em lidar com as emoções',
    description: 'De 0 (nenhuma confiança) a 10 (muita confiança)',
    min: 0,
    max: 10,
  },
  {
    id: 'sintomas',
    type: 'text',
    emoji: '🤒',
    question: 'Descreva os sintomas físicos ou emocionais',
    placeholder: 'Ex: dor de cabeça, taquicardia, medo...',
  },
  {
    id: 'notas',
    type: 'text',
    emoji: '📝',
    question: 'Notas adicionais ou observações',
    placeholder: 'Qualquer outra coisa que queira compartilhar...',
  },
];

export const CheckInScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [smartMessage, setSmartMessage] = useState(null);
  const [showSmartModal, setShowSmartModal] = useState(false);

  const generateSmartMessage = (responses) => {
    const messages = [];

    // Verificar nível de ruído mental alto
    if (responses.nivel_ruido > 8) {
      messages.push({
        type: 'high_noise',
        title: '🧠 Mente Acelerada Detectada',
        message: 'Percebemos que sua mente está acelerada. Que tal fazer a técnica de emergência agora?',
        action: 'Fazer Respiração',
        actionType: 'breathing',
      });
    }

    // Verificar palavras-chave nas notas
    if (responses.notas) {
      const notes = responses.notas.toLowerCase();
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
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTextInput('');
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevQuestion = QUESTIONS[currentQuestion - 1];
      setTextInput(responses[prevQuestion.id] || '');
    }
  };

  const handleChoice = async (value) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const questionId = QUESTIONS[currentQuestion].id;
    setResponses({
      ...responses,
      [questionId]: value,
    });
    
    handleNext();
  };

  const handleScale = async (value) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const questionId = QUESTIONS[currentQuestion].id;
    setResponses({
      ...responses,
      [questionId]: value,
    });
    
    handleNext();
  };

  const handleTextSubmit = async () => {
    const questionId = QUESTIONS[currentQuestion].id;
    setResponses({
      ...responses,
      [questionId]: textInput.trim(),
    });
    
    handleNext();
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await apiService.createCheckIn(responses);
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      // Gerar mensagem inteligente
      const message = generateSmartMessage(responses);
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
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
      alert('Erro ao salvar respostas. Tente novamente.');
      setLoading(false);
    }
  };

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

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

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
              style={[styles.nextButton, !textInput.trim() && styles.nextButtonDisabled]}
              onPress={handleTextSubmit}
              disabled={!textInput.trim()}
            >
              <Text style={[styles.nextButtonText, !textInput.trim() && styles.nextButtonTextDisabled]}>
                {currentQuestion === QUESTIONS.length - 1 ? 'Finalizar' : 'Próximo'}
              </Text>
            </TouchableOpacity>
          </View>
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
            {currentQuestion + 1} de {QUESTIONS.length}
          </Text>
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
                {currentQuestion === QUESTIONS.length - 1 ? 'Finalizar' : 'Pular'}
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
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Pular esta pergunta</Text>
          </TouchableOpacity>
        )}

        {/* Disclaimer */}
        <Disclaimer style={styles.disclaimer} />
      </ScrollView>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    margin: spacing.lg,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalMessage: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
});
