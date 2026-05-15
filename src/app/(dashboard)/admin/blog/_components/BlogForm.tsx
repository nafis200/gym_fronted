"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  BookOpen,
  Save,
  Upload,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { blogService } from "@/services/blogService";
import { BlogFormData, BlogStatus } from "@/types/blog";
import { cn } from "@/lib/utils";

interface BlogFormProps {
  mode: "create" | "edit";
  blogId?: number;
}

export default function BlogForm({ mode, blogId }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === "edit");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    featuredImage: "",
    category: "",
    tags: [],
    status: "DRAFT",
    seoMetaTitle: "",
    seoMetaDescription: "",
  });

  useEffect(() => {
    if (mode === "edit" && blogId) {
      const fetchBlog = async () => {
        try {
          const res = await blogService.getById(blogId);
          setFormData(res.data);
        } catch {
          toast.error("Failed to load blog");
          router.push("/admin/blog");
        } finally {
          setFetching(false);
        }
      };
      fetchBlog();
    } else {
      setFetching(false);
    }
  }, [mode, blogId, router]);

  const handleChange = (
    field: keyof BlogFormData,
    value: string | string[] | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "title" && mode === "create") {
      const safeValue = (value ?? "").toString();

      const slug = safeValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      const res = await blogService.uploadImage(file);
      const imageUrl = res.data?.[0]?.url || "";
      if (!imageUrl) {
        throw new Error("No URL returned");
      }
      setFormData((prev) => ({ ...prev, featuredImage: imageUrl }));
      toast.success("Image uploaded successfully");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message ||
          "Failed to upload image. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  }, []);

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, featuredImage: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      if (mode === "create") {
        await blogService.create(formData);
        toast.success("Blog created successfully");
      } else {
        await blogService.update(blogId!, formData);
        toast.success("Blog updated successfully");
      }
      router.push("/admin/blog");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <BookOpen className="w-8 h-8 text-primary mb-2" />
        <h1 className="text-2xl font-bold">
          {mode === "create" ? "Create New Blog" : "Edit Blog"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "create" ? "Add a new blog post" : "Update blog post"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug || ""}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="blog-slug"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            value={formData.shortDescription || ""}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            placeholder="Brief summary of the blog post"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Write your blog content here..."
            rows={12}
            required
          />
          <p className="text-xs text-muted-foreground">
            You can use Markdown for formatting
          </p>
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="space-y-4">
            {formData.featuredImage ? (
              <div className="relative inline-block">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/30 hover:border-muted-foreground/50",
                  uploading && "opacity-50 pointer-events-none",
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Uploading...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Drag and drop an image here, or click to select
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </div>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="e.g., Fitness, Health"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags?.join(", ") || ""}
              onChange={(e) =>
                handleChange(
                  "tags",
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                )
              }
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || "DRAFT"}
            onValueChange={(value) =>
              handleChange("status", value as BlogStatus)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h3 className="font-semibold">SEO Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="seoMetaTitle">Meta Title</Label>
            <Input
              id="seoMetaTitle"
              value={formData.seoMetaTitle || ""}
              onChange={(e) => handleChange("seoMetaTitle", e.target.value)}
              placeholder="SEO title (max 160 chars)"
              maxLength={160}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoMetaDescription">Meta Description</Label>
            <Textarea
              id="seoMetaDescription"
              value={formData.seoMetaDescription || ""}
              onChange={(e) =>
                handleChange("seoMetaDescription", e.target.value)
              }
              placeholder="SEO description (max 320 chars)"
              rows={3}
              maxLength={320}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blog")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === "create" ? "Create Blog" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
