/**
 * 🧭 NAVIGATION
 * Configuração do React Navigation para o CalmFlow
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './AuthContext';
import { SplashLoadingScreen } from './components';

import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  CheckInScreen,
  ProfileScreen,
  HistoryScreen,
} from './screens';

const Stack = createStackNavigator();

export default function Navigation() {
  const { isAuthenticated } = React.useContext(AuthContext);

  if (isAuthenticated === null) {
    return <SplashLoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : 'Login'}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F9FA' },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CheckIn" component={CheckInScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}