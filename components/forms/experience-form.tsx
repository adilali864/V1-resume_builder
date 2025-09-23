"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeData, Experience } from "@/hooks/use-resume-data"

interface ExperienceFormProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function ExperienceForm({ data, onUpdate }: ExperienceFormProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      startDate: "",
      endDate: "",
      location: "",
      position: "",
      company: "",
      responsibilities: [],
      currentJob: false,
    }
    onUpdate({
      experience: [...data.experience, newExperience],
    })
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updatedExperience = data.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    onUpdate({ experience: updatedExperience })
  }

  const removeExperience = (id: string) => {
    const filteredExperience = data.experience.filter((exp) => exp.id !== id)
    onUpdate({ experience: filteredExperience })
  }

  const handleResponsibilitiesChange = (id: string, value: string) => {
    const responsibilities = value.split("\n").filter((r) => r.trim())
    updateExperience(id, "responsibilities", responsibilities)
  }

  const handleCurrentJobChange = (id: string, checked: boolean) => {
    updateExperience(id, "currentJob", checked)
    if (checked) {
      updateExperience(id, "endDate", "")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Work Experience</h2>
        <p className="text-gray-600">Add your professional work experience</p>
      </div>

      <div className="space-y-4">
        {data.experience.map((exp) => (
          <Card key={exp.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Work Experience
                <Button variant="destructive" size="sm" onClick={() => removeExperience(exp.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    disabled={exp.currentJob}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.currentJob}
                  onCheckedChange={(checked) => handleCurrentJobChange(exp.id, checked as boolean)}
                />
                <Label htmlFor={`current-${exp.id}`}>Currently Working</Label>
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                  placeholder="e.g., Registered Nurse"
                />
              </div>

              <div>
                <Label>Hospital/Healthcare Facility</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                  placeholder="Enter workplace name"
                />
              </div>

              <div>
                <Label>Job Responsibilities</Label>
                <Textarea
                  value={exp.responsibilities.join("\n")}
                  onChange={(e) => handleResponsibilitiesChange(exp.id, e.target.value)}
                  placeholder="Enter each responsibility on a new line"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={addExperience} className="w-full bg-transparent" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  )
}
