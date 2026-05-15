"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Search,
  Filter,
  X,
  ArrowRight,
  TrendingUp,
  ChevronDown,
  Sparkles,
  Mail,
} from "lucide-react";
import { publicBlogService } from "@/services/publicBlogService";
import { Blog, BlogResponse } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogPageClientProps {
  page: number;
  category?: string;
  search?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const categories = ["All", "Training", "Nutrition", "Wellness", "Fitness", "Health"];
const sortOptions = ["Latest", "Popular", "Oldest"];

export default function BlogPageClient({
  page: initialPage,
  category: initialCategory,
  search: initialSearch,
}: BlogPageClientProps) {
  const { theme } = useTheme();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "");
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("Latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const fetchBlogs = async (page: number, category: string, search: string) => {
    setLoading(true);
    setError(false);

    try {
      const filters: { page?: number; category?: string; search?: string; status?: "PUBLISHED" } =
        {
          page,
          status: "PUBLISHED",
        };

      if (category && category !== "All") filters.category = category;
      if (search) filters.search = search;

      const response: BlogResponse = await publicBlogService.getAll(filters);
      let sortedData = [...response.data];

      if (sortBy === "Oldest") {
        sortedData = sortedData.reverse();
      }

      setBlogs(sortedData);
      setTotalPages(response.meta.totalPages);
    } catch {
      setError(true);
      toast.error("Failed to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, selectedCategory, searchQuery);
  }, [currentPage, selectedCategory, searchQuery, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, selectedCategory, searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const gradientBg =
    theme === "dark"
      ? "from-purple-900 via-indigo-900 to-slate-900"
      : "from-indigo-600 via-purple-600 to-pink-500";

  const contentBg =
    theme === "dark"
      ? "bg-slate-950"
      : "bg-gradient-to-b from-slate-50 via-white to-slate-100";

  const textLight = theme === "dark" ? "text-white" : "text-white";

  return (
    <div className={`min-h-screen ${contentBg}`}>
      <section className={`relative min-h-[70vh] overflow-hidden bg-gradient-to-br ${gradientBg}`}>
        <div className="container relative z-10 pt-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl lg:text-7xl font-bold ${textLight}`}
          >
            Our Blog
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-white/80 text-xl"
          >
            Fitness insights, nutrition tips & wellness guides
          </motion.p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="#blogs">
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold">
                Explore Articles <ArrowRight className="inline w-4 h-4 ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-50 -mt-6">
        <div className="container">
          <div className="backdrop-blur-xl p-4 rounded-2xl bg-white/80 border">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
              />
              <Button type="submit">
                <Search className="w-4 h-4" />
              </Button>
              <Button type="button" onClick={clearFilters}>
                <X className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section id="blogs" className="py-16">
        <div className="container">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              <BlogCardSkeleton count={6} />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">Failed to load blogs</div>
          ) : blogs.length === 0 ? (
            <div className="text-center">No blogs found</div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {blogs.map((blog, index) => (
                  <motion.div key={blog.id} variants={itemVariants}>
                    <BlogCard blog={blog} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </Button>

          <span className="px-4 py-2">
            {currentPage} / {totalPages}
          </span>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 rounded-3xl text-center text-white">
            <Mail className="mx-auto w-10 h-10 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Subscribe</h2>
            <p className="mb-6">Get latest updates in your inbox</p>

            <div className="flex gap-3 justify-center">
              <Input placeholder="Enter email" className="max-w-xs text-black" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}