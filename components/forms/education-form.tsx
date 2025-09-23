"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeData, Education } from "@/hooks/use-resume-data"

interface EducationFormProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

const DEGREE_OPTIONS = [
  "Bachelor of Science in Nursing (BSN)",
  "Associate Degree in Nursing (ADN)",
  "Master of Science in Nursing (MSN)",
  "RN License",
  "LPN Certificate",
  "CNA Certificate",
]

export function EducationForm({ data, onUpdate }: EducationFormProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      startYear: "",
      endYear: "",
      location: "",
      degree: "",
      institution: "",
    }
    onUpdate({
      education: [...data.education, newEducation],
    })
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updatedEducation = data.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    onUpdate({ education: updatedEducation })
  }

  const removeEducation = (id: string) => {
    const filteredEducation = data.education.filter((edu) => edu.id !== id)
    onUpdate({ education: filteredEducation })
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Education & Training</h2>
        <p className="text-gray-600">Add your educational background and certifications</p>
      </div>

      <div className="space-y-4">
        {data.education.map((edu) => (
          <Card key={edu.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Education Entry
                <Button variant="destructive" size="sm" onClick={() => removeEducation(edu.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Year</Label>
                  <Select value={edu.startYear} onValueChange={(value) => updateEducation(edu.id, "startYear", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select start year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>End Year</Label>
                  <Select value={edu.endYear} onValueChange={(value) => updateEducation(edu.id, "endYear", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select end year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRESENT">PRESENT</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <Label>Degree/Certification</Label>
                <Select value={edu.degree} onValueChange={(value) => updateEducation(edu.id, "degree", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree or certification" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEGREE_OPTIONS.map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Institution Name</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                  placeholder="Enter institution name"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={addEducation} className="w-full bg-transparent" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  )
}
