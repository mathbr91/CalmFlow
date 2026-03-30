/**
 * 📝 REGISTER SCREEN
 * Criação de conta com validações
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '../themes';
import { LoadingOverlay, Disclaimer } from '../components';
import { apiService } from '../services/ApiService';

import { AuthContext } from '../AuthContext';

export const RegisterScreen = ({ navigation }) => {
  const { login } = React.useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!firstName || !email || !password) {
      setError('Por favor, preencha todos os campos');
      return false;
    }
    if (password !== passwordConfirm) {
      setError('As senhas não coincidem');
      return false;
    }
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return false;
    }
    if (!email.includes('@')) {
      setError('Email inválido');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await apiService.register(email, password, firstName);
      // Faz login automaticamente
      await apiService.login(email, password);
      login();
      navigation.replace('Home');
    } catch (err) {
      console.error('[RegisterScreen] Erro de registro:', err);
      const responseData = err?.response?.data || err?.raw?.response?.data || {};
      const status = err?.status || err?.response?.status || err?.raw?.response?.status;
      const emailError = responseData?.email?.[0] || responseData?.email;

      if (status === 400 && emailError) {
        const message = String(emailError);
        Alert.alert('E-mail já cadastrado', message);
        setError(message);
      } else if (status === 500) {
        const message = 'Instabilidade no servidor, tente novamente em instantes';
        Alert.alert('Erro no servidor', message);
        setError(message);
      } else {
        setError(err?.userMessage || 'Falha ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>CalmFlow</Text>
            <Text style={styles.subtitle}>Crie sua conta</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* First Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Primeiro Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="João"
                placeholderTextColor={colors.textLight}
                value={firstName}
                onChangeText={setFirstName}
                editable={!loading}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                secureTextEntry
              />
            </View>

            {/* Password Confirm */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textLight}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                editable={!loading}
                secureTextEntry
              />
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <View style={styles.buttonContent}>
                {loading && (
                  <ActivityIndicator size="small" color={colors.surface} style={styles.buttonSpinner} />
                )}
                <Text style={styles.buttonText}>
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Entrar agora</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Disclaimer */}
          <Disclaimer style={styles.disclaimer} />
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={loading} message="Criando conta..." />
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
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginVertical: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.overlayLight,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.surface,
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.bodyLarge,
    color: colors.surface,
    fontWeight: '700',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSpinner: {
    marginRight: spacing.sm,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  disclaimer: {
    marginTop: spacing.lg,
  },
});
