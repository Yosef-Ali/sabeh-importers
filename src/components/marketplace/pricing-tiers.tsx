"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeToPlan } from "@/lib/actions/subscription";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

interface PricingTiersProps {
  isFreeMode?: boolean;
}

export function PricingTiers({ isFreeMode = false }: PricingTiersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = (planId: string) => {
    startTransition(async () => {
      try {
        const result = await subscribeToPlan(planId);
        if (result.error) {
          toast.error(result.error);
          if (result.error.includes("logged in")) {
            router.push("/login?callbackUrl=/");
          }
        } else if (result.success && result.redirectUrl) {
          toast.success("Successfully subscribed!");
          router.push(result.redirectUrl);
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <section className="py-24 bg-background" id="pricing">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="mb-16">
          <h2 className="font-amharic text-4xl font-bold uppercase text-foreground mb-4">
            የአገልግሎት ደረጃዎች (Packages)
          </h2>
          <p className="text-xl text-muted-foreground font-amharic max-w-3xl">
            ተሽከርካሪዎች፣ ማሽነሪዎች እና የንግድ እቃዎች በቀላሉ መሸጥ የሚችሉበት አስተማማኝ መድረክ።
            {isFreeMode && <span className="block mt-2 text-accent font-bold animate-pulse">*** አሁን ለተወሰነ ጊዜ በነጻ! (Limited Time Free Offer) ***</span>}
          </p>
          <div className="w-24 h-2 bg-gold mt-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Deckhand - Class C */}
          <div className="bg-card border border-border p-8 flex flex-col shadow-hard hover:shadow-hard-hover transition-all">
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="font-mono text-xs uppercase text-muted-foreground font-bold">
                  ደረጃ 1
                </span>
                <h3 className="font-display text-3xl font-bold uppercase text-foreground">ነጻ (Free)</h3>
              </div>
              <span className="font-mono text-2xl font-bold text-foreground">0 ብር</span>
            </div>
            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-foreground">
                <CheckCircle2 className="text-green-500 h-5 w-5" />
                መደበኛ ፍለጋ
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-foreground">
                <CheckCircle2 className="text-green-500 h-5 w-5" />
                ለ30 ቀናት የሚቆይ
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-muted-foreground">
                <XCircle className="h-5 w-5" /> የባለሙያ ማረጋገጫ የለውም
              </li>
            </ul>
             <Button 
                onClick={() => handleSubscribe("plan_free")}
                variant="outline" 
                className="w-full border-2 border-foreground text-foreground font-bold uppercase tracking-widest hover:bg-foreground hover:text-background h-12 rounded-none mt-auto"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "ይጀምሩ"}
              </Button>
          </div>

          {/* Officer - Class B */}
          <div className="bg-card border-2 border-foreground p-8 flex flex-col shadow-hard hover:shadow-hard-hover transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-foreground text-background px-4 py-1 font-mono text-[10px] uppercase font-bold">
              ታዋቂ ምርጫ
            </div>
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="font-mono text-xs uppercase text-muted-foreground font-bold">
                  ደረጃ 2
                </span>
                <h3 className="font-display text-3xl font-bold uppercase text-foreground">መደበኛ</h3>
              </div>
              <span className={cn("font-mono text-2xl font-bold text-foreground", isFreeMode && "text-accent")}>
                {isFreeMode ? "0 ብር (ቅናሽ)" : "500 ብር"}
              </span>
            </div>
            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-foreground">
                <CheckCircle2 className="text-green-500 h-5 w-5" />
                ቅድሚያ የሚሰጠው
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-foreground">
                <CheckCircle2 className="text-green-500 h-5 w-5" />
                ለ60 ቀናት የሚቆይ
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-foreground">
                <ShieldCheck className="text-green-500 h-5 w-5" />
                የተረጋገጠ አቅራቢ (Badge)
              </li>
            </ul>
            <Button 
              onClick={() => handleSubscribe("plan_pro")}
              className="w-full bg-foreground text-background font-bold uppercase tracking-widest hover:bg-foreground/80 h-12 rounded-none shadow-md mt-auto"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (isFreeMode ? "በነጻ ይጀምሩ" : "ይህንን ይምረጡ")}
            </Button>
          </div>

          {/* Captain - Class A */}
          <div className="bg-navy text-white border-2 border-navy p-8 flex flex-col shadow-hard-yellow hover:shadow-hard-hover transition-all relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-gold text-navy px-4 py-1 font-mono text-[10px] uppercase font-bold">
              ሁሉንም ያካተተ
            </div>
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="font-mono text-xs uppercase text-white/60 font-bold">
                  ደረጃ 3
                </span>
                <h3 className="font-display text-3xl font-bold uppercase text-white">ፕሪሚየም</h3>
              </div>
              <span className={cn("font-mono text-2xl font-bold text-gold", isFreeMode && "text-white")}>
                {isFreeMode ? "0 ብር (ቅናሽ)" : "2,000 ብር"}
              </span>
            </div>
            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-white">
                <CheckCircle2 className="text-gold h-5 w-5" />
                ሁሉም ጥቅማጥቅሞች
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-white">
                <CheckCircle2 className="text-gold h-5 w-5" />
                ያልተገደበ ዝርዝር
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-white">
                <CheckCircle2 className="text-gold h-5 w-5" />
                የመጀመሪያ ደረጃ ድጋፍ
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-white">
                <ShieldCheck className="text-gold h-5 w-5" />
                ወርቃማ ባጅ (Gold Badge)
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-white">
                <ShieldCheck className="text-gold h-5 w-5" />
                ያልተገደበ ጊዜ
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-white">
                <ShieldCheck className="text-gold h-5 w-5" />
                ከፊት ገጽ ላይ የሚቀመጥ
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-white">
                <ShieldCheck className="text-gold h-5 w-5" />
                የሎጅስቲክስ ድጋፍ
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-white">
                <ShieldCheck className="text-gold h-5 w-5" />
                ፕሮፌሽናል ፎቶግራፍ
              </li>
            </ul>
            <Button 
              onClick={() => handleSubscribe("plan_business")}
              className="w-full bg-gold text-navy font-bold uppercase tracking-widest hover:bg-gold/90 h-12 rounded-none shadow-md mt-auto"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (isFreeMode ? "በነጻ ይጀምሩ" : "ይህንን ይምረጡ")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
