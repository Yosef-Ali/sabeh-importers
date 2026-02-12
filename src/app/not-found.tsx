import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-primary font-montserrat">404</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest text-xs px-8">
              Back to Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="font-bold uppercase tracking-widest text-xs px-8">
              Browse Listings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
