"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Users } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

const ShowUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth");

      const data = res.data?.data || res.data || [];

      setUsers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/auth/${id}`);

      setUsers((prev) => prev.filter((u) => u.id !== id));

      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="text-center space-y-1">
        <Users className="mx-auto text-primary" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Users
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage system users
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading users...
        </p>
      )}

      {/* TABLE WRAPPER */}
      <div className="border rounded-lg overflow-x-auto bg-white dark:bg-gray-900 dark:border-gray-700">

        <Table>

          <TableCaption className="text-gray-500 dark:text-gray-400">
            List of all registered users
          </TableCaption>

          {/* HEADER */}
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow className="border-b dark:border-gray-700">
              <TableHead className="text-gray-700 dark:text-gray-200">
                ID
              </TableHead>

              <TableHead className="text-gray-700 dark:text-gray-200">
                Name
              </TableHead>

              <TableHead className="text-gray-700 dark:text-gray-200">
                Email
              </TableHead>

              <TableHead className="text-gray-700 dark:text-gray-200">
                Role
              </TableHead>

              <TableHead className="text-gray-700 dark:text-gray-200">
                Status
              </TableHead>

              <TableHead className="text-right text-gray-700 dark:text-gray-200">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="dark:text-gray-200">
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >

                <TableCell>{user.id}</TableCell>

                <TableCell className="font-medium">
                  {user.name}
                </TableCell>

                <TableCell className="text-gray-600 dark:text-gray-300">
                  {user.email}
                </TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 dark:text-white">
                    {user.role}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
    </div>
  );
};

export default ShowUsers;