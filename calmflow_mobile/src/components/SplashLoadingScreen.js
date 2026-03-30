import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SplashLoadingScreen = () => {
  const progressAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 0.88,
          duration: 1400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0.34,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/splash.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>CalmFlow</Text>
        </View>

        <View style={styles.waterProgressContainer}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: progressWidth }]} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B5BDB',
  },
  background: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: '12%',
  },
  logoText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  waterProgressContainer: {
    position: 'absolute',
    top: '63%',
    width: '100%',
    alignItems: 'center',
  },
  track: {
    width: '40%',
    height: 11,
    borderRadius: 999,
    backgroundColor: 'rgba(196, 233, 247, 0.34)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.24)',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#F6A9C8',
  },
});

export default SplashLoadingScreen;