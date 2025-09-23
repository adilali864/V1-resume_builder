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
