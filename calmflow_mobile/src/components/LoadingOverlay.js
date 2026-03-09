/**
 * ⏳ LOADING OVERLAY
 * Fade-in suave com mensagem customizável
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../themes';

export const LoadingOverlay = ({ visible = false, message = 'Carregando...' }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <View style={styles.content}>
        <ActivityIndicator
          size="large"
          color={colors.secondary}
          style={styles.spinner}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  spinner: {
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
