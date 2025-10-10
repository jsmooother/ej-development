import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Create Supabase client for storage operations
export function getStorageClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Upload file to Supabase Storage
export async function uploadImage(
  file: File,
  bucket: string = 'project-images',
  path?: string
): Promise<{ url: string; path: string }> {
  const supabase = getStorageClient();
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    path: fileName
  };
}

// Delete file from Supabase Storage
export async function deleteImage(
  path: string,
  bucket: string = 'project-images'
): Promise<void> {
  const supabase = getStorageClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

// List files in a folder
export async function listImages(
  folder: string = '',
  bucket: string = 'project-images'
): Promise<string[]> {
  const supabase = getStorageClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder);

  if (error) {
    throw new Error(`List failed: ${error.message}`);
  }

  return data.map(file => file.name);
}

