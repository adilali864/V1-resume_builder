"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ResumeBuilder } from "./resume-builder"
import { AIResumeBuilder } from "./ai-resume-builder"
import { FileText, Sparkles, ArrowLeft } from "lucide-react"

type BuilderMode = "landing" | "manual" | "ai"

export function LandingPage() {
  const [mode, setMode] = useState<BuilderMode>("landing")

  const handleBackToLanding = () => {
    setMode("landing")
  }

  if (mode === "manual") {
    return (
      <div>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto py-4 px-4">
            <Button variant="ghost" onClick={handleBackToLanding} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Options
            </Button>
          </div>
        </div>
        <ResumeBuilder />
      </div>
    )
  }

  if (mode === "ai") {
    return (
      <div>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto py-4 px-4">
            <Button variant="ghost" onClick={handleBackToLanding} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Options
            </Button>
          </div>
        </div>
        <AIResumeBuilder />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Europass Resume Builder</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create your professional nursing resume with our easy-to-use builder or let AI extract data from your
            existing resume
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Build from Scratch</CardTitle>
              <CardDescription>Create your resume step-by-step with our guided form builder</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Step-by-step guided process</li>
                <li>• Professional Europass format</li>
                <li>• Nursing-focused templates</li>
                <li>• Real-time preview</li>
              </ul>
              <Button onClick={() => setMode("manual")} className="w-full">
                Start Building
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group border-2 border-indigo-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">AI Resume Extraction</CardTitle>
              <CardDescription>Upload your existing resume and let AI extract the data automatically</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Upload PDF, DOC, or DOCX</li>
                <li>• AI-powered data extraction</li>
                <li>• Auto-populate template</li>
                <li>• Edit and refine results</li>
              </ul>
              <Button onClick={() => setMode("ai")} className="w-full bg-indigo-600 hover:bg-indigo-700">
                Try AI Extraction
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">Both options generate the same professional Europass format resume</p>
        </div>
      </div>
    </div>
  )
}
