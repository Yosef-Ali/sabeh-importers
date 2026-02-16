import React from "react";
import { SettingsClient } from "./client";
import { getVerificationMethods, getUserVerifications } from "@/lib/actions/verification-methods";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = getSession();

  if (!session) {
    redirect("/login");
  }

  const methods = await getVerificationMethods();
  const verifications = await getUserVerifications(session.userId);

  return (
    <SettingsClient 
      verificationMethods={methods} 
      userVerifications={verifications} 
    />
  );
}
