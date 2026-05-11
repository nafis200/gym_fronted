"use client";

import * as React from "react";
import { Hero } from "@/components/layout/Hero";
import { Statistics } from "@/components/layout/Statistics";
import { Gallery } from "@/components/layout/Gallery";
import { Blogs } from "@/components/layout/Blogs";
import { Testimonials } from "@/components/layout/Testimonials";


export default function Home() {
  
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Statistics />
      <Gallery />
      <Blogs />
    </div>
  );
}
