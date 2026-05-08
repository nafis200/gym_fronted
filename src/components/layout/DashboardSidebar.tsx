"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Calendar,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
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

  // ✅ NAV based on role
  const navItems =
    user?.role === "ADMIN"
      ? [
          { name: "Admin Dashboard", href: "/admin", icon: Shield },
          { name: "Upload Image", href: "/admin/upload_image", icon: Shield },
          { name: "Show And Delete Image", href: "/admin/show_image", icon: Shield },
          { name: "Upload Video", href: "/admin/upload_video", icon: Shield },
          { name: "Show And Delete Video", href: "/admin/show_video", icon: Shield },
          { name: "Users", href: "/admin/users", icon: User },
          { name: "Change Password", href: "/admin/changepassword", icon: User },
          { name: "Profile", href: "/admin/profile", icon: Settings },
        ]
      : [
          { name: "Dashboard", href: "/user", icon: LayoutDashboard },
          { name: "Bookings", href: "/user/bookings", icon: Calendar },
          { name: "Profile", href: "/user/profile", icon: User },
          { name: "Settings", href: "/user/settings", icon: Settings },
        ];

  // optional safety redirect (simple)
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
    <div className={cn(
      "relative flex flex-col h-[calc(100vh-4rem)] border-r bg-card transition-all",
      collapsed ? "w-16" : "w-64"
    )}>
      
      {/* NAV */}
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

      {/* LOGOUT */}
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

      {/* TOGGLE */}
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