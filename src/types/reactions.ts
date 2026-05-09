export interface Reaction {
  id: number;
  blogId: number;
  type: ReactionType;
  userId?: string;
  createdAt: string;
}

export type ReactionType = "love" | "like" | "clap" | "inspiring" | "insightful";

export interface ReactionCount {
  type: ReactionType;
  count: number;
  hasReacted: boolean;
}

export interface Comment {
  id: number;
  blogId: number;
  parentId?: number;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CommentFormData {
  name: string;
  email: string;
  content: string;
  parentId?: number;
}

export const REACTION_EMOJI: Record<ReactionType, string> = {
  love: "❤️",
  like: "👍",
  clap: "👏",
  inspiring: "🔥",
  insightful: "💡",
};

export const REACTION_LABEL: Record<ReactionType, string> = {
  love: "Love",
  like: "Like",
  clap: "Clap",
  inspiring: "Inspiring",
  insightful: "Insightful",
};

export const REACTION_COLOR: Record<ReactionType, string> = {
  love: "text-red-500",
  like: "text-blue-500",
  clap: "text-yellow-500",
  inspiring: "text-orange-500",
  insightful: "text-purple-500",
};