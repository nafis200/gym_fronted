"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, User, Calendar, ArrowRight } from "lucide-react";
import { Blog } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface BlogCardProps {
  blog: Blog;
  index?: number;
}

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export function BlogCard({ blog, index = 0 }: BlogCardProps) {
  const { theme } = useTheme();
  const readingTime = calculateReadingTime(blog.content);
  const formattedDate = blog.createdAt
    ? format(new Date(blog.createdAt), "MMM dd, yyyy")
    : "";

  const cardBg = theme === "dark"
    ? "bg-slate-900/80 border-slate-700 hover:border-slate-600"
    : "bg-white border-slate-200 hover:border-indigo-200";
    
  const titleColor = theme === "dark"
    ? "text-white group-hover:text-indigo-400"
    : "text-slate-800 group-hover:text-indigo-600";
    
  const descColor = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const metaColor = theme === "dark" ? "text-slate-500" : "text-slate-400";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
      
      <Link href={`/blog/${blog.slug}`}>
        <div className={`relative ${cardBg} border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300`}>
          {/* Image Container */}
          <div className="relative h-56 overflow-hidden">
            {blog.featuredImage ? (
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-6xl font-bold text-white/30">
                  {blog.title.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <Badge className={`${theme === "dark" ? "bg-slate-800/90 text-white" : "bg-white/90 text-slate-700"} backdrop-blur-sm border-0 shadow-lg`}>
                {blog.category || "Blog"}
              </Badge>
            </div>

            {/* Reading Time */}
            <div className="absolute top-4 right-4">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${
                theme === "dark" ? "bg-slate-800/90 text-slate-300" : "bg-white/90 text-slate-700"
              }`}>
                <Clock className="w-3 h-3" />
                <span>{readingTime} min</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className={`text-xl font-bold ${titleColor} mb-3 line-clamp-2 transition-colors`}>
              {blog.title}
            </h3>

            {blog.shortDescription && (
              <p className={`${descColor} text-sm mb-4 line-clamp-2`}>
                {blog.shortDescription}
              </p>
            )}

            {/* Meta Info */}
            <div className={`flex items-center justify-between pt-4 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>{blog.authorName || "Admin"}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${metaColor} text-sm`}>
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Read More - Animated Arrow */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mt-4 text-indigo-500 font-medium"
            >
              <span>Read Article</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}