"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea, Select } from "@/components/admin/form-field";
import { Toggle } from "@/components/admin/toggle";
import { HeroImageManager } from "@/components/admin/hero-image-manager";

export default function NewListingPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Build facts object
      const facts = {
        bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : undefined,
        bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : undefined,
        builtAreaSqm: formData.get('builtAreaSqm') ? parseInt(formData.get('builtAreaSqm') as string) : undefined,
        plotSqm: formData.get('plotSqm') ? parseInt(formData.get('plotSqm') as string) : undefined,
        parkingSpaces: formData.get('parkingSpaces') ? parseInt(formData.get('parkingSpaces') as string) : undefined,
        orientation: formData.get('orientation') as string || undefined,
        amenities: (formData.get('amenities') as string)?.split(',').map(a => a.trim()).filter(Boolean) || []
      };

      // Build location object
      const location = {
        address: formData.get('address') as string || undefined,
        locality: formData.get('locality') as string || undefined,
        country: formData.get('country') as string || undefined,
        latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
        longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
      };
      
      // Create listing object
      const listingData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        subtitle: formData.get('subtitle') as string || '',
        description: formData.get('description') as string || '',
        facts,
        location,
        status: formData.get('status') as 'coming_soon' | 'for_sale' | 'sold' || 'for_sale',
        heroImagePath: heroImageUrl || '',
        heroVideoUrl: formData.get('heroVideoUrl') as string || '',
        brochurePdfPath: formData.get('brochurePdfPath') as string || '',
        isPublished: formData.get('isPublished') === 'on',
      };
      
      // Call API to create listing
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create listing');
      }
      
      const result = await response.json();
      console.log('Created listing:', result);
      
      // Redirect to listings list
      router.push('/admin/listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert(error instanceof Error ? error.message : 'Failed to create listing');
      setIsSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader 
        title="New Listing" 
        description="Create a new property listing to showcase for sale"
      />

      <div className="mx-auto max-w-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Basic Information
            </h2>
            
            <FormField 
              label="Property Title" 
              id="title" 
              required
              description="The name of the property listing"
            >
              <Input 
                id="title" 
                name="title" 
                placeholder="e.g., Luxury Villa in La Zagaleta" 
                required 
              />
            </FormField>

            <FormField 
              label="Slug" 
              id="slug"
              required
              description="URL-friendly identifier (e.g., luxury-villa-la-zagaleta)"
            >
              <Input 
                id="slug" 
                name="slug" 
                placeholder="luxury-villa-la-zagaleta" 
                pattern="[a-z0-9-]+"
                required 
              />
            </FormField>

            <FormField 
              label="Subtitle" 
              id="subtitle"
              description="Brief tagline or subtitle"
            >
              <Input 
                id="subtitle" 
                name="subtitle" 
                placeholder="Exclusive Gated Community"
              />
            </FormField>

            <FormField 
              label="Status" 
              id="status"
              description="Current listing status"
            >
              <Select 
                id="status" 
                name="status"
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

            <FormField 
              label="Address" 
              id="address"
              description="Street address"
            >
              <Input 
                id="address" 
                name="address" 
                placeholder="123 Main Street"
              />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField 
                label="City/Area" 
                id="locality"
              >
                <Input 
                  id="locality" 
                  name="locality" 
                  placeholder="Marbella"
                />
              </FormField>

              <FormField 
                label="Country" 
                id="country"
              >
                <Input 
                  id="country" 
                  name="country" 
                  placeholder="Spain"
                />
              </FormField>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField 
                label="Latitude" 
                id="latitude"
                description="GPS coordinate"
              >
                <Input 
                  id="latitude" 
                  name="latitude" 
                  type="number"
                  step="any"
                  placeholder="36.5095"
                />
              </FormField>

              <FormField 
                label="Longitude" 
                id="longitude"
                description="GPS coordinate"
              >
                <Input 
                  id="longitude" 
                  name="longitude" 
                  type="number"
                  step="any"
                  placeholder="-4.8826"
                />
              </FormField>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Description
            </h2>

            <FormField 
              label="Property Description" 
              id="description"
              description="Detailed property description"
            >
              <Textarea 
                id="description" 
                name="description" 
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
              <FormField 
                label="Bedrooms" 
                id="bedrooms"
              >
                <Input 
                  id="bedrooms" 
                  name="bedrooms" 
                  type="number"
                  placeholder="5"
                />
              </FormField>

              <FormField 
                label="Bathrooms" 
                id="bathrooms"
              >
                <Input 
                  id="bathrooms" 
                  name="bathrooms" 
                  type="number"
                  placeholder="4"
                />
              </FormField>

              <FormField 
                label="Built Area (m²)" 
                id="builtAreaSqm"
              >
                <Input 
                  id="builtAreaSqm" 
                  name="builtAreaSqm" 
                  type="number"
                  placeholder="420"
                />
              </FormField>

              <FormField 
                label="Plot Size (m²)" 
                id="plotSqm"
              >
                <Input 
                  id="plotSqm" 
                  name="plotSqm" 
                  type="number"
                  placeholder="1200"
                />
              </FormField>

              <FormField 
                label="Parking Spaces" 
                id="parkingSpaces"
              >
                <Input 
                  id="parkingSpaces" 
                  name="parkingSpaces" 
                  type="number"
                  placeholder="3"
                />
              </FormField>

              <FormField 
                label="Orientation" 
                id="orientation"
              >
                <Input 
                  id="orientation" 
                  name="orientation" 
                  placeholder="South-facing"
                />
              </FormField>
            </div>

            <FormField 
              label="Amenities" 
              id="amenities"
              description="Comma-separated list of amenities"
            >
              <Textarea 
                id="amenities" 
                name="amenities" 
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
              imageUrl={heroImageUrl}
              onChange={setHeroImageUrl}
              label="Hero Image"
              description="Main property image displayed on cards and detail pages"
              required
            />

            <FormField 
              label="Hero Video URL" 
              id="heroVideoUrl"
              description="Optional video URL for the property"
            >
              <Input 
                id="heroVideoUrl" 
                name="heroVideoUrl" 
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </FormField>

            <FormField 
              label="Brochure PDF Path" 
              id="brochurePdfPath"
              description="Path to downloadable brochure"
            >
              <Input 
                id="brochurePdfPath" 
                name="brochurePdfPath" 
                placeholder="/documents/property-brochure.pdf"
              />
            </FormField>
          </div>

          {/* Publishing */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Publishing
            </h2>

            <Toggle
              id="isPublished"
              name="isPublished"
              label="Publish to Site"
              description="When enabled, this listing will be visible on the public site"
              defaultChecked={true}
            />

            <div className="rounded-lg border border-border/30 bg-muted/10 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-muted-foreground/70">
                  <p className="font-medium text-foreground/80">Publishing tip</p>
                  <p className="mt-1">Turn off to keep this listing in draft mode while you work on it. You can publish it later when ready.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border/20 pt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md disabled:opacity-50"
              >
                {isSaving ? "Creating..." : "Create Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
