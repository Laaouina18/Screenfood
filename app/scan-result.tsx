import { View, StyleSheet, ActivityIndicator, Alert, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Typo from '@/components/Typo';
import { useScan } from '@/contexts/scanContext';
import { Image } from 'expo-image';
import { colors, spacingX } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ScanResult = () => {
  const { scanId } = useLocalSearchParams();
  const { scanHistory } = useScan();
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('ingredients');
  const router = useRouter();

  useEffect(() => {
    if (!scanId) return;

    const found = scanHistory.find(item => item.id === scanId);
    if (found) {
      setResult(found);
    } else {
      Alert.alert('Erreur', 'Aucun résultat trouvé pour cet ID');
      router.back();
    }
  }, [scanId]);

  if (!result) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Typo style={styles.loadingText}>Chargement des résultats...</Typo>
        </View>
      </View>
    );
  }

  const { imageUri, timestamp, result: data } = result;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#10B981'; // Vert
    if (confidence >= 60) return '#F59E0B'; // Orange
    return '#EF4444'; // Rouge
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return 'checkmark-circle';
    if (confidence >= 60) return 'warning';
    return 'alert-circle';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ingredients':
        return (
          <View style={styles.tabContent}>
            <View style={styles.ingredientsGrid}>
              {data.ingredients.map((ingredient: string, index: number) => (
                <View key={index} style={styles.ingredientChip}>
                  <Ionicons name="leaf" size={16} color="#10B981" />
                  <Typo style={styles.ingredientText}>{ingredient}</Typo>
                </View>
              ))}
            </View>
          </View>
        );
      
      case 'recipes':
        return (
          <View style={styles.tabContent}>
            {data.recipes.map((recipe: any, index: number) => (
              <View key={index} style={styles.modernRecipeCard}>
                <View style={styles.recipeHeader}>
                  <View style={styles.recipeIconContainer}>
                    <Ionicons name="restaurant" size={24} color="#6366F1" />
                  </View>
                  <View style={styles.recipeHeaderText}>
                    <Typo style={styles.modernRecipeTitle}>{recipe.name}</Typo>
                    <Typo style={styles.recipeSubtitle}>
                      {recipe.ingredients?.length || 0} ingrédients
                    </Typo>
                  </View>
                </View>
                
                <View style={styles.recipeSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="list" size={18} color="#6366F1" />
                    <Typo style={styles.sectionTitle}>Ingrédients</Typo>
                  </View>
                  <Typo style={styles.recipeContent}>{recipe.ingredients?.join(', ')}</Typo>
                </View>
                
                <View style={styles.recipeSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="document-text" size={18} color="#6366F1" />
                    <Typo style={styles.sectionTitle}>Instructions</Typo>
                  </View>
                  <Typo style={styles.recipeContent}>{recipe.instructions}</Typo>
                </View>
              </View>
            ))}
          </View>
        );
      
      case 'nutrition':
        return (
          <View style={styles.tabContent}>
            {data.nutritionalInfo ? (
              <View style={styles.nutritionGrid}>
                {Object.entries(data.nutritionalInfo).map(([key, value]) => (
                  <View key={key} style={styles.nutritionCard}>
                    <View style={styles.nutritionIconContainer}>
                      <Ionicons 
                        name={getNutritionIcon(key)} 
                        size={24} 
                        color="#F59E0B" 
                      />
                    </View>
                    <Typo style={styles.nutritionLabel}>{key}</Typo>
                    <Typo style={styles.nutritionValue}>{value}</Typo>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="nutrition" size={48} color="#9CA3AF" />
                <Typo style={styles.emptyText}>Aucune information nutritionnelle disponible</Typo>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  const getNutritionIcon = (key: string) => {
    const iconMap: { [key: string]: string } = {
      'Calories': 'flame',
      'Protéines': 'fitness',
      'Glucides': 'leaf',
      'Lipides': 'water',
      'Fibres': 'cellular',
      'Sucres': 'diamond',
    };
    return iconMap[key] || 'nutrition';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Header */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.imageOverlay}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Header Info */}
        <View style={styles.headerCard}>
          <View style={styles.titleRow}>
            <Typo style={styles.mainTitle}>{data.title}</Typo>
            <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(data.confidence) + '20' }]}>
              <Ionicons 
                name={getConfidenceIcon(data.confidence)} 
                size={16} 
                color={getConfidenceColor(data.confidence)} 
              />
              <Typo style={[styles.confidenceText, { color: getConfidenceColor(data.confidence) }]}>
                {data.confidence}%
              </Typo>
            </View>
          </View>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag" size={16} color="#6366F1" />
              <Typo style={styles.metaText}>{data.category}</Typo>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color="#6366F1" />
              <Typo style={styles.metaText}>
                {new Date(timestamp).toLocaleString('fr-FR')}
              </Typo>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Ionicons 
              name="leaf" 
              size={20} 
              color={activeTab === 'ingredients' ? '#6366F1' : '#9CA3AF'} 
            />
            <Typo style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
              Ingrédients
            </Typo>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
            onPress={() => setActiveTab('recipes')}
          >
            <Ionicons 
              name="restaurant" 
              size={20} 
              color={activeTab === 'recipes' ? '#6366F1' : '#9CA3AF'} 
            />
            <Typo style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
              Recettes
            </Typo>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
            onPress={() => setActiveTab('nutrition')}
          >
            <Ionicons 
              name="nutrition" 
              size={20} 
              color={activeTab === 'nutrition' ? '#6366F1' : '#9CA3AF'} 
            />
            <Typo style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>
              Nutrition
            </Typo>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </View>
    </ScrollView>
  );
};

export default ScanResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  imageOverlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacingX._20,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaInfo: {
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#64748B',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#F1F5F9',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 40,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  modernRecipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  recipeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeHeaderText: {
    flex: 1,
  },
  modernRecipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  recipeSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  recipeSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  recipeContent: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: (width - 64) / 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  nutritionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    textAlign: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
  },
});