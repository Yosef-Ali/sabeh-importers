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
      <div className="rounded-xl border border-green-100 bg-green-50 p-5 text-sm text-green-700 font-medium">
        Report resolved.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-bold text-[#1a2d4a]">
            Report by{" "}
            <span className="text-[#1a2d4a]">{report.reporter?.name ?? "Unknown"}</span>
            <span className="text-gray-400 font-normal"> ({report.reporter?.email})</span>
          </p>
          {report.listing && (
            <p className="text-sm text-gray-600">
              Regarding listing:{" "}
              <Link
                href={`/listings/${report.listing.id}`}
                className="text-[#1a2d4a] font-semibold hover:text-[#FCDD09] inline-flex items-center gap-1"
                target="_blank"
              >
                {report.listing.title}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </p>
          )}
          <p className="text-xs text-gray-400">
            Submitted {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 px-3 py-1 text-xs font-bold uppercase">
          <Flag className="h-3 w-3" />
          {report.status}
        </span>
      </div>

      {report.reason && (
        <div className="rounded-lg bg-[#faf8f5] border border-gray-100 p-4 text-sm text-gray-700">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Reason</p>
          {report.reason}
        </div>
      )}

      {report.description && (
        <p className="text-sm text-gray-600">{report.description}</p>
      )}

      <div className="space-y-3 pt-2 border-t border-gray-100">
        <textarea
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          placeholder="Resolution note (required)…"
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCDD09] resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={() => handleResolve("RESOLVED")}
            disabled={loading}
            className="rounded-lg bg-[#1a2d4a] text-white px-5 py-2 text-sm font-bold hover:bg-[#2d4a6f] transition-colors disabled:opacity-50"
          >
            {loading ? "…" : "Mark Resolved"}
          </button>
          <button
            onClick={() => handleResolve("DISMISSED")}
            disabled={loading}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-bold text-gray-600 hover:bg-[#faf8f5] transition-colors disabled:opacity-50"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
