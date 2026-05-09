import api from "@/lib/axios";
import { Blog, BlogFilters, BlogResponse } from "@/types/blog";

export interface PublicBlogFilters extends BlogFilters {
  status?: "PUBLISHED";
}

export const publicBlogService = {
  getAll: async (filters?: PublicBlogFilters): Promise<BlogResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    try {
      const res = await api.get(`/blog?${params.toString()}`);
      return res.data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  },

  getBySlug: async (slug: string): Promise<{ data: Blog }> => {
    const res = await api.get(`/blog/slug/${slug}`);
    return res.data;
  },

  getById: async (id: number): Promise<{ data: Blog }> => {
    const res = await api.get(`/blog/${id}`);
    return res.data;
  },

  getRelated: async (id: number, category?: string, limit: number = 3): Promise<BlogResponse> => {
    const params = new URLSearchParams();
    params.append("limit", String(limit + 3));
    if (category) params.append("category", category);

    const res = await api.get(`/blog?${params.toString()}`);
    const filteredData = res.data.data.filter((blog: Blog) => blog.id !== id);
    return {
      data: filteredData.slice(0, limit),
      meta: res.data.meta
    };
  },
};