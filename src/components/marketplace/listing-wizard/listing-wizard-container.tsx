"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListingWizard, ListingFormData } from "./listing-wizard";
import { Step1Details } from "./step-1-details";
import { Step2Visibility } from "./step-2-visibility";
import { createListing } from "@/lib/actions/marketplace";

interface ListingWizardContainerProps {
  categories: Array<{
    id: string;
    name: string;
    nameAmharic?: string | null;
  }>;
  language?: "en" | "am";
}

export function ListingWizardContainer({
  categories,
  language = "en",
}: ListingWizardContainerProps) {
  const router = useRouter();

  const handleSubmit = async (data: ListingFormData) => {
    try {
      // Transform data to match createListing action expectations
      const formData = new FormData();
      formData.append("categoryId", data.categoryId);
      formData.append("title", data.title);
      if (data.titleAmharic) {
        formData.append("titleAmharic", data.titleAmharic);
      }
      formData.append("description", data.description);
      if (data.descriptionAmharic) {
        formData.append("descriptionAmharic", data.descriptionAmharic);
      }
      formData.append("price", data.price.toString());
      formData.append("currency", data.currency || "ETB");
      formData.append("negotiable", data.negotiable ? "true" : "false");
      formData.append("condition", data.condition);
      formData.append("city", data.city);
      if (data.region) {
        formData.append("location", data.region);
      }

      // Add images as JSON array for now (will be enhanced with R2 integration)
      if (data.images && data.images.length > 0) {
        formData.append("images", JSON.stringify(data.images));
      }

      // Add pricing tier metadata
      formData.append("pricingTier", data.pricingTier || "deckhand");
      formData.append("publishNow", data.publishNow !== false ? "true" : "false");

      // Call the server action
      const result = await createListing(formData);

      if (result.error) {
        alert(
          language === "am"
            ? `ዝርዝር መፍጠር አልተቻለም: ${result.error}`
            : `Failed to create listing: ${result.error}`
        );
        return;
      }

      // Success!
      alert(
        language === "am"
          ? "ዝርዝርዎ በተሳካ ሁኔታ ታትሟል! ገዢዎች ዝርዝርዎን ማየት ይችላሉ"
          : "Your listing has been published successfully! Buyers can now see your listing"
      );

      // Redirect to the listing or dashboard
      if (result.listingId) {
        router.push(`/listings/${result.listingId}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting listing:", error);
      alert(
        language === "am"
          ? "ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ"
          : "An error occurred. Please try again"
      );
    }
  };

  return (
    <ListingWizard onSubmit={handleSubmit} language={language}>
      {/* Step 1: Listing Details */}
      {(props: any) => (
        <Step1Details {...props} categories={categories} language={language} />
      )}

      {/* Step 2: Visibility & Pricing */}
      {(props: any) => <Step2Visibility {...props} language={language} />}
    </ListingWizard>
  );
}
