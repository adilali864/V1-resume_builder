"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ResumePreview } from "./resume-preview"
import { PersonalInfoForm } from "./forms/personal-info-form"
import { EducationForm } from "./forms/education-form"
import { ExperienceForm } from "./forms/experience-form"
import { SkillsLanguagesForm } from "./forms/skills-languages-form"
import { WizardSteps } from "./wizard-steps"
import { useResumeData } from "@/hooks/use-resume-data"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"
import type { ResumeData } from "@/types/resume"

const EDIT_STEPS = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Education" },
  { id: 3, title: "Experience" },
  { id: 4, title: "Skills & Languages" },
  { id: 5, title: "Preview" },
]

type AIBuilderStep = "upload" | "processing" | "extracted" | "editing" | "preview"

export function AIResumeBuilder() {
  const [step, setStep] = useState<AIBuilderStep>("upload")
  const [editStep, setEditStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { resumeData, updateResumeData, setResumeData } = useResumeData()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please upload a PDF, DOC, or DOCX file")
        setFile(null)
      }
    }
  }

  const extractResumeData = async () => {
    if (!file) return

    setStep("processing")
    setError(null)

    try {
      console.log("[v0] Starting file extraction for:", file.name)

      const fileContent = await extractTextFromFile(file)
      console.log("[v0] Extracted text length:", fileContent.length)

      const response = await fetch("/api/extract-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileContent, // Send fileContent instead of file
          filename: file.name,
        }),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error:", errorData)
        throw new Error(errorData.error || "Failed to extract resume data")
      }

      const data = await response.json()
      console.log("[v0] Extracted data:", data)

      setExtractedData(data.resumeData)
      setResumeData(data.resumeData)
      setStep("extracted")
    } catch (err) {
      console.error("[v0] Extraction error:", err)
      setError(err instanceof Error ? err.message : "Failed to extract resume data")
      setStep("upload")
    }
  }

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      if (file.type === "application/pdf") {
        // For PDFs, we'll read as text for now (basic extraction)
        // In production, you'd want to use a proper PDF parser like pdf-parse
        reader.readAsText(file)
      } else {
        // For DOC/DOCX files, read as text
        reader.readAsText(file)
      }

      reader.onload = () => {
        const result = reader.result as string
        if (result.length < 50) {
          // If text extraction failed, try reading as binary and convert
          const binaryReader = new FileReader()
          binaryReader.readAsArrayBuffer(file)
          binaryReader.onload = () => {
            // For now, return filename as fallback
            resolve(
              `Resume file: ${file.name}\nPlease note: This is a ${file.type} file that may require specialized parsing.`,
            )
          }
          binaryReader.onerror = () => reject(new Error("Failed to read file"))
        } else {
          resolve(result)
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
    })
  }

  const handleStartEditing = () => {
    setStep("editing")
    setEditStep(1)
  }

  const handlePreview = () => {
    setStep("preview")
  }

  const handleEditStep = (stepId: number) => {
    setEditStep(stepId)
  }

  const handleNextEditStep = () => {
    if (editStep < EDIT_STEPS.length) {
      setEditStep(editStep + 1)
    } else {
      setStep("preview")
    }
  }

  const handlePrevEditStep = () => {
    if (editStep > 1) {
      setEditStep(editStep - 1)
    }
  }

  const renderEditStep = () => {
    switch (editStep) {
      case 1:
        return <PersonalInfoForm data={resumeData} onUpdate={updateResumeData} />
      case 2:
        return <EducationForm data={resumeData} onUpdate={updateResumeData} />
      case 3:
        return <ExperienceForm data={resumeData} onUpdate={updateResumeData} />
      case 4:
        return <SkillsLanguagesForm data={resumeData} onUpdate={updateResumeData} />
      case 5:
        return <ResumePreview data={resumeData} onEdit={() => setEditStep(1)} />
      default:
        return null
    }
  }

  if (step === "upload") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your existing resume and let AI extract all the information automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="resume-file">Select Resume File</Label>
                <Input
                  id="resume-file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
              </div>

              {file && (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-sm text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}

              <Button onClick={extractResumeData} disabled={!file} className="w-full" size="lg">
                Extract Resume Data
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>AI will extract:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <span>• Personal Information</span>
                  <span>• Work Experience</span>
                  <span>• Education</span>
                  <span>• Skills & Languages</span>
                  <span>• Certifications</span>
                  <span>• Projects & Awards</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <h2 className="text-xl font-semibold mb-2">Processing Your Resume</h2>
          <p className="text-gray-600">AI is extracting data from your resume...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
        </div>
      </div>
    )
  }

  if (step === "extracted") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Data Extracted Successfully!</CardTitle>
              <CardDescription>
                AI has extracted your resume data. Review and edit as needed, then generate your Europass resume.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">What was extracted:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✓ Personal Information</li>
                    <li>✓ {extractedData?.education.length || 0} Education entries</li>
                    <li>✓ {extractedData?.experience.length || 0} Work experiences</li>
                    <li>✓ {extractedData?.languages.length || 0} Languages</li>
                    <li>✓ {extractedData?.medicalSkills.length || 0} Medical skills</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Next steps:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>1. Review extracted data</li>
                    <li>2. Edit any incorrect information</li>
                    <li>3. Add missing details</li>
                    <li>4. Generate final resume</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleStartEditing} className="flex-1">
                  Review & Edit Data
                </Button>
                <Button onClick={handlePreview} variant="outline" className="flex-1 bg-transparent">
                  Skip to Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "editing") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-indigo-600">Review & Edit Extracted Data</h1>
              <p className="text-gray-600">Make any necessary corrections to the AI-extracted information</p>
            </div>
            <WizardSteps steps={EDIT_STEPS} currentStep={editStep} onStepClick={handleEditStep} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">{renderEditStep()}</div>
        </div>

        {editStep < 5 && (
          <div className="max-w-4xl mx-auto px-4 pb-8">
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevEditStep} disabled={editStep === 1}>
                Previous
              </Button>
              <Button onClick={handleNextEditStep}>{editStep === 4 ? "Preview Resume" : "Next"}</Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (step === "preview") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto py-6">
            <h1 className="text-2xl font-bold text-indigo-600">Your AI-Generated Resume</h1>
            <p className="text-gray-600">Review your final resume and download as PDF</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ResumePreview data={resumeData} onEdit={() => setStep("editing")} />
          </div>
        </div>
      </div>
    )
  }

  return null
}
