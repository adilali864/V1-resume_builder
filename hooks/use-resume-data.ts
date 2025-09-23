"use client"

import { useState, useEffect, useCallback } from "react"

export interface PersonalInfo {
  firstName: string
  lastName: string
  nationality: string
  phone: string
  email: string
  linkedin: string
  address: string
  aboutMe: string
  profilePhoto?: string
}

export interface Education {
  id: string
  startYear: string
  endYear: string
  location: string
  degree: string
  institution: string
}

export interface Experience {
  id: string
  startDate: string
  endDate: string
  location: string
  position: string
  company: string
  responsibilities: string[]
  currentJob: boolean
}

export interface Language {
  id: string
  language: string
  reading: string
  speaking: string
  writing: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  motherTongue: string
  languages: Language[]
  medicalSkills: string[]
  hobbies: string
}

const initialData: ResumeData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    nationality: "",
    phone: "",
    email: "",
    linkedin: "",
    address: "",
    aboutMe: "",
  },
  education: [],
  experience: [],
  motherTongue: "",
  languages: [],
  medicalSkills: [],
  hobbies: "",
}

export function useResumeData() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("europass-resume-data")
      const savedTimestamp = localStorage.getItem("europass-resume-timestamp")

      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setResumeData(parsedData)

        if (savedTimestamp) {
          setLastSaved(new Date(savedTimestamp))
        }
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
      // Clear corrupted data
      localStorage.removeItem("europass-resume-data")
      localStorage.removeItem("europass-resume-timestamp")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        const timestamp = new Date()
        localStorage.setItem("europass-resume-data", JSON.stringify(resumeData))
        localStorage.setItem("europass-resume-timestamp", timestamp.toISOString())
        setLastSaved(timestamp)
      } catch (error) {
        console.error("Error saving data:", error)
      }
    }
  }, [resumeData, isLoading])

  const updateResumeData = useCallback((updates: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...updates }))
  }, [])

  const clearAllData = useCallback(() => {
    setResumeData(initialData)
    localStorage.removeItem("europass-resume-data")
    localStorage.removeItem("europass-resume-timestamp")
    setLastSaved(null)
  }, [])

  const exportData = useCallback(() => {
    const dataToExport = {
      ...resumeData,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `europass-resume-${resumeData.personalInfo.firstName || "data"}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [resumeData])

  const importData = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const importedData = JSON.parse(content)

          // Validate the imported data structure
          if (importedData && typeof importedData === "object") {
            // Remove metadata fields if present
            const { exportedAt, version, ...cleanData } = importedData

            // Merge with initial data to ensure all required fields exist
            const validatedData = {
              ...initialData,
              ...cleanData,
              // Ensure arrays exist
              education: Array.isArray(cleanData.education) ? cleanData.education : [],
              experience: Array.isArray(cleanData.experience) ? cleanData.experience : [],
              languages: Array.isArray(cleanData.languages) ? cleanData.languages : [],
              medicalSkills: Array.isArray(cleanData.medicalSkills) ? cleanData.medicalSkills : [],
              // Ensure personalInfo exists
              personalInfo: {
                ...initialData.personalInfo,
                ...(cleanData.personalInfo || {}),
              },
            }

            setResumeData(validatedData)
            resolve()
          } else {
            reject(new Error("Invalid file format"))
          }
        } catch (error) {
          reject(new Error("Failed to parse file"))
        }
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }, [])

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          resumeData.personalInfo.firstName &&
          resumeData.personalInfo.lastName &&
          resumeData.personalInfo.email
        )
      case 2:
        return true // Education is optional
      case 3:
        return true // Experience is optional
      case 4:
        return true // Skills are optional
      default:
        return true
    }
  }

  return {
    resumeData,
    updateResumeData,
    validateStep,
    isLoading,
    lastSaved,
    clearAllData,
    exportData,
    importData,
  }
}
