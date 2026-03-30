import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, typography } from '../themes';
import { apiService } from '../services/ApiService';

const TOTAL_SECONDS = 5 * 60;
const PHASES = [
  { text: 'Inspire profundamente', toValue: 1.8, durationMs: 4000 },
  { text: 'Segure o ar...', toValue: 1.8, durationMs: 4000 },
  { text: 'Solte devagar', toValue: 1.0, durationMs: 4000 },
  { text: 'Aguarde...', toValue: 1.0, durationMs: 4000 },
];

export const BreathingGuide = ({ onSessionEnd, showCloseButton = true, visible = true }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_SECONDS);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [, setIsPaused] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackVariant, setFeedbackVariant] = useState('A');
  const [sessionSeed, setSessionSeed] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1.0));

  const startedAtRef = useRef(Date.now());
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const finishedRef = useRef(false);
  const isPausedRef = useRef(false);

  const timerText = useMemo(() => {
    const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const ss = String(remainingSeconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, [remainingSeconds]);

  const glowOpacity = scaleAnim.interpolate({
    inputRange: [1.0, 1.8],
    outputRange: [0.35, 0.7],
  });

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const stopAndAskFeedback = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsPaused(true);
    isPausedRef.current = true;
    clearTimers();
    scaleAnim.stopAnimation();
    // 50/50 entre os dois conjuntos de feedback
    const useAltFeedback = Math.random() > 0.5;
    setFeedbackVariant(useAltFeedback ? 'B' : 'A');
    setFeedbackVisible(true);
  };

  const runPhaseLoop = () => {
    const executePhase = (index) => {
      const phase = PHASES[index];
      setPhaseIndex(index);

      Animated.timing(scaleAnim, {
        toValue: phase.toValue,
        duration: phase.durationMs,
        useNativeDriver: false,
      }).start();

      timeoutRef.current = setTimeout(() => {
        executePhase((index + 1) % PHASES.length);
      }, phase.durationMs);
    };

    executePhase(0);
  };

  const startSession = () => {
    finishedRef.current = false;
    setIsPaused(false);
    isPausedRef.current = false;
    startedAtRef.current = Date.now();
    setRemainingSeconds(TOTAL_SECONDS);
    setPhaseIndex(0);
    scaleAnim.setValue(1.0);

    runPhaseLoop();

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (isPausedRef.current) {
          return prev;
        }
        if (prev <= 1) {
          stopAndAskFeedback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!visible) return undefined;
    startSession();
    return () => clearTimers();
  }, [visible, sessionSeed]);

  const handleFeedback = async (alivioPercebido) => {
    const durationSeconds = Math.max(
      Math.round((Date.now() - startedAtRef.current) / 1000),
      1
    );

    try {
      await apiService.saveEmergencyRelief(alivioPercebido, durationSeconds);
    } catch (_) {
      // Erro já é tratado no ApiService com log enxuto.
    }

    setFeedbackVisible(false);
    onSessionEnd?.({
      duracao_segundos: durationSeconds,
      alivio_percebido: alivioPercebido,
      durationSeconds,
    });
  };

  const handleRepeat = () => {
    setFeedbackVisible(false);
    setIsPaused(false);
    isPausedRef.current = false;
    setSessionSeed((old) => old + 1);
  };

  if (!visible) return null;

  return (
    <View style={styles.root}>
      <View style={styles.translucentOverlay}>
        <View style={styles.contentCard}>
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={stopAndAskFeedback}
              hitSlop={{ top: 14, right: 14, bottom: 14, left: 14 }}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.title}>Respiração Quadrada</Text>
          <Text style={styles.timer}>{timerText}</Text>

          <View style={styles.breathArea}>
            <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

            <Animated.View style={[styles.breathCircle, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.circleLayerOuter} />
              <View style={styles.circleLayerInner} />
              <Text style={styles.phaseText}>{PHASES[phaseIndex].text}</Text>
            </Animated.View>
          </View>

          <ScrollView
            style={styles.stepsScroll}
            contentContainerStyle={styles.stepsContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.stepsTitle}>Passos da Respiração 4-4-4-4</Text>
            <Text style={styles.step}>1. Inspire por 4 segundos.</Text>
            <Text style={styles.step}>2. Segure o ar por 4 segundos.</Text>
            <Text style={styles.step}>3. Expire lentamente por 4 segundos.</Text>
            <Text style={styles.step}>4. Aguarde 4 segundos e reinicie o ciclo.</Text>
          </ScrollView>
        </View>
      </View>

      <Modal
        visible={feedbackVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {feedbackVariant === 'A' ? 'Você está se sentindo melhor?' : 'Como você se sente agora?'}
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={() => handleFeedback(false)}
              >
                <Text style={styles.modalButtonGhostText}>
                  {feedbackVariant === 'A' ? 'Não' : 'Pior'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSolid]}
                onPress={() => handleFeedback(true)}
              >
                <Text style={styles.modalButtonSolidText}>
                  {feedbackVariant === 'A' ? 'Sim' : 'Melhor'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.repeatButton} onPress={handleRepeat}>
              <Text style={styles.repeatText}>Repetir exercício</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    zIndex: 40,
  },
  translucentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 18, 28, 0.25)',
    borderRadius: 24,
    padding: spacing.md,
  },
  contentCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 22,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 35, 42, 0.7)',
    zIndex: 50,
  },
  closeButtonText: {
    ...typography.bodyLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  timer: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: '#2A6BF2',
    fontSize: 34,
    fontWeight: '800',
    fontFamily: Platform.select({ android: 'monospace', ios: 'Courier' }),
    letterSpacing: 1.6,
  },
  breathArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
    marginBottom: spacing.md,
  },
  glow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#62D6B8',
  },
  breathCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#4CC9A5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 9,
    backgroundColor: '#48B89A',
  },
  circleLayerOuter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#5FD9B6',
  },
  circleLayerInner: {
    position: 'absolute',
    width: '72%',
    height: '72%',
    borderRadius: 999,
    backgroundColor: '#8FF0D2',
    opacity: 0.55,
  },
  phaseText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.9,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  stepsScroll: {
    flex: 1,
    width: '100%',
  },
  stepsContainer: {
    backgroundColor: 'rgba(245, 250, 255, 0.9)',
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E1ECF5',
  },
  stepsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  step: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xs,
    letterSpacing: 0.25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalButtonGhost: {
    marginRight: spacing.sm,
    borderWidth: 1.4,
    borderColor: '#40B996',
    backgroundColor: '#FFFFFF',
  },
  modalButtonSolid: {
    marginLeft: spacing.sm,
    backgroundColor: '#40B996',
  },
  modalButtonGhostText: {
    ...typography.body,
    color: '#40B996',
    fontWeight: '700',
  },
  modalButtonSolidText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  repeatButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  repeatText: {
    ...typography.body,
    color: '#2A6BF2',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
