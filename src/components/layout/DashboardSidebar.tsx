"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  UploadCloud,
  Image,
  Video,
  Film,
  Users,
  Key,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const navItems =
    user?.role === "ADMIN"
      ? [
          { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
          { name: "Upload Image", href: "/admin/upload_image", icon: UploadCloud },
          { name: "Show And Delete Image", href: "/admin/show_image", icon: Image },
          { name: "Upload Video", href: "/admin/upload_video", icon: Video },
          { name: "Show And Delete Video", href: "/admin/show_video", icon: Film },
          { name: "Users", href: "/admin/users", icon: Users },
          { name: "Change Password", href: "/admin/changepassword", icon: Key },
          { name: "Profile", href: "/admin/profile", icon: User },
        ]
      : [
          { name: "Dashboard", href: "/user", icon: LayoutDashboard },
          { name: "Show Image", href: "/user/show_image", icon: Image },
          { name: "Show Video", href: "/user/show_video", icon: Video },
          { name: "Change Password", href: "/user/changepassword", icon: Key },
          { name: "Profile", href: "/user/profile", icon: User },
        ];

  if (typeof window !== "undefined") {
    if (user?.role === "ADMIN" && pathname.startsWith("/user")) {
      router.push("/admin");
    }
    if (user?.role === "USER" && pathname.startsWith("/admin")) {
      router.push("/user");
    }
  }

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      toast.success("Logged out");
      router.push("/");
    } catch {
      logout();
      router.push("/");
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col h-[calc(100vh-4rem)] border-r bg-card transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full flex gap-2 text-red-500",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </Button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 h-6 w-6 border rounded-full bg-background flex items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </div>
  );
};

export default DashboardSidebar;