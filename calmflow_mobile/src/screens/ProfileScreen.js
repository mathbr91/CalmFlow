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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../themes';
import { LoadingOverlay, Disclaimer } from '../components';
import { apiService } from '../services/ApiService';

import { AuthContext } from '../AuthContext';

export const ProfileScreen = ({ navigation }) => {
  const { logout } = React.useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [contato_apoio, setContatoApoio] = useState('');
  const [nome_contato_apoio, setNomeContatoApoio] = useState('');
  const [vinculo_contato_apoio, setVinculoContatoApoio] = useState('');
  const [totalCheckinsReal, setTotalCheckinsReal] = useState(0);
  const [streakReal, setStreakReal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
      return undefined;
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProfileExtended();

      setUser(response);
      setContatoApoio(response.contato_apoio || '');
      setNomeContatoApoio(response.nome_contato_apoio || '');
      setVinculoContatoApoio(response.vinculo_contato_apoio || '');
      setTotalCheckinsReal(Number(response.total_checkins || 0));
      setStreakReal(Number(response.streak_dias || 0));
    } catch (error) {
      // Fallback para endpoint de perfil simples caso profile-extended falhe
      try {
        const [fallback, checkIns, emergencias] = await Promise.all([
          apiService.getProfile(),
          apiService.getCheckIns(),
          apiService.getEmergencias(),
        ]);
        setUser(fallback);

        const checkInsList = Array.isArray(checkIns) ? checkIns : [];
        const emergenciasList = Array.isArray(emergencias) ? emergencias : [];
        const diasAtivos = new Set();

        checkInsList.forEach((item) => {
          if (item?.criado_em) {
            diasAtivos.add(new Date(item.criado_em).toDateString());
          }
        });

        emergenciasList.forEach((item) => {
          if (item?.criado_em) {
            diasAtivos.add(new Date(item.criado_em).toDateString());
          }
        });

        setTotalCheckinsReal(diasAtivos.size);

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        let streak = 0;
        let cursor = new Date(hoje);
        while (diasAtivos.has(cursor.toDateString())) {
          streak += 1;
          cursor.setDate(cursor.getDate() - 1);
        }
        setStreakReal(streak);
      } catch (e) {
        console.error('[ProfileScreen] Erro ao carregar perfil:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      const response = await apiService.updateProfileExtended({
        contato_apoio: contato_apoio,
        nome_contato_apoio: nome_contato_apoio,
        vinculo_contato_apoio: vinculo_contato_apoio,
      });
      setUser(response);
      setNomeContatoApoio(response.nome_contato_apoio || '');
      setVinculoContatoApoio(response.vinculo_contato_apoio || '');
      Alert.alert('✅ Sucesso', 'Contato de emergência atualizado com sucesso!');
    } catch (error) {
      console.error('[ProfileScreen] Erro ao salvar contato:', error);
      Alert.alert('❌ Erro', 'Não foi possível atualizar o contato.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await Promise.all([
              AsyncStorage.removeItem('access_token'),
              AsyncStorage.removeItem('refresh_token'),
            ]);
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
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
          <Text style={styles.sectionTitle}>📞 Contato de Emergência</Text>
          <Text style={styles.sectionDescription}>
            Configure a pessoa de confiança para situações de crise
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do Contato"
            value={nome_contato_apoio}
            onChangeText={setNomeContatoApoio}
            placeholderTextColor={colors.textLight}
            editable={!saving}
          />

          <TextInput
            style={styles.input}
            placeholder="Vínculo (ex: Mãe, Amigo, Cônjuge)"
            value={vinculo_contato_apoio}
            onChangeText={setVinculoContatoApoio}
            placeholderTextColor={colors.textLight}
            editable={!saving}
          />
          
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
              {saving ? '⏳ Salvando...' : '💾 Salvar Contato de Emergência'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🚨</Text>
            <Text style={styles.statLabel}>Sessões de Respiração</Text>
            <Text style={styles.statValue}>{user.sessoes_respiracao ?? 0}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
            <Text style={styles.statValue}>{totalCheckinsReal}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statLabel}>Dias Seguidos</Text>
            <Text style={styles.statValue}>{streakReal}</Text>
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
