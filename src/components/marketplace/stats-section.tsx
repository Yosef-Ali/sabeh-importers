"use client";

import { Package, Users, ShieldCheck, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "5,000+",
    label: "Active Listings",
    labelAm: "ንቁ ዝርዝሮች",
  },
  {
    icon: Users,
    value: "2,500+",
    label: "Verified Sellers",
    labelAm: "የተረጋገጡ ሻጮች",
  },
  {
    icon: ShieldCheck,
    value: "98%",
    label: "Satisfaction Rate",
    labelAm: "የእርካታ መጠን",
  },
  {
    icon: TrendingUp,
    value: "12M+ ብር",
    label: "Monthly Volume",
    labelAm: "ወርሃዊ ግብይት",
  },
];

export function StatsSection() {
  return (
    <section className="bg-navy py-14">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-gold" />
              </div>
              <span className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm text-white/60 font-mono uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
