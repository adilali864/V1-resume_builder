"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import type { ResumeData } from "@/hooks/use-resume-data"

interface PersonalInfoFormProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function PersonalInfoForm({ data, onUpdate }: PersonalInfoFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(data.personalInfo.profilePhoto || null)

  const handleInputChange = (field: string, value: string) => {
    onUpdate({
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    })
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
        handleInputChange("profilePhoto", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoPreview(null)
    handleInputChange("profilePhoto", "")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Personal Information</h2>
        <p className="text-gray-600">Enter your basic personal details</p>
      </div>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Photo</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {photoPreview ? (
            <div className="relative inline-block">
              <img
                src={photoPreview || "/placeholder.svg"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={removePhoto}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Upload Profile Photo</span>
                </Button>
              </Label>
            </div>
          )}
          <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={data.personalInfo.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={data.personalInfo.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              value={data.personalInfo.nationality}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              placeholder="Enter your nationality"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={data.personalInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              value={data.personalInfo.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              placeholder="Enter your LinkedIn profile URL"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={data.personalInfo.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter your address"
            />
          </div>

          <div>
            <Label htmlFor="aboutMe">Professional Summary</Label>
            <Textarea
              id="aboutMe"
              value={data.personalInfo.aboutMe}
              onChange={(e) => handleInputChange("aboutMe", e.target.value)}
              placeholder="e.g., Compassionate registered nurse with 5+ years of experience..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
