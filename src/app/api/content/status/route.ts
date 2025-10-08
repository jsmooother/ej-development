import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, this would be stored in the database
let contentStatus = {
  projects: {
    'sierra-horizon': true,  // Sierra Horizon - published
    'loma-azul': true,       // Loma Azul - published  
    'casa-palma': true,      // Casa Palma - published
  },
  editorials: {
    'marbella-market-reframed': true,    // Marbella Market, Reframed - published
    'andalusian-light': true,            // Designing with Andalusian Light - published
    'golden-mile-guide': true,           // Neighbourhood Guide - published
  }
};

export async function GET() {
  return NextResponse.json(contentStatus);
}

export async function POST(request: NextRequest) {
  try {
    const { type, id, isPublished } = await request.json();
    
    if (type === 'project' || type === 'editorial') {
      contentStatus[type === 'project' ? 'projects' : 'editorials'][id] = isPublished;
      console.log(`Updated ${type} ${id} to ${isPublished ? 'published' : 'draft'}`);
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error updating content status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
