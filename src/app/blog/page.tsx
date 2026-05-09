import { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog | FitNest",
  description: "Read the latest fitness tips, nutrition advice, and wellness guidance from our expert trainers.",
  openGraph: {
    title: "Blog | FitNest",
    description: "Read the latest fitness tips, nutrition advice, and wellness guidance from our expert trainers.",
    type: "website",
  },
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const category = params.category;
  const search = params.search;

  return <BlogPageClient page={page} category={category} search={search} />;
}