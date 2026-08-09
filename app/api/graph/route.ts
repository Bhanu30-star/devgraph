import { NextResponse } from 'next/server';
import { getGraphData } from '@/lib/queries/graph';

export async function GET() {
  try {
    const data = await getGraphData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return NextResponse.json({ success: false, error: 'Unable to connect to the graph database.' }, { status: 500 });
  }
}
