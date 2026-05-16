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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  MoreHorizontal,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function AdminAppointment() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [meta, setMeta] = useState({
    total: 0,
  });

  const [selectedBooking, setSelectedBooking] =
    useState<any>(null);

  const [rescheduleModal, setRescheduleModal] =
    useState<any>(null);

  const [slotStart, setSlotStart] = useState("");

  const [slotEnd, setSlotEnd] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get(`/booking`, {
        params: {
          email: searchTerm,
          page,
          limit,
        },
      });

      setBookings(res.data.data);

      setMeta(res.data.meta);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed"
      );
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleAction = async (
    id: number,
    action: string,
    data?: any
  ) => {
    try {
      if (action === "delete") {
        await api.delete(`/booking/${id}`);
      }

      if (action === "approve") {
        await api.patch(`/booking/approve/${id}`);
      }

      if (action === "reject") {
        await api.patch(`/booking/reject/${id}`);
      }

      if (action === "reschedule") {
        await api.patch(
          `/booking/reschedule/${id}`,
          data
        );
      }

      toast.success("Success");

      fetchBookings();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed"
      );
    }
  };

  const totalPages =
    Math.ceil(meta.total / limit) || 1;

  return (
    <div className="min-h-screen space-y-8 bg-background p-6 md:p-10">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Admin Appointments
          </h1>
        </div>

        <div className="relative w-full lg:w-96">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </div>

          <Input
            className="pl-10"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);

              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>

              <TableHead>Email</TableHead>

              <TableHead>Slot</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <div className="h-10 animate-pulse rounded-md bg-muted" />
                  </TableCell>
                </TableRow>
              ))
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center"
                >
                  No Data
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <button
                      onClick={() =>
                        setSelectedBooking(item)
                      }
                      className="font-medium text-bold hover:underline"
                    >
                      {item.subject}
                    </button>
                  </TableCell>

                  <TableCell>
                    {item.userEmail}
                  </TableCell>

                  <TableCell>
                    <div>
                      <p>
                        {new Date(
                          item.slotStart
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          item.slotStart
                        ).toLocaleTimeString()}{" "}
                        -
                        {" "}
                        {new Date(
                          item.slotEnd
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge>{item.status}</Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleAction(
                              item.id,
                              "approve"
                            )
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleAction(
                              item.id,
                              "reject"
                            )
                          }
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setRescheduleModal(
                              item
                            );

                            setSlotStart(
                              new Date(
                                item.slotStart
                              )
                                .toISOString()
                                .slice(0, 16)
                            );

                            setSlotEnd(
                              new Date(
                                item.slotEnd
                              )
                                .toISOString()
                                .slice(0, 16)
                            );
                          }}
                        >
                          Reschedule
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() =>
                            handleAction(
                              item.id,
                              "delete"
                            )
                          }
                          className="text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <Button
          onClick={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          disabled={page === 1}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Prev
        </Button>

        <p className="text-sm">
          Page {page} of {totalPages}
        </p>

        <Button
          onClick={() =>
            setPage((p) => p + 1)
          }
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>

        <Select
          value={limit.toString()}
          onValueChange={(val) => {
            setLimit(Number(val));

            setPage(1);
          }}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[10, 20, 50].map((v) => (
              <SelectItem
                key={v}
                value={v.toString()}
              >
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog
        open={!!selectedBooking}
        onOpenChange={() =>
          setSelectedBooking(null)
        }
      >
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>
              Booking Details
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Subject
                </p>

                <div className="rounded-lg border p-4 text-lg font-semibold">
                  {selectedBooking.subject}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Description
                </p>

                <div className="rounded-lg border p-4 leading-7">
                  {selectedBooking.description ||
                    "No description"}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Meeting Time
                </p>

                <div className="rounded-lg border p-4">
                  <p>
                    Start:
                    {" "}
                    {new Date(
                      selectedBooking.slotStart
                    ).toLocaleString()}
                  </p>

                  <p className="mt-2">
                    End:
                    {" "}
                    {new Date(
                      selectedBooking.slotEnd
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedBooking.meetingLink && (
                <a
                  href={
                    selectedBooking.meetingLink
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-lg bg-blue-600 px-5 py-3 text-white"
                >
                  Join Meeting
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!rescheduleModal}
        onOpenChange={() =>
          setRescheduleModal(null)
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reschedule Appointment
            </DialogTitle>
          </DialogHeader>

          {rescheduleModal && (
            <div className="space-y-5">
              <div className="rounded-lg border p-4">
                <h2 className="text-lg font-semibold">
                  {rescheduleModal.subject}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {
                    rescheduleModal.description
                  }
                </p>
              </div>

              <div className="space-y-2">
                <label>
                  New Start Time
                </label>

                <Input
                  type="datetime-local"
                  value={slotStart}
                  onChange={(e) =>
                    setSlotStart(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <label>
                  New End Time
                </label>

                <Input
                  type="datetime-local"
                  value={slotEnd}
                  onChange={(e) =>
                    setSlotEnd(
                      e.target.value
                    )
                  }
                />
              </div>

              <Button
                className="w-full"
                onClick={async () => {
                  await handleAction(
                    rescheduleModal.id,
                    "reschedule",
                    {
                      slotStart,
                      slotEnd,
                    }
                  );

                  setRescheduleModal(null);
                }}
              >
                Confirm Reschedule
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}