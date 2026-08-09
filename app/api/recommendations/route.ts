import { NextResponse } from 'next/server';
import { getDeveloperRecommendations } from '@/lib/queries/developers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const technology = searchParams.get('technology');
    
    if (!technology) {
      return NextResponse.json({ success: false, error: 'Technology parameter is required' }, { status: 400 });
    }
    
    const recommendations = await getDeveloperRecommendations(technology);
    return NextResponse.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ success: false, error: 'Unable to connect to the graph database.' }, { status: 500 });
  }
}
