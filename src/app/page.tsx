'use client'

import React, { useState, useEffect } from 'react'
import { NewsCard } from '@/components/NewsCard'
import { fetchDistributedNews, NewsArticle } from '@/lib/api'
import { distributeNewsByPercentage, filterNewsBySelection } from '@/lib/newsDistribution'
import { REGION_DISTRIBUTION, CATEGORY_DISTRIBUTION, REGION_NAMES, CATEGORY_NAMES } from '@/lib/constants'

// Componente para filtros de región
interface RegionFilterProps {
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
}

function RegionFilter({ selectedRegions, onToggleRegion }: RegionFilterProps) {
  const regions = Object.entries(REGION_DISTRIBUTION).map(([id, percentage]) => ({
    id,
    name: REGION_NAMES[id as keyof typeof REGION_NAMES],
    percentage: `${percentage}%`
  }));

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {regions.map((region) => (
        <button
          key={region.id}
          onClick={() => onToggleRegion(region.id)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedRegions.includes(region.id)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {region.name} ({region.percentage})
        </button>
      ))}
    </div>
  );
}

// Componente para filtros de categoría
interface CategoryFilterProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

function CategoryFilter({ selectedCategories, onToggleCategory }: CategoryFilterProps) {
  const categories = Object.entries(CATEGORY_DISTRIBUTION).map(([id, percentage]) => ({
    id,
    name: CATEGORY_NAMES[id as keyof typeof CATEGORY_NAMES],
    percentage: `${percentage}%`
  }));

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onToggleCategory(category.id)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategories.includes(category.id)
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name} ({category.percentage})
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  // Estado para almacenar noticias
  const [newsData, setNewsData] = useState<{[key: string]: (NewsArticle & { region?: string; categoryType?: string; })[]}>({});
  const [filteredNews, setFilteredNews] = useState<(NewsArticle & { region?: string; categoryType?: string; })[]>([]);
  const [distributedNews, setDistributedNews] = useState<(NewsArticle & { region?: string; categoryType?: string; })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useDistribution, setUseDistribution] = useState(true);
  
  // Estado para filtros
  const [selectedRegions, setSelectedRegions] = useState<string[]>(Object.keys(REGION_DISTRIBUTION));
  const [selectedCategories, setSelectedCategories] = useState<string[]>(Object.keys(CATEGORY_DISTRIBUTION));

  // Cargar noticias al iniciar
  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const data = await fetchDistributedNews();
        setNewsData(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las noticias. Por favor, intente de nuevo más tarde.');
        setLoading(false);
        console.error(err);
      }
    }

    loadNews();
  }, []);

  // Aplicar distribución y filtrado cuando cambian los datos o filtros
  useEffect(() => {
    if (Object.keys(newsData).length === 0) return;

    // Aplicar distribución según porcentajes
    const distributed = distributeNewsByPercentage(newsData);
    setDistributedNews(distributed);
    
    // Aplicar filtrado según selecciones
    const filtered = filterNewsBySelection(newsData, selectedRegions, selectedCategories);
    setFilteredNews(filtered);
  }, [newsData, selectedRegions, selectedCategories]);

  // Manejar cambios en filtros de región
  const handleToggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region) 
        : [...prev, region]
    );
  };

  // Manejar cambios en filtros de categoría
  const handleToggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Alternar entre vista distribuida y filtrada
  const toggleDistributionMode = () => {
    setUseDistribution(prev => !prev);
  };

  // Determinar qué noticias mostrar
  const newsToDisplay = useDistribution ? distributedNews : filteredNews;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Informe Diario de Noticias</h1>
        <p className="text-gray-600 text-center mb-6">
          Resumen de noticias actualizado para ejecutivos
        </p>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filtros</h2>
            <button 
              onClick={toggleDistributionMode}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {useDistribution ? 'Modo: Distribución' : 'Modo: Filtrado'}
            </button>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Regiones:</h3>
            <RegionFilter 
              selectedRegions={selectedRegions} 
              onToggleRegion={handleToggleRegion} 
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categorías:</h3>
            <CategoryFilter 
              selectedCategories={selectedCategories} 
              onToggleCategory={handleToggleCategory} 
            />
          </div>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : newsToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">No se encontraron noticias</h3>
            <p className="text-gray-500 mt-2">Intente seleccionar diferentes filtros o vuelva más tarde.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Noticias Destacadas</h2>
              <div className="text-sm text-gray-600">
                Mostrando {newsToDisplay.length} noticias en modo {useDistribution ? 'distribución' : 'filtrado'}
              </div>
            </div>
            <div className="news-grid">
              {newsToDisplay.map((article) => (
                <NewsCard key={article.article_id} article={article} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Informe Diario de Noticias</p>
        <p className="text-sm mt-1">Actualizado diariamente con las noticias más relevantes</p>
      </footer>
    </div>
  );
}
