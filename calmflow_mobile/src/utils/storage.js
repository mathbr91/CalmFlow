/**
 * 💾 ASYNC STORAGE HELPERS
 * Wrapper limpo para AsyncStorage com try-catch
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  /**
   * Salva um valor
   */
  async setItem(key, value) {
    try {
      const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`[StorageService] Erro ao salvar ${key}:`, error);
      throw error;
    }
  },

  /**
   * Obtém um valor
   */
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`[StorageService] Erro ao obter ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove um valor
   */
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Erro ao remover ${key}:`, error);
      throw error;
    }
  },

  /**
   * Limpa tudo
   */
  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[StorageService] Erro ao limpar storage:', error);
      throw error;
    }
  },
};
