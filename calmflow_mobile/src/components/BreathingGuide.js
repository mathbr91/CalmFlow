/**
 * 🌬️ BREATHING GUIDE
 * Animação de respiração com instruções
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, spacing, typography } from '../themes';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const BreathingGuide = ({ technique }) => {
  const [scaleAnim] = React.useState(new Animated.Value(0.8));
  const [breathingPhase, setBreathingPhase] = useState('inhale');

  useEffect(() => {
    if (!technique) return;

    // Inspire → Segure (estático) → Expire → Aguarde (estático)
    const sequence = [
      { phase: 'inhale', duration: 4000, toValue: 1.2 },
      { phase: 'hold',   duration: 4000, toValue: null },  // parado em 1.2
      { phase: 'exhale', duration: 4000, toValue: 0.8 },
      { phase: 'wait',   duration: 4000, toValue: null },  // parado em 0.8
    ];

    let currentStep = 0;

    const runCycle = () => {
      const currentPhase = sequence[currentStep];
      setBreathingPhase(currentPhase.phase);

      // Anima apenas nas fases de movimento; nas de espera mantém valor atual
      if (currentPhase.toValue !== null) {
        Animated.timing(scaleAnim, {
          toValue: currentPhase.toValue,
          duration: currentPhase.duration,
          useNativeDriver: true,
        }).start();
      }

      currentStep = (currentStep + 1) % sequence.length;

      setTimeout(runCycle, currentPhase.duration);
    };

    runCycle();

    return () => {
      scaleAnim.setValue(0.8);
    };
  }, [technique]);

  if (!technique) return null;

  return (
    <View style={styles.container}>
      {/* Título da Técnica */}
      <Text style={styles.title}>{technique.titulo}</Text>

      {/* Círculo animado de respiração */}
      <Animated.View
        style={[
          styles.breathingCircle,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.phaseText}>
          {breathingPhase === 'inhale' && '🌬️ Inspire'}
          {breathingPhase === 'hold'   && '⏸️ Segure'}
          {breathingPhase === 'exhale' && '😤 Expire'}
          {breathingPhase === 'wait'   && '🌿 Aguarde'}
        </Text>
      </Animated.View>

      {/* Passos da técnica */}
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>Passos:</Text>
        {technique.passos && technique.passos.map((passo, index) => (
          <Text key={index} style={styles.stepText}>
            {passo}
          </Text>
        ))}
      </View>

      {/* Dica opcional */}
      {technique.dica && (
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>💡 {technique.dica}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xl,
    elevation: 8,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  phaseText: {
    ...typography.bodyLarge,
    color: colors.surface,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.md,
    width: '100%',
  },
  stepsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  stepText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginVertical: spacing.sm,
    lineHeight: 20,
  },
  tipContainer: {
    backgroundColor: colors.disclaimerBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  tipText: {
    ...typography.bodySmall,
    color: colors.disclaimerText,
  },
});
