"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { InlineToggle } from "@/components/admin/inline-toggle";

export default function EditorialsListPage() {
  const [posts, setPosts] = useState([
    {
      id: '1',
      slug: 'marbella-market-reframed',
      title: 'Marbella Market, Reframed',
      excerpt: 'Design-led developments are resetting expectations along the Golden Mile.',
      tags: ['Market Insight'],
      coverImagePath: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      createdAt: new Date('2025-10-01'),
    },
    {
      id: '2',
      slug: 'andalusian-light',
      title: 'Designing with Andalusian Light',
      excerpt: 'Glazing, shading, and thermal comfort principles for coastal villas.',
      tags: ['Design Journal'],
      coverImagePath: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      createdAt: new Date('2025-09-15'),
    },
    {
      id: '3',
      slug: 'golden-mile-guide',
      title: 'Neighbourhood Guide · Golden Mile',
      excerpt: 'Our curated shortlist of dining, wellness, and cultural highlights.',
      tags: ['Guide'],
      coverImagePath: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      createdAt: new Date('2025-08-20'),
    },
  ]);

  const handleTogglePublish = async (postId: string, newStatus: boolean) => {
    // TODO: Replace with actual API call
    console.log(`Toggling post ${postId} to ${newStatus ? 'published' : 'draft'}`);
    
    // Update local state
    setPosts(prev => 
      prev.map(p => p.id === postId ? { ...p, isPublished: newStatus } : p)
    );
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <div>
      <AdminHeader 
        title="Editorials" 
        description={`Manage your editorial content (${posts.length} total)`}
        action={{
          label: "New Editorial",
          href: "/admin/editorials/new"
        }}
      />

      <div className="p-8">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <svg className="h-10 w-10 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="mt-6 font-sans text-2xl font-normal tracking-tight text-foreground">No editorials yet</h3>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Start writing your first editorial article to share insights and stories.
              </p>
              <Link
                href="/admin/editorials/new"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Write Your First Editorial
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/editorials/${post.id}`}
                className="group block overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-border hover:shadow-lg"
              >
                <div className="flex items-center gap-6 p-6">
                  {/* Cover Image */}
                  <div className="flex h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                    {post.coverImagePath ? (
                      <img 
                        src={post.coverImagePath} 
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg className="h-10 w-10 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Post Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-sans text-2xl font-normal tracking-tight text-foreground transition-colors group-hover:text-foreground">
                          {post.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground/60">{post.excerpt}</p>
                      </div>
                      <div className="ml-4 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <InlineToggle
                            id={post.id}
                            initialChecked={post.isPublished}
                            onToggle={(checked) => handleTogglePublish(post.id, checked)}
                          />
                          <span className={`text-[10px] font-medium uppercase tracking-wide ${
                            post.isPublished 
                              ? "text-green-700" 
                              : "text-muted-foreground/60"
                          }`}>
                            {post.isPublished ? "Live" : "Draft"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Post Meta */}
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-foreground/5 px-2.5 py-1 text-[10px] font-medium text-foreground/60">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Created {new Date(post.createdAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-muted-foreground/40 transition-all group-hover:translate-x-1 group-hover:text-foreground">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

