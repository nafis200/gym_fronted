"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useBookingStore } from "@/store/useBookingStore";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Clock,
  Award,
  Image as ImageIcon,
  Video,
  Users,
  ChevronRight,
  User as UserIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Img = { id: string; url: string; name?: string }; 
type Vid = { id: string };
type User = { id: string; name: string; email: string };

export default function UserDashboardPage() {
  const { user } = useAuthStore();
  const { fetchUserBookings } = useBookingStore();

  const [users, setUsers] = useState<User[]>([]);
  const [images, setImages] = useState<Img[]>([]);
  const [videos, setVideos] = useState<Vid[]>([]);

  useEffect(() => {
    if (user?.id) fetchUserBookings(user.id);
  }, [user?.id, fetchUserBookings]);

  useEffect(() => {
    const load = async () => {
      try {
        const [uRes, iRes, vRes] = await Promise.all([
          api.get("/auth"),
          api.get("/image"),
          api.get("/video")
        ]);
        console.log(uRes);
        setUsers(uRes.data.data || []);
        setImages(iRes.data.data || []);
        setVideos(vRes.data.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };
    load();
  }, []);

  if (!user) return null;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10" },
    { label: "Total Images", value: images.length, icon: ImageIcon, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
    { label: "Total Videos", value: videos.length, icon: Video, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-500/10" },
    { label: "Member Status", value: user.role === "PREMIUM_USER" ? "Premium" : "Standard", icon: Award, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-700 transition-colors ">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 dark:bg-slate-950 p-8 md:p-12 shadow-2xl transition-all border border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-2">
              <Sparkles className="w-3 h-3 mr-2" /> System Online
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Welcome, <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg font-medium leading-relaxed">
              Monitor your assets, manage the community, and track your hotel portfolio performance.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="text-right hidden md:block">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Account Type</p>
                <p className="text-white font-semibold">{user.role}</p>
             </div>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="group hover:scale-[1.02] transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl transition-colors ${s.bg}`}>
                  <s.icon className={`h-6 w-6 ${s.color}`} />
                </div>
                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Live
                </Badge>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{s.label}</p>
                <h2 className="text-4xl font-bold mt-2 text-slate-900 dark:text-white tracking-tight">{s.value}</h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* IMAGE PREVIEW */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
        <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-2xl text-slate-900 dark:text-white">Visual Library</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage and preview your recently uploaded media</p>
          </div>
          <Link href="/admin/show_image">
            <Button size="lg" className="rounded-xl shadow-lg shadow-blue-500/20">
              Browse Gallery
            </Button>
          </Link>
        </div>
        <CardContent className="p-8">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {images.slice(0, 2).map((img) => (
                <div key={img.id} className="group relative aspect-video overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <img
                    src={img.url}
                    alt={img.name || "Gallery image"}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                     <p className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {img.name || 'Untitled Showcase'}
                     </p>
                     <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">Click to expand details</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/50">
               <ImageIcon className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
               <p className="text-slate-500 font-medium">No images discovered yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* BOTTOM SECTION: COMMUNITY */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-10">
        <Card className="lg:col-span-3 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl bg-white dark:bg-slate-900">
          <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-2xl font-bold">Community Directory</CardTitle>
            <CardDescription>Network with {users.length} active platform members</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {users.slice(0, 6).map((u) => (
                <div key={u.id} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 group-hover:border-blue-500/50 transition-colors">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{u.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{u.email}</p>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none bg-slate-900 dark:bg-blue-600 rounded-3xl shadow-2xl flex flex-col justify-between p-10 relative overflow-hidden group">
            {/* Background Accent for Promo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
            
            <div className="space-y-6 relative z-10">
                <div className="h-14 w-14 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
                    <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white leading-tight">Elevate Your<br/>Experience</h3>
                  <p className="text-blue-100/80 dark:text-white/80 mt-4 text-lg leading-relaxed">
                      Get access to powerful analytics, priority support, and unlimited storage for your visual assets. 
                  </p>
                </div>
            </div>
            <Button className="w-full mt-10 bg-white text-slate-900 hover:bg-blue-50 dark:hover:bg-white/90 font-bold py-8 rounded-2xl text-lg shadow-xl relative z-10 transition-transform active:scale-95">
                Upgrade to Premium
            </Button>
        </Card>
      </div>
    </div>
  );
}