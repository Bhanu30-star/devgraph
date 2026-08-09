import { NextResponse } from 'next/server';
import { getProjectById } from '@/lib/queries/projects';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getProjectById(id);
    
    if (!data) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json({ success: false, error: 'Unable to connect to the graph database.' }, { status: 500 });
  }
}
