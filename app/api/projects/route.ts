import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/queries/projects';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ success: false, error: 'Unable to connect to the graph database.' }, { status: 500 });
  }
}
