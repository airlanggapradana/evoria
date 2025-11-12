"use client";
import { Calendar, MapPin, Ticket, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";
import { useState } from "react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image: string;
  category: string;
}

const EventCard = ({
  id,
  title,
  date,
  location,
  price,
  image,
  category,
}: EventCardProps) => {
  const router = useRouter();
  const { ref, isVisible } = useScrollAnimation();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 pt-0 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60" />

          {/* Category Badge */}
          <Badge className="absolute top-4 left-4 border-0 bg-gradient-to-r from-teal-500 to-sky-500 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {category}
          </Badge>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className={`h-9 w-9 rounded-full backdrop-blur-sm ${
                isLiked
                  ? "bg-sky-500/90 text-white hover:bg-sky-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="h-9 w-9 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="space-y-4 p-5">
          {/* Title */}
          <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-bold text-white transition-all group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-sky-400 group-hover:bg-clip-text group-hover:text-transparent">
            {title}
          </h3>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
                <Calendar className="h-4 w-4 text-teal-400" />
              </div>
              <span className="text-sm">{date}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                <MapPin className="h-4 w-4 text-purple-400" />
              </div>
              <span className="line-clamp-1 text-sm">{location}</span>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-teal-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">From</span>
                  <span className="text-lg font-bold text-white">{price}</span>
                </div>
              </div>

              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/event/${id}`);
                }}
                className="bg-gradient-to-r from-teal-500 to-sky-500 px-6 font-semibold transition-all hover:scale-105 hover:from-teal-600 hover:to-sky-600"
              >
                Book Now
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Hover Glow Effect */}
        <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-teal-500/10 to-purple-500/10" />
        </div>
      </Card>
    </div>
  );
};

export default EventCard;
