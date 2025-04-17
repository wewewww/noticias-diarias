'use client'

import { NewsArticle } from '@/lib/api';
import { REGION_DISTRIBUTION, CATEGORY_DISTRIBUTION } from '@/lib/constants';

// Función para distribuir noticias según los porcentajes especificados
export function distributeNewsByPercentage(
  allNews: {[key: string]: (NewsArticle & { region?: string; categoryType?: string })[]},
  totalCount: number = 30 // Número total de noticias a mostrar
): (NewsArticle & { region?: string; categoryType?: string })[] {
  // Array para almacenar las noticias distribuidas
  const distributedNews: (NewsArticle & { region?: string; categoryType?: string })[] = [];
  
  // Calcular cuántas noticias mostrar por región según los porcentajes
  const regionCounts: {[key: string]: number} = {};
  Object.entries(REGION_DISTRIBUTION).forEach(([region, percentage]) => {
    regionCounts[region] = Math.round((percentage / 100) * totalCount);
  });
  
  // Para cada región, distribuir por categoría
  Object.entries(regionCounts).forEach(([region, count]) => {
    if (!allNews[region] || allNews[region].length === 0) return;
    
    // Calcular cuántas noticias mostrar por categoría para esta región
    const categoryCounts: {[key: string]: number} = {};
    Object.entries(CATEGORY_DISTRIBUTION).forEach(([category, percentage]) => {
      categoryCounts[category] = Math.round((percentage / 100) * count);
    });
    
    // Agrupar noticias de esta región por categoría
    const newsByCategory: {[key: string]: (NewsArticle & { region?: string; categoryType?: string })[]} = {};
    allNews[region].forEach(article => {
      const category = article.categoryType || 'other';
      if (!newsByCategory[category]) {
        newsByCategory[category] = [];
      }
      newsByCategory[category].push(article);
    });
    
    // Seleccionar noticias para cada categoría según los conteos calculados
    Object.entries(categoryCounts).forEach(([category, categoryCount]) => {
      if (!newsByCategory[category] || newsByCategory[category].length === 0) return;
      
      // Ordenar por fecha (más reciente primero) y tomar la cantidad necesaria
      const sortedNews = [...newsByCategory[category]].sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );
      
      // Tomar solo la cantidad necesaria para esta categoría
      const selectedNews = sortedNews.slice(0, categoryCount);
      distributedNews.push(...selectedNews);
    });
  });
  
  // Ordenar todas las noticias seleccionadas por fecha (más reciente primero)
  return distributedNews.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

// Función para filtrar noticias según regiones y categorías seleccionadas
export function filterNewsBySelection(
  allNews: {[key: string]: (NewsArticle & { region?: string; categoryType?: string })[]},
  selectedRegions: string[],
  selectedCategories: string[]
): (NewsArticle & { region?: string; categoryType?: string })[] {
  const filtered: (NewsArticle & { region?: string; categoryType?: string })[] = [];
  
  // Recorrer las regiones seleccionadas
  selectedRegions.forEach(region => {
    if (allNews[region]) {
      // Filtrar por categorías seleccionadas
      const regionNews = allNews[region].filter(article => 
        article.categoryType && selectedCategories.includes(article.categoryType)
      );
      filtered.push(...regionNews);
    }
  });

  // Ordenar por fecha de publicación (más reciente primero)
  return filtered.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
