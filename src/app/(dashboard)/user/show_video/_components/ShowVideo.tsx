"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Video } from "lucide-react";

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

  return (
    <div className="container py-10 space-y-6">

      {/* Header */}
      <div className="text-center space-y-2">
        <Video className="mx-auto text-primary" />
        <h1 className="text-2xl font-bold">Video Gallery</h1>
        <p className="text-sm text-muted-foreground">
          Watch uploaded videos
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-muted-foreground">
          Loading videos...
        </p>
      )}

      {/* Empty */}
      {!loading && videos.length === 0 && (
        <p className="text-center text-muted-foreground">
          No videos found
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {videos.map((video) => {
          const videoId = getYouTubeId(video.videoLink);

          return (
            <Card
              key={video.id}
              className="relative p-3 space-y-3 shadow-md"
            >

              {/* YouTube Video */}
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