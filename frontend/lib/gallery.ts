// lib/gallery.ts
import {  GalleryItem} from "@/types/gallery";
import  api from "@/lib/axios"

interface GalleryResponse {
  success: boolean;
  gallery: GalleryItem[];
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const res = await api.get<GalleryResponse>("/gallery");
  return res.data.gallery;
}