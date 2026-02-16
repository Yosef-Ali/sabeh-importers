"use client";

import { useState } from "react";
import { resolveReport } from "@/lib/actions/admin";
import { ExternalLink, Flag } from "lucide-react";
import Link from "next/link";

interface ReportCardProps {
  report: any;
}

export function ReportCard({ report }: ReportCardProps) {
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [resolution, setResolution] = useState("");

  async function handleResolve(status: "RESOLVED" | "DISMISSED") {
    if (!resolution.trim()) {
      alert("Please enter a resolution note.");
      return;
    }
    setLoading(true);
    await resolveReport(report.id, status, resolution);
    setResolved(true);
    setLoading(false);
  }

  if (resolved) {
    return (
      <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 p-5 text-sm text-green-700 dark:text-green-300 font-medium">
        Report resolved.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-6 shadow-card space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-display font-bold text-primary">
            Report by{" "}
            <span className="text-primary">{report.reporter?.name ?? "Unknown"}</span>
            <span className="text-muted-foreground font-normal font-mono text-sm"> ({report.reporter?.email})</span>
          </p>
          {report.listing && (
            <p className="text-sm text-muted-foreground font-mono">
              Regarding listing:{" "}
              <Link
                href={`/listings/${report.listing.id}`}
                className="text-primary font-display font-semibold hover:text-accent inline-flex items-center gap-1"
                target="_blank"
              >
                {report.listing.title}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </p>
          )}
          <p className="text-xs text-muted-foreground/70 font-mono">
            Submitted {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-button text-xs font-mono font-bold border bg-red-100 text-red-700 border-red-200 uppercase">
          <Flag className="h-3 w-3" />
          {report.status}
        </span>
      </div>

      {report.reason && (
        <div className="rounded-card bg-primary/5 border-2 border-primary/10 p-4 text-sm text-foreground">
          <p className="text-xs font-mono font-bold text-primary uppercase tracking-wider mb-1">Reason</p>
          {report.reason}
        </div>
      )}

      {report.description && (
        <p className="text-sm text-muted-foreground">{report.description}</p>
      )}

      <div className="space-y-3 pt-2 border-t-2 border-primary/10">
        <textarea
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          placeholder="Resolution note (required)…"
          rows={2}
          className="w-full rounded-card border-2 border-primary/10 bg-white dark:bg-card text-foreground placeholder:text-muted-foreground px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={() => handleResolve("RESOLVED")}
            disabled={loading}
            className="rounded-button bg-primary text-primary-foreground px-5 py-2 text-sm font-display font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "…" : "Mark Resolved"}
          </button>
          <button
            onClick={() => handleResolve("DISMISSED")}
            disabled={loading}
            className="rounded-button border-2 border-primary/10 bg-white dark:bg-card px-5 py-2 text-sm font-display font-bold text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
