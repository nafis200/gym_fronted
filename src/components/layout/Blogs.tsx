"use client";

import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: number;
  image: string;
  category: string;
  titleKey: string;
  excerptKey: string;
  date: string;
  author: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop",
    category: "Training",
    titleKey: "blog.post1.title",
    excerptKey: "blog.post1.excerpt",
    date: "2024-01-15",
    author: "Marcus Thompson",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=2070&auto=format&fit=crop",
    category: "Nutrition",
    titleKey: "blog.post2.title",
    excerptKey: "blog.post2.excerpt",
    date: "2024-01-10",
    author: "Sarah Johnson",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop",
    category: "Wellness",
    titleKey: "blog.post3.title",
    excerptKey: "blog.post3.excerpt",
    date: "2024-01-05",
    author: "Mike Chen",
  },
];

export function Blogs() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t("blog.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-background rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden group">
                <Image
                  src={post.image}
                  alt={t(post.titleKey)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {t(post.titleKey)}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                  {t(post.excerptKey)}
                </p>
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
            >
              {t("blog.viewAll")}
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}