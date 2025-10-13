"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea, Select } from "@/components/admin/form-field";
import { Toggle } from "@/components/admin/toggle";
import { ProjectImagesManager } from "@/components/admin/project-images-manager";
import { ListingPreviewModal } from "@/components/admin/listing-preview-modal";
import { Eye } from "lucide-react";

type ImageTag = "before" | "after" | "gallery";

interface ProjectImage {
  id: string;
  url: string;
  tags: ImageTag[];
  caption?: string;
  pairId?: string;
}

interface ImagePair {
  id: string;
  label: string;
  beforeImageId?: string;
  afterImageId?: string;
}

interface Listing {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  facts: {
    bedrooms?: number;
    bathrooms?: number;
    builtAreaSqm?: number;
    plotSqm?: number;
    parkingSpaces?: number;
    orientation?: string;
    amenities?: string[];
  };
  location: {
    latitude?: number;
    longitude?: number;
    address?: string;
    locality?: string;
    country?: string;
  };
  status: 'coming_soon' | 'for_sale' | 'sold';
  heroImagePath: string | null;
  heroVideoUrl: string | null;
  brochurePdfPath: string | null;
  projectImages: ProjectImage[];
  imagePairs: ImagePair[];
  isPublished: boolean;
  createdAt: string;
}

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch listing data from API
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        
        const data = await response.json();
        // Ensure projectImages and imagePairs are arrays
        setListing({
          ...data,
          projectImages: Array.isArray(data.projectImages) ? data.projectImages : [],
          imagePairs: Array.isArray(data.imagePairs) ? data.imagePairs : []
        });
      } catch (error) {
        console.error('Error fetching listing:', error);
        alert('Failed to load listing');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListing();
  }, [params.id]);

  // Auto-save function for basic fields
  const autoSave = async (updatedListing: Listing, skipDescription = false) => {
    if (!updatedListing?.id) return;

    setIsAutoSaving(true);

    try {
      const response = await fetch(`/api/listings/${updatedListing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedListing,
          description: skipDescription ? listing?.description : updatedListing.description,
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Debounced auto-save for basic fields
  const debouncedAutoSave = useMemo(
    () => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (updatedListing: Listing) => {
        if (!updatedListing?.id) return;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          autoSave(updatedListing, true); // Skip description for auto-save
        }, 1000);
      };
    },
    [listing?.id]
  );

  // Manual save function for description
  const handleSaveDescription = async () => {
    if (!listing) return;

    setIsSaving(true);

    try {
      await autoSave(listing, false); // Include description for manual save
    } catch (err) {
      console.error('Failed to save description:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!listing || !confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      alert('Listing deleted successfully!');
      router.push('/admin/listings');
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('Failed to delete listing. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Listing not found</div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader 
        title="Edit Listing" 
        description={`Modify "${listing.title}"`}
        action={{
          label: "Back to Listings",
          href: "/admin/listings"
        }}
      />

      <form onSubmit={handleSave} className="mx-auto max-w-2xl p-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Basic Information
            </h2>
            
            <FormField label="Property Title" required>
              <Input
                value={listing.title}
                onChange={(e) => setListing({ ...listing, title: e.target.value })}
                placeholder="Enter property title"
                required
              />
            </FormField>

            <FormField label="Slug" required>
              <Input
                value={listing.slug}
                onChange={(e) => setListing({ ...listing, slug: e.target.value })}
                placeholder="property-slug"
                required
              />
            </FormField>

            <FormField label="Subtitle">
              <Input
                value={listing.subtitle || ''}
                onChange={(e) => setListing({ ...listing, subtitle: e.target.value })}
                placeholder="Brief tagline"
              />
            </FormField>

            <FormField label="Status">
              <Select
                value={listing.status}
                onChange={(e) => setListing({ ...listing, status: e.target.value as 'coming_soon' | 'for_sale' | 'sold' })}
              >
                <option value="for_sale">For Sale</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="sold">Sold</option>
              </Select>
            </FormField>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Location
            </h2>

            <FormField label="Address">
              <Input
                value={listing.location?.address || ''}
                onChange={(e) => setListing({ 
                  ...listing, 
                  location: { ...listing.location, address: e.target.value }
                })}
                placeholder="Street address"
              />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="City/Area">
                <Input
                  value={listing.location?.locality || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    location: { ...listing.location, locality: e.target.value }
                  })}
                  placeholder="Marbella"
                />
              </FormField>

              <FormField label="Country">
                <Input
                  value={listing.location?.country || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    location: { ...listing.location, country: e.target.value }
                  })}
                  placeholder="Spain"
                />
              </FormField>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Latitude">
                <Input
                  type="number"
                  step="any"
                  value={listing.location?.latitude || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    location: { ...listing.location, latitude: parseFloat(e.target.value) }
                  })}
                  placeholder="36.5095"
                />
              </FormField>

              <FormField label="Longitude">
                <Input
                  type="number"
                  step="any"
                  value={listing.location?.longitude || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    location: { ...listing.location, longitude: parseFloat(e.target.value) }
                  })}
                  placeholder="-4.8826"
                />
              </FormField>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Description
            </h2>

            <FormField label="Property Description">
              <Textarea
                value={listing.description || ''}
                onChange={(e) => setListing({ ...listing, description: e.target.value })}
                rows={12}
                placeholder="Describe the property in detail..."
                className="resize-y min-h-[200px]"
              />
            </FormField>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Property Details
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Bedrooms">
                <Input
                  type="number"
                  value={listing.facts?.bedrooms || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    facts: { ...listing.facts, bedrooms: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="5"
                />
              </FormField>

              <FormField label="Bathrooms">
                <Input
                  type="number"
                  value={listing.facts?.bathrooms || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    facts: { ...listing.facts, bathrooms: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="4"
                />
              </FormField>

              <FormField label="Built Area (m²)">
                <Input
                  type="number"
                  value={listing.facts?.builtAreaSqm || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    facts: { ...listing.facts, builtAreaSqm: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="420"
                />
              </FormField>

              <FormField label="Plot Size (m²)">
                <Input
                  type="number"
                  value={listing.facts?.plotSqm || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    facts: { ...listing.facts, plotSqm: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="1200"
                />
              </FormField>

              <FormField label="Parking Spaces">
                <Input
                  type="number"
                  value={listing.facts?.parkingSpaces || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    facts: { ...listing.facts, parkingSpaces: parseInt(e.target.value) || undefined }
                  })}
                  placeholder="3"
                />
              </FormField>

              <FormField label="Orientation">
                <Input
                  value={listing.facts?.orientation || ''}
                  onChange={(e) => setListing({ 
                    ...listing, 
                    facts: { ...listing.facts, orientation: e.target.value }
                  })}
                  placeholder="South-facing"
                />
              </FormField>
            </div>

            <FormField label="Amenities">
              <Textarea
                value={listing.facts?.amenities?.join(', ') || ''}
                onChange={(e) => setListing({ 
                  ...listing, 
                  facts: { 
                    ...listing.facts, 
                    amenities: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                  }
                })}
                rows={3}
                placeholder="Pool, Gym, Garden, Sea views, Air conditioning"
              />
            </FormField>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Media & Documents
            </h2>

            <HeroImageManager
              imageUrl={listing.heroImagePath || ''}
              onChange={(url) => setListing({ ...listing, heroImagePath: url })}
              label="Hero Image"
              description="Main property image"
              required
            />

            <FormField label="Hero Video URL">
              <Input
                type="url"
                value={listing.heroVideoUrl || ''}
                onChange={(e) => setListing({ ...listing, heroVideoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </FormField>

            <FormField label="Brochure PDF Path">
              <Input
                value={listing.brochurePdfPath || ''}
                onChange={(e) => setListing({ ...listing, brochurePdfPath: e.target.value })}
                placeholder="/documents/property-brochure.pdf"
              />
            </FormField>
          </div>

          {/* Publishing */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Publishing
            </h2>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-border/40 bg-white p-5 transition-all hover:border-border/60">
              <div className="flex-1">
                <label htmlFor="isPublished" className="block cursor-pointer text-sm font-medium text-foreground">
                  Publish to Site
                </label>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  When enabled, this listing will be visible on the public site
                </p>
              </div>
              
              <button
                type="button"
                role="switch"
                aria-checked={listing.isPublished}
                id="isPublished"
                onClick={() => setListing({ ...listing, isPublished: !listing.isPublished })}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-foreground/20 ${
                  listing.isPublished ? "bg-green-500" : "bg-muted-foreground/20"
                }`}
              >
                <span className="sr-only">Publish to Site</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    listing.isPublished ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border/20 pt-8">
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm font-medium text-red-600 transition hover:text-red-700"
            >
              Delete Listing
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

