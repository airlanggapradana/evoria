"use client";

import Image from "next/image";
import { Music, Briefcase, Trophy, Sparkles, ArrowUpRight } from "lucide-react";

interface EventCategoriesProps {
  onSelectCategory?: (category: string) => void;
}

const categories = [
  {
    id: "01",
    name: "Music & Concerts",
    categoryKey: "Konser",
    description: "Live concerts, music festivals and amazing performances.",
    eventsCount: "120+ Events",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    gradient: "from-purple-600/80 to-indigo-900/90",
    icon: Music,
    iconColor: "text-purple-600 bg-purple-50",
  },
  {
    id: "02",
    name: "Business & Conferences",
    categoryKey: "Seminar",
    description: "Professional conferences, seminars and networking events.",
    eventsCount: "85+ Events",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
    gradient: "from-blue-600/80 to-slate-900/90",
    icon: Briefcase,
    iconColor: "text-blue-600 bg-blue-50",
  },
  {
    id: "03",
    name: "Sports & Outdoor",
    categoryKey: "Olahraga",
    description: "Sports tournaments, matches and outdoor adventures.",
    eventsCount: "95+ Events",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    gradient: "from-emerald-600/80 to-teal-950/90",
    icon: Trophy,
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "04",
    name: "Festivals & Parties",
    categoryKey: "Festival",
    description: "Festivals, parties and cultural events to enjoy.",
    eventsCount: "110+ Events",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    gradient: "from-pink-600/80 to-purple-950/90",
    icon: Sparkles,
    iconColor: "text-pink-600 bg-pink-50",
  },
];

const EventCategories = ({ onSelectCategory }: EventCategoriesProps) => {
  const handleCategoryClick = (categoryKey: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryKey);
    }
    const eventsSection = document.getElementById("events");
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="categories" className="relative bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/70 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-700 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
            <span>EXPLORE CATEGORIES</span>
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Browse Event Categories
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            Find the perfect experience tailored to your passion and interests.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.categoryKey)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer"
              >
                {/* Visual Image Header with Number Tag */}
                <div className="relative h-44 w-full overflow-hidden rounded-2xl sm:h-48">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />

                  {/* ID Tag */}
                  <span className="absolute top-3.5 right-3.5 rounded-full bg-black/40 px-3 py-1 font-mono text-xs font-bold text-white/90 backdrop-blur-md">
                    {cat.id}
                  </span>

                  {/* Icon Indicator */}
                  <div className="absolute bottom-3.5 left-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-slate-900 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                    <IconComponent className="h-5 w-5 text-violet-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between pt-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-violet-600 sm:text-xl">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 sm:text-sm">
                      {cat.description}
                    </p>
                  </div>

                  {/* Bottom Stats & Button */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                      {cat.eventsCount}
                    </span>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600 transition-all duration-300 group-hover:bg-violet-600 group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventCategories;
