import { Package, Eye, MessageSquare, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    total: number;
    active: number;
    totalViews: number;
    unreadMessages: number;
  };
  language?: "en" | "am";
}

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Listings",
    labelAm: "ጠቅላላ ዝርዝሮች",
    icon: Package,
    bgClass: "bg-primary/10",
    textClass: "text-primary",
  },
  {
    key: "active",
    label: "Active",
    labelAm: "ንቁ",
    icon: CheckCircle,
    bgClass: "bg-green-500/10",
    textClass: "text-green-600",
  },
  {
    key: "totalViews",
    label: "Total Views",
    labelAm: "ጠቅላላ እይታዎች",
    icon: Eye,
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-600",
  },
  {
    key: "unreadMessages",
    label: "Messages",
    labelAm: "መልዕክቶች",
    icon: MessageSquare,
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-600",
  },
] as const;

export function DashboardStats({
  stats,
  language = "en",
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];

        return (
          <div
            key={card.key}
            className="bg-white rounded-card border-2 border-primary/10 p-6 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${card.bgClass} rounded-button flex items-center justify-center`}
              >
                <Icon className={`h-6 w-6 ${card.textClass}`} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-primary">
                  {value.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
              {language === "am" ? card.labelAm : card.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
