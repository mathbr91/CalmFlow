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
  TextInput,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '../themes';
import { LoadingOverlay, Disclaimer } from '../components';
import { apiService } from '../services/ApiService';

import { AuthContext } from '../AuthContext';

export const ProfileScreen = ({ navigation }) => {
  const { logout } = React.useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [contato_apoio, setContatoApoio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await apiService.get('/api/profile-extended/');
      setUser(response);
      setContatoApoio(response.contato_apoio || '');
    } catch (error) {
      console.error('[ProfileScreen] Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      const response = await apiService.put('/api/profile-extended/', {
        contato_apoio: contato_apoio,
      });
      setUser(response);
      Alert.alert('✅ Sucesso', 'Contato de apoio atualizado com sucesso!');
    } catch (error) {
      console.error('[ProfileScreen] Erro ao salvar contato:', error);
      Alert.alert('❌ Erro', 'Não foi possível atualizar o contato.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
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

        {/* Contato de Apoio Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>📞 Contato de Apoio</Text>
          <Text style={styles.sectionDescription}>
            Deixe um número para contato em caso de crise
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Ex: +55 11 98765-4321"
            value={contato_apoio}
            onChangeText={setContatoApoio}
            placeholderTextColor={colors.textLight}
            editable={!saving}
          />
          
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSaveContact}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? '⏳ Salvando...' : '💾 Salvar Contato'}
            </Text>
          </TouchableOpacity>
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
  sectionContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  saveButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '700',
  },
});
