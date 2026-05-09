"use client";

import React, { useState, useCallback } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UploadCloud, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const UploadImages = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
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
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
    }
  }, []);

  const removeFile = () => {
    setFiles(null);
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-2xl p-8 space-y-6 shadow-xl rounded-2xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <UploadCloud className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold">Upload Images</h1>
          <p className="text-sm text-muted-foreground">
            Drag & drop multiple images or click to select
          </p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-muted-foreground/50",
            previews.length > 0 && "border-transparent p-0"
          )}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
          />

          {previews.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className={cn(
                "p-4 rounded-full transition-colors",
                isDragging ? "bg-primary/20" : "bg-muted"
              )}>
                <ImageIcon className={cn(
                  "w-8 h-8",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isDragging ? "Drop images here" : "Drag and drop images here"}
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse (PNG, JPG, GIF up to 5MB)
                </p>
              </div>
            </div>
          ) : (
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
                  <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] p-1 truncate">
                    {file.name}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 cursor-pointer transition-colors min-h-[112px]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
                <div className="text-center p-2">
                  <ImageIcon className="w-6 h-6 mx-auto text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add More</span>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          className="w-full"
          disabled={loading || previews.length === 0}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 mr-2" />
              Upload {previews.length > 0 ? `(${previews.length})` : ""} Images
            </>
          )}
        </Button>
      </Card>
    </div>
  );
};

export default UploadImages;