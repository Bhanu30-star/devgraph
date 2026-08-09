import { NextResponse } from 'next/server';
import { getDeveloperById } from '@/lib/queries/developers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getDeveloperById(id);
    
    if (!data) {
      return NextResponse.json({ success: false, error: 'Developer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching developer details:', error);
    return NextResponse.json({ success: false, error: 'Unable to connect to the graph database.' }, { status: 500 });
  }
}
