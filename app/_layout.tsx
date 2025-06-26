import { AuthProvider } from "@/contexts/authContext";
import { ScanProvider } from "@/contexts/scanContext";
import { Stack } from "expo-router";
import React from "react";

const StackLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
		</Stack>
	);
};

export default function RootLayout() {
	return (
		<AuthProvider>
			     <ScanProvider>
				 <StackLayout />
				 </ScanProvider>
			
				
			
		</AuthProvider>
	);
}
