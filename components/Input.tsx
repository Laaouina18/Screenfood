import { StyleSheet, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { InputProps } from '@/types'
import { colors, radius, spacingX } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'

const Input = (props: InputProps) => {
	const [isFocused, setIsFocused] = useState(false)

	return (
		<View
			style={[
				styles.container,
				isFocused && styles.containerFocused,
				props.containerStyle && props.containerStyle
			]}
		>
			{props.icon && (
				<View style={[styles.iconContainer, isFocused && styles.iconFocused]}>
					{props.icon}
				</View>
			)}
			<TextInput
				style={[styles.input, props.inputStyle]}
				ref={props.inputRef && props.inputRef}
				placeholderTextColor={colors.neutral500}
				{...props}
				value={props.value}
				autoCorrect={false}
				autoCapitalize='none'
				onFocus={(e) => {
					setIsFocused(true)
					props.onFocus && props.onFocus(e)
				}}
				onBlur={(e) => {
					setIsFocused(false)
					props.onBlur && props.onBlur(e)
				}}
			/>
		</View>
	)
}

export default Input

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		height: verticalScale(60),
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1.5,
		borderColor: colors.neutral300,
		backgroundColor: colors.white,
		borderRadius: radius._17,
		borderCurve: 'continuous',
		paddingHorizontal: spacingX._15,
		gap: spacingX._10,
		shadowColor: colors.black,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 3,
		transition: 'all 0.2s ease',
	},
	containerFocused: {
		borderColor: colors.primary500,
		shadowColor: colors.primary500,
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 6,
		backgroundColor: colors.primary50,
	},
	iconContainer: {
		opacity: 0.6,
		transition: 'opacity 0.2s ease',
	},
	iconFocused: {
		opacity: 1,
	},
	input: {
		flex: 1,
		color: colors.neutral800,
		fontSize: verticalScale(18),
		fontWeight: '400',
		lineHeight: verticalScale(22),
	}
})