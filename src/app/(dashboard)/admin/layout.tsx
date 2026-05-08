"use client";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-muted/20">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-7xl mx-auto h-full">
            {children}
        </div>
      </main>
    </div>
  );
}
