/**
 * 🏠 HOME SCREEN
 * Botão de pânico centralizado + Check-in secundário
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography } from '../themes';
import {
  PanicButton,
  BreathingGuide,
  LoadingOverlay,
  Disclaimer,
} from '../components';
import { apiService } from '../services/ApiService';

export const HomeScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [technique, setTechnique] = useState(null);
  const [showTechnique, setShowTechnique] = useState(false);

  useEffect(() => {
    // Se voltou da tela de check-in com mensagem
    if (route.params?.showCheckInSuccess) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [route.params]);

  const handlePanicPress = async () => {
    setLoading(true);
    setShowTechnique(false);

    try {
      // Vibração tátil de ativação
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // Faz POST para emergências
      const response = await apiService.createEmergencia('outro', true);

      // Vibração suave de sucesso
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Extrai técnica da resposta
      setTechnique(response.tecnica_sugerida);
      setShowTechnique(true);
    } catch (error) {
      console.error('[HomeScreen] Erro ao criar emergência:', error);
      // Vibração de erro
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
      alert('Desculpe, houve um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInPress = () => {
    navigation.navigate('CheckIn');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  if (showTechnique && technique) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.successTitle}>✨ Você não está sozinho!</Text>
          <Text style={styles.successSubtitle}>
            Siga a técnica abaixo com calma e ritmo.
          </Text>

          <BreathingGuide technique={technique} />

          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => setShowTechnique(false)}
          >
            <Text style={styles.returnButtonText}>↻ Voltar ao início</Text>
          </TouchableOpacity>

          <Disclaimer style={styles.disclaimer} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bem-vindo ao CalmFlow</Text>
          <Text style={styles.subGreeting}>
            Como você está se sentindo agora?
          </Text>
        </View>

        {/* Panic Button */}
        <PanicButton onPress={handlePanicPress} loading={loading} />

        {/* Check-in Secondary Button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleCheckInPress}
        >
          <Text style={styles.secondaryButtonEmoji}>📝</Text>
          <Text style={styles.secondaryButtonText}>Como estou agora?</Text>
          <Text style={styles.secondaryButtonSubtext}>
            Responda 8 perguntas rápidas
          </Text>
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfile}
        >
          <Text style={styles.profileButtonText}>👤 Meu Perfil</Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <Disclaimer style={styles.disclaimer} />
      </ScrollView>

      {/* Loading Overlay */}
      <LoadingOverlay
        visible={loading}
        message="Ativando suporte..."
      />
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
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subGreeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  secondaryButtonEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  secondaryButtonSubtext: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  profileButton: {
    backgroundColor: colors.gradientStart,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  profileButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  disclaimer: {
    marginTop: spacing.xl,
  },
  successTitle: {
    ...typography.h2,
    color: colors.success,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  returnButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  returnButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
});
