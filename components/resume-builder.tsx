"use client"

import { useState } from "react"
import { WizardSteps } from "./wizard-steps"
import { PersonalInfoForm } from "./forms/personal-info-form"
import { EducationForm } from "./forms/education-form"
import { ExperienceForm } from "./forms/experience-form"
import { SkillsLanguagesForm } from "./forms/skills-languages-form"
import { ResumePreview } from "./resume-preview"
import { DataManagement } from "./data-management"
import { Button } from "./ui/button"
import { useResumeData } from "@/hooks/use-resume-data"
import { Loader2 } from "lucide-react"

const STEPS = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Education" },
  { id: 3, title: "Experience" },
  { id: 4, title: "Skills & Languages" },
  { id: 5, title: "Preview" },
]

export function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const { resumeData, updateResumeData, validateStep, isLoading } = useResumeData()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your resume data...</p>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || stepId === currentStep + 1) {
      setCurrentStep(stepId)
    }
  }

  const handleEditResume = () => {
    setCurrentStep(1)
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoForm data={resumeData} onUpdate={updateResumeData} />
      case 2:
        return <EducationForm data={resumeData} onUpdate={updateResumeData} />
      case 3:
        return <ExperienceForm data={resumeData} onUpdate={updateResumeData} />
      case 4:
        return <SkillsLanguagesForm data={resumeData} onUpdate={updateResumeData} />
      case 5:
        return <ResumePreview data={resumeData} onEdit={handleEditResume} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Data Management */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Europass Resume Builder</h1>
              <p className="text-gray-600">Create your professional nursing resume</p>
            </div>
            <DataManagement />
          </div>
          <WizardSteps steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">{renderCurrentStep()}</div>
      </div>

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
