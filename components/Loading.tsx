import { ActivityIndicator, StyleSheet, View, Text, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { colors } from '@/constants/theme'

interface LoadingProps {
  size?: 'small' | 'large'
  color?: string
  message?: string
  variant?: 'default' | 'scanning' | 'analyzing' | 'processing'
}

const Loading = ({ 
  size = 'large', 
  color = colors.primary,
  message,
  variant = 'default'
}: LoadingProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animation de pulsation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )

    // Animation de rotation pour le variant scanning
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    )

    if (variant === 'scanning') {
      rotateAnimation.start()
    } else {
      pulseAnimation.start()
    }

    return () => {
      pulseAnimation.stop()
      rotateAnimation.stop()
    }
  }, [variant])

  const getLoadingContent = () => {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })

    switch (variant) {
      case 'scanning':
        return (
          <View style={styles.container}>
            <Animated.View 
              style={[
                styles.scanningBox, 
                { transform: [{ rotate: spin }] }
              ]}
            >
              <View style={styles.scanningCorner} />
              <View style={[styles.scanningCorner, styles.topRight]} />
              <View style={[styles.scanningCorner, styles.bottomLeft]} />
              <View style={[styles.scanningCorner, styles.bottomRight]} />
            </Animated.View>
            <Text style={styles.message}>
              {message || 'Scan en cours...'}
            </Text>
          </View>
        )

      case 'analyzing':
        return (
          <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={styles.foodIcon}>
                <Text style={styles.foodEmoji}>🍎</Text>
              </View>
            </Animated.View>
            <Text style={styles.message}>
              {message || 'Analyse nutritionnelle...'}
            </Text>
          </View>
        )

      case 'processing':
        return (
          <View style={styles.container}>
            <View style={styles.dotsContainer}>
              <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
              <Animated.View style={[styles.dot, styles.dotDelay1]} />
              <Animated.View style={[styles.dot, styles.dotDelay2]} />
            </View>
            <Text style={styles.message}>
              {message || 'Traitement des données...'}
            </Text>
          </View>
        )

      default:
        return (
          <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <ActivityIndicator size={size} color={color} />
            </Animated.View>
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        )
    }
  }

  return (
    <View style={styles.wrapper}>
      {getLoadingContent()}
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: colors.primary || '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Styles pour le variant scanning
  scanningBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: colors.primary || '#007AFF',
    borderRadius: 8,
    position: 'relative',
  },
  scanningCorner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: colors.primary || '#007AFF',
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    left: undefined,
    right: -2,
    borderLeftWidth: 0,
    borderRightWidth: 4,
  },
  bottomLeft: {
    top: undefined,
    bottom: -2,
    borderTopWidth: 0,
    borderBottomWidth: 4,
  },
  bottomRight: {
    top: undefined,
    bottom: -2,
    left: undefined,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  // Styles pour le variant analyzing
  foodIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary ? `${colors.primary}20` : '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodEmoji: {
    fontSize: 40,
  },
  // Styles pour le variant processing
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary || '#007AFF',
    marginHorizontal: 4,
  },
  dotDelay1: {
    // Animation avec délai sera gérée via Animated.delay si nécessaire
  },
  dotDelay2: {
    // Animation avec délai sera gérée via Animated.delay si nécessaire
  },
})