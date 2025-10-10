"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { InlineToggle } from "@/components/admin/inline-toggle";

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/listings');
        if (response.ok) {
          const data = await response.json();
          setListings(data);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleTogglePublish = async (listingId: string, newStatus: boolean) => {
    console.log(`Toggling listing ${listingId} to ${newStatus ? 'published' : 'draft'}`);
    
    // Update local state
    setListings(prev => 
      prev.map(listing => listing.id === listingId ? { ...listing, isPublished: newStatus } : listing)
    );
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      console.log(`Deleting listing ${listingId}`);
      
      // Remove from local state
      setListings(prev => prev.filter(l => l.id !== listingId));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to delete listing:', error);
    }
  };

  return (
    <div>
      <AdminHeader 
        title="Listings" 
        description={`Manage your property listings (${listings.length} total)`}
        action={{
          label: "New Listing",
          href: "/admin/listings/new"
        }}
      />

      <div className="p-8">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <svg className="h-10 w-10 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7M3 7V4a1 1 0 011-1h16a1 1 0 011 1v3M4 21v-8M20 21v-8M8 10v4M16 10v4" />
                </svg>
              </div>
              <h3 className="mt-6 font-sans text-2xl font-normal tracking-tight text-foreground">No listings yet</h3>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Start by adding your first property listing.
              </p>
              <Link
                href="/admin/listings/new"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/admin/listings/${listing.id}`}
                className="group block overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-border hover:shadow-lg"
              >
                <div className="flex items-center gap-6 p-6">
                  {/* Listing Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-sans text-2xl font-normal tracking-tight text-foreground transition-colors group-hover:text-foreground">
                          {listing.title}
                        </h3>
                        {listing.subtitle && (
                          <p className="mt-1 text-sm text-muted-foreground/60">{listing.subtitle}</p>
                        )}
                      </div>
                      <div className="ml-4 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <InlineToggle
                            id={listing.id}
                            initialChecked={listing.isPublished}
                            onToggle={(checked) => handleTogglePublish(listing.id, checked)}
                          />
                          <span className={`text-[10px] font-medium uppercase tracking-wide ${
                            listing.isPublished 
                              ? "text-green-700" 
                              : "text-muted-foreground/60"
                          }`}>
                            {listing.isPublished ? "Live" : "Draft"}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(listing.id);
                          }}
                          className="text-muted-foreground/40 transition-colors hover:text-red-600"
                          title="Delete listing"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Listing Meta */}
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <span className="font-sans">{listing.price}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/60">
                        <span>{listing.beds} bed</span>
                        <span>·</span>
                        <span>{listing.baths} bath</span>
                        <span>·</span>
                        <span>{listing.sqm}m²</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Created {new Date(listing.createdAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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