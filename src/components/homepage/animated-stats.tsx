"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Package } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  label: string;
  labelAm: string;
  value: number;
  suffix: string;
}

const STATS: Stat[] = [
  {
    icon: <Package className="h-6 w-6" />,
    label: "Active Listings",
    labelAm: "ንቁ ማስታወቂያዎች",
    value: 150000,
    suffix: "+",
  },
  {
    icon: <Users className="h-6 w-6" />,
    label: "Verified Sellers",
    labelAm: "የተረጋገጡ ሻጮች",
    value: 50000,
    suffix: "+",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    label: "Happy Buyers",
    labelAm: "ደስተኛ ገዢዎች",
    value: 1000000,
    suffix: "+",
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K";
  }
  return num.toString();
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {formatNumber(count)}
      {count >= value && suffix}
    </span>
  );
}

export function AnimatedStats() {
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12">
      {STATS.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 hover:border-[#FCDD09]/30 transition-all group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCDD09]/20 text-[#FCDD09] group-hover:bg-[#FCDD09]/30 transition-colors">
            {stat.icon}
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-xs text-white/60 uppercase tracking-wide font-bold">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
