import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
import { colors } from '@/constants/theme'

const index = () => {
	return (
		<View style={styles.container}>
			

		</View>
	)
}

export default index

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.neutral900,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		height: "20%",
		aspectRatio: 1,
	},
})