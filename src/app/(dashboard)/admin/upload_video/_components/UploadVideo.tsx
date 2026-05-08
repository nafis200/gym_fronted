"use client";

import React, { useState } from "react";
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UploadCloud, Video } from "lucide-react";

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/)([^&?/]+)/);
  return match ? match[1] : null;
};

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Please enter title");
      return;
    }

    if (!videoLink.trim()) {
      toast.error("Please enter video link");
      return;
    }

    try {
      setLoading(true);

      await api.post("/video/add-video", {
        title,
        videoLink,
      });

      toast.success("Video saved successfully 🚀");

      setTitle("");
      setVideoLink("");

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const videoId = getYouTubeId(videoLink);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">

      <Card className="w-full max-w-xl p-8 space-y-6 shadow-xl rounded-2xl">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <UploadCloud className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold">Add Video</h1>
          <p className="text-sm text-muted-foreground">
            Save video title and link
          </p>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Video Title</label>

          <Input
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video Link
          </label>

          <Input
            type="url"
            placeholder="https://youtu.be/... or mp4 link"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
        </div>

        {/* Preview FIXED */}
        {videoLink && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Preview:</p>

            {/* YouTube */}
            {videoId ? (
              <iframe
                className="w-full h-48 rounded-md"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="preview"
                allowFullScreen
              />
            ) : (
              /* MP4 fallback */
              <video
                src={videoLink}
                controls
                className="w-full h-48 rounded-md object-cover"
              />
            )}
          </div>
        )}

        {/* Button */}
        <Button
          onClick={handleUpload}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Video"}
        </Button>

      </Card>
    </div>
  );
};

export default UploadVideo;