"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Coffee, HelpCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { Hero } from "@/components/layout/Hero";
import { Statistics } from "@/components/layout/Statistics";
import { Gallery } from "@/components/layout/Gallery";
import { useRoomStore } from "@/store/useRoomStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { roomTypes, isLoading, fetchRoomTypes } = useRoomStore();
  
  // Search state
  const [checkIn, setCheckIn] = React.useState("");
  const [checkOut, setCheckOut] = React.useState("");
  const [guests, setGuests] = React.useState("");
  
  // Cast t to any or specific type to access faq if needed, 
  // but usually useTranslation returns a proxy or a broad object.
  // Given the previous usage: t("hero.title")
  const faqData = (t as any)("faq") || { title: "FAQ", items: [] };

  React.useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (guests) params.append("guests", guests);
    
    const queryString = params.toString();
    router.push(queryString ? `/rooms?${queryString}` : "/rooms");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Statistics />
      <Gallery />

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to LuxeStay</h2>
          <Separator className="w-24 mx-auto bg-primary h-1 rounded-full" />
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Nestled in the heart of the city, LuxeStay offers a sanctuary of tranquility and sophistication. 
            Whether you are traveling for business or leisure, our world-class amenities and impeccable service 
            ensure a memorable stay.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Star, title: "5-Star Rating", desc: "Award-winning service and hospitality." },
              { icon: MapPin, title: "Prime Location", desc: "Steps away from major attractions." },
              { icon: Coffee, title: "Luxury Dining", desc: "Exquisite culinary experiences." },
            ].map((feature, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-none bg-muted/30">
                <CardContent className="p-6 text-center pt-8">
                  <feature.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms Preview */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">{t("rooms.title")}</h2>
            <Link href="/rooms">
              <Button variant="ghost" className="gap-2 group">
                View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {isLoading ? (
               [1, 2, 3].map((i) => (
                 <Card key={i} className="overflow-hidden animate-pulse">
                   <div className="h-64 bg-slate-200" />
                   <CardHeader className="space-y-2">
                     <div className="h-6 bg-slate-200 w-3/4 rounded" />
                     <div className="h-4 bg-slate-200 w-1/2 rounded" />
                   </CardHeader>
                   <CardContent>
                     <div className="h-10 bg-slate-200 rounded" />
                   </CardContent>
                 </Card>
               ))
             ) : (
               roomTypes.slice(0, 3).map((type: any) => (
                 <Card key={type.id} className="overflow-hidden hover:shadow-xl transition-all border-none shadow-md bg-background">
                   <div className="h-64 relative overflow-hidden group">
                      <Image 
                        src={type.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"} 
                        alt={type.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                   </div>
                   <CardHeader>
                     <div className="flex justify-between items-start mb-1">
                       <CardTitle>{type.name}</CardTitle>
                       <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                         {type.rooms?.length || 0} {type.rooms?.length === 1 ? "Room" : "Rooms"} Available
                       </span>
                     </div>
                     <CardDescription className="line-clamp-2">{type.description}</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <div className="flex justify-between items-center">
                       <span className="text-lg font-bold text-primary">
                         ${type.price} <span className="text-sm font-normal text-muted-foreground">{t("rooms.perNight")}</span>
                       </span>
                         <Link href={`/rooms/${type.id}`}>
                           <Button size="sm">{t("rooms.viewDetail")}</Button>
                         </Link>
                     </div>
                   </CardContent>
                 </Card>
               ))
             )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold mb-4">{faqData.title}</h2>
             <p className="text-muted-foreground">{faqData.subtitle}</p>
           </div>
           
           <Accordion type="single" collapsible className="w-full space-y-4">
             {faqData.items.map((item: any, i: number) => (
               <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4 bg-muted/20 border-none shadow-sm">
                 <AccordionTrigger className="hover:no-underline font-medium text-left">
                   {item.q}
                 </AccordionTrigger>
                 <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                   {item.a}
                 </AccordionContent>
               </AccordionItem>
             ))}
           </Accordion>
        </div>
      </section>
    </div>
  );
}
