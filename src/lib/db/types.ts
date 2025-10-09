import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  enquiries,
  instagramCache,
  listingDocuments,
  listingImages,
  listings,
  posts,
  profiles,
  projectImages,
  projects,
  siteSettings,
} from "./schema";

export type SiteSettings = InferSelectModel<typeof siteSettings>;
export type InsertSiteSettings = InferInsertModel<typeof siteSettings>;

export type Listing = InferSelectModel<typeof listings>;
export type InsertListing = InferInsertModel<typeof listings>;

export type ListingImage = InferSelectModel<typeof listingImages>;
export type InsertListingImage = InferInsertModel<typeof listingImages>;

export type ListingDocument = InferSelectModel<typeof listingDocuments>;
export type InsertListingDocument = InferInsertModel<typeof listingDocuments>;

export type Project = InferSelectModel<typeof projects>;
export type InsertProject = InferInsertModel<typeof projects>;

export type ProjectImage = InferSelectModel<typeof projectImages>;
export type InsertProjectImage = InferInsertModel<typeof projectImages>;

export type Post = InferSelectModel<typeof posts>;
export type InsertPost = InferInsertModel<typeof posts>;

export type Enquiry = InferSelectModel<typeof enquiries>;
export type InsertEnquiry = InferInsertModel<typeof enquiries>;

export type InstagramCache = InferSelectModel<typeof instagramCache>;
export type InsertInstagramCache = InferInsertModel<typeof instagramCache>;

export type Profile = InferSelectModel<typeof profiles>;
export type InsertProfile = InferInsertModel<typeof profiles>;
