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
  Modal,
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
  const [showBreathingModal, setShowBreathingModal] = useState(false);

  useEffect(() => {
    // Se voltou da tela de check-in com mensagem
    if (route.params?.showCheckInSuccess) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Se deve mostrar modal de respiração (depois do check-in inteligente)
    if (route.params?.showBreathingModal) {
      setShowBreathingModal(true);
    }
  }, [route.params]);

  const handlePanicPress = async () => {
    // Vibração tátil de ativação
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Abrir modal de respiração
    setShowBreathingModal(true);
  };

  const handleCheckInPress = () => {
    navigation.navigate('CheckIn');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleHistory = () => {
    navigation.navigate('History');
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

        {/* History Button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleHistory}
        >
          <Text style={styles.secondaryButtonEmoji}>📊</Text>
          <Text style={styles.secondaryButtonText}>Meu Histórico</Text>
          <Text style={styles.secondaryButtonSubtext}>
            Veja seu humor nos últimos 7 dias
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

      {/* Breathing Modal */}
      <Modal
        visible={showBreathingModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowBreathingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🌬️ Respiração de Emergência</Text>
            <Text style={styles.modalSubtitle}>
              Siga o ritmo da animação abaixo
            </Text>
            
            <BreathingGuide technique={{ nome: '4-4-4', descricao: 'Inspire 4s, Segure 4s, Expire 4s' }} />
            
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowBreathingModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  closeModalButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    width: '100%',
  },
  closeModalButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
});
