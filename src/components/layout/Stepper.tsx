interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  showDescriptions?: boolean;
}

export function Stepper({ steps, currentStep, onStepClick, showDescriptions = false }: StepperProps) {
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
                ? "bg-[#FAAE3A] text-[#404042] border-[#FFD95A] shadow-lg"
                : currentStep > idx
                ? "bg-[#FFD95A] text-white border-[#FFD95A]"
                : "bg-gray-200 text-[#4C3D3D] border-gray-200"}
            `}
            onClick={() => onStepClick(idx)}
            type="button"
            style={{ minWidth: 48 }}
          >
            {idx + 1}
          </button>
          <div className="flex flex-col items-center">
            <span
              className={`text-xs text-center mt-1 truncate ${currentStep === idx ? "font-bold text-[#4C3D3D]" : "text-gray-500"}`}
              style={{ maxWidth: 90, width: '90px', display: 'block' }}
              title={step.label}
            >
              {step.label}
            </span>
            {showDescriptions && step.description && (
              <span className="text-xs text-gray-500 text-center mt-1 max-w-[120px]">
                {step.description}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 