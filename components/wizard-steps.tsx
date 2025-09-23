"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  id: number
  title: string
}

interface WizardStepsProps {
  steps: Step[]
  currentStep: number
  onStepClick: (stepId: number) => void
}

export function WizardSteps({ steps, currentStep, onStepClick }: WizardStepsProps) {
  return (
    <div className="flex justify-center items-center space-x-4">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = step.id < currentStep
        const isClickable = step.id <= currentStep || step.id === currentStep + 1

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                isActive && "bg-blue-600 border-blue-600 text-white",
                isCompleted && "bg-green-600 border-green-600 text-white",
                !isActive && !isCompleted && "border-gray-300 text-gray-500",
                isClickable && "cursor-pointer hover:border-blue-400",
                !isClickable && "cursor-not-allowed opacity-50",
              )}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-semibold">{step.id}</span>}
            </button>
            <span
              className={cn(
                "ml-2 text-sm font-medium",
                isActive && "text-blue-600",
                isCompleted && "text-green-600",
                !isActive && !isCompleted && "text-gray-500",
              )}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={cn("w-8 h-0.5 mx-4", step.id < currentStep ? "bg-green-600" : "bg-gray-300")} />
            )}
          </div>
        )
      })}
    </div>
  )
}
