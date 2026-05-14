"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Play, MonitorPlay, AlertCircle, RefreshCw, VideoOff } from "lucide-react";
import { tutorialService } from "@/services/tutorialService";
import { Tutorial } from "@/types/tutorial";
import { TutorialCard } from "@/components/tutorials/TutorialCard";
import { TutorialCardSkeleton } from "@/components/tutorials/TutorialCardSkeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTutorials = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await tutorialService.getAll();
      setTutorials(response.data);
    } catch {
      setError(true);
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const filteredTutorials = useMemo(() => {
    if (!searchQuery.trim()) return tutorials;
    const q = searchQuery.toLowerCase();
    return tutorials.filter((t) => t.title.toLowerCase().includes(q));
  }, [tutorials, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Play className="h-3 w-3" />
              Video Library
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
              Tutorials
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Learn and improve with our curated collection of video tutorials.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          >
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
              <MonitorPlay className="h-4 w-4" />
              <span className="font-medium">{filteredTutorials.length}</span>
              <span>{filteredTutorials.length === 1 ? "video" : "videos"}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              Failed to load tutorials
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={fetchTutorials}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </motion.div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <TutorialCardSkeleton count={8} />
          </div>
        ) : filteredTutorials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              {searchQuery ? (
                <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              ) : (
                <VideoOff className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              {searchQuery ? "No tutorials found" : "No tutorials yet"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm text-center">
              {searchQuery
                ? `No tutorials match "${searchQuery}". Try a different search term.`
                : "Tutorials will appear here once they are added. Check back later."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredTutorials.map((tutorial, index) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
