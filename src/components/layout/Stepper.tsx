import { CORPORATE_COLORS } from "@/constants/colors";

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center gap-6 mb-8 mt-6">
      {steps.map((step, idx) => (
        <button
          key={idx}
          className="flex flex-col items-center font-bold focus:outline-none"
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
          }}
          onClick={() => onStepClick(idx)}
          type="button"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mb-1 transition-colors duration-200 ${
              currentStep === idx
                ? "text-white"
                : "text-[#404042] bg-gray-200"
            }`}
            style={{
              background: currentStep === idx ? CORPORATE_COLORS.yellow : "#e5e7eb",
            }}
          >
            {idx + 1}
          </div>
          <span
            className="text-xs text-center"
            style={{
              color: currentStep === idx ? CORPORATE_COLORS.dark : CORPORATE_COLORS.dark,
              fontWeight: currentStep === idx ? "bold" : "normal",
            }}
          >
            {step.label}
          </span>
        </button>
      ))}
    </div>
  );
} 