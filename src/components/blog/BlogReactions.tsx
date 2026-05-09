"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Hand, Flame, Lightbulb } from "lucide-react";
import { ReactionType, REACTION_EMOJI, REACTION_LABEL, ReactionCount } from "@/types/reactions";
import { reactionService } from "@/services/reactionService";
import { toast } from "sonner";

interface BlogReactionsProps {
  blogId: number;
}

const reactionTypes: ReactionType[] = ["love", "like", "clap", "inspiring", "insightful"];

const reactionIcons: Record<ReactionType, React.ReactNode> = {
  love: <Heart className="w-5 h-5" />,
  like: <Hand className="w-5 h-5" />,
  clap: <Hand className="w-5 h-5" />,
  inspiring: <Flame className="w-5 h-5" />,
  insightful: <Lightbulb className="w-5 h-5" />,
};

export function BlogReactions({ blogId }: BlogReactionsProps) {
  const { theme } = useTheme();
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatingReaction, setAnimatingReaction] = useState<ReactionType | null>(null);

  const fetchReactions = async () => {
    try {
      const res = await reactionService.getByBlogId(blogId);
      setReactions(res.data || []);
    } catch (err) {
      console.error("Error fetching reactions:", err);
      setReactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [blogId]);

  const handleReaction = async (type: ReactionType) => {
    setAnimatingReaction(type);
    try {
      const res = await reactionService.toggle(blogId, type);
      setReactions(res.data || []);
      toast.success(`Reacted with ${REACTION_LABEL[type]}!`);
    } catch (err) {
      toast.error("Failed to react");
    } finally {
      setTimeout(() => setAnimatingReaction(null), 500);
    }
  };

  const textSecondary = theme === "dark" ? "text-slate-400" : "text-slate-600";
  const cardBg = theme === "dark" ? "bg-slate-900/80 border-slate-700" : "bg-white border-slate-200";

  const getTotalReactions = () => reactions.reduce((sum, r) => sum + r.count, 0);

  if (loading) {
    return (
      <div className={`${cardBg} border rounded-2xl p-4`}>
        <div className="animate-pulse flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardBg} border rounded-2xl p-4`}>
      <p className={`text-sm font-medium mb-4 ${textSecondary}`}>
        What did you think? ({getTotalReactions()})
      </p>
      <div className="flex flex-wrap gap-2">
        {reactionTypes.map((type) => {
          const reaction = reactions.find((r) => r.type === type);
          const count = reaction?.count || 0;
          const hasReacted = reaction?.hasReacted || false;

          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReaction(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                hasReacted
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent"
                  : theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
                    : "bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <AnimatePresence>
                {animatingReaction === type && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl"
                  >
                    {REACTION_EMOJI[type]}
                  </motion.span>
                )}
              </AnimatePresence>
              {reactionIcons[type]}
              <span className="font-medium">{REACTION_LABEL[type]}</span>
              {count > 0 && <span className="text-xs opacity-80">({count})</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}