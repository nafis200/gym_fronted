export type BlogStatus = "DRAFT" | "PUBLISHED";

export interface Blog {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags: string[];
  status: BlogStatus;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  slug?: string;
  shortDescription?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  status?: BlogStatus;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
}

export interface BlogFilters {
  search?: string;
  status?: BlogStatus;
  category?: string;
  page?: number;
  limit?: number;
}

export interface BlogResponse {
  data: Blog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}