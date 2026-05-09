import axios from "@/lib/axios";

export interface GalleryImage {
  id: string;
  url: string;
}

export const imageService = {
  getGalleryImages: async (): Promise<GalleryImage[]> => {
    const response = await axios.get<{ success: boolean; data: GalleryImage[] }>("/image");
    return response.data.data;
  },
};