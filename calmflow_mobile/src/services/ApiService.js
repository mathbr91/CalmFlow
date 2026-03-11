/**
 * 🔌 API SERVICE
 * Axios com interceptadores para JWT, timeouts e erros
 * Detecção inteligente de ambiente (Web vs Mobile)
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * 🎯 DETECÇÃO INTELIGENTE DE API_BASE_URL
 * - Navegador (Web): http://127.0.0.1:8000/api
 * - Celular (Expo Go): http://192.168.1.19:8000/api
 */
function getApiBaseUrl() {
  const normalizeBaseUrl = (url) =>
    url
      .replace(/\/api\/v1\/?$/i, '/api')
      .replace(/\/+$/, '');

  // Se houver configuração no app.json/Constants
  if (Constants.expoConfig?.extra?.API_BASE_URL) {
    return normalizeBaseUrl(Constants.expoConfig.extra.API_BASE_URL);
  }

  // Detecta o ambiente
  if (Platform.OS === 'web') {
    // Navegador: usa localhost
    return 'http://127.0.0.1:8000/api';
  } else {
    // Mobile (iOS/Android com Expo Go): usa IP da rede local
    return 'http://192.168.1.19:8000/api';
  }
}

const API_BASE_URL = getApiBaseUrl();
const API_TIMEOUT = Constants.expoConfig?.extra?.API_TIMEOUT || 10000;

console.log(`[ApiService] Ambiente: ${Platform.OS}, URL: ${API_BASE_URL}`);

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
        try {
          // ✅ Garante que Content-Type sempre é application/json
          if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
          }

          const token = await AsyncStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          console.log(`[ApiService] ${config.method.toUpperCase()} ${config.url}`);
        } catch (error) {
          console.error('[ApiService] Erro ao preparar requisição:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptador de resposta: refresh token se expirado
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[ApiService] ✅ ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        console.error(`[ApiService] ❌ ${error.response?.status || 'ERRO'} ${error.config?.url}`, error.message);

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
              console.log('[ApiService] Token renovado, tentando requisição novamente...');
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            console.error('[ApiService] Erro ao refresh token:', refreshError);
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * AUTENTICAÇÃO
   */

  async register(email, password, username, firstName) {
    const response = await this.client.post('/register/', {
      email,
      password,
      password_confirm: password,
      username,
      first_name: firstName,
    });
    return response.data;
  }

  async login(email, password) {
    const response = await this.client.post('/token/', {
      username: email,
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
