"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Calendar, Clock, BookOpen, Send } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const bookingSchema = z.object({
  subject: z.string().min(5, "Subject is too short"),
  description: z.string().min(10, "Please provide a detailed description"),
  bookingDate: z.string().min(1, "Select a date"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function AppointmentPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingForm) => {
    if (!user?.email) {
      toast.error("User email not found. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      const slotStart = new Date(
        `${data.bookingDate}T${data.startTime}:00`
      ).toISOString();

      const slotEnd = new Date(
        `${data.bookingDate}T${data.endTime}:00`
      ).toISOString();

      const payload = {
        userEmail: user.email,
        subject: data.subject,
        description: data.description,
        slotStart,
        slotEnd,
      };

      await api.post("/booking", payload);

      toast.success("Appointment request submitted successfully!");
      reset();
      router.push("/user/appointment");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create booking.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-2xl shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Book New Appointment
            </CardTitle>
          </div>
          <CardDescription>
            Fill in the required details to schedule your session.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="subject"
                  className="pl-10"
                  placeholder="e.g. Career Guidance Meeting"
                  {...register("subject")}
                />
              </div>
              {errors.subject && (
                <p className="text-xs text-destructive font-medium">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Write details about your meeting purpose..."
                className="min-h-[120px] resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookingDate">Date</Label>
                <Input
                  id="bookingDate"
                  type="date"
                  {...register("bookingDate")}
                />
                {errors.bookingDate && (
                  <p className="text-xs text-destructive">
                    {errors.bookingDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    className="pl-10"
                    {...register("startTime")}
                  />
                </div>
                {errors.startTime && (
                  <p className="text-xs text-destructive">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    className="pl-10"
                    {...register("endTime")}
                  />
                </div>
                {errors.endTime && (
                  <p className="text-xs text-destructive">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 text-lg font-semibold h-12"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (
                <>
                  Confirm Booking <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// 