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
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography } from '../themes';
import { LoadingOverlay, Disclaimer } from '../components';
import { apiService } from '../services/ApiService';

const QUESTIONS = [
  {
    id: 'animo',
    emoji: '😊',
    question: 'Como está seu ânimo?',
    description: 'De 1 (péssimo) a 5 (ótimo)',
  },
  {
    id: 'sono',
    emoji: '😴',
    question: 'Qual é sua qualidade de sono?',
    description: 'De 1 (horrível) a 5 (excelente)',
  },
  {
    id: 'energia',
    emoji: '⚡',
    question: 'Como está sua energia?',
    description: 'De 1 (muito cansado) a 5 (muito energizado)',
  },
  {
    id: 'ansiedade',
    emoji: '😰',
    question: 'Qual é seu nível de ansiedade?',
    description: 'De 1 (muita ansiedade) a 5 (sem ansiedade)',
  },
  {
    id: 'concentracao',
    emoji: '🧠',
    question: 'Como está sua concentração?',
    description: 'De 1 (muito disperso) a 5 (muito focado)',
  },
  {
    id: 'estresse',
    emoji: '😤',
    question: 'Qual é seu nível de estresse?',
    description: 'De 1 (muito estressado) a 5 (relaxado)',
  },
  {
    id: 'relacionamentos',
    emoji: '💑',
    question: 'Como estão seus relacionamentos?',
    description: 'De 1 (muito mal) a 5 (excelente)',
  },
  {
    id: 'corpo',
    emoji: '💪',
    question: 'Como se sente fisicamente?',
    description: 'De 1 (muito mal) a 5 (muito bem)',
  },
];

export const CheckInScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSkip = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleScore = async (score) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const questionId = QUESTIONS[currentQuestion].id;
    setScores({
      ...scores,
      [questionId]: score,
    });

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Último questionário, envia dados
      handleSubmit({ ...scores, [questionId]: score });
    }
  };

  const handleSubmit = async (finalScores) => {
    setLoading(true);

    try {
      await apiService.createCheckIn(finalScores);
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
      setCompleted(true);

      // Volta pra home após 2 segundos
      setTimeout(() => {
        navigation.replace('Home', { showCheckInSuccess: true });
      }, 2000);
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
  const selectedScore = scores[question.id];

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
          <Text style={styles.questionDescription}>
            {question.description}
          </Text>
        </View>

        {/* Score Buttons (1-5) */}
        <View style={styles.scoresContainer}>
          {[1, 2, 3, 4, 5].map((score) => (
            <TouchableOpacity
              key={score}
              style={[
                styles.scoreButton,
                selectedScore === score && styles.scoreButtonSelected,
              ]}
              onPress={() => handleScore(score)}
            >
              <Text
                style={[
                  styles.scoreText,
                  selectedScore === score && styles.scoreTextSelected,
                ]}
              >
                {score}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skip Button */}
        {currentQuestion < QUESTIONS.length - 1 && (
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
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.xl,
  },
  scoreButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.overlayLight,
  },
  scoreButtonSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  scoreText: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  scoreTextSelected: {
    color: colors.surface,
  },
  skipButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  skipButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  disclaimer: {
    marginTop: spacing.xl,
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
});
