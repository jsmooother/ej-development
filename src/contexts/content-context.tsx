"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  facts: {
    sqm: number;
    bedrooms: number;
    bathrooms: number;
  };
  heroImagePath: string;
  isPublished: boolean;
  createdAt: Date;
}

interface Editorial {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImagePath: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
}

interface InstagramCard {
  id: string;
  imageUrl: string;
  caption: string;
  isPublished: boolean;
  createdAt: Date;
}

interface ContentContextType {
  projects: Project[];
  editorials: Editorial[];
  instagramCards: InstagramCard[];
  updateProject: (project: Project) => void;
  updateEditorial: (editorial: Editorial) => void;
  deleteProject: (id: string) => void;
  deleteEditorial: (id: string) => void;
  getPublishedProjects: () => Project[];
  getPublishedEditorials: () => Editorial[];
  getPublishedInstagramCards: () => InstagramCard[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      slug: 'sierra-horizon',
      title: 'Sierra Horizon',
      summary: 'La Zagaleta · 2023',
      facts: { sqm: 420, bedrooms: 6, bathrooms: 5 },
      heroImagePath: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1400&q=80',
      isPublished: true,
      createdAt: new Date('2023-06-15'),
    },
    {
      id: '2',
      slug: 'loma-azul',
      title: 'Loma Azul',
      summary: 'Benahavís · 2022',
      facts: { sqm: 380, bedrooms: 5, bathrooms: 4 },
      heroImagePath: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
      isPublished: true,
      createdAt: new Date('2022-09-20'),
    },
    {
      id: '3',
      slug: 'casa-palma',
      title: 'Casa Palma',
      summary: 'Marbella Club · 2021',
      facts: { sqm: 320, bedrooms: 4, bathrooms: 3 },
      heroImagePath: 'https://images.unsplash.com/photo-1521783988139-8930bd045bfa?auto=format&fit=crop&w=1400&q=80',
      isPublished: false, // This one is unpublished
      createdAt: new Date('2021-05-10'),
    },
  ]);

  const [editorials, setEditorials] = useState<Editorial[]>([
    {
      id: '1',
      slug: 'marbella-market-reframed',
      title: 'Marbella Market, Reframed',
      excerpt: 'Design-led developments are resetting expectations along the Golden Mile.',
      coverImagePath: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      tags: ['Market Insight'],
      isPublished: true,
      createdAt: new Date('2025-10-01'),
    },
    {
      id: '2',
      slug: 'andalusian-light',
      title: 'Designing with Andalusian Light',
      excerpt: 'Glazing, shading, and thermal comfort principles for coastal villas.',
      coverImagePath: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      tags: ['Design Journal'],
      isPublished: true,
      createdAt: new Date('2025-09-15'),
    },
    {
      id: '3',
      slug: 'golden-mile-guide',
      title: 'Neighbourhood Guide · Golden Mile',
      excerpt: 'Our curated shortlist of dining, wellness, and cultural highlights.',
      coverImagePath: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      tags: ['Guide'],
      isPublished: false, // This one is unpublished
      createdAt: new Date('2025-08-20'),
    },
  ]);

  const [instagramCards, setInstagramCards] = useState<InstagramCard[]>([
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      caption: 'Sierra Horizon construction progress',
      isPublished: true,
      createdAt: new Date('2025-10-05'),
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      caption: 'Marbella sunset views',
      isPublished: true,
      createdAt: new Date('2025-10-03'),
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
      caption: 'Interior design details',
      isPublished: false, // This one is unpublished
      createdAt: new Date('2025-10-01'),
    },
  ]);

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const updateEditorial = (updatedEditorial: Editorial) => {
    setEditorials(prev => prev.map(e => e.id === updatedEditorial.id ? updatedEditorial : e));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const deleteEditorial = (id: string) => {
    setEditorials(prev => prev.filter(e => e.id !== id));
  };

  const getPublishedProjects = () => {
    return projects.filter(p => p.isPublished);
  };

  const getPublishedEditorials = () => {
    return editorials.filter(e => e.isPublished);
  };

  const getPublishedInstagramCards = () => {
    return instagramCards.filter(i => i.isPublished);
  };

  const value: ContentContextType = {
    projects,
    editorials,
    instagramCards,
    updateProject,
    updateEditorial,
    deleteProject,
    deleteEditorial,
    getPublishedProjects,
    getPublishedEditorials,
    getPublishedInstagramCards,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
