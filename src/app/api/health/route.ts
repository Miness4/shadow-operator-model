import { NextResponse } from 'next/server';

/**
 * Health check endpoint
 * Used for monitoring and deployment verification
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    environment: process.env.NODE_ENV,
  });
}
