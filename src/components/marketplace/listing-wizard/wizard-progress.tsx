import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    title: string;
    titleAm?: string;
  }>;
  language?: "en" | "am";
}

export function WizardProgress({
  currentStep,
  totalSteps,
  steps,
  language = "en",
}: WizardProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center font-display font-bold text-sm transition-all shadow-hard",
                    isCompleted &&
                      "bg-primary border-primary text-primary-foreground",
                    isCurrent && "bg-accent border-accent text-primary",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-white border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    "absolute top-12 text-xs font-mono whitespace-nowrap",
                    isCurrent ? "text-primary font-bold" : "text-muted-foreground"
                  )}
                >
                  {language === "am" && step.titleAm ? step.titleAm : step.title}
                </span>
              </div>

              {/* Connector Line */}
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
