"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { Tutorial } from "@/types/tutorial";
import { getYouTubeVideoId, getYouTubeThumbnail, isValidYouTubeUrl } from "@/lib/youtube";

interface TutorialCardProps {
  tutorial: Tutorial;
  index: number;
}

export function TutorialCard({ tutorial, index }: TutorialCardProps) {
  const videoId = getYouTubeVideoId(tutorial.videoLink);
  const thumbnail = videoId ? getYouTubeThumbnail(videoId) : "/placeholder-thumbnail.jpg";
  const isValid = isValidYouTubeUrl(tutorial.videoLink);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/tutorials/${tutorial.id}`} className="group block">
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-slate-300/80 dark:hover:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-1">
          <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <img
              src={thumbnail}
              alt={tutorial.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                <Play className="w-6 h-6 text-slate-900 ml-0.5" />
              </div>
            </div>
            {!isValid && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Invalid URL
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {tutorial.title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
