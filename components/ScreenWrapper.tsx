

// Enhanced ScreenWrapper Component
import { Dimensions, Platform, StatusBar, SafeAreaView, ViewStyle, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '@/constants/theme'

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const { height } = Dimensions.get('window')

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
    const paddingTop = Platform.OS === 'ios'
        ? height * 0.06
        : StatusBar.currentHeight || 0;
    
    return (
        <SafeAreaView style={[enhancedStyles.container, { paddingTop }, style]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={colors.neutral900}
                translucent
            />
            {children}
        </SafeAreaView>
    )
}

const enhancedStyles = StyleSheet.create({
    container: {
        flex: 1,
        // Enhanced background with subtle gradient effect
        backgroundColor: colors.neutral900,
        marginTop: StatusBar.currentHeight || 0,
        // Add subtle texture or pattern
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: -2,
                },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 1,
            },
        }),
    },
})

export default ScreenWrapper