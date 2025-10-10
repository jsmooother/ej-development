// Content limit types
export type ContentLimits = {
  frontpage: {
    projects: number;
    editorials: number;
    instagram: number;
  };
};

// Site settings types
export type SiteSettings = {
  contentLimits: ContentLimits;
};

// Type guard for content limits
export function isContentLimits(value: unknown): value is ContentLimits {
  if (!value || typeof value !== 'object') return false;
  
  const v = value as any;
  if (!v.frontpage || typeof v.frontpage !== 'object') return false;
  
  const { frontpage } = v;
  return (
    typeof frontpage.projects === 'number' &&
    typeof frontpage.editorials === 'number' &&
    typeof frontpage.instagram === 'number'
  );
}
