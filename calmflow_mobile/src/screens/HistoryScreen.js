/**
 * 📊 HISTORY SCREEN
 * Mostra o histórico de humor e sessões de respiração
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { colors, spacing, typography } from '../themes';
import { LoadingOverlay } from '../components';
import { apiService } from '../services/ApiService';

export const HistoryScreen = ({ navigation }) => {
  const [checkIns, setCheckIns] = useState([]);
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        await apiService.getProfile();
        loadHistory();
      } catch (err) {
        console.warn('[HistoryScreen] usuário não autenticado', err.message);
        navigation.replace('Login');
      }
    };
    checkAuthAndLoad();
  }, []);

  const loadHistory = async () => {
    try {
      setError(null);
      const [checkInsResponse, emergenciasResponse] = await Promise.all([
        apiService.getCheckIns(),
        apiService.getEmergencias(),
      ]);

      const checkInsPayload = checkInsResponse?.data ?? checkInsResponse;
      const emergenciasPayload = emergenciasResponse?.data ?? emergenciasResponse;
      const safeCheckIns = Array.isArray(checkInsPayload) ? checkInsPayload : (checkInsPayload?.results || []);
      const safeEmergencias = Array.isArray(emergenciasPayload)
        ? emergenciasPayload
        : (emergenciasPayload?.results || []);

      setCheckIns(safeCheckIns);
      setSessoes(
        safeEmergencias
          .filter((e) => e?.tipo_evento === 'sessao_respiracao' || e?.tipo_evento === 'alivio_emergencia')
          .sort((a, b) => new Date(b?.criado_em || 0) - new Date(a?.criado_em || 0))
      );
    } catch (err) {
      console.error('[HistoryScreen] Erro ao carregar histórico:', err);
      setError('Não foi possível carregar o histórico. Verifique sua conexão.');
      setCheckIns([]);
      setSessoes([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistory();
  }, []);

  const getClimaColor = (clima) => {
    const map = {
      ensolarado: '#FFD43B',
      nublado: '#868E96',
      tempestuoso: '#495057',
      neblina: '#ADB5BD',
    };
    return map[clima] || '#ADB5BD';
  };

  const getClimaEmoji = (clima) => {
    const map = {
      ensolarado: '☀️',
      nublado: '☁️',
      tempestuoso: '⛈️',
      neblina: '🌫️',
    };
    return map[clima] || '❓';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const getCheckInForDate = (date) => {
    const entries = checkIns
      .filter((c) => {
        if (!c?.criado_em) return false;
        return new Date(c.criado_em).toDateString() === date.toDateString();
      })
      .sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
    return entries[entries.length - 1];
  };

  const hasSessions = sessoes.length > 0;
  const isEmpty = checkIns.length === 0 && !hasSessions;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingOverlay visible={true} message="Carregando histórico..." />
      </SafeAreaView>
    );
  }

  const last7Days = getLast7Days();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Meu Histórico</Text>
          <Text style={styles.subtitle}>Check-ins e sessões de respiração</Text>
        </View>

        {/* Erro de rede */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadHistory}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Estado vazio */}
        {isEmpty && !error && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>Nenhum registro encontrado.</Text>
            <Text style={styles.emptySubtitle}>Comece sua jornada hoje!</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('CheckIn')}
            >
              <Text style={styles.emptyButtonText}>Fazer meu primeiro Check-in</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Timeline de humor (7 dias) */}
        {checkIns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Check-ins — Últimos 7 dias</Text>
            <View style={styles.timeline}>
              {last7Days.map((date, index) => {
                const checkIn = getCheckInForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <View key={index} style={styles.dayContainer}>
                    <View style={styles.dayInfo}>
                      <Text style={[styles.dayText, isToday && styles.todayText]}>
                        {formatDate(date)}
                      </Text>
                      {isToday && <Text style={styles.todayLabel}>Hoje</Text>}
                    </View>
                    <View style={styles.climaContainer}>
                      {checkIn ? (
                        <View style={styles.climaIndicator}>
                          <View
                            style={[
                              styles.climaCircle,
                              { backgroundColor: getClimaColor(checkIn.clima_interno) },
                            ]}
                          />
                          <Text style={styles.climaEmoji}>
                            {getClimaEmoji(checkIn.clima_interno)}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.noDataContainer}>
                          <Text style={styles.noDataText}>—</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Estatísticas rápidas */}
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{checkIns.length}</Text>
                <Text style={styles.statLabel}>Total de check-ins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.round((last7Days.filter((d) => getCheckInForDate(d)).length / 7) * 100)}%
                </Text>
                <Text style={styles.statLabel}>Consistência 7d</Text>
              </View>
            </View>
          </View>
        )}

        {/* Sessões de Respiração */}
        {hasSessions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌬️ Sessões de Respiração</Text>
            {sessoes.map((sessao, index) => (
              <View
                key={sessao.id ?? index}
                style={[
                  styles.sessaoCard,
                  sessao.alivio_percebido === true
                    ? styles.sessaoCardGood
                    : sessao.alivio_percebido === false
                    ? styles.sessaoCardBad
                    : styles.sessaoCardNeutral,
                ]}
              >
                <View style={styles.sessaoLeft}>
                  <Text style={styles.sessaoEmoji}>
                    {sessao.alivio_percebido === true
                      ? '😌'
                      : sessao.alivio_percebido === false
                      ? '😔'
                      : '🌿'}
                  </Text>
                </View>
                <View style={styles.sessaoInfo}>
                  <Text style={styles.sessaoDate}>{formatDateTime(sessao.criado_em)}</Text>
                  <Text style={styles.sessaoDur}>
                    Tempo: {Math.floor((Number(sessao.duracao_segundos) || 0) / 60)}min {(Number(sessao.duracao_segundos) || 0) % 60}s
                  </Text>
                </View>
                <View style={styles.sessaoRight}>
                  {sessao.alivio_percebido === true && (
                    <Text style={styles.sessaoBadgeGood}>Melhor / Sim</Text>
                  )}
                  {sessao.alivio_percebido === false && (
                    <Text style={styles.sessaoBadgeBad}>Pior / Não</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  // ─── Estado vazio ─────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  emptyButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '700',
  },
  // ─── Seções ────────────────────────────────────────────────────
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  // ─── Timeline de check-ins ─────────────────────────────────────
  timeline: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.overlayLight,
  },
  dayInfo: {
    flex: 1,
  },
  dayText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  todayText: {
    color: colors.primary,
    fontWeight: '700',
  },
  todayLabel: {
    ...typography.bodySmall,
    color: colors.secondary,
    fontWeight: '600',
  },
  climaContainer: {
    width: 60,
    alignItems: 'center',
  },
  climaIndicator: {
    alignItems: 'center',
  },
  climaCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: spacing.xs,
  },
  climaEmoji: {
    fontSize: 20,
  },
  noDataContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 18,
  },
  // ─── Estatísticas rápidas ──────────────────────────────────────
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  // ─── Cards de sessão de respiração ─────────────────────────────
  sessaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
  },
  sessaoCardGood: {
    borderLeftColor: colors.secondary,
  },
  sessaoCardBad: {
    borderLeftColor: colors.error,
  },
  sessaoCardNeutral: {
    borderLeftColor: colors.overlayLight,
  },
  sessaoLeft: {
    marginRight: spacing.md,
  },
  sessaoEmoji: {
    fontSize: 28,
  },
  sessaoInfo: {
    flex: 1,
  },
  sessaoDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sessaoDur: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  sessaoRight: {
    marginLeft: spacing.sm,
  },
  sessaoBadgeGood: {
    ...typography.caption,
    color: colors.secondary,
    backgroundColor: `${colors.secondary}20`,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontWeight: '700',
    overflow: 'hidden',
  },
  sessaoBadgeBad: {
    ...typography.caption,
    color: colors.error,
    backgroundColor: `${colors.error}15`,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontWeight: '700',
    overflow: 'hidden',
  },
  // ─── Erro de rede ──────────────────────────────────────────────
  errorContainer: {
    backgroundColor: `${colors.error}15`,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  retryButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
});