"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, AlertCircle, RefreshCw } from "lucide-react";
import { tutorialService } from "@/services/tutorialService";
import { Tutorial } from "@/types/tutorial";
import { getYouTubeVideoId, getYouTubeEmbedUrl, isValidYouTubeUrl } from "@/lib/youtube";

export default function TutorialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTutorial = async () => {
    if (!params.id) return;
    setLoading(true);
    setError(false);
    try {
      const response = await tutorialService.getById(params.id as string);
      setTutorial(response.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorial();
  }, [params.id]);

  const videoId = tutorial ? getYouTubeVideoId(tutorial.videoLink) : null;
  const embedUrl = videoId ? getYouTubeEmbedUrl(videoId) : null;
  const isValid = tutorial ? isValidYouTubeUrl(tutorial.videoLink) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg mb-8" />
          <div className="aspect-video bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl mb-6" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-2/3 mb-3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              Failed to load tutorial
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={fetchTutorial}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!tutorial) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Tutorials
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {embedUrl && isValid ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-xl mb-8">
              <iframe
                src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={tutorial.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-8 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 dark:text-slate-500 text-sm">Video unavailable</p>
                <a
                  href={tutorial.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium mt-2 hover:underline"
                >
                  Open in YouTube
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}

          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {tutorial.title}
            </h1>
            {videoId && isValid && (
              <a
                href={tutorial.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
              >
                Watch on YouTube
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
