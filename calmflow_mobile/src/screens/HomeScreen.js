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

const SCIENCE_SUPPORT_TECHNIQUES = [
  {
    id: 'dive_reflex',
    icon: '🧊',
    title: 'Reflexo de Mergulho',
    subtitle: 'Ativacao vagal em crise',
    howTo: 'Molhe o rosto com agua gelada por 15 a 30 segundos e respire lentamente. Repita 2 a 3 ciclos.',
    duration: '15-30 segundos por ciclo',
    purpose: 'Reduzir ativacao fisiologica via nervo vago.',
  },
  {
    id: 'sunlight',
    icon: '☀️',
    title: 'Exposicao Solar',
    subtitle: 'Regulacao de serotonina',
    howTo: 'Fique 10 minutos em luz solar natural, se possivel no inicio da manha, com respiracao ritmada.',
    duration: '10 minutos',
    purpose: 'Apoiar regulacao de humor e ritmo circadiano.',
  },
  {
    id: 'contrast_shower',
    icon: '🚿',
    title: 'Banho de Contraste',
    subtitle: 'Reset fisiologico rapido',
    howTo: 'Finalize o banho com agua fria em pernas, bracos e nuca, mantendo expiracao mais longa que inspiracao.',
    duration: '30 segundos finais',
    purpose: 'Gerar reset corporal e aumentar estado de alerta regulado.',
  },
  {
    id: 'sound_pause',
    icon: '🎧',
    title: 'Pausa Sonora',
    subtitle: 'Sincronizacao em 60 BPM',
    howTo: 'Ouça uma faixa em 60 BPM com volume baixo, focando no ritmo e na respiracao.',
    duration: '5-10 minutos',
    purpose: 'Acalmar aceleracao mental e favorecer foco.',
  },
];

export const HomeScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [technique, setTechnique] = useState(null);
  const [showTechnique, setShowTechnique] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [selectedScienceTechnique, setSelectedScienceTechnique] = useState(null);

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
    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await apiService.createBreathingSession();
      setShowBreathingModal(true);
    } catch (error) {
      console.error('[HomeScreen] Erro ao iniciar sessão de respiração:', error);
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

  const handleHistory = () => {
    navigation.navigate('History');
  };

  const handleScienceTechniquePress = (item) => {
    setSelectedScienceTechnique(item);
  };

  const handleBreathingSessionEnd = () => {
    setShowBreathingModal(false);
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

          <BreathingGuide technique={technique} visible={true} />

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

        <View style={styles.scienceSection}>
          <Text style={styles.scienceSectionTitle}>Suporte Imediato (Base Cientifica)</Text>
          {SCIENCE_SUPPORT_TECHNIQUES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.scienceCard}
              onPress={() => handleScienceTechniquePress(item)}
            >
              <Text style={styles.scienceCardTitle}>{item.icon} {item.title}</Text>
              <Text style={styles.scienceCardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
          <View style={styles.breathingModalContent}>
            <BreathingGuide
              visible={true}
              technique={{
                titulo: 'Respiração Quadrada 4-4-4-4',
                passos: [
                  '1. Inspire pelo nariz durante 4 segundos.',
                  '2. Segure o ar por 4 segundos.',
                  '3. Expire lentamente por 4 segundos.',
                  '4. Aguarde 4 segundos com o pulmão vazio.',
                  '5. Repita até completar 5 minutos.',
                ],
                dica: 'Se surgir tensão, mantenha o ritmo e reduza a força da respiração.',
              }}
              showCloseButton={true}
              onSessionEnd={handleBreathingSessionEnd}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={Boolean(selectedScienceTechnique)}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedScienceTechnique(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.scienceModalContent}>
            <Text style={styles.modalTitle}>
              {selectedScienceTechnique?.icon} {selectedScienceTechnique?.title}
            </Text>
            <Text style={styles.modalSubtitle}>{selectedScienceTechnique?.subtitle}</Text>

            <Text style={styles.scienceInstructionText}>
              <Text style={styles.scienceInstructionStrong}>Como fazer: </Text>
              {selectedScienceTechnique?.howTo}
            </Text>
            <Text style={styles.scienceInstructionText}>
              <Text style={styles.scienceInstructionStrong}>Tempo sugerido: </Text>
              {selectedScienceTechnique?.duration}
            </Text>
            <Text style={styles.scienceInstructionText}>
              <Text style={styles.scienceInstructionStrong}>Objetivo: </Text>
              {selectedScienceTechnique?.purpose}
            </Text>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setSelectedScienceTechnique(null)}
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
    marginTop: 40,
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
  scienceSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  scienceSectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  scienceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  scienceCardTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  scienceCardSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  scienceModalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    margin: spacing.lg,
    width: '90%',
    maxWidth: 420,
  },
  scienceInstructionText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  scienceInstructionStrong: {
    fontWeight: '800',
    color: colors.primary,
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
    flexDirection: 'column',
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
  },
  breathingModalContent: {
    width: '94%',
    height: '88%',
    maxWidth: 460,
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
  reliefModalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    margin: spacing.lg,
    width: '90%',
    maxWidth: 360,
  },
  reliefButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  reliefPrimaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  reliefPrimaryButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '700',
  },
  reliefSecondaryButton: {
    flex: 1,
    backgroundColor: colors.overlayLight,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  reliefSecondaryButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
