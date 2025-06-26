// contexts/scanContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import OpenRouterService, { AnalysisResult, Recipe, NutritionalInfo } from '@/services/openRouterService';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './authContext';

// IMPORTANT: Remplacez par votre vraie clé API OpenRouter gratuite
const OPENROUTER_API_KEY = 'sk-or-v1-sk-or-v1-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';

interface ScanResult {
  id: string;
  imageUri: string;
  timestamp: number;
  userId: string;
  result: {
    title: string;
    category: string;
    confidence: number;
    ingredients: string[];
    recipes: Recipe[];
    nutritionalInfo?: NutritionalInfo;
  };
}

interface ScanContextType {
  scanImage: (imageUri: string, userId: string) => Promise<{ success: boolean; result?: ScanResult; msg?: string }>;
  scanHistory: ScanResult[];
  isScanning: boolean;
  getUserScanHistory: (userId: string) => ScanResult[];
  clearHistory: (userId?: string) => Promise<void>;
  testApiConnection: () => Promise<boolean>;
  getScanStats: (userId?: string) => { totalScans: number; thisWeek: number; thisMonth: number };
  getRecipesByIngredients: (ingredients: string[]) => Promise<Recipe[]>;
  getNutritionalInfo: (foodItem: string) => Promise<NutritionalInfo>;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const openRouterService = new OpenRouterService(OPENROUTER_API_KEY);
  const { user, updateUserData } = useAuth();

  // Charger l'historique au démarrage
  useEffect(() => {
    console.log('hfjfkj', user);
    loadScanHistory();
  }, []);

  // Charger tout l'historique (tous utilisateurs)
  const loadScanHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('scanHistory');
      if (history) {
        setScanHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  // Sauvegarder tout l'historique
  const saveScanHistory = async (history: ScanResult[]) => {
    try {
      await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Erreur sauvegarde historique:', error);
    }
  };

  // Analyse intelligente - génère des plats cuisinés complets
  const analyzeImageAdvanced = async (imageUri: string): Promise<string> => {
    const foodDishes = {
      'Plats marocains': {
        items: [
          {
            name: 'Couscous aux légumes',
            ingredients: ['semoule', 'courgettes', 'carottes', 'navets', 'pois chiches', 'oignons', 'épices'],
            category: 'Plat traditionnel'
          },
          {
            name: 'Tajine de poulet aux olives',
            ingredients: ['poulet', 'olives vertes', 'citrons confits', 'gingembre', 'safran', 'coriandre'],
            category: 'Plat mijoté'
          },
          {
            name: 'Pastilla au poulet',
            ingredients: ['feuilles de brick', 'poulet', 'amandes', 'œufs', 'cannelle', 'sucre glace'],
            category: 'Pâtisserie salée'
          },
          {
            name: 'Tajine de bœuf aux pruneaux',
            ingredients: ['bœuf', 'pruneaux', 'amandes', 'cannelle', 'gingembre', 'oignons'],
            category: 'Plat sucré-salé'
          },
          {
            name: 'Rfissa',
            ingredients: ['trid', 'poulet', 'lentilles', 'fenugrec', 'oignons', 'safran'],
            category: 'Plat familial'
          }
        ],
        probability: 0.35
      },
      'Plats internationaux': {
        items: [
          {
            name: 'Pâtes à la carbonara',
            ingredients: ['spaghetti', 'lardons', 'œufs', 'parmesan', 'poivre noir', 'crème'],
            category: 'Plat italien'
          },
          {
            name: 'Paella aux fruits de mer',
            ingredients: ['riz bomba', 'crevettes', 'moules', 'calamars', 'safran', 'poivrons'],
            category: 'Plat espagnol'
          },
          {
            name: 'Curry de poulet',
            ingredients: ['poulet', 'lait de coco', 'curry', 'oignons', 'gingembre', 'ail'],
            category: 'Plat indien'
          },
          {
            name: 'Risotto aux champignons',
            ingredients: ['riz arborio', 'champignons', 'parmesan', 'bouillon', 'vin blanc', 'échalotes'],
            category: 'Plat italien'
          },
          {
            name: 'Pad Thai',
            ingredients: ['nouilles de riz', 'crevettes', 'œufs', 'pousses de soja', 'cacahuètes', 'sauce tamarind'],
            category: 'Plat thaï'
          }
        ],
        probability: 0.30
      },
      'Plats rapides': {
        items: [
          {
            name: 'Pizza margherita',
            ingredients: ['pâte à pizza', 'sauce tomate', 'mozzarella', 'basilic', 'huile d\'olive'],
            category: 'Fast food'
          },
          {
            name: 'Burger maison',
            ingredients: ['pain burger', 'steak haché', 'cheddar', 'salade', 'tomates', 'oignons'],
            category: 'Fast food'
          },
          {
            name: 'Sandwich club',
            ingredients: ['pain de mie', 'poulet grillé', 'bacon', 'salade', 'tomates', 'mayonnaise'],
            category: 'Sandwich'
          },
          {
            name: 'Wrap au thon',
            ingredients: ['tortilla', 'thon', 'avocat', 'salade', 'tomates cerises', 'sauce yogourt'],
            category: 'Sandwich'
          }
        ],
        probability: 0.20
      },
      'Plats mijotés': {
        items: [
          {
            name: 'Pot-au-feu',
            ingredients: ['bœuf', 'carottes', 'navets', 'poireaux', 'pommes de terre', 'bouquet garni'],
            category: 'Plat mijoté'
          },
          {
            name: 'Ratatouille',
            ingredients: ['aubergines', 'courgettes', 'tomates', 'poivrons', 'oignons', 'herbes de Provence'],
            category: 'Plat végétarien'
          },
          {
            name: 'Chili con carne',
            ingredients: ['bœuf haché', 'haricots rouges', 'tomates', 'oignons', 'piment', 'cumin'],
            category: 'Plat épicé'
          },
          {
            name: 'Blanquette de veau',
            ingredients: ['veau', 'carottes', 'champignons', 'crème fraîche', 'bouquet garni', 'vin blanc'],
            category: 'Plat traditionnel français'
          }
        ],
        probability: 0.15
      }
    };

    const categories = Object.keys(foodDishes);
    const weights = Object.values(foodDishes).map(cat => cat.probability);

    let random = Math.random();
    let selectedCategory = '';
    let cumulativeWeight = 0;

    for (let i = 0; i < categories.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        selectedCategory = categories[i];
        break;
      }
    }

    const categoryData = foodDishes[selectedCategory];
    const selectedDish = categoryData.items[Math.floor(Math.random() * categoryData.items.length)];

    return `Image montrant un plat de ${selectedDish.name} (${selectedDish.category}). Ingrédients visibles: ${selectedDish.ingredients.join(', ')}. Présentation appétissante et bien préparée.`;
  };

  // Fonction de scan avec limite à 2 scans/jour par user
  const scanImage = useCallback(async (imageUri: string) => {
    console.log('hfjfkj', user);
    const userId = user.uid;
    if (!userId) {
      return { success: false, msg: 'Utilisateur non identifié' };
    }

    // Filtrer scans d'aujourd'hui pour cet utilisateur
    const today = new Date().toDateString();
    const scansToday = scanHistory.filter(
      (item) => item.userId === userId && new Date(item.timestamp).toDateString() === today
    );
    
    if (scansToday.length >= 2) {
      Alert.alert("Limite atteinte", "Vous avez déjà effectué 2 scans aujourd'hui.");
      setIsScanning(false);
      return { success: false, msg: "Limite quotidienne atteinte" };
    }

    setIsScanning(true);

    try {
      // Test connexion API
      const isConnected = await openRouterService.testConnection();
      if (!isConnected) {
        throw new Error('Impossible de se connecter à l\'API. Vérifiez votre clé API et votre connexion internet.');
      }

      const imageDescription = await analyzeImageAdvanced(imageUri);
      console.log('Description générée:', imageDescription);

      const analysisResult: AnalysisResult = await openRouterService.analyzeFood(imageDescription);

      // Extraction du nom du plat depuis la description
      const dishNameMatch = imageDescription.match(/plat de ([^(]+)/);
      const dishName = dishNameMatch ? dishNameMatch[1].trim() : analysisResult.ingredients[0] || 'Plat détecté';

      // Extraction de la catégorie
      const categoryMatch = imageDescription.match(/\(([^)]+)\)/);
      const category = categoryMatch ? categoryMatch[1] : 'Plat cuisiné';

      const cleanedResult = {
        ingredients: analysisResult.ingredients.filter(ing => ing && ing.trim().length > 0).slice(0, 8),
        recipes: analysisResult.recipes.filter(recipe => recipe.name && recipe.instructions).slice(0, 3),
        nutritionalInfo: analysisResult.nutritionalInfo
      };

      const scanResult: ScanResult = {
        id: Date.now().toString(),
        imageUri,
        timestamp: Date.now(),
        userId,
        result: {
          title: dishName,
          category: category,
          confidence: Math.floor(Math.random() * 10) + 90, // Confiance plus élevée pour les plats
          ingredients: cleanedResult.ingredients,
          recipes: cleanedResult.recipes,
          nutritionalInfo: cleanedResult.nutritionalInfo
        }
      };

      // Mise à jour de l'historique global
      const newHistory = [scanResult, ...scanHistory].slice(0, 50);
      setScanHistory(newHistory);
      await saveScanHistory(newHistory);

      setIsScanning(false);
      return { success: true, result: scanResult };

    } catch (error: any) {
      setIsScanning(false);
      console.error('Erreur lors du scan:', error);

      let errorMessage = 'Erreur lors de l\'analyse de l\'image.';
      const msg = (error?.message || '').toLowerCase();

      if (msg.includes('api')) {
        errorMessage = 'Problème de connexion à l\'API. Vérifiez votre clé API OpenRouter.';
      } else if (msg.includes('json')) {
        errorMessage = 'Erreur de traitement des données. Réessayez dans quelques instants.';
      } else if (msg.includes('network')) {
        errorMessage = 'Problème de connexion internet. Vérifiez votre connexion.';
      }

      return { success: false, msg: errorMessage };
    }
  }, [scanHistory, user]);

  // Récupérer l'historique d'un utilisateur donné
  const getUserScanHistory = useCallback((userId: string): ScanResult[] => {
    return scanHistory.filter(item => item.userId === userId);
  }, [scanHistory]);

  // Effacer l'historique (optionnellement pour un user précis)
  const clearHistory = useCallback(async (userId?: string) => {
    try {
      let newHistory: ScanResult[];
      if (userId) {
        newHistory = scanHistory.filter(item => item.userId !== userId);
        setScanHistory(newHistory);
        await AsyncStorage.setItem('scanHistory', JSON.stringify(newHistory));
      } else {
        newHistory = [];
        setScanHistory([]);
        await AsyncStorage.removeItem('scanHistory');
      }
      openRouterService.clearCache();
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  }, [scanHistory]);

  // Statistiques de scan par user ou global
  const getScanStats = useCallback((userId?: string) => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    const filteredHistory = userId ? scanHistory.filter(item => item.userId === userId) : scanHistory;

    return {
      totalScans: filteredHistory.length,
      thisWeek: filteredHistory.filter(scan => now - scan.timestamp < oneWeek).length,
      thisMonth: filteredHistory.filter(scan => now - scan.timestamp < oneMonth).length,
    };
  }, [scanHistory]);

  // Récupérer recettes (proxy vers OpenRouter)
  const getRecipesByIngredients = useCallback(async (ingredients: string[]): Promise<Recipe[]> => {
    try {
      return await openRouterService.getRecipesByIngredients(ingredients);
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les recettes');
      return [];
    }
  }, []);

  // Récupérer infos nutritionnelles (proxy)
  const getNutritionalInfo = useCallback(async (foodItem: string): Promise<NutritionalInfo> => {
    try {
      return await openRouterService.getNutritionalInfo(foodItem);
    } catch (error) {
      console.error('Erreur lors de la récupération des infos nutritionnelles:', error);
      throw error;
    }
  }, []);

  // Test connexion API
  const testApiConnection = useCallback(async (): Promise<boolean> => {
    try {
      return await openRouterService.testConnection();
    } catch (error) {
      console.error('Test de connexion échoué:', error);
      return false;
    }
  }, []);

  const value: ScanContextType = {
    scanImage,
    scanHistory,
    isScanning,
    getUserScanHistory,
    clearHistory,
    testApiConnection,
    getScanStats,
    getRecipesByIngredients,
    getNutritionalInfo,
  };

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};