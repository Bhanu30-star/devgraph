import { NextResponse } from 'next/server';
import { getTechnologies } from '@/lib/queries/technologies';

export async function GET() {
  try {
    const technologies = await getTechnologies();
    return NextResponse.json({ success: true, data: technologies });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json({ success: false, error: 'Unable to connect to the graph database.' }, { status: 500 });
  }
}
