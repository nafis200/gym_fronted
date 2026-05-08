"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  User, Mail, Shield, BadgeCheck, 
  Calendar, MapPin, Link as LinkIcon, 
  Settings, Edit3 
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Profile = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
  profilePhoto?: string;
  createdAt: string;
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me", { withCredentials: true });
      setProfile(res.data?.data || res.data);
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive font-medium">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-950 dark:to-slate-900" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <Avatar className="h-32 w-32 ring-4 ring-background border-4 border-background shadow-xl">
              <AvatarImage src={profile.profilePhoto} alt={profile.name} />
              <AvatarFallback className="text-3xl bg-muted text-muted-foreground">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left mb-2">
              <h1 className="text-3xl font-extrabold flex items-center justify-center sm:justify-start gap-2 leading-tight">
                {profile.name}
                {profile.verified && <BadgeCheck className="text-primary fill-primary/10 w-6 h-6" />}
              </h1>
              <p className="text-muted-foreground font-medium">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">About</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Role:</span>
                  <Badge variant="secondary" className="capitalize">{profile.role.toLowerCase()}</Badge>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className={`h-2 w-2 rounded-full ${profile.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="font-medium">Status:</span>
                  <span className={profile.status === "ACTIVE" ? "text-green-600 dark:text-green-400" : "text-red-600"}>
                    {profile.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3 text-sm text-muted-foreground">
               <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Dhaka, Bangladesh</div>
               <div className="flex items-center gap-3 text-primary"><LinkIcon className="w-4 h-4" /> portfolio.dev</div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Account Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Email Address</p>
                  <p className="text-sm font-medium truncate">{profile.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Account Verification</p>
                  <p className="text-sm font-medium">{profile.verified ? "Verified Member" : "Not Verified"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Activity</h2>
              <p className="text-sm text-muted-foreground">No recent activity to show.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;