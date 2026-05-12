"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Coffee, Star, Users, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { aboutService } from "@/services/aboutService";
import { Hero } from "@/components/layout/Hero";
import { Statistics } from "@/components/layout/Statistics";
import { Gallery } from "@/components/layout/Gallery";
import { Blogs } from "@/components/layout/Blogs";
import { Testimonials } from "@/components/layout/Testimonials";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const { t } = useTranslation();
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await aboutService.getAllAboutData();
        setAboutData(result);
      } catch (err) {
        console.error("Failed to fetch about data for home page:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const faqData = (t as any)("faq") || { title: "FAQ", items: [] };
  const { aboutPage, statistics, testimonials, gallery } = aboutData || {};

  return (
    <div className="flex flex-col min-h-screen">
      <Hero aboutPage={aboutPage} />
      <Statistics isLoading={loading} statistics={statistics} />
      <Gallery aboutGallery={gallery} />
      <Blogs />
      <Testimonials testimonials={testimonials} />

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">
            {aboutPage?.name ? `Meet ${aboutPage.name}` : "Dedicated Physical Education Specialist"}
          </h2>
          <Separator className="w-24 mx-auto bg-primary h-1 rounded-full" />
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            {aboutPage?.introText || aboutPage?.aboutDescription ||
              "Empowering students through movement, teamwork, and wellness. With a focus on holistic development, I strive to inspire a lifelong commitment to health and physical activity through innovative teaching and athletic mentorship."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Star,
                title: aboutPage?.designation ? `Certified ${aboutPage.designation}` : "Certified Professional",
                desc: "Specialized in modern curriculum design and inclusive physical education practices.",
              },
              {
                icon: Trophy,
                title: aboutPage?.yearsOfExperience ? `${aboutPage.yearsOfExperience}+ Years Experience` : "Athletic Excellence",
                desc: "Extensive experience in multi-sport coaching and developing student-athlete talent.",
              },
              {
                icon: Target,
                title: aboutPage?.tagline || "Wellness Focused",
                desc: "Dedicated to promoting mental health and physical resilience through active lifestyles.",
              },
            ].map((feature, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-none bg-muted/30">
                <CardContent className="p-6 text-center pt-8">
                  <feature.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold mb-4">{faqData.title}</h2>
             <p className="text-muted-foreground">{faqData.subtitle}</p>
           </div>
           
           <Accordion type="single" collapsible className="w-full space-y-4">
             {faqData.items.map((item: any, i: number) => (
               <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4 bg-muted/20 border-none shadow-sm">
                 <AccordionTrigger className="hover:no-underline font-medium text-left">
                   {item.q}
                 </AccordionTrigger>
                 <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                   {item.a}
                 </AccordionContent>
               </AccordionItem>
             ))}
           </Accordion>
        </div>
      </section>
    </div>
  );
}