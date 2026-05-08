"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Video } from "lucide-react";

type VideoType = {
  id: string;
  videoLink: string;
  title: string;
};

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/)([^&?/]+)/);
  return match ? match[1] : null;
};

const ShowVideo = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/video");
      setVideos(res.data.data || []);
    } catch {
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/video/${id}`);
      toast.success("Video deleted");
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container py-10 space-y-6">

      <div className="text-center">
        <Video className="mx-auto text-primary" />
        <h1 className="text-2xl font-bold">Video Gallery</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {videos.map((video) => {
          const videoId = getYouTubeId(video.videoLink);

          return (
            <Card key={video.id} className="relative p-3 space-y-3">

              {/* 🎥 YouTube iframe OR fallback */}
              {videoId ? (
                <iframe
                  className="w-full h-60 rounded-md"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={video.title}
                  allowFullScreen
                />
              ) : (
                <p className="text-red-500 text-sm">
                  Invalid YouTube link
                </p>
              )}

              {/* Delete */}
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => handleDelete(video.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              {/* Title */}
              <p className="text-sm font-medium">
                {video.title}
              </p>

            </Card>
          );
        })}

      </div>
    </div>
  );
};

export default ShowVideo;