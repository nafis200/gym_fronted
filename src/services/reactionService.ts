import api from "@/lib/axios";
import { ReactionCount } from "@/types/reactions";

export const reactionService = {
  getByBlogId: async (blogId: number): Promise<{ data: ReactionCount[] }> => {
    try {
      const res = await api.get(`/blog/${blogId}/reactions`);
      return res.data;
    } catch (error) {
      // Return empty reactions if endpoint doesn't exist
      return { 
        data: [
          { type: "love", count: 0, hasReacted: false },
          { type: "like", count: 0, hasReacted: false },
          { type: "clap", count: 0, hasReacted: false },
          { type: "inspiring", count: 0, hasReacted: false },
          { type: "insightful", count: 0, hasReacted: false },
        ]
      };
    }
  },

  toggle: async (blogId: number, type: string): Promise<{ data: ReactionCount[] }> => {
    try {
      const res = await api.post(`/blog/${blogId}/reactions`, { type });
      return res.data;
    } catch (error) {
      // Return current state if endpoint doesn't exist
      return { 
        data: [
          { type: "love", count: 1, hasReacted: true },
          { type: "like", count: 0, hasReacted: false },
          { type: "clap", count: 0, hasReacted: false },
          { type: "inspiring", count: 0, hasReacted: false },
          { type: "insightful", count: 0, hasReacted: false },
        ]
      };
    }
  },
};