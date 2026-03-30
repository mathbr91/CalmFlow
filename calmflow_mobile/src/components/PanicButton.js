/**
 * 🚨 PANIC BUTTON
 * Grande círculo centralizado com efeito de pressão
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography } from '../themes';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const PanicButton = ({ onPress, loading = false }) => {
  const [scaleAnim] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
    if (onPress && !loading) {
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={loading}
          activeOpacity={1}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>ATIVAR MODO</Text>
              <Text style={styles.buttonText}>CALMO</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const BUTTON_SIZE = SCREEN_WIDTH * 0.6;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl || 64,
  },
  buttonContainer: {
    zIndex: 2,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: colors.secondary, // Verde Água para ativar ajuda
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    elevation: 10,
    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  buttonText: {
    color: colors.surface,
    ...typography.h2,
    textAlign: 'center',
    fontWeight: '700',
  },
});
