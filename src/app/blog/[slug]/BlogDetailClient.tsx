"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ChevronUp,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Blog } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogReactions } from "@/components/blog/BlogReactions";
import { BlogComments } from "@/components/blog/BlogComments";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { publicBlogService } from "@/services/publicBlogService";
import { toast } from "sonner";

interface BlogDetailClientProps {
  blog: Blog;
}

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const { theme } = useTheme();
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [moreBlogs, setMoreBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const readingTime = calculateReadingTime(blog.content);
  const formattedDate = blog.createdAt
    ? format(new Date(blog.createdAt), "MMMM dd, yyyy")
    : "";

  const textPrimary = theme === "dark" ? "text-white" : "text-slate-800";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-slate-600";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-slate-400";
  const cardBg = theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200";
  
  const pageBg = theme === "dark" 
    ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    : "bg-gradient-to-b from-slate-50 via-white to-slate-100";

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const [relatedRes, moreRes] = await Promise.all([
          publicBlogService.getRelated(blog.id, blog.category, 3),
          publicBlogService.getAll({ limit: 4, status: "PUBLISHED" }),
        ]);
        
        const relatedFiltered = relatedRes.data.filter((b: Blog) => b.id !== blog.id);
        const moreFiltered = moreRes.data.filter((b: Blog) => b.id !== blog.id).slice(0, 4);
        
        setRelatedBlogs(relatedFiltered);
        setMoreBlogs(moreFiltered);
      } catch (err) {
        console.error("Error fetching related blogs:", err);
        setRelatedBlogs([]);
        setMoreBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog.id, blog.category]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog.title;
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
    }

    if (shareUrl) window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={pageBg}>
      <ReadingProgressBar />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg flex items-center justify-center"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className={`${theme === "dark" ? "bg-slate-900/50" : "bg-white/50"} backdrop-blur-md border-b`}>
        <div className="container py-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-sm">
            <Link href="/" className={`${textSecondary} hover:text-indigo-500 transition-colors`}>Home</Link>
            <span className={textMuted}>/</span>
            <Link href="/blog" className={`${textSecondary} hover:text-indigo-500 transition-colors`}>Blog</Link>
            <span className={textMuted}>/</span>
            <span className={`${textPrimary} truncate max-w-[200px]`}>{blog.title}</span>
          </motion.div>
        </div>
      </div>

      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="container py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-4 mb-6">
            {blog.category && <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">{blog.category}</Badge>}
            <div className={`flex items-center gap-4 text-sm ${textSecondary}`}>
              <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{formattedDate}</span></div>
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{readingTime} min read</span></div>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-6`}>
            {blog.title}
          </motion.h1>

          {blog.shortDescription && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`text-xl ${textSecondary} mb-8`}>
              {blog.shortDescription}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={`flex items-center gap-4 pb-8 ${theme === "dark" ? "border-slate-700" : "border-slate-200"} border-b`}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {blog.authorName ? blog.authorName.charAt(0).toUpperCase() : 'F'}
            </div>
            <div>
              <p className={`font-semibold ${textPrimary}`}>{blog.authorName || 'FitNest Admin'}</p>
              <p className={`text-sm ${textMuted}`}>Author</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {blog.featuredImage && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="container mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image src={blog.featuredImage} alt={blog.title} fill className="object-cover" priority />
            </div>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="container pb-16">
        <div className="max-w-7xl mx-auto">
          <div className={`${cardBg} rounded-2xl p-8 shadow-lg`}>
            <div className="flex items-center gap-2 mb-6 pb-6 border-b">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Share:</span>
              <Button variant="outline" size="icon" onClick={() => handleShare("facebook")}><Facebook className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("twitter")}><Twitter className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("linkedin")}><Linkedin className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" onClick={handleCopyLink}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className={`mt-8 pt-8 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`}>
              <p className={`text-sm font-medium mb-3 ${textSecondary}`}>Tags:</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => <Badge key={tag} variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400">#{tag}</Badge>)}
              </div>
            </div>
          )}

          <div className="mt-8"><BlogReactions blogId={blog.id} /></div>
          <div className="mt-12"><BlogComments blogId={blog.id} /></div>
        </div>
      </motion.div>

      {relatedBlogs.length > 0 && (
        <section className={`py-16 ${theme === "dark" ? "bg-slate-900/50" : "bg-slate-100/50"}`}>
          <div className="container">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-2xl font-bold mb-8 flex items-center gap-2 ${textPrimary}`}>
              <MessageCircle className="w-6 h-6 text-indigo-500" /> Related Blogs
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog, index) => <BlogCard key={relatedBlog.id} blog={relatedBlog} index={index} />)}
            </div>
          </div>
        </section>
      )}

      {moreBlogs.length > 0 && (
        <section className="py-16">
          <div className="container">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`text-2xl font-bold mb-8 flex items-center gap-2 ${textPrimary}`}>
              More Articles You May Like <ArrowRight className="w-6 h-6 text-indigo-500" />
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {moreBlogs.map((moreBlog, index) => <BlogCard key={moreBlog.id} blog={moreBlog} index={index} />)}
            </div>
            <div className="text-center mt-8">
              <Link href="/blog">
                <Button variant="outline" size="lg" className="gap-2">View All Articles <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}