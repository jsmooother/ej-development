import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface Property {
  id: string;
  size: string;
  rooms: string;
  image: string;
  location?: string;
  price?: string;
  description?: string;
  createdAt: string;
  published: boolean;
}

export interface InstagramPost {
  id: string;
  caption: string;
  image: string;
  url: string;
  createdAt: string;
}

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readData<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeData<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  return readData<BlogPost>("blog-posts.json");
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.id === id) || null;
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
  const posts = await getBlogPosts();
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.push(newPost);
  await writeData("blog-posts.json", posts);
  return newPost;
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return null;
  
  posts[index] = {
    ...posts[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  await writeData("blog-posts.json", posts);
  return posts[index];
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const posts = await getBlogPosts();
  const filtered = posts.filter((post) => post.id !== id);
  if (filtered.length === posts.length) return false;
  await writeData("blog-posts.json", filtered);
  return true;
}

// Properties
export async function getProperties(): Promise<Property[]> {
  return readData<Property>("properties.json");
}

export async function getProperty(id: string): Promise<Property | null> {
  const properties = await getProperties();
  return properties.find((prop) => prop.id === id) || null;
}

export async function createProperty(property: Omit<Property, "id" | "createdAt">): Promise<Property> {
  const properties = await getProperties();
  const newProperty: Property = {
    ...property,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  properties.push(newProperty);
  await writeData("properties.json", properties);
  return newProperty;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const properties = await getProperties();
  const index = properties.findIndex((prop) => prop.id === id);
  if (index === -1) return null;
  
  properties[index] = {
    ...properties[index],
    ...updates,
    id,
  };
  await writeData("properties.json", properties);
  return properties[index];
}

export async function deleteProperty(id: string): Promise<boolean> {
  const properties = await getProperties();
  const filtered = properties.filter((prop) => prop.id !== id);
  if (filtered.length === properties.length) return false;
  await writeData("properties.json", filtered);
  return true;
}

// Instagram Posts
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  return readData<InstagramPost>("instagram-posts.json");
}

export async function createInstagramPost(post: Omit<InstagramPost, "id" | "createdAt">): Promise<InstagramPost> {
  const posts = await getInstagramPosts();
  const newPost: InstagramPost = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  await writeData("instagram-posts.json", posts);
  return newPost;
}

export async function deleteInstagramPost(id: string): Promise<boolean> {
  const posts = await getInstagramPosts();
  const filtered = posts.filter((post) => post.id !== id);
  if (filtered.length === posts.length) return false;
  await writeData("instagram-posts.json", filtered);
  return true;
}

