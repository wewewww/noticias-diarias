// src/app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NewsApiParams, NewsResponse } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Usar URL nativa en lugar de nextUrl
    const { searchParams } = new URL(request.url);

    const country = searchParams.get('country');
    const category = searchParams.get('category');
    const language = searchParams.get('language') || 'es';
    const q = searchParams.get('q');
    const timeframe = searchParams.get('timeframe');

    const params: NewsApiParams = {
      apikey: process.env.NEWSDATA_API_KEY || 'pub_80963f68d40893354094906b3c5ac99b2d362',
      language
    };

    if (country) params.country = country;
    if (category) params.category = category;
    if (q) params.q = q;
    if (timeframe) params.timeframe = timeframe;

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const url = `https://newsdata.io/api/1/news?${queryParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al obtener noticias: ${response.status}`);
    }

    const data: NewsResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en la API proxy:', error);
    return NextResponse.json(
      { error: 'Error al obtener noticias' },
      { status: 500 }
    );
  }
}
