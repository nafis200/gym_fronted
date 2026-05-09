"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Booking = {
  id: number;
  userEmail: string;
  subject: string;
  slotStart: string;
  slotEnd: string;
  status: string;
  meetingLink?: string;
  createdAt: string;
};

const ShowAppointment = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!user?.email) return;

        const res = await api.get(`/booking/${user.email}`);
        setBookings(res.data.data || res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [user]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!bookings.length) return <p className="p-6">No booking found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      <div className="rounded-xl border overflow-hidden shadow-lg">
        <Table>

          <TableHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-white">ID</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Subject</TableHead>
              <TableHead className="text-white">Start Time</TableHead>
              <TableHead className="text-white">End Time</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Meeting</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookings.map((booking, index) => (
              <TableRow
                key={booking.id}
                className={`
                  transition-all
                  hover:bg-indigo-50 dark:hover:bg-zinc-800
                  ${index % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-gray-50 dark:bg-zinc-950"}
                `}
              >
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.userEmail}</TableCell>
                <TableCell>{booking.subject}</TableCell>
                <TableCell>
                  {booking.slotStart
                    ? new Date(booking.slotStart).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {booking.slotEnd
                    ? new Date(booking.slotEnd).toLocaleString()
                    : "-"}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "APPROVED"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : booking.status === "REJECTED"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-gray-200 dark:bg-zinc-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </TableCell>

                <TableCell>
                  {booking.meetingLink ? (
                    <a
                      href={booking.meetingLink}
                      target="_blank"
                      className="text-blue-500 hover:underline font-medium"
                    >
                      Join
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
    </div>
  );
};

export default ShowAppointment;