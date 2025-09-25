import { type NextRequest, NextResponse } from "next/server"
import type { ResumeData } from "@/types/resume"

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API route called")
    const { fileContent, filename } = await request.json()
    console.log("[v0] Received data - filename:", filename, "content length:", fileContent?.length)

    const apiKey = process.env.PERPLEXITY_API_KEY
    console.log("[v0] API key exists:", !!apiKey)

    if (!fileContent || !apiKey) {
      console.error("[v0] Missing required data:", { hasFileContent: !!fileContent, hasApiKey: !!apiKey })
      return NextResponse.json({ error: "File content is required and API key must be configured" }, { status: 400 })
    }

    const prompt = `
You are a resume data extraction expert. Extract ALL information from the provided resume text and return it in the exact JSON format specified below.

CRITICAL INSTRUCTIONS:
1. Extract ALL available information - do not leave fields empty if data exists
2. For personal info: extract name, phone, email, address, LinkedIn, GitHub, portfolio links
3. For education: extract ALL degrees, universities, years, GPAs, locations
4. For experience: extract ALL jobs, positions, companies, dates, locations, and detailed responsibilities
5. For skills: map technical skills to appropriate categories (languages, frameworks, tools, etc.)
6. For projects: treat as work experience entries with detailed descriptions
7. For achievements/awards: include in experience or create separate entries
8. For certifications: include in education section
9. Return ONLY the JSON object, no markdown formatting or additional text

JSON Structure to fill:
{
  "personalInfo": {
    "firstName": "extract first name",
    "lastName": "extract last name", 
    "nationality": "extract if mentioned",
    "phone": "extract phone number",
    "email": "extract email address",
    "linkedin": "extract LinkedIn URL or profile",
    "address": "extract full address/location",
    "aboutMe": "create brief summary from resume content",
    "profilePhoto": ""
  },
  "education": [
    {
      "id": "edu-1",
      "startYear": "start year",
      "endYear": "end year or 'Present'",
      "location": "university location",
      "degree": "degree name and field",
      "institution": "university/institution name"
    }
  ],
  "experience": [
    {
      "id": "exp-1", 
      "startDate": "MM/YYYY format",
      "endDate": "MM/YYYY or 'Present'",
      "location": "job/project location",
      "position": "job title or project name",
      "company": "company name or 'Personal Project'",
      "responsibilities": ["detailed bullet point 1", "detailed bullet point 2"],
      "currentJob": true/false
    }
  ],
  "motherTongue": "infer from location/context",
  "languages": [
    {
      "id": "lang-1",
      "language": "language name",
      "reading": "B2",
      "speaking": "B2", 
      "writing": "B2"
    }
  ],
  "medicalSkills": [],
  "hobbies": "extract interests/hobbies if mentioned"
}

EXAMPLE EXTRACTION RULES:
- "Python, JavaScript" → extract as technical skills in aboutMe
- "Bennett University, B.Tech CSE, 2022-2026" → education entry
- "IEEE WIE Vice Chairperson, Jan 2024 – Jul 2024" → experience entry
- "AI Resume Builder — Python, Streamlit, 2025" → experience entry as project
- "+91-8368528828" → phone number
- "yashswishukla@gmail.com" → email
- "Gautam Buddha Nagar, Uttar Pradesh" → address

Resume content to extract from:
${fileContent}

Extract ALL information and return ONLY the JSON object:
`

    console.log("[v0] Sending request to Perplexity API")
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.1,
      }),
    })

    console.log("[v0] Perplexity API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Perplexity API error:", errorText)
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Perplexity API response:", data)

    const extractedText = data.choices[0]?.message?.content

    if (!extractedText) {
      console.error("[v0] No content received from Perplexity API")
      throw new Error("No content received from Perplexity API")
    }

    console.log("[v0] Extracted text:", extractedText)

    // Parse the JSON response
    let resumeData: ResumeData
    try {
      let jsonText = extractedText.trim()

      // Try to find JSON in the response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonText = jsonMatch[0]
      }

      // Clean up common issues
      jsonText = jsonText.replace(/```json\s*/, "").replace(/```\s*$/, "")

      console.log("[v0] Attempting to parse JSON:", jsonText.substring(0, 200) + "...")
      resumeData = JSON.parse(jsonText)

      // Validate and ensure all required fields exist
      resumeData = validateAndCleanResumeData(resumeData)
      console.log("[v0] Successfully parsed and validated resume data")
    } catch (parseError) {
      console.error("[v0] JSON parsing error:", parseError)
      console.error("[v0] Raw response:", extractedText)
      // Return a default structure if parsing fails
      resumeData = getDefaultResumeData()
      console.log("[v0] Using default resume data due to parsing error")
    }

    return NextResponse.json({ resumeData })
  } catch (error) {
    console.error("[v0] Resume extraction error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to extract resume data",
      },
      { status: 500 },
    )
  }
}

function validateAndCleanResumeData(data: any): ResumeData {
  return {
    personalInfo: {
      firstName: data.personalInfo?.firstName || "",
      lastName: data.personalInfo?.lastName || "",
      nationality: data.personalInfo?.nationality || "",
      phone: data.personalInfo?.phone || "",
      email: data.personalInfo?.email || "",
      linkedin: data.personalInfo?.linkedin || "",
      address: data.personalInfo?.address || "",
      aboutMe: data.personalInfo?.aboutMe || "",
      profilePhoto: data.personalInfo?.profilePhoto || "",
    },
    education: Array.isArray(data.education)
      ? data.education.map((edu: any, index: number) => ({
          id: edu.id || `edu-${index + 1}`,
          startYear: edu.startYear || "",
          endYear: edu.endYear || "",
          location: edu.location || "",
          degree: edu.degree || "",
          institution: edu.institution || "",
        }))
      : [],
    experience: Array.isArray(data.experience)
      ? data.experience.map((exp: any, index: number) => ({
          id: exp.id || `exp-${index + 1}`,
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          location: exp.location || "",
          position: exp.position || "",
          company: exp.company || "",
          responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
          currentJob: exp.currentJob || false,
        }))
      : [],
    motherTongue: data.motherTongue || "",
    languages: Array.isArray(data.languages)
      ? data.languages.map((lang: any, index: number) => ({
          id: lang.id || `lang-${index + 1}`,
          language: lang.language || "",
          reading: lang.reading || "B2",
          speaking: lang.speaking || "B2",
          writing: lang.writing || "B2",
        }))
      : [],
    medicalSkills: Array.isArray(data.medicalSkills) ? data.medicalSkills : [],
    hobbies: data.hobbies || "",
  }
}

function getDefaultResumeData(): ResumeData {
  return {
    personalInfo: {
      firstName: "",
      lastName: "",
      nationality: "",
      phone: "",
      email: "",
      linkedin: "",
      address: "",
      aboutMe: "",
      profilePhoto: "",
    },
    education: [],
    experience: [],
    motherTongue: "",
    languages: [],
    medicalSkills: [],
    hobbies: "",
  }
}
