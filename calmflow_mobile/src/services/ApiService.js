/**
 * 🔌 API SERVICE
 * Axios com interceptadores para JWT, timeouts e erros
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || 'http://192.168.1.19:8000/api/v1'; // IP do PC na rede local
const API_TIMEOUT = Constants.expoConfig?.extra?.API_TIMEOUT || 10000;

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptador de requisição: adiciona JWT token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('[ApiService] Erro ao obter JWT token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptador de resposta: refesh token se expirado
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
      email,
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
