"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { login, logout, user, isAuthenticated, accessToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            console.log("AuthProvider: Checking session...");
            try {
                const response = await api.get("/auth/me");
                console.log("AuthProvider: Profile response success:", response.data.success);
                if (response.data.success) {
                    login(response.data.data, ""); 
                    console.log("AuthProvider: Logged in as:", response.data.data.email);
                }
            } catch (error: any) {
                console.log("AuthProvider: session check failed", error.response?.status || error.message);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    if (isAuthenticated) logout();
                }
            } finally {
                setIsLoading(false);
                setHasChecked(true);
            }
        };

        if (accessToken && !hasChecked) {
            fetchProfile();
        } else if (!accessToken && !hasChecked) {
            setIsLoading(false);
            setHasChecked(true);
        }
    }, [login, logout, isAuthenticated, hasChecked, accessToken]);

    if (isLoading && !hasChecked) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
