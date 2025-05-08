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
    <div className="flex items-center justify-between mb-8 mt-6 w-full max-w-4xl mx-auto">
      {steps.map((step, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center relative min-w-0">
          {/* Línea de conexión a la izquierda */}
          {idx > 0 && (
            <div className="absolute left-0 top-5 -translate-y-1/2 w-1/2 h-1 bg-gray-200 z-0" />
          )}
          {/* Línea de conexión a la derecha */}
          {idx < steps.length - 1 && (
            <div className="absolute right-0 top-5 -translate-y-1/2 w-1/2 h-1 bg-gray-200 z-0" />
          )}
          <button
            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-colors duration-200 border-4
              ${currentStep === idx
                ? "bg-[#FAAE3A] text-white border-[#F17625] shadow-lg"
                : "bg-gray-200 text-[#404042] border-gray-200"}
            `}
            onClick={() => onStepClick(idx)}
            type="button"
            style={{ minWidth: 48 }}
          >
            {idx + 1}
          </button>
          <span
            className={`text-xs text-center mt-1 truncate ${currentStep === idx ? "font-bold text-[#404042]" : "text-gray-500"}`}
            style={{ maxWidth: 90, width: '90px', display: 'block' }}
            title={step.label}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
} 