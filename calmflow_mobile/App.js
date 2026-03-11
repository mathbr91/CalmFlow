/**
 * 🎯 APP.JS - ENTRY POINT
 * Ponto de entrada do CalmFlow com React Navigation
 */

import React from 'react';
import Navigation from './src/navigation';
import { AuthProvider } from './src/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <AuthProvider>
      {/* force status bar colors to match brand blue */}
      <StatusBar style="light" backgroundColor="#3B5BDB" />
      <Navigation />
    </AuthProvider>
  );
}