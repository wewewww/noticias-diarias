// src/app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NewsApiParams, NewsResponse } from '@/lib/api';

export const dynamic = 'force-dynamic';

// Función para obtener noticias de NewsData.io a través del servidor
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la consulta
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const category = searchParams.get('category');
    const language = searchParams.get('language') || 'es';
    const q = searchParams.get('q');
    const timeframe = searchParams.get('timeframe');
    
    // Construir parámetros para la API
    const params: NewsApiParams = {
      apikey: process.env.NEWSDATA_API_KEY || 'pub_80963f68d40893354094906b3c5ac99b2d362',
      language
    };
    
    if (country) params.country = country;
    if (category) params.category = category;
    if (q) params.q = q;
    if (timeframe) params.timeframe = timeframe;
    
    // Construir URL para la API
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const url = `https://newsdata.io/api/1/news?${queryParams.toString()}`;
    
    // Realizar la solicitud a la API
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al obtener noticias: ${response.status}`);
    }
    
    const data: NewsResponse = await response.json();
    
    // Devolver los resultados
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en la API proxy:', error);
    return NextResponse.json(
      { error: 'Error al obtener noticias' },
      { status: 500 }
    );
  }
}
