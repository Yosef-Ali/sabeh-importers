"use client";

import { useState } from "react";
import { toggleUserBan } from "@/lib/actions/admin";
import { toast } from "sonner";

interface UserBanButtonProps {
  userId: string;
  isActive: boolean;
  userName: string;
}

export function UserBanButton({ userId, isActive, userName }: UserBanButtonProps) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(isActive);

  async function handleToggle() {
    const confirmed = window.confirm(
      active
        ? `Ban ${userName}? They will no longer be able to log in.`
        : `Unban ${userName}? They will regain access.`
    );
    if (!confirmed) return;
    setLoading(true);
    try {
      await toggleUserBan(userId, !active);
      setActive(!active);
      toast.success(active ? `${userName} has been banned.` : `${userName} has been unbanned.`);
    } catch {
      toast.error("Failed to update user status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50
        ${active
          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
          : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
        }`}
    >
      {loading ? "…" : active ? "Ban" : "Unban"}
    </button>
  );
}
