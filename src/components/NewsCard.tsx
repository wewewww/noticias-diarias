'use client'

import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { NewsArticle } from '@/lib/api'
import { formatDate, timeAgo, truncateText } from '@/lib/utils'

interface NewsCardProps {
  article: NewsArticle & {
    region?: string;
    categoryType?: string;
  }
}

export function NewsCard({ article }: NewsCardProps) {
  const { 
    title, 
    description, 
    link, 
    image_url, 
    pubDate, 
    source_name,
    region,
    categoryType
  } = article;

  // Determinar las clases de las etiquetas según la región y categoría
  const regionClass = region ? `region-${region}` : 'region-global';
  const categoryClass = categoryType ? `category-${categoryType}` : 'category-other';

  // Traducir nombres de regiones y categorías
  const regionNames: Record<string, string> = {
    'sevilla': 'Sevilla',
    'spain': 'España',
    'portugal': 'Portugal',
    'romania': 'Rumanía',
    'global': 'Global'
  };

  const categoryNames: Record<string, string> = {
    'politics': 'Política',
    'economy': 'Economía',
    'geopolitics': 'Geopolítica',
    'other': 'Otras'
  };

  const regionName = region ? regionNames[region] : 'Global';
  const categoryName = categoryType ? categoryNames[categoryType] : 'Otras';

  return (
    <Card className="news-card overflow-hidden flex flex-col h-full">
      <CardHeader className="p-4 pb-0">
        {image_url ? (
          <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
            <Image 
              src={image_url} 
              alt={title || 'Imagen de noticia'} 
              fill 
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                // Fallback para imágenes que no cargan
                const target = e.target as HTMLImageElement;
                target.src = '/news-placeholder.jpg';
              }}
            />
          </div>
        ) : (
          <div className="relative w-full h-48 mb-4 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
        <div className="flex gap-2 mb-2">
          <span className={`region-badge ${regionClass}`}>{regionName}</span>
          <span className={`category-badge ${categoryClass}`}>{categoryName}</span>
        </div>
        <CardTitle className="text-lg font-bold line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <CardDescription className="line-clamp-3">
          {description || truncateText(article.content || '', 150)}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-gray-500">
        <div>
          <span>{source_name}</span>
        </div>
        <div>
          <span title={formatDate(pubDate)}>{timeAgo(pubDate)}</span>
        </div>
      </CardFooter>
      <a href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={title}></a>
    </Card>
  )
}
