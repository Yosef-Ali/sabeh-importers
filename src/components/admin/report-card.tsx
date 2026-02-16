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
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-bold text-foreground">
            Report by{" "}
            <span className="text-foreground">{report.reporter?.name ?? "Unknown"}</span>
            <span className="text-muted-foreground font-normal"> ({report.reporter?.email})</span>
          </p>
          {report.listing && (
            <p className="text-sm text-muted-foreground">
              Regarding listing:{" "}
              <Link
                href={`/listings/${report.listing.id}`}
                className="text-foreground font-semibold hover:text-accent inline-flex items-center gap-1"
                target="_blank"
              >
                {report.listing.title}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </p>
          )}
          <p className="text-xs text-muted-foreground/70">
            Submitted {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 px-3 py-1 text-xs font-bold uppercase">
          <Flag className="h-3 w-3" />
          {report.status}
        </span>
      </div>

      {report.reason && (
        <div className="rounded-lg bg-muted border border-border p-4 text-sm text-foreground">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Reason</p>
          {report.reason}
        </div>
      )}

      {report.description && (
        <p className="text-sm text-muted-foreground">{report.description}</p>
      )}

      <div className="space-y-3 pt-2 border-t border-border">
        <textarea
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          placeholder="Resolution note (required)…"
          rows={2}
          className="w-full rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={() => handleResolve("RESOLVED")}
            disabled={loading}
            className="rounded-lg bg-primary text-primary-foreground px-5 py-2 text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "…" : "Mark Resolved"}
          </button>
          <button
            onClick={() => handleResolve("DISMISSED")}
            disabled={loading}
            className="rounded-lg border border-border bg-card px-5 py-2 text-sm font-bold text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
