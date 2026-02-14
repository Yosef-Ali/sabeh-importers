"use client";

import React, { useState } from "react";
import { UserPlus, Loader2, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { inviteUser } from "@/lib/actions/admin";

type Role = "SELLER" | "BUYER" | "STAFF" | "MANAGER" | "DISTRIBUTOR";

export function InviteUserButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", role: "SELLER" as Role });

  function reset() {
    setOpen(false);
    setError(null);
    setInviteLink(null);
    setCopied(false);
    setForm({ name: "", email: "", role: "SELLER" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await inviteUser(form.name, form.email, form.role);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setInviteLink(result.verifyLink);
  }

  async function copyLink() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2" size="sm">
        <UserPlus className="h-4 w-4" /> Invite User
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-background rounded-xl border border-border shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold">Invite New User</h2>
          <button
            type="button"
            onClick={reset}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {inviteLink ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              User <strong>{form.name}</strong> ({form.email}) has been created.
              Share this link so they can verify their email and set a password.
              The link expires in <strong>7 days</strong>.
            </p>
            <div className="flex items-center gap-2">
              <Input value={inviteLink} readOnly className="font-mono text-xs" />
              <Button type="button" variant="outline" size="icon" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              In dev mode the link is also printed to the server console.
            </p>
            <Button className="w-full" onClick={reset}>Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="inv-name">Full name</Label>
              <Input
                id="inv-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Abebe Girma"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inv-email">Email address</Label>
              <Input
                id="inv-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as Role })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SELLER">Seller</SelectItem>
                  <SelectItem value="BUYER">Buyer</SelectItem>
                  <SelectItem value="DISTRIBUTOR">Distributor</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={reset}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Invite
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
