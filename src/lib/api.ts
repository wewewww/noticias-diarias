'use client'

// Tipos para la API de noticias
export interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
  image_url: string | null;
  source_id: string;
  source_name: string;
  category: string[];
  country: string[];
  language: string;
  region?: string;
  categoryType?: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage: string | null;
}

// Parámetros para la API
export interface NewsApiParams {
  apikey?: string; // Opcional ya que se manejará en el servidor
  country?: string;
  category?: string;
  language?: string;
  q?: string;
  timeframe?: string;
}

// Función para obtener noticias a través del proxy de API local
export async function fetchNews(params: NewsApiParams): Promise<NewsResponse> {
  const queryParams = new URLSearchParams();
  
  // Añadir todos los parámetros a la consulta (excepto apikey que se maneja en el servidor)
  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== 'apikey') {
      queryParams.append(key, value);
    }
  });
  
  // Usar la ruta de API local
  const url = `/api/news?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al obtener noticias: ${response.status}`);
    }
    
    const data: NewsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    throw error;
  }
}

// Mapeo de regiones a códigos de país para la API
export const regionMapping = {
  sevilla: 'es', // Sevilla es parte de España
  spain: 'es',
  portugal: 'pt',
  romania: 'ro',
  global: '' // Para noticias globales no especificamos país
};

// Mapeo de categorías para la API
export const categoryMapping = {
  politics: 'politics',
  economy: 'business',
  geopolitics: 'politics', // Usamos politics como lo más cercano a geopolítica
  other: '' // Para otras categorías no especificamos
};

// Función para obtener noticias con distribución según los porcentajes requeridos
export async function fetchDistributedNews(
  apiKey?: string, // Ya no necesitamos la API key aquí
  language: string = 'es',
  maxDaysOld: number = 7
): Promise<{[key: string]: NewsArticle[]}> {
  // Calculamos el timeframe para noticias no más antiguas de 7 días
  const timeframe = `${maxDaysOld * 24}`;
  
  // Resultados organizados por región y categoría
  const results: {[key: string]: NewsArticle[]} = {};
  
  // Obtener noticias para cada región y categoría
  for (const [region, regionCode] of Object.entries(regionMapping)) {
    results[region] = [];
    
    for (const [category, categoryCode] of Object.entries(categoryMapping)) {
      try {
        const params: NewsApiParams = {
          language,
          timeframe
        };
        
        // Añadir país si no es global
        if (regionCode) {
          params.country = regionCode;
        }
        
        // Añadir categoría si no es "other"
        if (categoryCode) {
          params.category = categoryCode;
        }
        
        // Para Sevilla, añadimos "Sevilla" como término de búsqueda
        if (region === 'sevilla') {
          params.q = 'Sevilla';
        }
        
        const response = await fetchNews(params);
        
        if (response.results && response.results.length > 0) {
          // Añadir metadatos de región y categoría a cada artículo
          const articlesWithMetadata = response.results.map(article => ({
            ...article,
            region,
            categoryType: category
          }));
          
          results[region].push(...articlesWithMetadata);
        }
      } catch (error) {
        console.error(`Error al obtener noticias para ${region}/${category}:`, error);
      }
    }
  }
  
  return results;
}
