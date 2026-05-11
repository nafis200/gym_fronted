"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { CalendarIcon, ClipboardList } from "lucide-react";

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoticeForm>({
    resolver: zodResolver(noticeSchema),
  });

  const onSubmit = async (data: NoticeForm) => {
    setIsLoading(true);
    try {
      const response = await api.post("/notice/create-notice", data);
      
      if (response.data) {
        toast.success("Notice created successfully!");
        reset();
        router.push("/notices");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create notice.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-start  pt-10 pb-10">
      <Card className="w-full max-w-2xl shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">Create New Notice</CardTitle>
          </div>
          <CardDescription>
            Fill in the details below to publish a new official notice.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-sm font-semibold">
                Notice Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Mid-term Examination Schedule"
                className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-[11px] text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="noticeDate" className="text-sm font-semibold">
                Notice Date <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="noticeDate"
                  type="date"
                  className={errors.noticeDate ? "border-destructive pl-10" : "pl-10"}
                  {...register("noticeDate")}
                />
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.noticeDate && (
                <p className="text-[11px] text-destructive">{errors.noticeDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Write the detailed notice content here..."
                rows={5}
                className="resize-none"
                {...register("description")}
              />
            </div>

            <div className="flex gap-4 pt-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Publishing..." : "Publish Notice"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNotice;