import { NextResponse } from 'next/server';
import { getStats } from '@/lib/queries/stats';

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ success: false, error: 'Unable to connect to the graph database.' }, { status: 500 });
  }
}
