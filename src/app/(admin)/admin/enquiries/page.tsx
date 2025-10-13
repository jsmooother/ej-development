"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  context: {
    projectType?: string;
    budget?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  } | null;
  source: string;
  createdAt: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/enquiries', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch enquiries');
      }
      
      const data = await response.json();
      // Handle both old format (array) and new format (object with enquiries array)
      setEnquiries(Array.isArray(data) ? data : data.enquiries || []);
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
      setEnquiries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEnquiry = async (enquiryId: string) => {
    if (!confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete enquiry');
      }

      // Remove from local state
      setEnquiries(prev => prev.filter(enquiry => enquiry.id !== enquiryId));
      
      // Clear selection if deleted enquiry was selected
      if (selectedEnquiry?.id === enquiryId) {
        setSelectedEnquiry(null);
      }

      console.log('Enquiry deleted successfully');
    } catch (error) {
      console.error('Failed to delete enquiry:', error);
      alert('Failed to delete enquiry. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <AdminHeader 
        title="Enquiries" 
        description={`Manage contact form submissions (${enquiries.length} total)`}
      />

      <div className="p-8">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <svg className="h-10 w-10 animate-spin text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="mt-6 font-sans text-2xl font-normal tracking-tight text-foreground">Loading enquiries...</h3>
            </div>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <svg className="h-10 w-10 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-6 font-sans text-2xl font-normal tracking-tight text-foreground">No enquiries yet</h3>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Contact form submissions will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
            {/* Enquiries List */}
            <div className="space-y-3">
              {enquiries.map((enquiry) => (
                <button
                  key={enquiry.id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selectedEnquiry?.id === enquiry.id
                      ? 'border-foreground/30 bg-foreground/5 shadow-sm'
                      : 'border-border/50 bg-card hover:border-border hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground truncate">{enquiry.name}</h3>
                        {enquiry.context?.budget && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            {enquiry.context.budget}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground truncate">{enquiry.email}</p>
                      <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{enquiry.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">
                        {formatDate(enquiry.createdAt).split(',')[0]}
                      </span>
                      {enquiry.context?.projectType && (
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                          {enquiry.context.projectType}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Enquiry Detail */}
            <div className="rounded-2xl border border-border/50 bg-card">
              {selectedEnquiry ? (
                  <div className="divide-y divide-border/30">
                    {/* Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h2 className="font-sans text-2xl font-medium text-foreground">
                            {selectedEnquiry.name}
                          </h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Received {formatDate(selectedEnquiry.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                  {/* Contact Details */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                      Contact Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground/60">Email</p>
                        <a href={`mailto:${selectedEnquiry.email}`} className="text-sm font-medium text-foreground hover:text-foreground/80">
                          {selectedEnquiry.email}
                        </a>
                      </div>
                      {selectedEnquiry.phone && (
                        <div>
                          <p className="text-xs text-muted-foreground/60">Phone</p>
                          <a href={`tel:${selectedEnquiry.phone}`} className="text-sm font-medium text-foreground hover:text-foreground/80">
                            {selectedEnquiry.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Details */}
                  {selectedEnquiry.context && (
                    <div className="p-6 space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                        Project Details
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {selectedEnquiry.context.projectType && (
                          <div>
                            <p className="text-xs text-muted-foreground/60">Project Type</p>
                            <p className="text-sm font-medium text-foreground capitalize">
                              {selectedEnquiry.context.projectType.replace('-', ' ')}
                            </p>
                          </div>
                        )}
                        {selectedEnquiry.context.budget && (
                          <div>
                            <p className="text-xs text-muted-foreground/60">Budget Range</p>
                            <p className="text-sm font-medium text-foreground">
                              {selectedEnquiry.context.budget}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                      Message
                    </h3>
                    <div className="rounded-lg bg-muted/20 p-4">
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                        {selectedEnquiry.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 flex items-center gap-3">
                    <a
                      href={`mailto:${selectedEnquiry.email}?subject=Re: Your EJ Properties Enquiry&body=Dear ${selectedEnquiry.name},%0D%0A%0D%0AThank you for your enquiry.%0D%0A%0D%0A`}
                      className="flex-1 rounded-lg border border-foreground bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background transition hover:bg-foreground/90"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Reply via Email
                      </div>
                    </a>
                    {selectedEnquiry.phone && (
                      <a
                        href={`tel:${selectedEnquiry.phone}`}
                        className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-center text-sm font-medium text-foreground transition hover:bg-foreground/5"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call
                        </div>
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                      disabled={isDeleting}
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-[600px] items-center justify-center p-8 text-center">
                  <div>
                    <svg className="mx-auto h-16 w-16 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-sm font-medium text-muted-foreground">
                      Select an enquiry to view details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

