"use client";

import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { imageService, GalleryImage } from "@/services/imageService";

interface GalleryImageItem {
  imageUrl: string;
  caption?: string | null;
}

const defaultImages = [
  "/personal/Uzzal2/5.jpeg",
];

interface GalleryProps {
  aboutGallery?: GalleryImageItem[];
}

export function Gallery({ aboutGallery }: GalleryProps) {
  const { t } = useTranslation();
  const [images, setImages] = useState<{ url: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      if (aboutGallery?.length) {
        setImages(aboutGallery.map((g) => ({ url: g.imageUrl })));
        return;
      }
      try {
        const data = await imageService.getGalleryImages();
        if (data.length > 0) {
          setImages(data);
        } else {
          setImages(defaultImages.map((url) => ({ url })));
        }
      } catch {
        setImages(defaultImages.map((url) => ({ url })));
      }
    };
    load();
  }, [aboutGallery]);

  return (
    <section className="py-20 overflow-hidden bg-background">
      <div className="container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t("gallery.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("gallery.subtitle")}
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <motion.div
          className="flex gap-6"
          animate={{
            x: [0, -50 * (images.length / 2)],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...images, ...images].map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 h-52 rounded-2xl overflow-hidden shadow-xl relative group"
            >
              <Image
                src={img.url}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}