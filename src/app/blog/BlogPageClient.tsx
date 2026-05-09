"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ArrowRight, TrendingUp, Clock, User, Calendar, Mail, ChevronDown, Sparkles } from "lucide-react";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const categories = ["All", "Training", "Nutrition", "Wellness", "Fitness", "Health"];
const sortOptions = ["Latest", "Popular", "Oldest"];

export default function BlogPageClient({ page: initialPage, category: initialCategory, search: initialSearch }: BlogPageClientProps) {
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
      const filters: { page?: number; category?: string; search?: string; status?: "PUBLISHED" } = {
        page,
        status: "PUBLISHED",
      };
      if (category && category !== "All") filters.category = category;
      if (search) filters.search = search;

      const response: BlogResponse = await publicBlogService.getAll(filters);
      let sortedData = [...response.data];
      
      if (sortBy === "Oldest") {
        sortedData.reverse();
      }
      
      setBlogs(sortedData);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error("Error fetching blogs:", err);
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const gradientBg = theme === "dark" 
    ? "from-purple-900 via-indigo-900 to-slate-900"
    : "from-indigo-600 via-purple-600 to-pink-500";
    
  const contentBg = theme === "dark"
    ? "bg-slate-950 via-slate-900 to-slate-950"
    : "bg-gradient-to-b from-slate-50 via-white to-slate-100";
    
  const cardBg = theme === "dark"
    ? "bg-slate-900/80 border-slate-700"
    : "bg-white border-slate-200";
    
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-800";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const textMuted = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const textLight = theme === "dark" ? "text-white/90" : "text-white";
  
  return (
    <div className={`min-h-screen ${contentBg}`}>
      {/* Animated Gradient Hero */}
      <section className={`relative min-h-[70vh] lg:min-[60vh] overflow-hidden bg-gradient-to-br ${gradientBg}`}>
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-[100px] ${theme === "dark" ? "bg-purple-500/30" : "bg-white/20"}`}
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className={`absolute top-40 right-10 w-80 h-80 rounded-full blur-[100px] ${theme === "dark" ? "bg-cyan-500/20" : "bg-cyan-300/20"}`}
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 80, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className={`absolute bottom-20 left-1/3 w-72 h-72 rounded-full blur-[100px] ${theme === "dark" ? "bg-pink-500/20" : "bg-purple-300/20"}`}
          />
          <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]`} />
        </div>

        <div className="container relative z-10 pt-20 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                theme === "dark" 
                  ? "bg-white/10 backdrop-blur-sm border border-white/20" 
                  : "bg-white/20 backdrop-blur-sm border border-white/30"
              }`}
            >
              <Sparkles className={`w-4 h-4 ${theme === "dark" ? "text-purple-400" : "text-white"}`} />
              <span className={`text-sm ${textLight}`}>Premium Fitness Insights</span>
            </motion.div>
            
            <h1 className={`text-5xl lg:text-7xl font-bold ${textLight} mb-6`}>
              Our Blog
            </h1>
            <p className={`text-xl lg:text-2xl ${theme === "dark" ? "text-white/80" : "text-white/90"} max-w-2xl mx-auto mb-10 font-light leading-relaxed`}>
              Discover expert fitness tips, nutrition guidance, and wellness strategies to transform your health journey
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="#blogs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all ${
                    theme === "dark"
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "bg-white text-indigo-600 hover:bg-slate-100"
                  }`}
                >
                  Explore Articles
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`px-8 py-4 rounded-full font-semibold text-lg transition-all ${
                  theme === "dark"
                    ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                    : "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                }`}
              >
                Subscribe Newsletter
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Glassmorphism Search & Filter Bar */}
      <section className="sticky top-16 z-50 -mt-6">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`backdrop-blur-xl border rounded-2xl p-4 lg:p-6 shadow-xl ${
              theme === "dark"
                ? "bg-slate-900/80 border-slate-700"
                : "bg-white/80 border-slate-200"
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 relative">
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-slate-400"}`} />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-12 border ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:ring-indigo-500"
                          : "bg-slate-50 border-slate-200 focus:ring-indigo-500"
                      }`}
                    />
                  </div>
                </div>
              </form>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className={`w-full lg:w-40 px-4 py-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    {sortBy}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full mt-2 left-0 right-0 border rounded-xl shadow-xl overflow-hidden z-50 ${
                        theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                      }`}
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                          className={`w-full px-4 py-3 text-left transition-all ${
                            theme === "dark"
                              ? `${sortBy === option ? 'text-indigo-400 font-medium' : 'text-slate-300'} hover:bg-slate-700`
                              : `${sortBy === option ? 'text-indigo-600 font-medium' : 'text-slate-600'} hover:bg-slate-50`
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`gap-2 rounded-xl ${
                  showFilters 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : theme === "dark"
                      ? "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700"
                      : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {(selectedCategory || searchQuery) && (
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                )}
              </Button>

              {(selectedCategory || searchQuery) && (
                <Button variant="ghost" onClick={clearFilters} className={theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700"}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Category Pills */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`pt-4 mt-4 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
                    <p className={`text-sm mb-3 font-medium ${textMuted}`}>Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <motion.button
                          key={category}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCategoryChange(category === "All" ? "" : category)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === category || (category === "All" && !selectedCategory)
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                              : theme === "dark"
                                ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {category}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section id="blogs" className="py-12 lg:py-20">
        <div className="container">
          {error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-red-500 text-lg mb-4">Failed to load blogs</p>
              <Button onClick={() => fetchBlogs(currentPage, selectedCategory, searchQuery)}>
                Try Again
              </Button>
            </motion.div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <BlogCardSkeleton count={6} />
            </div>
          ) : blogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}>
                <Search className={`w-10 h-10 ${theme === "dark" ? "text-slate-600" : "text-slate-300"}`} />
              </div>
              <p className={`${textSecondary} text-lg mb-2`}>No blogs found</p>
              <p className={`${textMuted} mb-6`}>Try adjusting your search or filters</p>
              <Button onClick={clearFilters} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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

          {/* Pagination */}
          {!loading && !error && blogs.length > 0 && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-12 lg:mt-16"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={theme === "dark" ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"}
              >
                ← Previous
              </Button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                          : theme === "dark"
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={theme === "dark" ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"}
              >
                Next →
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 lg:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 lg:p-12"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iMzAiIHI9IjIiLz48Y2lyY2xlIGN4PSIwLjAiIGN5PSIzMCIgcj0iMiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMC4wIiByPSIyIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iMiIvPjxjaXJjbGUgY3g9IjAuMCIgY3k9IjYwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-6"
              >
                <Mail className="w-4 h-4 text-white" />
                <span className="text-white text-sm">Stay Updated</span>
              </motion.div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-white/90 mb-8 text-lg">
                Get the latest fitness tips, nutrition advice, and wellness strategies delivered to your inbox
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-full bg-white text-indigo-600 font-semibold shadow-lg"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}