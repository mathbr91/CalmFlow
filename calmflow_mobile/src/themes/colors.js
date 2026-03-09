/**
 * 🎨 PALETA DE CORES - CALMFLOW
 * Baseada em Azul Sereno + Verde Água
 * Design minimalista para redução de ansiedade
 */

export const colors = {
  // PRIMÁRIAS - Cores calmantes
  primary: '#3B5BDB',           // Azul Sereno (botões principais)
  secondary: '#20C997',         // Verde Água (acentos, sucesso)
  accent: '#FFD43B',            // Amarelo suave (alertas gentis)

  // NEUTROS - Fundo and Text
  background: '#F8F9FA',        // Branco levemente cinzento
  surface: '#FFFFFF',           // Branco puro (cards)
  surfaceLight: '#F1F3F5',      // Cinza muito claro

  // TEXT
  textPrimary: '#212529',       // Preto suave para textos
  textSecondary: '#6C757D',     // Cinza para textos secundários
  textLight: '#8E99A4',         // Cinza claro

  // ESTADOS
  success: '#20C997',           // Verde (sucesso, check-in completo)
  warning: '#FFB700',           // Laranja (avisos)
  error: '#FF6B6B',             // Vermelho (erros)
  info: '#3B5BDB',              // Azul (informações)

  // GRADIENTES (para backgrounds)
  gradientStart: '#E7F5FF',     // Azul muito claro
  gradientEnd: '#D3F9D8',       // Verde muito claro

  // TRANSPARÊNCIAS
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',

  // DISCLAIMER
  disclaimerBg: '#FFF3BF',      // Amarelo suave
  disclaimerText: '#856404',    // Marrom escuro
};

/**
 * 📐 ESPAÇAMENTOS
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * 🔤 TIPOGRAFIA
 */
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 28,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

/**
 * 📏 BORDER RADIUS
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 9999,
};
