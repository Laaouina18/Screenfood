// services/openRouterService.ts

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
  difficulty?: string;
}

export interface NutritionalInfo {
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
  vitamins?: string[];
}

export interface AnalysisResult {
  ingredients: string[];
  recipes: Recipe[];
  nutritionalInfo?: NutritionalInfo;
}

interface OpenRouterConfig {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export default class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private config: OpenRouterConfig;
  private cache = new Map<string, any>();

  constructor(apiKey: string, config: OpenRouterConfig = {}) {
    this.apiKey = apiKey;
    this.config = {
      model: config.model || 'deepseek/deepseek-chat-v3-0324:free', // 🔄 modèle à jour
      maxTokens: config.maxTokens || 800,
      temperature: config.temperature || 0.7,
    };
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const cacheKey = JSON.stringify({ endpoint, data });

    if (this.cache.has(cacheKey)) {
      console.log('Réponse depuis le cache');
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'com.foodscanner.app',
          'X-Title': 'Food Scanner App',
        },
        body: JSON.stringify({
          ...data,
          model: this.config.model,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        console.error('Erreur API OpenRouter:', response.status, text);
        if (response.status === 429) throw new Error('Limite de requêtes atteinte (429)');
        if (response.status === 401) throw new Error('Clé API invalide ou expirée');
        if (response.status === 403) throw new Error('Accès refusé. Vérifie ta clé API.');
        if (response.status === 404) throw new Error('Modèle ou endpoint introuvable (404)');
        throw new Error(`Erreur API: ${response.status} - ${text}`);
      }

      const json = JSON.parse(text);
      this.cache.set(cacheKey, json);
      if (this.cache.size > 50) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      return json;
    } catch (error) {
      console.error('Erreur requête OpenRouter:', error);
      throw error;
    }
  }

  async analyzeFood(description: string): Promise<AnalysisResult> {
    const prompt = `Analyse: ${description}

Réponds en JSON strict :
{
  "ingredients": ["ingrédient1", "ingrédient2"],
  "recipes": [
    {
      "name": "Nom recette",
      "ingredients": ["ingrédient1", "ingrédient2"],
      "instructions": ["étape1", "étape2"],
      "cookingTime": "15 min"
    }
  ],
  "nutritionalInfo": {
    "calories": 200,
    "proteins": 10,
    "carbs": 30,
    "fats": 5
  }
}`;

    const response = await this.makeRequest('/chat/completions', {
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert culinaire. Réponds uniquement en JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content?.trim() ?? '';

    try {
      const match = content.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : JSON.parse(content);

      return {
        ingredients: parsed.ingredients?.slice(0, 5) || ['Ingrédient détecté'],
        recipes: (parsed.recipes || []).slice(0, 2).map((r: any) => ({
          name: r.name || 'Recette suggérée',
          ingredients: r.ingredients || [],
          instructions: r.instructions || [],
          cookingTime: r.cookingTime || '15 min',
          difficulty: r.difficulty || 'Facile',
        })),
        nutritionalInfo: parsed.nutritionalInfo || {
          calories: 150,
          proteins: 5,
          carbs: 20,
          fats: 3,
        },
      };
    } catch (e) {
      console.error('Erreur parsing JSON:', e, 'Contenu brut:', content);
      return {
        ingredients: ['Ingrédient détecté'],
        recipes: [{
          name: 'Recette simple',
          ingredients: ['Ingrédient inconnu'],
          instructions: ['Préparer selon les goûts'],
          cookingTime: '15 min',
          difficulty: 'Facile',
        }],
        nutritionalInfo: {
          calories: 150,
          proteins: 5,
          carbs: 20,
          fats: 3,
        },
      };
    }
  }

  async getRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
    const prompt = `Créer 2 recettes avec: ${ingredients.slice(0, 3).join(', ')}

Réponds en JSON:
{
  "recipes": [
    {
      "name": "Nom recette",
      "ingredients": ["ing1", "ing2"],
      "instructions": ["étape1", "étape2"],
      "cookingTime": "20 min"
    }
  ]
}`;

    const response = await this.makeRequest('/chat/completions', {
      messages: [
        { role: 'system', content: 'Tu es un assistant culinaire. Réponds en JSON uniquement.' },
        { role: 'user', content: prompt },
      ],
    });

    const content = response.choices?.[0]?.message?.content?.trim() ?? '';

    try {
      const parsed = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] ?? content);
      return parsed.recipes || [];
    } catch (e) {
      console.error('Erreur parsing recettes:', e);
      return [];
    }
  }

  async getNutritionalInfo(food: string): Promise<NutritionalInfo> {
    const prompt = `Infos nutritionnelles pour 100g de ${food}:

Réponds en JSON:
{
  "calories": 100,
  "proteins": 8,
  "carbs": 15,
  "fats": 2,
  "fiber": 3,
  "vitamins": ["A", "C", "D"]
}`;

    const response = await this.makeRequest('/chat/completions', {
      messages: [
        { role: 'system', content: 'Tu es un nutritionniste. Réponds uniquement en JSON.' },
        { role: 'user', content: prompt },
      ],
    });

    const content = response.choices?.[0]?.message?.content?.trim() ?? '';

    try {
      return JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] ?? content);
    } catch (e) {
      console.error('Erreur parsing nutrition:', e);
      return {
        calories: 100,
        proteins: 5,
        carbs: 15,
        fats: 3,
        fiber: 2,
        vitamins: ['Vitamines diverses'],
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/chat/completions', {
        messages: [{ role: 'user', content: 'Dis juste OK' }],
      });

      const message = response.choices?.[0]?.message?.content ?? '';
      return message.toLowerCase().includes('ok');
    } catch {
      return false;
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  async checkQuota(): Promise<{ remaining?: number; limit?: number; resetTime?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/key`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) return {};

      const data = await response.json();
      return {
        remaining: data.usage?.remaining,
        limit: data.usage?.limit,
        resetTime: data.usage?.reset_time,
      };
    } catch (error) {
      console.error('Erreur quota:', error);
      return {};
    }
  }
}
