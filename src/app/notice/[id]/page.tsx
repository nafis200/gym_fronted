"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  Download, 
  ExternalLink, 
  ArrowLeft, 
  Clock,
  ChevronLeft
} from "lucide-react";
import { format } from "date-fns";

interface Notice {
  id: string;
  title: string;
  description: string | null;
  noticeDate: string;
  createdAt: string;
  pdfUrl?: string | null;
}

const SingleNotice = () => {
  const { id } = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotice = async () => {
    try {
      const res = await api.get(`/notices/${id}`);
      setNotice(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 max-w-4xl px-4">
        <Skeleton className="h-8 w-32 mb-6" />
        <Card className="border-none shadow-sm">
          <CardHeader className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="container mx-auto py-32 text-center">
        <div className="bg-destructive/10 text-destructive inline-flex p-4 rounded-full mb-4">
          <FileText className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">Notice Not Found</h2>
        <p className="text-muted-foreground mt-2">The announcement you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-6">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950/30 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-8 hover:bg-transparent p-0 text-muted-foreground hover:text-primary group transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to All Notices
        </Button>

        <article className="space-y-8">
          <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            
            <CardHeader className="pt-10 pb-6">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  {format(new Date(notice.noticeDate), "MMMM dd, yyyy")}
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 font-normal">
                  <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  Posted {format(new Date(notice.createdAt), "p")}
                </Badge>
              </div>

              <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {notice.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pb-10 space-y-10">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {notice.description || "Detailed information for this notice is currently unavailable."}
                </p>
              </div>

              {notice.pdfUrl && (
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 md:p-8">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl text-red-600">
                        <FileText className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Official Document</h4>
                        <p className="text-sm text-muted-foreground">Download the PDF version for archival and printing.</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button asChild variant="outline" className="bg-white dark:bg-slate-900">
                        <a href={notice.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Preview
                        </a>
                      </Button>
                      <Button asChild className="shadow-lg shadow-primary/20">
                        <a href={notice.pdfUrl} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  <FileText className="absolute -right-8 -bottom-8 h-40 w-40 text-slate-200/50 dark:text-slate-800/20 -rotate-12 pointer-events-none" />
                </div>
              )}
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
};

export default SingleNotice;