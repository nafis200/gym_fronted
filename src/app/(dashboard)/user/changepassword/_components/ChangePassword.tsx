"use client";

import React, { useState } from "react";
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/auth/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true, // 👈 cookie token support (IMPORTANT)
        }
      );

      toast.success("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Password change failed";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">

      <Card className="w-full max-w-md p-6 space-y-4">

        {/* Header */}
        <div className="text-center space-y-1">
          <KeyRound className="mx-auto text-primary" />
          <h1 className="text-xl font-bold">Change Password</h1>
          <p className="text-sm text-gray-500">
            Update your account password securely
          </p>
        </div>

        {/* Old Password */}
        <Input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        {/* New Password */}
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {/* Button */}
        <Button
          className="w-full"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </Button>
      </Card>
    </div>
  );
};

export default ChangePassword;