import { NextResponse } from 'next/server';
import { getDevelopers } from '@/lib/queries/developers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;
    
    const developers = await getDevelopers(q);
    return NextResponse.json({ success: true, data: developers });
  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json({ success: false, error: 'Unable to connect to the graph database.' }, { status: 500 });
  }
}
