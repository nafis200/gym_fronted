"use client";

import { useEffect, useState, useRef, ElementType } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { Users, Award, Clock, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItemProps {
  icon: ElementType;
  value: number;
  suffix: string;
  label: string;
  index: number;
}

function StatItem({ icon: Icon, value, suffix, label, index }: StatItemProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const springValue = useSpring(0, { duration: 2000, bounce: 0 });
  const transformValue = useTransform(springValue, [0, value], [0, value]);

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    return transformValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [transformValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-indigo-600" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
        {displayValue}
        {suffix}
      </div>
      <p className="text-slate-600 dark:text-slate-300 font-medium">{label}</p>
    </motion.div>
  );
}

function StatSkeleton() {
  return (
    <div className="flex flex-col items-center text-center">
      <Skeleton className="w-16 h-16 rounded-2xl mb-4" />
      <Skeleton className="h-10 w-24 mb-2" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}

interface StatisticsProps {
  isLoading?: boolean;
  statistics?: Array<{
    title: string;
    count: number;
    suffix: string;
  }>;
}

const icons = [Users, Award, Clock, TrendingUp];

export function Statistics({ isLoading, statistics }: StatisticsProps) {
  const { t } = useTranslation();

  const stats = statistics?.length
    ? statistics.map((s, i) => ({
        icon: icons[i % icons.length],
        value: s.count,
        suffix: s.suffix || "+",
        label: s.title,
      }))
    : [
        { icon: Users, value: 12000, suffix: "+", label: t("statistics.students") },
        { icon: Award, value: 15, suffix: "+", label: t("statistics.awards") },
        { icon: Clock, value: 10, suffix: "+", label: t("statistics.years") },
        { icon: TrendingUp, value: 98, suffix: "%", label: t("statistics.success") },
      ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t("statistics.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t("statistics.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {isLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            stats.map((stat, index) => (
              <StatItem key={index} {...stat} index={index} label={stat.label} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}