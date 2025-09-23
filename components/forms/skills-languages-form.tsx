"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { ResumeData, Language } from "@/hooks/use-resume-data"

interface SkillsLanguagesFormProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

const LANGUAGE_LEVELS = [
  { value: "A1", label: "A1 - Basic" },
  { value: "A2", label: "A2 - Elementary" },
  { value: "B1", label: "B1 - Intermediate" },
  { value: "B2", label: "B2 - Upper Intermediate" },
  { value: "C1", label: "C1 - Advanced" },
  { value: "C2", label: "C2 - Proficient" },
]

const MEDICAL_SKILLS = {
  "Clinical Skills": [
    "Patient Assessment",
    "Vital Signs Monitoring",
    "CPR & BLS",
    "ACLS",
    "IV Therapy",
    "Medication Administration",
    "Wound Care",
    "Infection Control",
  ],
  "Technical Skills": [
    "EMR/EHR Systems",
    "Medical Equipment",
    "Telemetry Monitoring",
    "Ventilator Management",
    "Laboratory Tests",
    "Patient Documentation",
  ],
  "Specialized Care": [
    "ICU/Critical Care",
    "Emergency Care",
    "Pediatric Care",
    "Geriatric Care",
    "Surgical Care",
    "Rehabilitation",
  ],
}

export function SkillsLanguagesForm({ data, onUpdate }: SkillsLanguagesFormProps) {
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      language: "",
      reading: "",
      speaking: "",
      writing: "",
    }
    onUpdate({
      languages: [...data.languages, newLanguage],
    })
  }

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    const updatedLanguages = data.languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang))
    onUpdate({ languages: updatedLanguages })
  }

  const removeLanguage = (id: string) => {
    const filteredLanguages = data.languages.filter((lang) => lang.id !== id)
    onUpdate({ languages: filteredLanguages })
  }

  const handleSkillToggle = (skill: string, checked: boolean) => {
    const updatedSkills = checked ? [...data.medicalSkills, skill] : data.medicalSkills.filter((s) => s !== skill)
    onUpdate({ medicalSkills: updatedSkills })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Skills & Languages</h2>
        <p className="text-gray-600">Add your language skills and medical expertise</p>
      </div>

      {/* Languages Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="motherTongue">Mother Tongue</Label>
            <Input
              id="motherTongue"
              value={data.motherTongue}
              onChange={(e) => onUpdate({ motherTongue: e.target.value })}
              placeholder="e.g., English"
            />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-4">Other Languages</h3>
            <div className="space-y-4">
              {data.languages.map((lang) => (
                <Card key={lang.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Language Entry</h4>
                    <Button variant="destructive" size="sm" onClick={() => removeLanguage(lang.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label>Language</Label>
                      <Input
                        value={lang.language}
                        onChange={(e) => updateLanguage(lang.id, "language", e.target.value)}
                        placeholder="Enter language"
                      />
                    </div>

                    <div>
                      <Label>Reading Level</Label>
                      <Select value={lang.reading} onValueChange={(value) => updateLanguage(lang.id, "reading", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Speaking Level</Label>
                      <Select
                        value={lang.speaking}
                        onValueChange={(value) => updateLanguage(lang.id, "speaking", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Writing Level</Label>
                      <Select value={lang.writing} onValueChange={(value) => updateLanguage(lang.id, "writing", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button onClick={addLanguage} className="w-full bg-transparent" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Language
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medical Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(MEDICAL_SKILLS).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-md font-semibold mb-3 text-blue-600 border-b border-blue-200 pb-1">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={data.medicalSkills.includes(skill)}
                      onCheckedChange={(checked) => handleSkillToggle(skill, checked as boolean)}
                    />
                    <Label htmlFor={skill} className="text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hobbies Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hobbies & Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="hobbies">Hobbies</Label>
          <Input
            id="hobbies"
            value={data.hobbies}
            onChange={(e) => onUpdate({ hobbies: e.target.value })}
            placeholder="Enter hobbies separated by commas (e.g., Yoga, Reading, Travel)"
          />
        </CardContent>
      </Card>
    </div>
  )
}
