import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

const welcome = () => {
	const router = useRouter()
	
	return (
		<ScreenWrapper>
			<LinearGradient
				colors={['#667eea', '#764ba2', '#667eea']}
				locations={[0, 0.5, 1]}
				style={styles.container}
			>
				{/* Header avec login */}
				<Animated.View 
					entering={FadeInUp.duration(800).delay(200)}
					style={styles.header}
				>
					<TouchableOpacity 
						style={styles.loginButton} 
						onPress={() => router.push('/auth/login')}
					>
						<LinearGradient
							colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
							style={styles.loginButtonGradient}
						>
							<Typo fontWeight={'600'} color="#fff" size={16}>Se connecter</Typo>
						</LinearGradient>
					</TouchableOpacity>
				</Animated.View>

				{/* Logo et illustration principale */}
				<View style={styles.mainContent}>
					<Animated.View
						entering={FadeIn.duration(1000).delay(300)}
						style={styles.logoContainer}
					>
						<View style={styles.logoWrapper}>
							<LinearGradient
								colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
								style={styles.logoBackground}
							>
								<Text style={styles.logo}>🍎</Text>
							</LinearGradient>
						</View>
						<Typo fontWeight={'800'} size={32} color="#fff" style={styles.appName}>
							FoodScan
						</Typo>
						<View style={styles.logoUnderline} />
					</Animated.View>

					<Animated.View
						entering={FadeIn.duration(1000).delay(500)}
						style={styles.welcomeImageContainer}
					>
						{/* Illustration améliorée */}
						<View style={styles.illustrationContainer}>
							<View style={styles.phoneFrame}>
								<LinearGradient
									colors={['#1a1a1a', '#2d2d2d']}
									style={styles.phoneGradient}
								>
									<View style={styles.phoneScreen}>
										<LinearGradient
											colors={['#f8fafc', '#e2e8f0']}
											style={styles.screenGradient}
										>
											<View style={styles.scanInterface}>
												<Text style={styles.barcodeEmoji}>📱</Text>
												<View style={styles.scanLineContainer}>
													<View style={styles.scanLine} />
													<View style={styles.scanGlow} />
												</View>
												<Text style={styles.productEmoji}>🥛</Text>
											</View>
										</LinearGradient>
									</View>
								</LinearGradient>
							</View>
							
							{/* Éléments flottants améliorés */}
							<View style={styles.floatingElements}>
								<Animated.View 
									style={[styles.floatingItem, styles.apple]}
									entering={FadeIn.duration(1000).delay(800)}
								>
									<View style={styles.floatingBg}>
										<Text style={styles.floatingEmoji}>🍎</Text>
									</View>
								</Animated.View>
								<Animated.View 
									style={[styles.floatingItem, styles.bread]}
									entering={FadeIn.duration(1000).delay(1000)}
								>
									<View style={styles.floatingBg}>
										<Text style={styles.floatingEmoji}>🍞</Text>
									</View>
								</Animated.View>
								<Animated.View 
									style={[styles.floatingItem, styles.carrot]}
									entering={FadeIn.duration(1000).delay(1200)}
								>
									<View style={styles.floatingBg}>
										<Text style={styles.floatingEmoji}>🥕</Text>
									</View>
								</Animated.View>
							</View>

							{/* Cercles décoratifs */}
							<View style={styles.decorativeCircles}>
								<View style={[styles.circle, styles.circle1]} />
								<View style={[styles.circle, styles.circle2]} />
								<View style={[styles.circle, styles.circle3]} />
							</View>
						</View>
					</Animated.View>
				</View>

				{/* Footer avec design amélioré */}
				<View style={styles.footer}>
					<LinearGradient
						colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.95)']}
						style={styles.footerGradient}
					>
						<Animated.View
							entering={FadeInDown.duration(1000).springify().damping(12)} 
							style={styles.titleContainer}
						>
							<Typo fontWeight={'800'} size={28} color="#fff" style={styles.mainTitle}>
								Scannez, analysez,
							</Typo>
							<View style={styles.highlightTextContainer}>
								<Typo fontWeight={'800'} size={28} color="#fff">
									mangez 
								</Typo>
								<LinearGradient
									colors={['#667eea', '#764ba2']}
									style={styles.highlightBg}
								>
									<Typo fontWeight={'800'} size={28} color="#fff" style={styles.highlightText}>
										 mieux
									</Typo>
								</LinearGradient>
							</View>
						</Animated.View>

						<Animated.View
							entering={FadeInDown.duration(1000).delay(300).springify().damping(12)} 
							style={styles.subtitleContainer}
						>
							<Typo size={17} color="rgba(255,255,255,0.8)" style={styles.subtitle}>
								Découvrez la composition nutritionnelle
							</Typo>
							<Typo size={17} color="rgba(255,255,255,0.8)" style={styles.subtitle}>
								de vos aliments en un scan
							</Typo>
						</Animated.View>

						{/* Fonctionnalités principales améliorées */}
						<Animated.View
							entering={FadeInDown.duration(1000).delay(500).springify().damping(12)}
							style={styles.featuresContainer}
						>
							<View style={styles.feature}>
								<View style={styles.featureIconContainer}>
									<Text style={styles.featureIcon}>📱</Text>
								</View>
								<Typo size={14} color="rgba(255,255,255,0.7)" style={styles.featureText}>
									Scan rapide
								</Typo>
							</View>
							<View style={styles.feature}>
								<View style={styles.featureIconContainer}>
									<Text style={styles.featureIcon}>🥗</Text>
								</View>
								<Typo size={14} color="rgba(255,255,255,0.7)" style={styles.featureText}>
									Infos nutritionnelles
								</Typo>
							</View>
							<View style={styles.feature}>
								<View style={styles.featureIconContainer}>
									<Text style={styles.featureIcon}>📊</Text>
								</View>
								<Typo size={14} color="rgba(255,255,255,0.7)" style={styles.featureText}>
									Suivi personnalisé
								</Typo>
							</View>
						</Animated.View>

						{/* Bouton principal amélioré */}
						<Animated.View 
							style={styles.buttonContainer} 
							entering={FadeInDown.duration(1000).delay(700).springify().damping(12)}
						>
							<TouchableOpacity 
								onPress={() => router.push('/auth/register')}
								style={styles.mainButtonContainer}
								activeOpacity={0.8}
							>
								<LinearGradient
									colors={['#667eea', '#764ba2']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 1}}
									style={styles.mainButton}
								>
									<Typo size={18} fontWeight={'700'} color="#fff">
										Commencer le scan
									</Typo>
									<View style={styles.buttonIcon}>
										<Text style={styles.buttonIconText}>🚀</Text>
									</View>
								</LinearGradient>
							</TouchableOpacity>
							
							<TouchableOpacity 
								style={styles.skipButton}
								onPress={() => router.push('/scan')}
								activeOpacity={0.7}
							>
								<View style={styles.skipButtonContent}>
									<Text style={styles.skipIcon}>👆</Text>
									<Typo size={16} color="rgba(255,255,255,0.6)">
										Essayer sans compte
									</Typo>
								</View>
							</TouchableOpacity>
						</Animated.View>
					</LinearGradient>
				</View>
			</LinearGradient>
		</ScreenWrapper>
	)
}

export default welcome

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	header: {
		alignItems: 'flex-end',
		paddingTop: spacingY._7,
		paddingHorizontal: spacingX._20,
	},
	loginButton: {
		borderRadius: 25,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	loginButtonGradient: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.3)',
	},
	mainContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: spacingX._20,
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: verticalScale(50),
	},
	logoWrapper: {
		marginBottom: 16,
	},
	logoBackground: {
		width: 80,
		height: 80,
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 10,
	},
	logo: {
		fontSize: 40,
	},
	appName: {
		textShadowColor: 'rgba(0,0,0,0.3)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
		marginBottom: 8,
	},
	logoUnderline: {
		width: 60,
		height: 3,
		backgroundColor: 'rgba(255,255,255,0.6)',
		borderRadius: 2,
	},
	welcomeImageContainer: {
		width: '100%',
		height: verticalScale(320),
		justifyContent: 'center',
		alignItems: 'center',
	},
	illustrationContainer: {
		position: 'relative',
		width: '85%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	phoneFrame: {
		width: 180,
		height: 320,
		borderRadius: 28,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 15 },
		shadowOpacity: 0.4,
		shadowRadius: 25,
		elevation: 15,
	},
	phoneGradient: {
		flex: 1,
		padding: 4,
		borderRadius: 28,
	},
	phoneScreen: {
		flex: 1,
		borderRadius: 24,
		overflow: 'hidden',
	},
	screenGradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	scanInterface: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		width: '100%',
	},
	barcodeEmoji: {
		fontSize: 35,
		position: 'absolute',
		top: 35,
	},
	scanLineContainer: {
		position: 'relative',
		width: '75%',
		height: 4,
	},
	scanLine: {
		width: '100%',
		height: 3,
		backgroundColor: '#667eea',
		borderRadius: 2,
	},
	scanGlow: {
		position: 'absolute',
		top: -2,
		left: 0,
		right: 0,
		height: 7,
		backgroundColor: '#667eea',
		opacity: 0.3,
		borderRadius: 4,
	},
	productEmoji: {
		fontSize: 45,
		position: 'absolute',
		bottom: 45,
	},
	floatingElements: {
		position: 'absolute',
		width: '120%',
		height: '120%',
	},
	floatingItem: {
		position: 'absolute',
	},
	floatingBg: {
		backgroundColor: 'rgba(255,255,255,0.25)',
		borderRadius: 25,
		padding: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 5,
	},
	floatingEmoji: {
		fontSize: 24,
	},
	apple: {
		top: '15%',
		right: '5%',
	},
	bread: {
		top: '65%',
		left: '0%',
	},
	carrot: {
		bottom: '20%',
		right: '10%',
	},
	decorativeCircles: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		zIndex: -1,
	},
	circle: {
		position: 'absolute',
		borderRadius: 50,
		backgroundColor: 'rgba(255,255,255,0.1)',
	},
	circle1: {
		width: 100,
		height: 100,
		top: '10%',
		left: '-20%',
	},
	circle2: {
		width: 80,
		height: 80,
		bottom: '15%',
		right: '-15%',
	},
	circle3: {
		width: 60,
		height: 60,
		top: '50%',
		left: '-10%',
	},
	footer: {
		borderTopLeftRadius: 35,
		borderTopRightRadius: 35,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -10 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 20,
	},
	footerGradient: {
		alignItems: 'center',
		paddingTop: verticalScale(40),
		paddingBottom: verticalScale(50),
		gap: spacingY._20,
	},
	titleContainer: {
		alignItems: 'center',
		gap: 4,
	},
	mainTitle: {
		textShadowColor: 'rgba(0,0,0,0.5)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
	},
	highlightTextContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	highlightBg: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
		marginLeft: 4,
	},
	highlightText: {
		textShadowColor: 'rgba(0,0,0,0.3)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
	subtitleContainer: {
		alignItems: 'center',
		gap: 4,
	},
	subtitle: {
		textAlign: 'center',
		lineHeight: 22,
	},
	featuresContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		paddingHorizontal: spacingX._25,
		marginTop: spacingY._15,
	},
	feature: {
		alignItems: 'center',
		gap: spacingY._8,
		flex: 1,
	},
	featureIconContainer: {
		backgroundColor: 'rgba(255,255,255,0.15)',
		borderRadius: 20,
		padding: 8,
		marginBottom: 4,
	},
	featureIcon: {
		fontSize: 20,
	},
	featureText: {
		textAlign: 'center',
		lineHeight: 18,
	},
	buttonContainer: {
		width: '100%',
		paddingHorizontal: spacingX._25,
		gap: spacingY._16,
	},
	mainButtonContainer: {
		borderRadius: 28,
		overflow: 'hidden',
		shadowColor: '#667eea',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.4,
		shadowRadius: 16,
		elevation: 12,
	},
	mainButton: {
		paddingVertical: 18,
		paddingHorizontal: 24,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
	},
	buttonIcon: {
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderRadius: 12,
		padding: 4,
	},
	buttonIconText: {
		fontSize: 16,
	},
	skipButton: {
		alignSelf: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.1)',
	},
	skipButtonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	skipIcon: {
		fontSize: 14,
	},
})