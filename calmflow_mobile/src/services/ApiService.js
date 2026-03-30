/**
 * 🔌 API SERVICE
 * Axios com interceptadores para JWT, timeouts e erros
 * Detecção inteligente de ambiente (Web vs Mobile)
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function extractBackendMessage(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return String(data[0] || '');
  if (data.detail) return String(data.detail);

  const firstKey = Object.keys(data)[0];
  if (!firstKey) return '';
  const firstValue = data[firstKey];

  if (Array.isArray(firstValue)) return String(firstValue[0] || '');
  if (typeof firstValue === 'string') return firstValue;
  return '';
}

function looksLikeEmailAlreadyExists(data) {
  const emailError = data?.email?.[0] || '';
  const msg = String(emailError).toLowerCase();
  return msg.includes('already exists') || msg.includes('já existe') || msg.includes('cadastrado') || msg.includes('em uso');
}

function normalizeApiError(error) {
  const status = error?.response?.status;
  const responseData = error?.response?.data;
  const backendMessage = extractBackendMessage(responseData);
  const requestUrl = error?.config?.url || '';

  if (!error?.response) {
    return {
      isApiError: true,
      code: 'NETWORK_ERROR',
      status: null,
      userMessage: 'Não foi possível conectar ao servidor. Verifique sua conexão Wi-Fi.',
      backendMessage: '',
      raw: error,
    };
  }

  if (status === 400 && looksLikeEmailAlreadyExists(responseData)) {
    return {
      isApiError: true,
      code: 'EMAIL_ALREADY_EXISTS',
      status,
      userMessage: 'Este e-mail já está cadastrado. Tente outro ou faça login.',
      backendMessage,
      raw: error,
    };
  }

  if (status === 400) {
    return {
      isApiError: true,
      code: 'BAD_REQUEST',
      status,
      userMessage: backendMessage || 'Dados inválidos. Revise as informações e tente novamente.',
      backendMessage,
      raw: error,
    };
  }

  if (status === 401) {
    const isLoginEndpoint = requestUrl.includes('/token/');
    return {
      isApiError: true,
      code: 'UNAUTHORIZED',
      status,
      userMessage: isLoginEndpoint
        ? 'Ops! E-mail ou senha incorretos. Vamos tentar novamente.'
        : 'Sua sessão expirou. Faça login novamente.',
      backendMessage,
      raw: error,
    };
  }

  if (status >= 500) {
    return {
      isApiError: true,
      code: 'SERVER_ERROR',
      status,
      userMessage: 'Erro no servidor. Tente novamente em instantes.',
      backendMessage,
      raw: error,
    };
  }

  return {
    isApiError: true,
    code: 'UNKNOWN_ERROR',
    status,
    userMessage: backendMessage || 'Ocorreu um erro inesperado. Tente novamente.',
    backendMessage,
    raw: error,
  };
}

/**
 * Detecta a URL base da API.
 * Prioridade:
 *   1. app.json → expo.extra.API_BASE_URL  (produção / staging)
 *   2. web: http://127.0.0.1:8000/api      (dev local no browser)
 *   3. mobile sem URL configurada → aviso  (dev local no Expo Go)
 */
function getApiBaseUrl() {
  const normalizeBaseUrl = (url) => url.replace(/\/+$/, '');

  // PRODUÇÃO: se API_BASE_URL estiver configurada no app.json, usa sempre ela
  if (Constants.expoConfig?.extra?.API_BASE_URL) {
    return normalizeBaseUrl(Constants.expoConfig.extra.API_BASE_URL);
  }

  // DESENVOLVIMENTO LOCAL
  if (Platform.OS === 'web') {
    return 'http://127.0.0.1:8000/api';
  } else {
    // Mobile local: avisa no console para configurar o app.json
    console.warn(
      '[ApiService] ATENÇÃO: API_BASE_URL não configurada no app.json. ' +
      'Configure extra.API_BASE_URL para apontar para o backend.'
    );
    return 'http://127.0.0.1:8000/api';
  }
}

const API_BASE_URL = getApiBaseUrl();
const API_TIMEOUT = 10000;

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptador de requisição: adiciona JWT token e garante headers
    this.client.interceptors.request.use(
      async (config) => {
        // ✅ Garante que Content-Type sempre é application/json
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json';
        }

        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token.trim()}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptador de resposta: refresh token se expirado
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              await AsyncStorage.setItem('access_token', response.access);
              this.client.defaults.headers.Authorization = `Bearer ${response.access}`;
              originalRequest.headers.Authorization = `Bearer ${response.access}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
          }
        }

        return Promise.reject(normalizeApiError(error));
      }
    );
  }

  /**
   * AUTENTICAÇÃO
   */

  async register(email, password, firstName) {
    const response = await this.client.post('/register/', {
      email,
      password,
      password_confirm: password,
      first_name: firstName,
    });
    return response.data;
  }

  async login(email, password) {
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const response = await this.client.post('/token/', {
      username: normalizedEmail,
      password,
    });

    // Salva tokens no AsyncStorage
    await AsyncStorage.setItem('access_token', response.data.access);
    await AsyncStorage.setItem('refresh_token', response.data.refresh);

    return response.data;
  }

  async refreshToken(refreshToken) {
    const response = await this.client.post('/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  }

  async logout() {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  }

  async getProfile() {
    const response = await this.client.get('/profile/');
    return response.data;
  }

  async getProfileExtended() {
    const response = await this.client.get('/profile-extended/');
    return response.data;
  }

  async updateProfileExtended(payload) {
    const response = await this.client.put('/profile-extended/', payload);
    return response.data;
  }

  /**
   * MÉTODOS GENÉRICOS PARA REQUISIÇÕES
   */

  async get(endpoint) {
    const response = await this.client.get(endpoint);
    return response.data;
  }

  async post(endpoint, data) {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }

  async put(endpoint, data) {
    const response = await this.client.put(endpoint, data);
    return response.data;
  }

  async delete(endpoint) {
    const response = await this.client.delete(endpoint);
    return response.data;
  }

  /**
   * EMERGÊNCIAS & SOS
   */

  async createEmergencia(sintomaPrincipal, ambienteSeguro, idioma = 'pt-br') {
    const response = await this.client.post('/emergencias/', {
      sintoma_principal: sintomaPrincipal,
      ambiente_seguro: ambienteSeguro,
      lang: idioma, // Query param pode ser passado assim
    });
    return response.data;
  }

  async getSos(idioma = 'pt-br') {
    const response = await this.client.get(`/sos/?lang=${idioma}`);
    return response.data;
  }

  async getEmergencias() {
    const response = await this.client.get('/emergencias/');
    return response.data;
  }

  async createBreathingSession() {
    const response = await this.client.post('/emergencias/', {
      sintoma_principal: 'outro',
      ambiente_seguro: true,
      tipo_evento: 'sessao_respiracao',
      tecnica_utilizada: 'respiracao_quadrada',
      duracao_segundos: 0,
    });
    return response.data;
  }

  async saveEmergencyRelief(alivioPercebido, duracaoSegundos = 0) {
    try {
      const response = await this.client.post('/emergencias/', {
        sintoma_principal: 'outro',
        ambiente_seguro: true,
        tipo_evento: 'alivio_emergencia',
        tecnica_utilizada: 'respiracao_quadrada',
        alivio_percebido: alivioPercebido,
        duracao_segundos: duracaoSegundos,
      });
      console.info('[ApiService] saveEmergencyRelief enviado com sucesso', {
        alivio_percebido: alivioPercebido,
        duracao_segundos: duracaoSegundos,
      });
      return response.data;
    } catch (error) {
      console.error('[ApiService] Falha ao enviar saveEmergencyRelief');
      throw error;
    }
  }

  /**
   * CHECK-INS
   */

  async createCheckIn(scores) {
    const response = await this.client.post('/check-ins/', scores);
    return response.data;
  }

  async getCheckIns() {
    const response = await this.client.get('/check-ins/');
    return response.data;
  }

  /**
   * UTILITÁRIO
   */

  setLanguage(lang) {
    this.language = lang;
  }
}

export const apiService = new ApiService();
