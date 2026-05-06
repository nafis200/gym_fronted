"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  image: string;
  name: string;
  role: string;
  quoteKey: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    image: "https://i.pravatar.cc/150?u=1",
    name: "Alex Rodriguez",
    role: "Professional Athlete",
    quoteKey: "testimonials.quote1",
    rating: 5,
  },
  {
    id: 2,
    image: "https://i.pravatar.cc/150?u=2",
    name: "Emma Wilson",
    role: "Fitness Enthusiast",
    quoteKey: "testimonials.quote2",
    rating: 5,
  },
  {
    id: 3,
    image: "https://i.pravatar.cc/150?u=3",
    name: "James Chen",
    role: "Marathon Runner",
    quoteKey: "testimonials.quote3",
    rating: 5,
  },
  {
    id: 4,
    image: "https://i.pravatar.cc/150?u=4",
    name: "Sarah Martinez",
    role: "Personal Trainer",
    quoteKey: "testimonials.quote4",
    rating: 5,
  },
  {
    id: 5,
    image: "https://i.pravatar.cc/150?u=5",
    name: "David Kim",
    role: "CrossFit Athlete",
    quoteKey: "testimonials.quote5",
    rating: 5,
  },
  {
    id: 6,
    image: "https://i.pravatar.cc/150?u=6",
    name: "Lisa Thompson",
    role: "Yoga Instructor",
    quoteKey: "testimonials.quote6",
    rating: 5,
  },
];

export function Testimonials() {
  const { t } = useTranslation();

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
            {t("testimonials.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <motion.div
          className="flex gap-6"
          animate={{
            x: [0, 50 * (testimonials.length / 2)],
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
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-96 bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 shadow-md"
            >
              <Quote className="w-10 h-10 text-indigo-600/30 mb-4" />
              <p className="text-slate-700 dark:text-slate-200 mb-6 italic">
                {t(testimonial.quoteKey)}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
                <div className="ml-auto flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}