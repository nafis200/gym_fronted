"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogCardSkeletonProps {
  count?: number;
}

export function BlogCardSkeleton({ count = 6 }: BlogCardSkeletonProps) {
  const { theme } = useTheme();
  const skeletonBg = theme === "dark" ? "bg-slate-800" : "bg-slate-100";
  const skeletonHighlight = theme === "dark" ? "bg-slate-700" : "bg-slate-200";

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.article
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur" />
          <div className={`relative ${theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} border rounded-2xl overflow-hidden`}>
            {/* Image Skeleton */}
            <div className="relative h-56 overflow-hidden rounded-t-2xl">
              <Skeleton className={`h-full w-full absolute inset-0 ${skeletonBg}`} />
            </div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
              {/* Category badge */}
              <Skeleton className={`h-6 w-20 rounded-full ${skeletonBg}`} />

              {/* Title */}
              <div className="space-y-2">
                <Skeleton className={`h-6 w-3/4 rounded ${skeletonHighlight}`} />
                <Skeleton className={`h-6 w-1/2 rounded ${skeletonHighlight}`} />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className={`h-4 w-full rounded ${skeletonHighlight}`} />
                <Skeleton className={`h-4 w-2/3 rounded ${skeletonHighlight}`} />
              </div>

              {/* Meta */}
              <div className={`flex items-center justify-between pt-4 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-100"}`}>
                <div className="flex items-center gap-2">
                  <Skeleton className={`h-8 w-8 rounded-full ${skeletonBg}`} />
                  <Skeleton className={`h-4 w-16 rounded ${skeletonHighlight}`} />
                </div>
                <Skeleton className={`h-4 w-20 rounded ${skeletonHighlight}`} />
              </div>

              {/* Read More */}
              <Skeleton className={`h-10 w-32 rounded-full ${skeletonBg} mt-4`} />
            </div>
          </div>
        </motion.article>
      ))}
    </>
  );
}