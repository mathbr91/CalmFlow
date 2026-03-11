/**
 * 📊 HISTORY SCREEN
 * Mostra o histórico de clima interno dos últimos 7 dias
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography } from '../themes';
import { LoadingOverlay } from '../components';
import { apiService } from '../services/ApiService';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const HistoryScreen = ({ navigation }) => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const response = await apiService.getCheckIns();
      // Filtrar apenas os últimos 7 dias
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentCheckIns = response.filter(checkIn => {
        const checkInDate = new Date(checkIn.criado_em);
        return checkInDate >= sevenDaysAgo;
      });

      setCheckIns(recentCheckIns);
    } catch (error) {
      console.error('[HistoryScreen] Erro ao carregar histórico:', error);
      alert('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const getClimaColor = (clima) => {
    const colors = {
      'ensolarado': '#FFD43B', // Amarelo
      'nublado': '#868E96',    // Cinza
      'tempestuoso': '#495057', // Cinza escuro
      'neblina': '#ADB5BD',    // Cinza claro
    };
    return colors[clima] || '#ADB5BD';
  };

  const getClimaEmoji = (clima) => {
    const emojis = {
      'ensolarado': '☀️',
      'nublado': '☁️',
      'tempestuoso': '⛈️',
      'neblina': '🌫️',
    };
    return emojis[clima] || '❓';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Criar array dos últimos 7 dias
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
    return checkIns.find(checkIn => {
      const checkInDate = new Date(checkIn.criado_em);
      return checkInDate.toDateString() === date.toDateString();
    });
  };

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
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Histórico de Humor</Text>
          <Text style={styles.subtitle}>Últimos 7 dias</Text>
        </View>

        {/* Timeline */}
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
                          { backgroundColor: getClimaColor(checkIn.clima_interno) }
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

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{checkIns.length}</Text>
              <Text style={styles.statLabel}>Check-ins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {checkIns.filter(c => c.nivel_ruido > 7).length}
              </Text>
              <Text style={styles.statLabel}>Dias agitados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.round((checkIns.length / 7) * 100)}%
              </Text>
              <Text style={styles.statLabel}>Consistência</Text>
            </View>
          </View>
        </View>

        {/* Insights */}
        {checkIns.length > 0 && (
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>💡 Insights</Text>
            {checkIns.filter(c => c.nivel_ruido > 7).length > 3 && (
              <Text style={styles.insightText}>
                • Você teve vários dias com alta agitação mental. Considere técnicas de relaxamento diário.
              </Text>
            )}
            {checkIns.filter(c => c.clima_interno === 'ensolarado').length > 4 && (
              <Text style={styles.insightText}>
                • Excelente! Você teve muitos dias positivos. Continue mantendo seus hábitos saudáveis.
              </Text>
            )}
            {checkIns.length >= 5 && (
              <Text style={styles.insightText}>
                • Parabéns pela consistência! Manter o check-in regular ajuda muito no bem-estar.
              </Text>
            )}
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
  timeline: {
    marginBottom: spacing.xl,
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
  statsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  statsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  insightsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
  },
  insightsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  insightText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
});