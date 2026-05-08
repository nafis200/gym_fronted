"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";

type ImageType = {
  id: string;
  url: string;
  name: string;
};

const ShowImage = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);

  // GET IMAGES
  const fetchImages = async () => {
    try {
      setLoading(true);

      const res = await api.get("/image");

      setImages(res.data.data || []);

    } catch (error) {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="container py-10 space-y-6">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <ImageIcon className="w-6 h-6 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold">Image Gallery</h1>
        <p className="text-sm text-muted-foreground">
          View and manage your uploaded images
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-muted-foreground">
          Loading images...
        </p>
      )}

      {/* Empty */}
      {!loading && images.length === 0 && (
        <p className="text-center text-muted-foreground">
          No images found
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <Card
            key={img.id}
            className="relative overflow-hidden group rounded-xl shadow-md"
          >

            {/* Image */}
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

            {/* Bottom info */}
            <div className="p-3 bg-background">
              <p className="text-sm truncate font-medium">
                {img.name}
              </p>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShowImage;