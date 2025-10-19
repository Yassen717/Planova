import { NextResponse } from 'next/server';
import { createApiResponse } from '@/lib/api';

export async function GET() {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Planova API',
  };

  return NextResponse.json(createApiResponse(healthData));
}