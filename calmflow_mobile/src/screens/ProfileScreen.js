/**
 * 👤 PROFILE SCREEN
 * Informações do usuário e logout
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
import { colors, spacing, typography } from '../themes';
import { LoadingOverlay, Disclaimer } from '../components';
import { apiService } from '../services/ApiService';

export const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await apiService.getProfile();
      setUser(response);
    } catch (error) {
      console.error('[ProfileScreen] Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiService.logout();
    navigation.replace('Login');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingOverlay visible={loading} message="Carregando perfil..." />
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.first_name || user.username}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userId}>ID: {user.id}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🚨</Text>
            <Text style={styles.statLabel}>Emergências</Text>
            <Text style={styles.statValue}>--</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
            <Text style={styles.statValue}>--</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statLabel}>Dias</Text>
            <Text style={styles.statValue}>--</Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.actionButtonEmoji}>🏠</Text>
          <Text style={styles.actionButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleLogout}
        >
          <Text style={styles.actionButtonEmoji}>🚪</Text>
          <Text style={[styles.actionButtonText, styles.dangerText]}>
            Fazer Logout
          </Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <Disclaimer style={styles.disclaimer} />
      </ScrollView>

      <LoadingOverlay visible={loading} message="Carregando..." />
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
    marginBottom: spacing.md,
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  avatar: {
    fontSize: 32,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userId: {
    ...typography.caption,
    color: colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h3,
    color: colors.secondary,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: `${colors.error}20`,
  },
  dangerText: {
    color: colors.error,
  },
  disclaimer: {
    marginTop: spacing.xl,
  },
});
