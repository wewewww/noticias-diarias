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

export interface NewsApiParams {
  apikey?: string;
  country?: string;
  category?: string;
  language?: string;
  q?: string;
  timeframe?: string;
}

export async function fetchNews(params: NewsApiParams): Promise<NewsResponse> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== 'apikey') {
      queryParams.append(key, value);
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-noticias-ochre.vercel.app/api/news';
  const url = `${baseUrl}?${queryParams.toString()}`;

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

export const regionMapping = {
  sevilla: 'es',
  spain: 'es',
  portugal: 'pt',
  romania: 'ro',
  global: ''
};

export const categoryMapping = {
  politics: 'politics',
  economy: 'business',
  geopolitics: 'politics',
  other: ''
};

export async function fetchDistributedNews(
  apiKey?: string,
  language: string = 'es',
  maxDaysOld: number = 7
): Promise<{[key: string]: NewsArticle[]}> {
  const timeframe = `${maxDaysOld * 24}`;
  const results: {[key: string]: NewsArticle[]} = {};

  for (const [region, regionCode] of Object.entries(regionMapping)) {
    results[region] = [];

    for (const [category, categoryCode] of Object.entries(categoryMapping)) {
      try {
        const params: NewsApiParams = {
          language,
          timeframe
        };

        if (regionCode) {
          params.country = regionCode;
        }

        if (categoryCode) {
          params.category = categoryCode;
        }

        if (region === 'sevilla') {
          params.q = 'Sevilla';
        }

        const response = await fetchNews(params);

        if (response.results && response.results.length > 0) {
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
