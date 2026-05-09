"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Search, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from "lucide-react";

export default function AdminAppointment() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({ total: 0, limit: 10, page: 1 });

  // API Call logic
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/booking`, {
        params: { 
          email: searchTerm, 
          page, 
          limit 
        },
      });
      setBookings(res.data.data);
      setMeta(res.data.meta);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, limit]);

  // Effect to handle search and pagination
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 400); // ৪০০ms ডিলে সার্ভারকে অতিরিক্ত প্রেশার থেকে বাঁচাবে

    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleAction = async (id: number, action: string) => {
    try {
      if (action === "delete") {
        await api.delete(`/booking/${id}`);
        toast.success("Booking deleted successfully");
      } else {
        await api.patch(`/booking/${action}/${id}`);
        toast.success(`Booking status: ${action}ed`);
      }
      fetchBookings();
    } catch (error: any) {
      toast.error("Action failed. Please try again.");
    }
  };

  const totalPages = Math.ceil(meta.total / limit) || 1;

  return (
    <div className="p-6 md:p-10 space-y-8 bg-background min-h-screen">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Appointments</h1>
          <p className="text-muted-foreground">Manage and monitor all user bookings.</p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Search className="h-4 w-4 text-muted-foreground" />}
          </div>
          <Input
            placeholder="Search by user email..."
            className="pl-10 h-11 bg-muted/30 focus:bg-background border-border ring-offset-background"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // সার্চ করলে সবসময় ১ম পেজে ফিরিয়ে আনবে
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[30%]">User Email</TableHead>
              <TableHead>Time Slot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && bookings.length === 0 ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4} className="h-16 animate-pulse bg-muted/20" />
                </TableRow>
              ))
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-medium">{item.userEmail}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{new Date(item.slotStart).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.slotEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                       variant="outline"
                       className={`rounded-full px-3 py-1 ${
                        item.status === "APPROVED" ? "border-green-500/50 bg-green-500/10 text-green-600" :
                        item.status === "PENDING" ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-600" :
                        "border-red-500/50 bg-red-500/10 text-red-600"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleAction(item.id, "approve")} className="text-green-600"><CheckCircle className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(item.id, "reject")} className="text-orange-500"><XCircle className="mr-2 h-4 w-4" /> Reject</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(item.id, "delete")} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
        <div className="flex items-center gap-6">
          <p className="text-sm text-muted-foreground">
            Total <span className="font-semibold text-foreground">{meta.total}</span> bookings
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Limit:</span>
            <Select 
              value={limit.toString()} 
              onValueChange={(val) => {
                setLimit(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((v) => (
                  <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          
          <div className="text-sm font-medium px-4">
            Page {page} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages || loading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}