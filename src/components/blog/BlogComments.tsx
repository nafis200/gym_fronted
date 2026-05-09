"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { commentService } from "@/services/commentService";
import { Comment } from "@/types/reactions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogCommentsProps {
  blogId: number;
}

const commentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  content: z.string().min(5, "Comment must be at least 5 characters"),
});

export function BlogComments({ blogId }: BlogCommentsProps) {
  const { theme } = useTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; email: string; content: string }>({
    resolver: zodResolver(commentSchema),
  });

  const fetchComments = async () => {
    try {
      const res = await commentService.getByBlogId(blogId);
      setComments(res.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const onSubmit = async (data: { name: string; email: string; content: string }) => {
    setSubmitting(true);
    try {
      await commentService.create(blogId, data);
      reset();
      toast.success("Comment posted successfully!");
      fetchComments();
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const onReply = async (parentId: number, data: { name: string; email: string; content: string }) => {
    setSubmitting(true);
    try {
      await commentService.reply(blogId, parentId, data);
      setReplyingTo(null);
      reset();
      toast.success("Reply posted successfully!");
      fetchComments();
    } catch (err) {
      toast.error("Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const textPrimary = theme === "dark" ? "text-white" : "text-slate-800";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-slate-600";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-slate-400";
  const cardBg = theme === "dark" ? "bg-slate-900/50" : "bg-slate-50";
  const inputBg = theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";

  const getCommentCount = () => comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardBg} border rounded-2xl p-6`}
      >
        <h3 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center gap-2`}>
          <MessageCircle className="w-5 h-5" />
          Comments ({getCommentCount()})
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Your name"
                {...register("name")}
                className={`${inputBg} ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your email"
                {...register("email")}
                className={`${inputBg} ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <Textarea
              placeholder="Write a comment..."
              {...register("content")}
              className={`${inputBg} min-h-[100px] ${errors.content ? "border-red-500" : ""}`}
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Post Comment</>}
          </Button>
        </form>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${cardBg} rounded-2xl p-6 animate-pulse`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-24 bg-slate-300 dark:bg-slate-700 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="h-4 w-3/4 bg-slate-300 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center py-12 ${textSecondary}`}>
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to comment!</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${cardBg} border rounded-2xl p-6`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-semibold ${textPrimary}`}>{comment.name}</span>
                      <span className={`text-sm ${textMuted}`}>
                        {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : "Just now"}
                      </span>
                    </div>
                    <p className={`${textSecondary} mb-4`}>{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <button className={`flex items-center gap-1 ${textMuted} hover:text-indigo-500 transition-colors text-sm`}>
                        Like
                      </button>
                      <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className={`flex items-center gap-1 ${textMuted} hover:text-indigo-500 transition-colors text-sm`}>
                        Reply
                      </button>
                    </div>

                    <AnimatePresence>
                      {replyingTo === comment.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                          <form onSubmit={handleSubmit((data) => onReply(comment.id, data))} className="space-y-3">
                            <Input placeholder="Your name" {...register("name")} className={inputBg} />
                            <Input type="email" placeholder="Your email" {...register("email")} className={inputBg} />
                            <Textarea placeholder="Write a reply..." {...register("content")} className={`${inputBg} min-h-[80px]`} />
                            <div className="flex gap-2">
                              <Button type="submit" size="sm" disabled={submitting} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Reply"}
                              </Button>
                              <Button type="button" variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-indigo-500/30 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className={`${cardBg} rounded-xl p-4`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                {reply.name.charAt(0).toUpperCase()}
                              </div>
                              <span className={`font-semibold ${textPrimary}`}>{reply.name}</span>
                              <span className={`text-sm ${textMuted}`}>
                                {reply.createdAt ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true }) : "Just now"}
                              </span>
                            </div>
                            <p className={`${textSecondary} text-sm`}>{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}