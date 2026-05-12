"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface HeroSectionFormProps {
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

export default function HeroSectionForm({ initialData, onSave, saving }: HeroSectionFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    designation: initialData?.designation || "",
    tagline: initialData?.tagline || "",
    profileImage: initialData?.profileImage || "",
    introText: initialData?.introText || "",
    resumeLink: initialData?.resumeLink || "",
    aboutDescription: initialData?.aboutDescription || "",
    yearsOfExperience: initialData?.yearsOfExperience || "",
    facebook: initialData?.facebook || "",
    linkedin: initialData?.linkedin || "",
    youtube: initialData?.youtube || "",
    email: initialData?.email || "",
    quote: initialData?.quote || "",
    quoteAuthor: initialData?.quoteAuthor || "",
  });

  const [imagePreview, setImagePreview] = useState(formData.profileImage);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...formData,
      yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
            placeholder="e.g., Physical Education Director"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
            placeholder="A short tagline or headline"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Profile Image</Label>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed">
              {imagePreview ? (
                <Image src={imagePreview} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Upload className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-auto"
              />
              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setImagePreview("");
                    setFormData((prev) => ({ ...prev, profileImage: "" }));
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="introText">Introduction Text</Label>
          <Textarea
            id="introText"
            value={formData.introText}
            onChange={(e) => handleChange("introText", e.target.value)}
            placeholder="Write a brief introduction about yourself"
            rows={4}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="aboutDescription">About Description</Label>
          <Textarea
            id="aboutDescription"
            value={formData.aboutDescription}
            onChange={(e) => handleChange("aboutDescription", e.target.value)}
            placeholder="Detailed description for the about section"
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            type="number"
            value={formData.yearsOfExperience}
            onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
            placeholder="e.g., 15"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resumeLink">Resume Link</Label>
          <Input
            id="resumeLink"
            value={formData.resumeLink}
            onChange={(e) => handleChange("resumeLink", e.target.value)}
            placeholder="URL to resume PDF"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={formData.facebook}
              onChange={(e) => handleChange("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input
              id="youtube"
              value={formData.youtube}
              onChange={(e) => handleChange("youtube", e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Inspirational Quote</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea
              id="quote"
              value={formData.quote}
              onChange={(e) => handleChange("quote", e.target.value)}
              placeholder="Enter an inspirational quote"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quoteAuthor">Quote Author</Label>
            <Input
              id="quoteAuthor"
              value={formData.quoteAuthor}
              onChange={(e) => handleChange("quoteAuthor", e.target.value)}
              placeholder="Author name"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}