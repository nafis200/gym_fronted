"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useBookingStore } from "@/store/useBookingStore";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Package, 
  ArrowRight,
  TrendingUp,
  Award,
  User,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

export default function UserDashboardPage() {
  const { user } = useAuthStore();
  const { userBookings, fetchUserBookings, isLoading } = useBookingStore();

  useEffect(() => {
    if (user?.id) {
      fetchUserBookings(user.id);
    }
  }, [user?.id, fetchUserBookings]);

  if (!user) return null;

  const stats = [
    { 
      label: "Total Bookings", 
      value: userBookings.length, 
      icon: Package, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10" 
    },
    { 
      label: "Upcoming Stays", 
      value: userBookings.filter(b => new Date(b.checkIn) > new Date()).length, 
      icon: Calendar, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10" 
    },
    { 
      label: "Member Status", 
      value: user.role === "PREMIUM_USER" ? "Premium" : "Standard", 
      icon: Award, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10" 
    },
    { 
      label: "Rewards Points", 
      value: "1,250", 
      icon: TrendingUp, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10" 
    },
  ];

  const recentBookings = userBookings.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-blue-600 p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
            <AvatarImage src={user.profilePhoto || ""} />
            <AvatarFallback className="text-2xl bg-white/20 text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-white/80 max-w-lg">
              It's great to see you again. Manage your luxury stays and explore exclusive member rewards from your personal dashboard.
            </p>
          </div>
          <div className="md:ml-auto">
            <Link href="/rooms">
                <Button variant="secondary" className="font-semibold bg-white text-primary hover:bg-white/90 dark:text-black">
                Book New Stay
                </Button>
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={stat.bg + " p-3 rounded-xl " + stat.color}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>You have {userBookings.length} total bookings</CardDescription>
            </div>
            <Link href="/user/bookings">
                <Button variant="ghost" size="sm" className="gap-1 border">
                View All <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4 py-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">
                          {booking.rooms?.[0]?.room?.roomType?.name || "Suite Booking"}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(booking.checkIn), "MMM dd")} - {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold whitespace-nowrap">${booking.totalAmount}</p>
                      <Badge 
                        variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}
                        className={booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-600 border-none hover:bg-emerald-500/20' : ''}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold text-lg">No bookings yet</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                    Ready to experience luxury? Start by exploring our exclusive rooms and suites.
                    </p>
                </div>
                <Link href="/rooms">
                    <Button variant="outline" size="sm">Browse Rooms</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Quick Actions & Info */}
        <div className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-1">
                    <Link href="/user/profile">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-none px-4">
                            <User className="h-4 w-4 text-primary" />
                            View Profile
                        </Button>
                    </Link>
                    <Link href="/user/settings">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-none px-4">
                            <Settings className="h-4 w-4 text-primary" />
                            Account Settings
                        </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-none px-4">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Payment Methods
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
                <CardContent className="p-6 space-y-4">
                    <div className="relative z-10 space-y-2">
                        <h3 className="text-lg font-bold">LuxeLoyalty Rewards</h3>
                        <p className="text-primary-foreground/80 text-sm">
                            You're only <span className="font-bold text-white">2 stays</span> away from reaching <span className="underline decoration-2 underline-offset-4 decoration-amber-400">Gold Status</span>!
                        </p>
                    </div>
                    <Button variant="secondary" className="w-full font-bold shadow-sm" size="sm">
                        View Benefits
                    </Button>
                </CardContent>
                <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            </Card>
        </div>
      </div>
    </div>
  );
}
