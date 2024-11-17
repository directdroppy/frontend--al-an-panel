import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description?: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;

          return (
            <div
              key={step.title}
              className={cn(
                "flex flex-col items-center relative",
                index !== steps.length - 1 && "flex-1"
              )}
            >
              {/* Bağlantı çizgisi */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 w-full h-[2px] -right-2",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}

              {/* Adım dairesi */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "border-border bg-background"
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Adım başlığı ve açıklaması */}
              <div className="mt-4 text-center">
                <div
                  className={cn(
                    "text-sm font-medium",
                    (isActive || isCompleted) && "text-primary"
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}