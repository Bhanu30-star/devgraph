import { NextResponse } from 'next/server';
import { getTechnologyById } from '@/lib/queries/technologies';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getTechnologyById(id);
    
    if (!data) {
      return NextResponse.json({ success: false, error: 'Technology not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching technology details:', error);
    return NextResponse.json({ success: false, error: 'Unable to connect to the graph database.' }, { status: 500 });
  }
}
