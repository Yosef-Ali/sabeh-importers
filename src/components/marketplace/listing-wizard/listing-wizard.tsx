"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WizardProgress } from "./wizard-progress";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

type StepRenderProp = (props: {
  formData: Partial<ListingFormData>;
  updateFormData: (data: Partial<ListingFormData>) => void;
  language: "en" | "am";
}) => React.ReactNode;

interface ListingWizardProps {
  initialData?: Partial<ListingFormData>;
  onSubmit: (data: ListingFormData) => Promise<void>;
  language?: "en" | "am";
  children: StepRenderProp[];
}

export interface ListingFormData {
  // Step 1: Listing Details
  categoryId: string;
  title: string;
  titleAmharic?: string;
  description: string;
  descriptionAmharic?: string;
  price: number;
  currency: string;
  negotiable: boolean;
  condition: string;
  images: string[];
  city: string;
  region: string;
  customFields: Record<string, any>;

  // Step 2: Visibility & Pricing
  pricingTier: "deckhand" | "officer" | "captain";
  publishNow: boolean;
}

const WIZARD_STEPS = [
  {
    title: "Listing Details",
    titleAm: "የዝርዝር ዝርዝሮች",
  },
  {
    title: "Visibility & Pricing",
    titleAm: "ታይነት እና ዋጋ አወጣጥ",
  },
];

export function ListingWizard({
  initialData,
  onSubmit,
  language = "en",
  children,
}: ListingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ListingFormData>>(
    initialData || {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);

  // Auto-save draft to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        localStorage.setItem("listing-draft", JSON.stringify(formData));
        setIsDraftSaving(true);
        setTimeout(() => setIsDraftSaving(false), 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("listing-draft");
    if (draft && !initialData) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(parsed);
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, [initialData]);

  const updateFormData = (data: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData as ListingFormData);
      // Clear draft on successful submit
      localStorage.removeItem("listing-draft");
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("listing-draft", JSON.stringify(formData));
    setIsDraftSaving(true);
    setTimeout(() => setIsDraftSaving(false), 2000);
  };

  const isLastStep = currentStep === WIZARD_STEPS.length;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
            {language === "am" ? "አዲስ ዝርዝር ፍጠር" : "Create New Listing"}
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            {language === "am"
              ? "የእርስዎን እቃ ለመሸጥ ዝርዝሮችን ያስገቡ"
              : "Fill in the details to list your item for sale"}
          </p>
        </div>

        {/* Progress Indicator */}
        <WizardProgress
          currentStep={currentStep}
          totalSteps={WIZARD_STEPS.length}
          steps={WIZARD_STEPS}
          language={language}
        />

        {/* Draft Save Indicator */}
        {isDraftSaving && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded-button">
              <Save className="h-3 w-3" />
              {language === "am" ? "ረቂቅ ተቀምጧል" : "Draft saved"}
            </span>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-card border-2 border-primary/10 shadow-card p-6 md:p-8 mb-6">
          {/* Render current step's child component */}
          {children[currentStep - 1]?.({
            formData,
            updateFormData,
            language: language || "en",
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {/* Back Button */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="font-display"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "am" ? "ተመለስ" : "Back"}
          </Button>

          <div className="flex items-center gap-3">
            {/* Save Draft Button */}
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleSaveDraft}
              disabled={isDraftSaving}
              className="font-display"
            >
              <Save className="mr-2 h-4 w-4" />
              {language === "am" ? "ረቂቅ አስቀምጥ" : "Save Draft"}
            </Button>

            {/* Next/Submit Button */}
            {isLastStep ? (
              <Button
                type="button"
                variant="accent"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="font-display font-bold"
              >
                {isSubmitting
                  ? language === "am"
                    ? "በማተም ላይ..."
                    : "Publishing..."
                  : language === "am"
                  ? "አትም"
                  : "Publish Listing"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="accent"
                size="lg"
                onClick={handleNext}
                className="font-display"
              >
                {language === "am" ? "ቀጥል" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Step Indicator Text */}
        <div className="mt-4 text-center text-sm text-muted-foreground font-mono">
          {language === "am" ? "ደረጃ" : "Step"} {currentStep} {language === "am" ? "ከ" : "of"}{" "}
          {WIZARD_STEPS.length}
        </div>
      </div>
    </div>
  );
}
