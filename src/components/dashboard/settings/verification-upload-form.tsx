"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadDropzone } from "@/lib/uploadthing";
import { CheckCircle2, Clock, XCircle, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { submitVerificationDocument } from "@/lib/actions/verification-methods";
import { cn } from "@/lib/utils";

interface VerificationMethod {
  id: string;
  name: string;
  description: string | null;
  isRequired: boolean;
}

interface UserVerification {
  id: string;
  methodId: string | null;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "UNVERIFIED";
  notes?: string | null;
  documentUrl?: string | null;
}

interface Props {
  userId: string;
  methods: VerificationMethod[];
  verifications: UserVerification[];
}

export function VerificationUploadForm({ userId, methods, verifications }: Props) {
  const router = useRouter();

  const getStatus = (methodId: string) => {
    const verification = verifications.find((v) => v.methodId === methodId);
    return verification?.status || "UNVERIFIED";
  };

  const getVerification = (methodId: string) => {
    return verifications.find((v) => v.methodId === methodId);
  };

  const handleUploadComplete = async (methodId: string, url: string) => {
    try {
      await submitVerificationDocument({
        userId,
        methodId,
        documentUrl: url,
      });
      toast.success("Document uploaded successfully");
      router.refresh();
    } catch {
      toast.error("Failed to submit document");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Identity Verification
        </CardTitle>
        <CardDescription>
          Upload the required documents to verify your identity and unlock seller features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {methods.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No verification requirements at this time.
          </p>
        ) : (
          methods.map((method) => {
            const status = getStatus(method.id);
            const verification = getVerification(method.id);

            return (
              <div
                key={method.id}
                className={cn(
                  "rounded-lg border p-4 transition-all",
                  status === "VERIFIED"
                    ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900"
                    : status === "REJECTED"
                    ? "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900"
                    : "bg-card"
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{method.name}</h4>
                      {method.isRequired && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.description || "Upload a valid copy of this document."}
                    </p>
                    {verification?.notes && status === "REJECTED" && (
                      <div className="mt-2 text-sm text-destructive bg-destructive/10 p-2 rounded flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>Rejection Reason: {verification.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {status === "VERIFIED" && (
                      <Badge className="bg-green-600 hover:bg-green-700 gap-1 pl-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </Badge>
                    )}
                    {status === "PENDING" && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 pl-1.5 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                        <Clock className="h-3.5 w-3.5" /> Pending Review
                      </Badge>
                    )}
                    {status === "REJECTED" && (
                      <Badge variant="destructive" className="gap-1 pl-1.5">
                        <XCircle className="h-3.5 w-3.5" /> Rejected
                      </Badge>
                    )}
                    {status === "UNVERIFIED" && (
                      <Badge variant="outline" className="gap-1 pl-1.5 text-muted-foreground">
                        <AlertCircle className="h-3.5 w-3.5" /> Not Submitted
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Upload Area - Only show if not pending/verified */}
                {(status === "UNVERIFIED" || status === "REJECTED") && (
                  <div className="border-t pt-4">
                    <UploadDropzone
                      endpoint="verificationDocument"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          handleUploadComplete(method.id, res[0].url);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`);
                      }}
                      appearance={{
                        container: "border-dashed border-2 bg-muted/30 h-32 md:h-40",
                        label: "text-primary text-sm",
                        allowedContent: "text-muted-foreground text-xs",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
