"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Notice {
  id: string;
  title: string;
  description: string | null;
  noticeDate: string;
  createdAt: string;
}

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const response = await api.get("/notice");
      setNotices(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to load notices");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="text-primary h-8 w-8" />
            Official Notices
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with the latest announcements and academic news.
          </p>
        </div>
        <Badge variant="outline" className="w-fit px-4 py-1 text-sm font-medium">
          {notices.length} Total Notices
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No notices available</h3>
          <p className="text-muted-foreground">Please check back later for updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <Card 
              key={notice.id} 
              className="group hover:shadow-xl transition-all duration-300 border-none ring-1 ring-border hover:ring-primary/50 flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-primary text-sm font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(notice.noticeDate), "MMMM dd, yyyy")}
                </div>
                <CardTitle className="leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {notice.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-base line-clamp-3">
                  {notice.description || "No additional details provided for this notice."}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notices;