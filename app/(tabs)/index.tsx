// screens/Home.tsx
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, Alert, FlatList, Text, ScrollView } from 'react-native';
import React, { useState, useMemo } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, spacingX } from '@/constants/theme';
import ProfileChip from '@/components/ProfileChip';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/authContext';
import { useScan } from '@/contexts/scanContext';
import Typo from '@/components/Typo';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const Home = () => {
    const { user } = useAuth();
    const { scanImage, scanHistory, isScanning, getScanStats } = useScan();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [scanResult, setScanResult] = useState<any | null>(null);

    const scanStats = getScanStats();

    // Filtrer l'historique des scans pour n'afficher que ceux de l'utilisateur connecté
    const userScanHistory = useMemo(() => {
        if (!user?.uid) return [];
        return scanHistory.filter(scan => scan.userId === user.uid);
    }, [scanHistory, user?.uid]);

    // Fonction pour ouvrir la caméra
    const openCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission refusée', 'Nous avons besoin d\'accéder à votre caméra');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                handleImageScan(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible d\'ouvrir la caméra');
        }
    };

    // Fonction pour ouvrir la galerie
    const openGallery = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission refusée', 'Nous avons besoin d\'accéder à votre galerie');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                handleImageScan(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible d\'ouvrir la galerie');
        }
    };

    const handleImageScan = async (imageUri: string) => {
        setSelectedImage(imageUri);
        const response = await scanImage(imageUri);
        
        if (response.success && response.result) {
            setScanResult({
                ...response.result,
                imageUri,
            });
        } else {
            Alert.alert('Erreur', response.msg || 'Erreur lors du scan');
        }
        setSelectedImage(null);
    };
    

    // Options de scan
    const showScanOptions = () => {
        Alert.alert(
            'Scanner une image',
            'Choisissez une option',
            [
                {
                    text: 'Caméra',
                    onPress: openCamera,
                    style: 'default'
                },
                {
                    text: 'Galerie',
                    onPress: openGallery,
                    style: 'default'
                },
                {
                    text: 'Annuler',
                    style: 'cancel'
                }
            ]
        );
    };

    const renderScanResult = () => {
        if (!scanResult) return null;
    
        return (
            <View style={styles.resultContainer}>
                <Image source={{ uri: scanResult.imageUri }} style={styles.resultImage} />
                <Typo variant="h3" style={styles.resultTitle}>{scanResult.title}</Typo>
                <Typo variant="body" style={styles.resultCategory}>Catégorie : {scanResult.category}</Typo>
                <Typo variant="body" style={styles.resultConfidence}>Confiance : {scanResult.confidence}%</Typo>
            </View>
        );
    };
    

    // Rendu d'un item de l'historique
    const renderHistoryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.historyItem}
            onPress={() => router.push({
                pathname: '/scan-result',
                params: { scanId: item.id }
            })}
        >
            <View style={styles.historyImageContainer}>
                <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
                <View style={styles.imageOverlay}>
                    <Ionicons name="eye" size={16} color="#fff" />
                </View>
            </View>
            <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>{item.result.title}</Text>
                <View style={styles.categoryBadge}>
                    <Text style={styles.historyCategory}>{item.result.category}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <Ionicons name="time" size={12} color="#8E8E93" />
                    <Text style={styles.historyDate}>
                        {new Date(item.timestamp).toLocaleDateString('fr-FR')}
                    </Text>
                </View>
            </View>
            <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceText}>{item.result.confidence}%</Text>
                <View style={styles.confidenceBar}>
                    <View 
                        style={[
                            styles.confidenceBarFill, 
                            { width: `${item.result.confidence}%` }
                        ]} 
                    />
                </View>
            </View>
        </TouchableOpacity>
    );

    // Écran de chargement pendant le scan
    if (isScanning && selectedImage) {
        return (
            <ScreenWrapper>
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.loadingContainer}
                >
                    <View style={styles.scanningImageContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.scanningImage} />
                        <View style={styles.scanningOverlay}>
                            <View style={styles.scanningGrid} />
                            <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />
                        </View>
                    </View>
                    <View style={styles.loadingTextContainer}>
                        <Typo variant="h3" color="#fff">Analyse en cours...</Typo>
                        <Typo variant="body" color="rgba(255,255,255,0.8)" style={styles.loadingText}>
                            L'IA analyse votre image avec précision
                        </Typo>
                        <View style={styles.loadingDots}>
                            <View style={[styles.dot, { animationDelay: '0s' }]} />
                            <View style={[styles.dot, { animationDelay: '0.2s' }]} />
                            <View style={[styles.dot, { animationDelay: '0.4s' }]} />
                        </View>
                    </View>
                </LinearGradient>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <LinearGradient
                colors={['#f8fafc', '#e2e8f0']}
                style={styles.container}
            >
                <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header avec profil */}
                    <View style={styles.headerContainer}>
                        <ProfileChip
                            imageUrl={user?.image}
                            name={user?.name}
                            message={`${userScanHistory.length} scans effectués`}
                            rightIcon={
                                <TouchableOpacity 
                                    onPress={() => router.push('/notifications')}
                                    style={styles.notificationButton}
                                >
                                    <Ionicons name="notifications" size={24} color="#1e293b" />
                                    <View style={styles.notificationBadge} />
                                </TouchableOpacity>
                            }
                        />
                    </View>

                    {/* Section de scan */}
                    <View style={styles.scanSection}>
                        <View style={styles.sectionHeader}>
                            <Typo variant="h2" style={styles.sectionTitle}>Scanner une image</Typo>
                            <Typo variant="body" style={styles.sectionSubtitle}>
                                Découvrez ce qui vous entoure avec l'IA
                            </Typo>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.scanButtonContainer}
                            onPress={showScanOptions}
                            disabled={isScanning}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.scanButton}
                            >
                                <View style={styles.scanButtonContent}>
                                    {isScanning ? (
                                        <ActivityIndicator color="#fff" size="large" />
                                    ) : (
                                        <>
                                            <View style={styles.scanIconContainer}>
                                                <Ionicons name="camera" size={32} color="#fff" />
                                                <View style={styles.scanPulse} />
                                            </View>
                                            <View style={styles.scanButtonTextContainer}>
                                                <Typo variant="h3" color="#fff" style={styles.scanButtonText}>
                                                    Commencer le scan
                                                </Typo>
                                                <Typo variant="body" color="rgba(255,255,255,0.8)" style={styles.scanButtonSubtext}>
                                                    Caméra ou galerie
                                                </Typo>
                                            </View>
                                        </>
                                    )}
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Affichage du résultat de scan récent */}
                    {renderScanResult()}

                    {/* Section titre des recettes */}
                    <View style={styles.recipesSection}>
                        <View style={styles.recipesSectionHeader}>
                            <View>
                                <Typo variant="h2" style={styles.recipesTitle}>Mes Recettes</Typo>
                                <Typo variant="body" style={styles.recipesSubtitle}>
                                    {userScanHistory.length} {userScanHistory.length <= 1 ? 'recette trouvée' : 'recettes trouvées'}
                                </Typo>
                            </View>
                            {userScanHistory.length > 0 && (
                                <TouchableOpacity onPress={() => router.push('/history')}>
                                    <Typo variant="body" style={styles.viewAllText}>Voir tout</Typo>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Historique des recettes de l'utilisateur */}
                        {userScanHistory.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconContainer}>
                                    <Ionicons name="restaurant-outline" size={48} color="#cbd5e1" />
                                    <View style={styles.emptyIconBg} />
                                </View>
                                <Typo variant="h4" color="#64748b" style={styles.emptyTitle}>
                                    Aucune recette pour le moment
                                </Typo>
                                <Typo variant="body" color="#94a3b8" style={styles.emptyText}>
                                    Scannez vos premiers ingrédients pour découvrir des recettes personnalisées
                                </Typo>
                            </View>
                        ) : (
                            <View style={styles.historyContainer}>
                                {userScanHistory.map((item, index) => (
                                    <TouchableOpacity 
                                        key={item.id}
                                        style={styles.historyItem}
                                        onPress={() => router.push({
                                            pathname: '/scan-result',
                                            params: { scanId: item.id }
                                        })}
                                    >
                                        <View style={styles.historyImageContainer}>
                                            <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
                                            <View style={styles.imageOverlay}>
                                                <Ionicons name="eye" size={16} color="#fff" />
                                            </View>
                                        </View>
                                        <View style={styles.historyContent}>
                                            <Text style={styles.historyTitle}>{item.result.title}</Text>
                                            <View style={styles.categoryBadge}>
                                                <Text style={styles.historyCategory}>{item.result.category}</Text>
                                            </View>
                                            <View style={styles.dateContainer}>
                                                <Ionicons name="time" size={12} color="#8E8E93" />
                                                <Text style={styles.historyDate}>
                                                    {new Date(item.timestamp).toLocaleDateString('fr-FR')}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.confidenceContainer}>
                                            <Text style={styles.confidenceText}>{item.result.confidence}%</Text>
                                            <View style={styles.confidenceBar}>
                                                <View 
                                                    style={[
                                                        styles.confidenceBarFill, 
                                                        { width: `${item.result.confidence}%` }
                                                    ]} 
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </LinearGradient>
        </ScreenWrapper>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacingX._20,
    },
    headerContainer: {
        paddingHorizontal: spacingX._20,
        paddingTop: 10,
        marginBottom: 20,
    },
    notificationButton: {
        position: 'relative',
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    notificationBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacingX._20,
    },
    scanningImageContainer: {
        position: 'relative',
        marginBottom: 40,
    },
    scanningImage: {
        width: 220,
        height: 220,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    scanningOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanningGrid: {
        position: 'absolute',
        width: '80%',
        height: '80%',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    loadingIndicator: {
        marginVertical: 20,
    },
    loadingTextContainer: {
        alignItems: 'center',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    loadingDots: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    scanSection: {
        paddingHorizontal: spacingX._20,
        marginBottom: 30,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#1e293b',
        marginBottom: 4,
    },
    sectionSubtitle: {
        color: '#64748b',
        fontSize: 16,
    },
    scanButtonContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    scanButton: {
        paddingVertical: 28,
        paddingHorizontal: 24,
    },
    scanButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    scanIconContainer: {
        position: 'relative',
    },
    scanPulse: {
        position: 'absolute',
        top: -8,
        left: -8,
        right: -8,
        bottom: -8,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    scanButtonTextContainer: {
        alignItems: 'flex-start',
    },
    scanButtonText: {
        marginBottom: 2,
    },
    scanButtonSubtext: {
        fontSize: 14,
    },
    recipesSection: {
        paddingHorizontal: spacingX._20,
        marginTop: 20,
    },
    recipesSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    recipesTitle: {
        color: '#1e293b',
        marginBottom: 4,
    },
    recipesSubtitle: {
        color: '#64748b',
        fontSize: 14,
    },
    viewAllText: {
        color: '#667eea',
        fontWeight: '600',
    },
    historyContainer: {
        gap: 12,
    },
    historyItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.8)',
    },
    historyImageContainer: {
        position: 'relative',
        marginRight: 16,
    },
    historyImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
    },
    imageOverlay: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 8,
        padding: 4,
    },
    historyContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 6,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        marginBottom: 6,
    },
    historyCategory: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '600',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    historyDate: {
        fontSize: 12,
        color: '#8e8e93',
        fontWeight: '500',
    },
    confidenceContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 60,
    },
    confidenceText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#667eea',
        marginBottom: 4,
    },
    confidenceBar: {
        width: 40,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    confidenceBarFill: {
        height: '100%',
        backgroundColor: '#667eea',
        borderRadius: 2,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyIconContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    emptyIconBg: {
        position: 'absolute',
        top: -12,
        left: -12,
        right: -12,
        bottom: -12,
        backgroundColor: '#f8fafc',
        borderRadius: 36,
        zIndex: -1,
    },
    emptyTitle: {
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        lineHeight: 20,
    },
    resultContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: spacingX._20,
        marginBottom: 20,
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    resultImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
    resultTitle: {
        color: '#1e293b',
        marginBottom: 8,
    },
    resultCategory: {
        color: '#64748b',
        marginBottom: 4,
    },
    resultConfidence: {
        color: '#667eea',
        fontWeight: '600',
    },
});