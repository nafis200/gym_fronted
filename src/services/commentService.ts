import api from "@/lib/axios";
import { Comment, CommentFormData } from "@/types/reactions";

export const commentService = {
  getByBlogId: async (blogId: number): Promise<{ data: Comment[] }> => {
    try {
      const res = await api.get(`/blog/${blogId}/comments`);
      return res.data;
    } catch (error) {
      return { data: [] };
    }
  },

  create: async (blogId: number, data: CommentFormData): Promise<{ data: Comment }> => {
    try {
      const res = await api.post(`/blog/${blogId}/comments`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  reply: async (blogId: number, commentId: number, data: CommentFormData): Promise<{ data: Comment }> => {
    try {
      const res = await api.post(`/blog/${blogId}/comments/${commentId}/replies`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (blogId: number, commentId: number): Promise<void> => {
    try {
      await api.delete(`/blog/${blogId}/comments/${commentId}`);
    } catch (error) {
      throw error;
    }
  },
};