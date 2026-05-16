"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { CalendarIcon, ClipboardList, Upload, FileText, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const noticeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  noticeDate: z.string().min(1, "Notice date is required"),
});

type NoticeForm = z.infer<typeof noticeSchema>;

const CreateNotice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoticeForm>({
    resolver: zodResolver(noticeSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a valid PDF file");
        return;
      }
      setPdfFile(file);
    }
  };

  const removeFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: NoticeForm) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("noticeDate", data.noticeDate);

      if (data.description) {
        formData.append("description", data.description);
      }

      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      const response = await api.post("/notices/create-notice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast.success("Notice created successfully!");
        reset();
        setPdfFile(null);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create notice.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card className="shadow-xl border-t-4 border-t-primary overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-sm">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Create New Notice</CardTitle>
              <CardDescription className="dark:text-white">
                Publish official announcements and documents
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">Notice Title <span className="text-destructive">*</span></Label>
                <Input 
                  id="title"
                  placeholder="e.g. Annual Sports Meet 2024" 
                  {...register("title")} 
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-xs font-medium text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="noticeDate" className="font-semibold">Notice Date <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input 
                    id="noticeDate"
                    type="date" 
                    {...register("noticeDate")} 
                    className={`pl-10 ${errors.noticeDate ? "border-destructive" : ""}`} 
                  />
                  <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.noticeDate && (
                  <p className="text-xs font-medium text-destructive">{errors.noticeDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">Description</Label>
              <Textarea 
                id="description"
                placeholder="Provide additional details about this notice..."
                rows={4} 
                {...register("description")} 
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Attachment</Label>
              {!pdfFile ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 transition-colors hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                >
                  <div className="p-3 bg-muted rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-medium">Click to upload PDF</p>
                    <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between border rounded-lg p-3 bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded border shadow-sm">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-md">
                        {pdfFile.name}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground font-bold">
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={removeFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 shadow-md">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Publishing...
                  </span>
                ) : (
                  "Publish Notice"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNotice;