// Enhanced ProfileChip Component
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React from 'react'
import { colors, spacingX } from '@/constants/theme'
import { scale } from '@/utils/styling'

type Props = {
	imageUrl: ImageSourcePropType | string
	name: string | null | undefined
	message: string | null | undefined
	rightIcon?: React.ReactNode
	onPress?: () => void
	onRightIconPress?: () => void
	variant?: 'default' | 'compact' | 'large'
	showOnlineStatus?: boolean
	isOnline?: boolean
	disabled?: boolean
	backgroundColor?: string
}

const ProfileChip: React.FC<Props> = ({ 
	imageUrl, 
	name, 
	message, 
	rightIcon, 
	onPress, 
	onRightIconPress,
	variant = 'default',
	showOnlineStatus = false,
	isOnline = false,
	disabled = false,
	backgroundColor
}) => {
	const getImageSource = () => {
		if (typeof imageUrl === 'string') {
			return { uri: imageUrl }
		}
		return imageUrl
	}

	const getInitials = (name: string | null | undefined): string => {
		if (!name) return '?'
		return name
			.split(' ')
			.map(word => word.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('')
	}

	const [imageError, setImageError] = React.useState(false)

	const getContainerStyle = () => {
		const baseStyle = [styles.container]
		
		if (variant === 'compact') {
			baseStyle.push(styles.compactContainer)
		} else if (variant === 'large') {
			baseStyle.push(styles.largeContainer)
		}
		
		if (backgroundColor) {
			baseStyle.push({ backgroundColor })
		}
		
		if (disabled) {
			baseStyle.push(styles.disabledContainer)
		}
		
		return baseStyle
	}

	const getImageStyle = () => {
		const baseStyle = [styles.profileImage]
		
		if (variant === 'compact') {
			baseStyle.push(styles.compactImage)
		} else if (variant === 'large') {
			baseStyle.push(styles.largeImage)
		}
		
		return baseStyle
	}

	const getNameStyle = () => {
		const baseStyle = [styles.name]
		
		if (variant === 'compact') {
			baseStyle.push(styles.compactName)
		} else if (variant === 'large') {
			baseStyle.push(styles.largeName)
		}
		
		if (disabled) {
			baseStyle.push(styles.disabledText)
		}
		
		return baseStyle
	}

	const getMessageStyle = () => {
		const baseStyle = [styles.message]
		
		if (variant === 'compact') {
			baseStyle.push(styles.compactMessage)
		} else if (variant === 'large') {
			baseStyle.push(styles.largeMessage)
		}
		
		if (disabled) {
			baseStyle.push(styles.disabledText)
		}
		
		return baseStyle
	}

	const renderContent = () => (
		<>
			<View style={styles.leftContent}>
				<View style={styles.imageContainer}>
					{!imageError && imageUrl ? (
						<Image
							source={getImageSource()}
							style={getImageStyle()}
							onError={() => setImageError(true)}
						/>
					) : (
						<View style={[getImageStyle(), styles.avatarPlaceholder]}>
							<Text style={styles.avatarText}>
								{getInitials(name)}
							</Text>
						</View>
					)}
					{showOnlineStatus && (
						<View style={[
							styles.onlineIndicator, 
							isOnline ? styles.online : styles.offline
						]} />
					)}
				</View>
				<View style={styles.textContainer}>
					{name && (
						<Text 
							style={getNameStyle()} 
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{name}
						</Text>
					)}
					
				</View>
			</View>
			{rightIcon && (
				<TouchableOpacity 
					onPress={onRightIconPress || onPress}
					disabled={disabled}
					style={styles.rightContent}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					{rightIcon}
				</TouchableOpacity>
			)}
		</>
	)

	if (onPress && !rightIcon) {
		return (
			<TouchableOpacity 
				style={getContainerStyle()} 
				onPress={onPress}
				disabled={disabled}
				activeOpacity={0.8}
			>
				{renderContent()}
			</TouchableOpacity>
		)
	}

	return (
		<View style={getContainerStyle()}>
			{renderContent()}
		</View>
	)
}

export default ProfileChip

// Enhanced Styles with Modern Design
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: scale(16),
		paddingVertical: scale(14),
		backgroundColor: '#FFFFFF',
		borderRadius: scale(16),
		marginVertical: scale(4),
		// Modern shadow
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
		// Subtle border
		borderWidth: 0.5,
		borderColor: 'rgba(0, 0, 0, 0.05)',
	},
	compactContainer: {
		paddingHorizontal: scale(12),
		paddingVertical: scale(10),
		borderRadius: scale(12),
	},
	largeContainer: {
		paddingHorizontal: scale(20),
		paddingVertical: scale(18),
		borderRadius: scale(20),
	},
	disabledContainer: {
		opacity: 0.5,
		backgroundColor: '#F8F9FA',
	},
	leftContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	imageContainer: {
		position: 'relative',
		marginRight: scale(14),
	},
	profileImage: {
		width: scale(48),
		height: scale(48),
		borderRadius: scale(24),
		backgroundColor: '#F1F3F4',
		// Enhanced image styling
		borderWidth: 2,
		borderColor: '#FFFFFF',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	compactImage: {
		width: scale(38),
		height: scale(38),
		borderRadius: scale(19),
	},
	largeImage: {
		width: scale(58),
		height: scale(58),
		borderRadius: scale(29),
		borderWidth: 3,
	},
	textContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	name: {
		fontSize: scale(16),
		fontWeight: '700',
		color: '#1A1A1A',
		marginBottom: scale(2),
		// Better typography
		letterSpacing: -0.2,
		lineHeight: scale(20),
	},
	compactName: {
		fontSize: scale(14),
		fontWeight: '600',
		lineHeight: scale(18),
	},
	largeName: {
		fontSize: scale(18),
		fontWeight: '800',
		lineHeight: scale(22),
		letterSpacing: -0.3,
	},
	message: {
		fontSize: scale(13),
		color: '#6B7280',
		fontWeight: '500',
		lineHeight: scale(16),
		// Better contrast and readability
		opacity: 0.9,
	},
	compactMessage: {
		fontSize: scale(12),
		fontWeight: '400',
		lineHeight: scale(15),
	},
	largeMessage: {
		fontSize: scale(15),
		fontWeight: '500',
		lineHeight: scale(18),
	},
	disabledText: {
		color: '#9CA3AF',
	},
	rightContent: {
		marginLeft: scale(12),
		padding: scale(6),
		borderRadius: scale(8),
		// Subtle interactive area
		backgroundColor: 'rgba(0, 0, 0, 0.02)',
	},
	onlineIndicator: {
		position: 'absolute',
		bottom: scale(-1),
		right: scale(-1),
		width: scale(14),
		height: scale(14),
		borderRadius: scale(7),
		borderWidth: 2.5,
		borderColor: '#FFFFFF',
		// Enhanced shadow for indicator
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.15,
		shadowRadius: 2,
		elevation: 3,
	},
	online: {
		backgroundColor: '#10B981',
		// Subtle glow effect
		shadowColor: '#10B981',
		shadowOpacity: 0.3,
	},
	offline: {
		backgroundColor: '#6B7280',
	},
	avatarPlaceholder: {
		backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Note: React Native doesn't support gradients directly
		// Fallback solid color
		backgroundColor: '#667eea',
		justifyContent: 'center',
		alignItems: 'center',
		// Enhanced placeholder styling
		shadowColor: '#667eea',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	avatarText: {
		color: '#FFFFFF',
		fontSize: scale(16),
		fontWeight: '700',
		letterSpacing: 0.5,
		// Better text rendering
		textShadowColor: 'rgba(0, 0, 0, 0.1)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
})