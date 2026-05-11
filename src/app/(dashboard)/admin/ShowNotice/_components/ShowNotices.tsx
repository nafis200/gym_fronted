"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Trash2, Calendar, FileText, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Notice {
  id: string;
  title: string;
  description: string | null;
  noticeDate: string;
  createdAt: string;
}

const ShowNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      const response = await api.get("/notice");
      setNotices(response.data.data || response.data);
    } catch (error: any) {
      toast.error("Failed to load notices");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    setIsDeleting(id);
    try {
      await api.delete(`/notice/${id}`);
      toast.success("Notice deleted successfully");
      setNotices((prev) => prev.filter((notice) => notice.id !== id));
    } catch (error: any) {
      toast.error("Failed to delete notice");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="shadow-md border-none ring-1 ring-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              All Notices
            </CardTitle>
            <CardDescription>
              Manage and view all published academic notices.
            </CardDescription>
          </div>
          <Link href="/notices/create">
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Loading notices...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground text-lg">No notices found.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Title</TableHead>
                    <TableHead className="font-bold">Notice Date</TableHead>
                    <TableHead className="font-bold hidden md:table-cell">Description</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.map((notice) => (
                    <TableRow key={notice.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {notice.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(notice.noticeDate), "PPP")}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs">
                        <p className="truncate">{notice.description || "No description"}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(notice.id)}
                          disabled={isDeleting === notice.id}
                        >
                          {isDeleting === notice.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowNotices;