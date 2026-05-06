"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Text & CTA */}
        <div className="space-y-8 lg:sticky lg:top-16">
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {t("hero.title")} <span className="text-indigo-600">.</span>
          </h1>
          
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full inline-block">
            <p className="font-medium text-xs">{t("hero.badgeTitle")}</p>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("hero.description1")}
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("hero.description2")}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="bg-indigo-600 text-white px-8 py-4 rounded font-bold flex items-center gap-3 text-lg hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              {t("hero.cta")} <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded font-bold flex items-center gap-3 hover:bg-slate-50 transition-colors">
              {t("hero.ctaSecondary")}
            </Button>
          </div>

          {/* Trusted By / Community Stats */}
          <div className="pt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?u=1" alt="Student" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?u=2" alt="Student" />
              <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://i.pravatar.cc/100?u=3" alt="Student" />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">+12k</div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t("hero.communityStats")}</p>
          </div>
        </div>

        {/* Right Side: Masonry Image Grid */}
        <div className="space-y-6">
          {/* Large Top Image */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-xl aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative group">
            <Image 
              src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop"
              alt="Cricket Match"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Bottom Two Images */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-[2.5rem] overflow-hidden shadow-xl aspect-square bg-slate-100 dark:bg-slate-800 relative group">
              <Image 
                src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=2070&auto=format&fit=crop"
                alt="Jump Training"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="rounded-[2.5rem] overflow-hidden shadow-xl aspect-square bg-slate-100 dark:bg-slate-800 relative group">
              <Image 
                src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop"
                alt="Football Game"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Secondary Gallery Item */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-xl aspect-[16/9] bg-slate-100 dark:bg-slate-800 relative group">
            <Image 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop"
              alt="Athletic Progress"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Watch Movement Lab</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}