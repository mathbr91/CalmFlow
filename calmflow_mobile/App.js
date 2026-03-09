/**
 * 🎯 APP.JS - VERSÃO SIMPLIFICADA PARA TESTES
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function App() {
  const [screen, setScreen] = React.useState('home');

  const handlePanicPress = () => {
    alert('🔴 BOTÃO DE PÂNICO PRESSIONADO!\n\nConectando ao servidor...');
  };

  const handleCheckIn = () => {
    setScreen('checkin');
  };

  return (
    <SafeAreaView style={styles.container}>
      {screen === 'home' ? (
        <View style={styles.homeContainer}>
          <Text style={styles.title}>CalmFlow</Text>
          <Text style={styles.subtitle}>Suporte Emocional Inteligente</Text>
          
          {/* Botão de Pânico */}
          <TouchableOpacity 
            style={styles.panicButton}
            onPress={handlePanicPress}
            activeOpacity={0.7}
          >
            <Text style={styles.panicButtonText}>🔴</Text>
            <Text style={styles.panicButtonLabel}>EMERGÊNCIA</Text>
          </TouchableOpacity>

          {/* Botão Check-in */}
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleCheckIn}
          >
            <Text style={styles.buttonText}>📋 Check-in Rápido</Text>
          </TouchableOpacity>

          {/* Botão Login */}
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => alert('Login - Próxima fase')}
          >
            <Text style={styles.buttonText}>🔐 Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.screenContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setScreen('home')}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Check-in Rápido</Text>
          <Text style={styles.screenText}>Como você está se sentindo?</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  panicButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  panicButtonText: {
    fontSize: 50,
  },
  panicButtonLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  screenText: {
    fontSize: 16,
    color: '#666',
  },
});
