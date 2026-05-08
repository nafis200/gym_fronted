"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Image,
  Video,
  Film,
  Users,
  Key,
  DoorOpen,  // Using DoorOpen for "Open"
  DoorClosed, // Using DoorClosed for "Close"
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems =
    user?.role === "ADMIN"
      ? [
          { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
          { name: "Upload Image", href: "/admin/upload_image", icon: UploadCloud },
          { name: "Show Image", href: "/admin/show_image", icon: Image },
          { name: "Upload Video", href: "/admin/upload_video", icon: Video },
          { name: "Show Video", href: "/admin/show_video", icon: Film },
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
    <>
      {/* MOBILE TRIGGER BUTTON - Adjusted position to not hide navbar */}
      <div className="lg:hidden fixed top-16 left-4 z-50">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => setIsOpen(!isOpen)}
          className="flex gap-2 shadow-lg border-primary/20"
        >
          {isOpen ? (
            <>
              <DoorClosed className="h-4 w-4" />
              <span className="text-xs">Close</span>
            </>
          ) : (
            <>
              <DoorOpen className="h-4 w-4" />
              {/* <span className="text-xs">Menu</span> */}
            </>
          )}
        </Button>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-card transition-all duration-300 lg:relative lg:translate-x-0",
          !isOpen ? "-translate-x-full" : "translate-x-0",
          collapsed ? "lg:w-16" : "lg:w-64",
          "w-72" // Slightly wider on mobile for better touch targets
        )}
      >
        {/* Top Spacer for Mobile so content starts below the toggle button */}
        <div className="h-32 lg:h-4 lg:hidden" />

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className={cn(collapsed ? "lg:hidden" : "block")}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t bg-muted/30">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full flex gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors",
              collapsed ? "lg:justify-center" : "justify-start"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={cn(collapsed ? "lg:hidden" : "block")}>Logout</span>
          </Button>
        </div>

        {/* DESKTOP TOGGLE */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-24 h-6 w-6 border rounded-full bg-background items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>
    </>
  );
};

export default DashboardSidebar;