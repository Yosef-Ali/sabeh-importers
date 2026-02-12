"use client";

import { Shield, Lock, HeadphonesIcon, Award } from "lucide-react";

const BADGES = [
  {
    icon: <Shield className="h-5 w-5" />,
    label: "Verified Sellers",
    labelAm: "የተረጋገጡ ሻጮች",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    label: "Secure Payments",
    labelAm: "ደህንነቱ የተጠበቀ ክፍያ",
  },
  {
    icon: <Award className="h-5 w-5" />,
    label: "Ethiopian Trusted",
    labelAm: "የኢትዮጵያ አስተማማኝ",
  },
  {
    icon: <HeadphonesIcon className="h-5 w-5" />,
    label: "24/7 Support",
    labelAm: "24/7 ድጋፍ",
  },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {BADGES.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-white/80 text-sm group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#FCDD09] group-hover:bg-[#FCDD09]/20 transition-colors">
            {badge.icon}
          </div>
          <span className="font-semibold hidden sm:inline">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
