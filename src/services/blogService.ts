import api from "@/lib/axios";
import { Blog, BlogFormData, BlogFilters, BlogResponse } from "@/types/blog";

export const blogService = {
  getAll: async (filters: BlogFilters): Promise<BlogResponse> => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    const res = await api.get(`/admin/blog?${params.toString()}`);
    return res.data;
  },

  getById: async (id: number): Promise<{ data: Blog }> => {
    const res = await api.get(`/admin/blog/${id}`);
    return res.data;
  },

  create: async (data: BlogFormData): Promise<{ data: Blog }> => {
    const res = await api.post("/admin/blog", data);
    return res.data;
  },

  update: async (id: number, data: BlogFormData): Promise<{ data: Blog }> => {
    const res = await api.put(`/admin/blog/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/blog/${id}`);
  },

  uploadImage: async (file: File): Promise<{ data: { url: string }[] }> => {
    const formData = new FormData();
    formData.append("files", file);
    const res = await api.post("/image/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};