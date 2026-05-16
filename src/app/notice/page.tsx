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
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { Calendar, FileText, ChevronRight, FileDown, Bell } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Notice {
  id: string;
  title: string;
  description: string | null;
  noticeDate: string;
  createdAt: string;
  pdfUrl?: string | null;
}

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const response = await api.get("/notices");
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Bell className="h-3 w-3" />
              Updates
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Official Notices
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Stay informed with the latest academic announcements, event
              schedules, and administrative updates.
            </p>
          </div>

          <div className="hidden md:block">
            <div className="bg-white dark:bg-slate-900 border rounded-2xl px-6 py-4 shadow-sm">
              <p className="text-sm text-muted-foreground font-medium">
                Total Announcements
              </p>
              <p className="text-3xl font-bold text-primary">
                {notices.length}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden border-none shadow-md">
                <CardHeader className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed shadow-sm">
            <div className="bg-muted p-4 rounded-full mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No notices found</h3>
            <p className="text-muted-foreground mt-2">
              We couldn't find any active notices at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((notice) => (
              <Card
                key={notice.id}
                className="group relative flex flex-col justify-between overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="secondary"
                      className="font-medium flex items-center gap-1.5 px-2.5 py-0.5"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(notice.noticeDate), "MMM dd, yyyy")}
                    </Badge>

                    {notice.pdfUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <a
                          href={notice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileDown className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </div>

                  <CardTitle className="text-xl font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {notice.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-sm md:text-base leading-relaxed line-clamp-3 text-slate-600 dark:text-slate-400">
                    {notice.description ||
                      "Official announcement details are available in the full view."}
                  </CardDescription>
                </CardContent>

                <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-100 dark:border-slate-800 bg-transparent mt-auto">
                  <Link href={`/notice/${notice.id}`} className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-between group/btn px-4 py-6 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-primary hover:text-red-400 transition-all duration-300"
                    >
                      <span className="font-bold tracking-tight">
                        Read Full Announcement
                      </span>
                      <div className="bg-primary group-hover/btn:bg-primary-foreground group-hover/btn:text-primary p-1 rounded-full text-primary-foreground transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
