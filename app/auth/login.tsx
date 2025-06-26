import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons';
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext';

const Login = () => {
    const emailRef = React.useRef('');
    const passordRef = React.useRef('');
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const { login: loginUser } = useAuth();

    const handleSumbit = async () => {
        setLoading(true);
        const res = await loginUser(emailRef.current, passordRef.current);
        setLoading(false);
        if (res.success) {
            router.navigate('/(tabs)');
        } else {
            alert(res.msg)
        }
    }

    return (
        <ScreenWrapper style={styles.screenWrapper}>
            <View style={styles.container}>
                {/* back button */}
                <BackButton iconSize={28} />

                {/* Header with gradient background */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerContent}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="log-in" size={32} color="#FFFFFF" />
                        </View>
                        <Typo fontWeight={'700'} size={28} color="#FFFFFF">Welcome Back</Typo>
                        <Typo fontWeight={'400'} size={16} color="#E8F4FD">Sign in to continue tracking your expenses</Typo>
                    </View>
                </View>

                {/* form container with shadow */}
                <View style={styles.formContainer}>
                    <View style={styles.form}>
                        <Input
                            icon={<Ionicons name="mail" size={24} color="#6366F1" />}
                            placeholder='Enter your email'
                            onChangeText={(value) => (emailRef.current = value)}
                            style={styles.input}
                        />
                        <Input
                            icon={<Ionicons name="lock-closed" size={24} color="#6366F1" />}
                            placeholder='Enter your password'
                            secureTextEntry
                            onChangeText={(value) => (passordRef.current = value)}
                            style={styles.input}
                        />
                    </View>

                    {/* forgot password */}
                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* button */}
                    <View style={styles.buttonContainer}>
                        <Button onPress={handleSumbit} loading={loading} style={styles.loginButton}>
                            <Typo size={verticalScale(16)} fontWeight={'600'} color="#FFFFFF">Sign In</Typo>
                        </Button>
                    </View>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Link href={'/auth/register'} style={styles.footerLink}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Text style={styles.footerLinkText}>Create Account</Text>
                    </Link>
                </View>

                {/* Social login section (optional) */}
                <View style={styles.socialContainer}>
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.divider} />
                    </View>
                    
                    <View style={styles.socialButtons}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-apple" size={24} color="#000000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Login

const styles = StyleSheet.create({
    screenWrapper: {
        backgroundColor: '#F8FAFC'
    },
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        marginVertical: spacingY._20
    },
    headerContainer: {
        backgroundColor: '#667EEA',
        borderRadius: 20,
        padding: spacingY._30,
        marginTop: spacingY._20,
        marginBottom: spacingY._30,
        shadowColor: '#667EEA',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    headerContent: {
        alignItems: 'center',
        gap: 12
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: spacingY._30,
        marginBottom: spacingY._20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    form: {
        gap: spacingY._20
    },
    input: {
        borderColor: '#E2E8F0',
        borderWidth: 1.5,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1E293B',
        shadowColor: '#64748B',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: 8,
        marginBottom: 4
    },
    forgotPassword: {
        fontSize: verticalScale(14),
        fontWeight: '500',
        color: '#6366F1',
        textDecorationLine: 'underline'
    },
    buttonContainer: {
        marginTop: spacingY._20,
    },
    loginButton: {
        backgroundColor: '#6366F1',
        borderRadius: 16,
        paddingVertical: 16,
        shadowColor: '#6366F1',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    footer: {
        alignItems: 'center',
        marginTop: spacingY._20,
    },
    footerLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: verticalScale(15),
        color: '#64748B',
        fontWeight: '400',
    },
    footerLinkText: {
        fontSize: verticalScale(15),
        color: '#6366F1',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    socialContainer: {
        marginTop: spacingY._25,
        paddingHorizontal: spacingX._10
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacingY._20,
        gap: 12
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0'
    },
    dividerText: {
        fontSize: verticalScale(13),
        color: '#64748B',
        fontWeight: '500'
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#64748B',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
})

// Styles alternatifs avec d'autres couleurs
const alternativeColorSchemes = {
    // Thème vert menthe
    mint: {
        headerBackground: '#4ECDC4',
        buttonBackground: '#4ECDC4',
        accentColor: '#4ECDC4'
    },
    // Thème corail
    coral: {
        headerBackground: '#FF6B6B',
        buttonBackground: '#FF6B6B',
        accentColor: '#FF6B6B'
    },
    // Thème violet
    purple: {
        headerBackground: '#9B59B6',
        buttonBackground: '#9B59B6',
        accentColor: '#9B59B6'
    },
    // Thème bleu océan
    ocean: {
        headerBackground: '#3498DB',
        buttonBackground: '#3498DB',
        accentColor: '#3498DB'
    }
};