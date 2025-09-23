import { type NextRequest, NextResponse } from "next/server"
import type { ResumeData } from "@/types/resume"

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"

export async function POST(request: NextRequest) {
  try {
    const { file, filename, apiKey } = await request.json()

    if (!file || !apiKey) {
      return NextResponse.json({ error: "File and API key are required" }, { status: 400 })
    }

    // Create the prompt for Perplexity API
    const prompt = `
You are a resume data extraction expert. Extract all relevant information from the uploaded resume and return it in the exact JSON format specified below. Be thorough and extract all available information.

Please extract and return the data in this exact JSON structure:

{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "nationality": "",
    "phone": "",
    "email": "",
    "linkedin": "",
    "address": "",
    "aboutMe": "",
    "profilePhoto": ""
  },
  "education": [
    {
      "id": "unique-id",
      "startYear": "YYYY",
      "endYear": "YYYY",
      "location": "",
      "degree": "",
      "institution": ""
    }
  ],
  "experience": [
    {
      "id": "unique-id",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY",
      "location": "",
      "position": "",
      "company": "",
      "responsibilities": ["", ""],
      "currentJob": false
    }
  ],
  "motherTongue": "",
  "languages": [
    {
      "id": "unique-id",
      "language": "",
      "reading": "A1|A2|B1|B2|C1|C2",
      "speaking": "A1|A2|B1|B2|C1|C2",
      "writing": "A1|A2|B1|B2|C1|C2"
    }
  ],
  "medicalSkills": [""],
  "hobbies": ""
}

Instructions:
- Extract ALL personal information available
- For education: include all degrees, certifications, courses
- For experience: break down responsibilities into bullet points
- For languages: if proficiency levels aren't specified, estimate based on context or use "B2" as default
- For medical skills: extract any healthcare, nursing, or medical-related skills mentioned
- Generate unique IDs for each array item
- If information is missing, use empty strings or empty arrays
- Return ONLY the JSON object, no additional text

Resume content to extract from: ${filename}
`

    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`)
    }

    const data = await response.json()
    const extractedText = data.choices[0]?.message?.content

    if (!extractedText) {
      throw new Error("No content received from Perplexity API")
    }

    // Parse the JSON response
    let resumeData: ResumeData
    try {
      // Clean the response to extract JSON
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }

      resumeData = JSON.parse(jsonMatch[0])

      // Validate and ensure all required fields exist
      resumeData = validateAndCleanResumeData(resumeData)
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      // Return a default structure if parsing fails
      resumeData = getDefaultResumeData()
    }

    return NextResponse.json({ resumeData })
  } catch (error) {
    console.error("Resume extraction error:", error)
    return NextResponse.json({ error: "Failed to extract resume data" }, { status: 500 })
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
          id: edu.id || `edu-${index}`,
          startYear: edu.startYear || "",
          endYear: edu.endYear || "",
          location: edu.location || "",
          degree: edu.degree || "",
          institution: edu.institution || "",
        }))
      : [],
    experience: Array.isArray(data.experience)
      ? data.experience.map((exp: any, index: number) => ({
          id: exp.id || `exp-${index}`,
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
          id: lang.id || `lang-${index}`,
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
