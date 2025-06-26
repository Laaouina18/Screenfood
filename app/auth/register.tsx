import { StyleSheet, Text, View } from 'react-native'
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

const Register = () => {
    const emailRef = React.useRef('');
    const nameRef = React.useRef('');
    const passordRef = React.useRef('');
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const { register: registerUser } = useAuth();
    
    const handleSumbit = async () => {
        setLoading(true);
        const res = await registerUser(emailRef.current, passordRef.current, nameRef.current);
        setLoading(false);
        if (res.success) {
            router.navigate('/auth/login');
        } else {
            alert(res.msg)
        }
    }
    
    return (
        <ScreenWrapper style={styles.screenWrapper}>
            <View style={styles.container}>
                {/* back button  */}
                <BackButton iconSize={28} />
                
                {/* Header with gradient background */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerContent}>
                        <Typo fontWeight={'700'} size={28} color="#FFFFFF">Sign Up</Typo>
                        <Typo fontWeight={'400'} size={16} color="#E8F4FD">Create your account to start tracking expenses</Typo>
                    </View>
                </View>
                
                {/* form container with shadow */}
                <View style={styles.formContainer}>
                    <View style={styles.form}>
                        <Input
                            icon={<Ionicons name="person" size={24} color="#6366F1" />}
                            placeholder='Enter your Name'
                            onChangeText={(value) => (nameRef.current = value)}
                            style={styles.input}
                        />
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
                    
                    {/* button */}
                    <View style={styles.buttonContainer}>
                        <Button onPress={handleSumbit} loading={loading} style={styles.registerButton}>
                            <Typo size={verticalScale(16)} fontWeight={'600'} color="#FFFFFF">Create Account</Typo>
                        </Button>
                    </View>
                </View>
                
                {/* footer */}
                <View style={styles.footer}>
                    <Link href={'/auth/login'} style={styles.footerLink}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Text style={styles.footerLinkText}>Sign In</Text>
                    </Link>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Register

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
        backgroundColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
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
        // Alternative gradient using backgroundColor
        backgroundColor: '#667EEA',
    },
    headerContent: {
        alignItems: 'center',
        gap: 8
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
    buttonContainer: {
        marginTop: spacingY._25,
    },
    registerButton: {
        backgroundColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        // Alternative gradient using backgroundColor
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
        transform: [{ translateY: 0 }],
    },
    footer: {
        alignItems: 'center',
        marginTop: spacingY._30,
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
    }
})

// Version alternative avec des couleurs plus chaudes
const alternativeStyles = StyleSheet.create({
    // Couleurs alternatives pour un thème plus chaud
    headerContainer: {
        backgroundColor: '#FF6B6B', // Rouge corail
        // ou backgroundColor: '#4ECDC4', // Turquoise
        // ou backgroundColor: '#45B7D1', // Bleu océan
        // ou backgroundColor: '#96CEB4', // Vert menthe
        // ou backgroundColor: '#FFEAA7', // Jaune doux
    },
    registerButton: {
        backgroundColor: '#FF6B6B', // Assortir avec l'en-tête
    },
    footerLinkText: {
        color: '#FF6B6B', // Assortir avec l'en-tête
    }
});