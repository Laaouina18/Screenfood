import { View, Text, Image, ScrollView, TouchableOpacity, Platform, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/theme";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { getProfileImage } from "@/services/imagesService";
import Animated, { FadeInDown, FadeInUp, FadeIn } from "react-native-reanimated";
import { UserDataType } from "@/types";

const { width, height } = Dimensions.get('window');

// Fonctions responsive
const getResponsiveSize = (small: number, medium: number, large: number) => {
	if (width < 768) return small;
	if (width < 1024) return medium;
	return large;
};

const getResponsivePadding = () => {
	if (width < 768) return 16;
	if (width < 1024) return 24;
	return 32;
};

const isTablet = width >= 768;
const isDesktop = width >= 1024;

const MENU_ITEMS = [
	{
		icon: <AntDesign name="user" size={getResponsiveSize(24, 28, 32)} color="#667eea" />,
		title: "Edit Profile",
		subtitle: "Update your personal information",
		route: "(modals)/profileModal"
	},
	{
		icon: <MaterialIcons name="favorite-border" size={getResponsiveSize(24, 28, 32)} color="#667eea" />,
		title: "Favourites",
		subtitle: "Your saved items",
		route: "favourites"
	},
	{
		icon: <MaterialIcons name="privacy-tip" size={getResponsiveSize(24, 28, 32)} color="#667eea" />,
		title: "Privacy & Policy",
		subtitle: "Learn about our policies",
		route: "privacyAndPolicy"
	},
	{
		icon: <Ionicons name="settings-outline" size={getResponsiveSize(24, 28, 32)} color="#667eea" />,
		title: "Settings",
		subtitle: "App preferences",
		route: "settings"
	}
];

const ProfileScreen = () => {
	const router = useRouter();
	const isIOS = Platform.OS === "ios";
	const { user, updateUserData } = useAuth();
	const [userData, setUserData] = useState<UserDataType>({
		name: '',
		image: null,
	})

	const handleLogout = async () => {
		await auth.signOut();
	};

	useEffect(() => {
		if (user) {
			setUserData(prevState => ({
				...prevState,
				image: user.image || null,
				name: user.name || ''
			}))
		}
	}, [user])

	const renderProfileImage = () => {
		const imageSource = userData.image
			? { uri: typeof userData.image === 'string' ? userData.image : userData.image.uri }
			: getProfileImage(null)

		return (
			<Image
				source={imageSource}
				style={styles.avatar}
				resizeMode="cover"
			/>
		)
	}

	const MenuItem = ({ icon, title, subtitle, route }: any) => (
		<Animated.View entering={FadeInDown.duration(800).springify().damping(12)}>
			<TouchableOpacity 
				onPress={() => router.push(route)}
				style={styles.menuItemTouchable}
				activeOpacity={0.7}
			>
				<View style={styles.menuItem}>
					<View style={styles.menuIconContainer}>
						<View style={styles.iconBackground}>
							{icon}
						</View>
					</View>
					<View style={styles.menuTextContainer}>
						<Text style={styles.menuItemText}>{title}</Text>
						<Text style={styles.menuItemSubtitle}>{subtitle}</Text>
					</View>
					<View style={styles.chevronContainer}>
						<AntDesign name="right" size={getResponsiveSize(16, 18, 20)} color="#64748b" />
					</View>
				</View>
			</TouchableOpacity>
		</Animated.View>
	);

	return (
		<ScreenWrapper>
			<LinearGradient
				colors={['#667eea', '#764ba2']}
				style={styles.container}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			>
				{/* Header avec profil */}
				<Animated.View entering={FadeIn.duration(1000)} style={styles.header}>
					<View style={[styles.avatarContainer, { paddingTop: isIOS ? 40 : 10 }]}>
						<LinearGradient
							colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
							style={styles.avatarGradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
						>
							{renderProfileImage()}
						</LinearGradient>
						
						{/* Badge en ligne */}
						<View style={styles.onlineBadge}>
							<View style={styles.onlineDot} />
						</View>
					</View>
					
					<View style={styles.userInfoContainer}>
						<Text style={[styles.name, { fontFamily: "HelvetIns" }]}>
							{user?.name}
						</Text>
						<Text style={styles.title}>{user?.email}</Text>
						
						{/* Stats rapides */}
						<View style={styles.statsContainer}>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>24</Text>
								<Text style={styles.statLabel}>Posts</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>156</Text>
								<Text style={styles.statLabel}>Likes</Text>
							</View>
							<View style={styles.statDivider} />
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>89</Text>
								<Text style={styles.statLabel}>Following</Text>
							</View>
						</View>
					</View>
				</Animated.View>

				{/* Menu principal */}
				<ScrollView 
					style={styles.menuContainer}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
				>
					<View style={styles.menuSection}>
						<Text style={styles.sectionTitle}>Account</Text>
						<View style={isTablet ? styles.menuGrid : styles.menuList}>
							{MENU_ITEMS.map((item, index) => (
								<View key={index} style={isTablet ? styles.menuItemGrid : null}>
									<MenuItem {...item} />
								</View>
							))}
						</View>
					</View>

					{/* Bouton de déconnexion */}
					<Animated.View 
						entering={FadeInUp.duration(1000).springify().damping(15)}
						style={styles.logoutSection}
					>
						<Button onPress={handleLogout} style={styles.logoutButton}>
							<View style={styles.logoutContent}>
								<AntDesign name="logout" size={getResponsiveSize(18, 20, 22)} color="#ef4444" />
								<Typo fontWeight="600" color="#ef4444" size={getResponsiveSize(16, 18, 20)}>
									Logout
								</Typo>
							</View>
						</Button>
					</Animated.View>
				</ScrollView>
			</LinearGradient>
		</ScreenWrapper>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: getResponsiveSize(20, 30, 40),
	},
	header: {
		alignItems: "center",
		paddingVertical: getResponsiveSize(30, 40, 50),
		backgroundColor: 'rgba(255,255,255,0.1)',
		borderBottomLeftRadius: getResponsiveSize(24, 28, 32),
		borderBottomRightRadius: getResponsiveSize(24, 28, 32),
		shadowColor: 'rgba(0,0,0,0.3)',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
		backdropFilter: 'blur(10px)',
	},
	avatarContainer: {
		alignItems: "center",
		position: "relative",
	},
	avatarGradient: {
		width: getResponsiveSize(144, 160, 180),
		height: getResponsiveSize(144, 160, 180),
		borderRadius: getResponsiveSize(72, 80, 90),
		padding: 6,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: 'rgba(255,255,255,0.5)',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 10,
	},
	avatar: {
		width: getResponsiveSize(132, 148, 168),
		height: getResponsiveSize(132, 148, 168),
		borderRadius: getResponsiveSize(66, 74, 84),
		borderWidth: 3,
		borderColor: 'rgba(255,255,255,0.8)',
	},
	onlineBadge: {
		position: "absolute",
		bottom: 8,
		right: 8,
		width: getResponsiveSize(24, 28, 32),
		height: getResponsiveSize(24, 28, 32),
		borderRadius: getResponsiveSize(12, 14, 16),
		backgroundColor: 'rgba(255,255,255,0.9)',
		alignItems: "center",
		justifyContent: "center",
		shadowColor: 'rgba(0,0,0,0.3)',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	onlineDot: {
		width: getResponsiveSize(12, 14, 16),
		height: getResponsiveSize(12, 14, 16),
		borderRadius: getResponsiveSize(6, 7, 8),
		backgroundColor: '#10b981',
	},
	userInfoContainer: {
		alignItems: "center",
		marginTop: getResponsiveSize(20, 25, 30),
	},
	name: {
		fontSize: getResponsiveSize(28, 32, 36),
		color: '#ffffff',
		fontWeight: "bold",
		letterSpacing: 0.5,
		textShadowColor: 'rgba(0,0,0,0.3)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
	},
	title: {
		fontSize: getResponsiveSize(16, 18, 20),
		color: 'rgba(255,255,255,0.8)',
		marginTop: 4,
		fontWeight: "500",
	},
	statsContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: getResponsiveSize(20, 25, 30),
		paddingHorizontal: getResponsiveSize(40, 60, 80),
		backgroundColor: 'rgba(255,255,255,0.1)',
		borderRadius: 16,
		paddingVertical: getResponsiveSize(12, 16, 20),
		backdropFilter: 'blur(10px)',
	},
	statItem: {
		alignItems: "center",
		flex: 1,
	},
	statNumber: {
		fontSize: getResponsiveSize(22, 26, 30),
		fontWeight: "bold",
		color: '#ffffff',
	},
	statLabel: {
		fontSize: getResponsiveSize(12, 14, 16),
		color: 'rgba(255,255,255,0.7)',
		marginTop: 2,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	statDivider: {
		width: 1,
		height: getResponsiveSize(32, 36, 40),
		backgroundColor: 'rgba(255,255,255,0.3)',
		marginHorizontal: getResponsiveSize(20, 25, 30),
	},
	menuContainer: {
		flex: 1,
		paddingTop: getResponsiveSize(20, 30, 40),
	},
	menuSection: {
		backgroundColor: 'rgba(255,255,255,0.9)',
		marginHorizontal: getResponsivePadding(),
		borderRadius: getResponsiveSize(16, 20, 24),
		paddingVertical: getResponsiveSize(8, 12, 16),
		shadowColor: 'rgba(0,0,0,0.1)',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 4,
		backdropFilter: 'blur(10px)',
	},
	sectionTitle: {
		fontSize: getResponsiveSize(14, 16, 18),
		fontWeight: "700",
		color: '#1e293b',
		paddingHorizontal: getResponsiveSize(20, 24, 28),
		paddingVertical: getResponsiveSize(16, 20, 24),
		paddingBottom: getResponsiveSize(8, 12, 16),
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	menuList: {
		// Style par défaut pour mobile
	},
	menuGrid: {
		flexDirection: isDesktop ? 'row' : 'column',
		flexWrap: 'wrap',
		gap: getResponsiveSize(8, 12, 16),
		paddingHorizontal: getResponsiveSize(8, 12, 16),
	},
	menuItemGrid: {
		flex: isDesktop ? 0.48 : 1,
	},
	menuItemTouchable: {
		marginHorizontal: getResponsiveSize(8, 12, 16),
		borderRadius: getResponsiveSize(12, 14, 16),
		overflow: "hidden",
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: getResponsiveSize(16, 20, 24),
		paddingHorizontal: getResponsiveSize(16, 20, 24),
	},
	menuIconContainer: {
		marginRight: getResponsiveSize(16, 20, 24),
	},
	iconBackground: {
		width: getResponsiveSize(48, 56, 64),
		height: getResponsiveSize(48, 56, 64),
		borderRadius: getResponsiveSize(12, 14, 16),
		backgroundColor: 'rgba(102, 126, 234, 0.15)',
		alignItems: "center",
		justifyContent: "center",
	},
	menuTextContainer: {
		flex: 1,
	},
	menuItemText: {
		fontSize: getResponsiveSize(18, 20, 22),
		fontWeight: "600",
		color: '#1e293b',
		marginBottom: 2,
	},
	menuItemSubtitle: {
		fontSize: getResponsiveSize(14, 16, 18),
		color: '#64748b',
		fontWeight: "400",
	},
	chevronContainer: {
		paddingLeft: getResponsiveSize(8, 12, 16),
	},
	logoutSection: {
		paddingHorizontal: getResponsivePadding(),
		paddingVertical: getResponsiveSize(24, 32, 40),
	},
	logoutButton: {
		backgroundColor: 'rgba(239, 68, 68, 0.1)',
		borderWidth: 1.5,
		borderColor: 'rgba(239, 68, 68, 0.3)',
		paddingVertical: getResponsiveSize(16, 20, 24),
		backdropFilter: 'blur(10px)',
	},
	logoutContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: getResponsiveSize(8, 12, 16),
	},
});

export default ProfileScreen;