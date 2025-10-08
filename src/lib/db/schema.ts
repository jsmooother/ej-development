import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const listingStatusEnum = pgEnum("listing_status", ["coming_soon", "for_sale", "sold"]);

export const profileRoleEnum = pgEnum("profile_role", ["admin", "editor"]);

export const listingDocumentTypeEnum = pgEnum("listing_document_type", [
  "floorplan",
  "brochure",
  "document",
]);

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  brandName: text("brand_name").notNull(),
  primaryInstagramUsername: text("primary_instagram_username").notNull(),
  instagramAccessToken: text("instagram_access_token"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: text("address"),
  heroVideoUrl: text("hero_video_url"),
  mapboxToken: text("mapbox_token"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    facts: jsonb("facts").$type<{
      bedrooms?: number;
      bathrooms?: number;
      builtAreaSqm?: number;
      plotSqm?: number;
      parkingSpaces?: number;
      orientation?: string;
      amenities?: string[];
    }>(),
    location: jsonb("location").$type<{
      latitude?: number;
      longitude?: number;
      address?: string;
      locality?: string;
      country?: string;
    }>(),
    status: listingStatusEnum("status").notNull().default("for_sale"),
    heroImagePath: text("hero_image_path"),
    heroVideoUrl: text("hero_video_url"),
    brochurePdfPath: text("brochure_pdf_path"),
    isPublished: boolean("is_published").notNull().default(true),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    slugIdx: uniqueIndex("listings_slug_idx").on(table.slug),
    statusIdx: index("listings_status_idx").on(table.status),
  }),
);

export const listingImages = pgTable(
  "listing_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    imagePath: text("image_path").notNull(),
    altText: text("alt_text"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    listingIdx: index("listing_images_listing_idx").on(table.listingId),
  }),
);

export const listingDocuments = pgTable(
  "listing_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    documentPath: text("document_path").notNull(),
    documentType: listingDocumentTypeEnum("document_type").notNull().default("floorplan"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    listingDocListingIdx: index("listing_documents_listing_idx").on(table.listingId),
  }),
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    content: text("content"),
    year: integer("year"),
    facts: jsonb("facts").$type<Record<string, string | number | null>>(),
    heroImagePath: text("hero_image_path"),
    isPublished: boolean("is_published").notNull().default(true),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    slugIdx: uniqueIndex("projects_slug_idx").on(table.slug),
    yearIdx: index("projects_year_idx").on(table.year),
  }),
);

export const projectImages = pgTable(
  "project_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    imagePath: text("image_path").notNull(),
    altText: text("alt_text"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    projectIdx: index("project_images_project_idx").on(table.projectId),
  }),
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content"),
    coverImagePath: text("cover_image_path"),
    tags: text("tags").array(),
    isPublished: boolean("is_published").notNull().default(true),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    slugIdx: uniqueIndex("posts_slug_idx").on(table.slug),
    publishedIdx: index("posts_published_idx").on(table.isPublished),
  }),
);

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),
    context: jsonb("context").$type<Record<string, string | number | boolean | null>>(),
    source: text("source").notNull().default("contact"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    createdIdx: index("enquiries_created_idx").on(table.createdAt),
  }),
);

export const instagramCache = pgTable("instagram_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).defaultNow(),
  payload: jsonb("payload").$type<unknown>().notNull(),
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey(),
  role: profileRoleEnum("role").notNull().default("editor"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
