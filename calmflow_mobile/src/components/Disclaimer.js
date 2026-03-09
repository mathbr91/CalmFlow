/**
 * 📋 DISCLAIMER
 * Rodapé obrigatório em todas as telas
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../themes';

export const Disclaimer = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>⚠️ AVISO IMPORTANTE</Text>
        <Text style={styles.text}>
          Este aplicativo fornece ferramentas de suporte ao bem-estar e conteúdo informativo, não substituindo diagnóstico, aconselhamento ou tratamento médico/psicológico profissional. Se você está em perigo imediato, em crise ou com pensamentos de auto-extermínio, entre em contato imediatamente com serviços de emergência, hospitais ou autoridades de saúde da sua região.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.disclaimerBg,
    borderTopWidth: 2,
    borderTopColor: colors.warning,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.caption,
    color: colors.disclaimerText,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  text: {
    ...typography.caption,
    color: colors.disclaimerText,
    lineHeight: 16,
  },
});
