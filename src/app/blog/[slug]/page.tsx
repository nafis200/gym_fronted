import { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicBlogService } from "@/services/publicBlogService";
import BlogDetailClient from "./BlogDetailClient";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const response = await publicBlogService.getBySlug(slug);
    const blog = response.data;

    return {
      title: `${blog.title} | FitNest`,
      description: blog.shortDescription || blog.seoMetaDescription || blog.content.slice(0, 160),
      openGraph: {
        title: blog.title,
        description: blog.shortDescription || blog.seoMetaDescription || blog.content.slice(0, 160),
        images: blog.featuredImage ? [blog.featuredImage] : [],
        type: "article",
        publishedTime: blog.createdAt,
        authors: ["FitNest"],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.shortDescription || blog.seoMetaDescription || blog.content.slice(0, 160),
        images: blog.featuredImage ? [blog.featuredImage] : [],
      },
    };
  } catch {
    return {
      title: "Blog | FitNest",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  try {
    const response = await publicBlogService.getBySlug(slug);
    const blog = response.data;

    if (!blog || blog.status !== "PUBLISHED") {
      notFound();
    }

    return <BlogDetailClient blog={blog} />;
  } catch {
    notFound();
  }
}