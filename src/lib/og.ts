const DEFAULT_SITE_URL = "https://www.ejproperties.es";
const DEFAULT_OG_IMAGE = "/placeholder-project.jpg";

function getBaseUrl() {
  // Force the canonical production domain for social previews.
  // NEXT_PUBLIC_* values are build-time and can drift across environments.
  if (process.env.NODE_ENV === "production") {
    return DEFAULT_SITE_URL;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function getAbsoluteUrl(path: string) {
  return new URL(path, getBaseUrl()).toString();
}

export function buildOgImageUrl(params: {
  title: string;
  subtitle?: string;
  highlight?: string;
  image?: string;
  badge?: string;
}) {
  const search = new URLSearchParams();
  search.set("title", params.title);
  if (params.subtitle) search.set("subtitle", params.subtitle);
  if (params.highlight) search.set("highlight", params.highlight);
  if (params.image) search.set("image", params.image);
  if (params.badge) search.set("badge", params.badge);

  return getAbsoluteUrl(`/api/og?${search.toString()}`);
}

export function getDefaultOgImageUrl() {
  return getAbsoluteUrl(DEFAULT_OG_IMAGE);
}
