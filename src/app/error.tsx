"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <span className="material-symbols-outlined text-3xl text-destructive">error</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8">
          <Button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest text-xs px-8"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
