"use client";

import React, { useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

const UploadImages = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  // preview images (UI only)
  const previews = files ? Array.from(files) : [];

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast.error("Please select image(s)");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);

      await api.post("/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Images uploaded successfully 🚀");
      setFiles(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">

      <Card className="w-full max-w-2xl p-8 space-y-6 shadow-xl rounded-2xl">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <UploadCloud className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold">Upload Images</h1>
          <p className="text-sm text-muted-foreground">
            Drag & select multiple images to upload
          </p>
        </div>

        {/* File Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Choose Images
          </label>

          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            className="cursor-pointer"
          />
        </div>

        {/* Preview Section */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previews.map((file, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden border group"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-28 object-cover group-hover:scale-105 transition"
                />

                {/* file name overlay */}
                <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] p-1 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Images"}
        </Button>

      </Card>
    </div>
  );
};

export default UploadImages;