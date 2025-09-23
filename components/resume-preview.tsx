"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Edit, Loader2 } from "lucide-react"
import type { ResumeData } from "@/hooks/use-resume-data"
import { usePDFGenerator } from "@/hooks/use-pdf-generator"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

interface ResumePreviewProps {
  data: ResumeData
  onEdit?: () => void
}

export function ResumePreview({ data, onEdit }: ResumePreviewProps) {
  const { generatePDF, isGenerating } = usePDFGenerator()
  const { toast } = useToast()

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(data)
      toast({
        title: "Success!",
        description: "Your resume has been downloaded as PDF.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Resume Preview</h2>
        <p className="text-gray-600">Review your resume before downloading</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button onClick={handleDownloadPDF} disabled={isGenerating} className="bg-green-600 hover:bg-green-700">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Resume
          </Button>
        )}
      </div>

      {/* Resume Preview */}
      <Card className="max-w-4xl mx-auto">
        <div id="resume-content" className="europass-resume">
          <EuropassResumeTemplate data={data} />
        </div>
      </Card>
    </div>
  )
}

function EuropassResumeTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex min-h-[29.7cm] bg-white">
      {/* Left Sidebar - Blue */}
      <div className="w-[35%] bg-blue-600 text-white p-8">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {data.personalInfo.profilePhoto && (
            <img
              src={data.personalInfo.profilePhoto || "/placeholder.svg"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white mb-6 mx-auto object-cover"
            />
          )}
          <h1 className="text-2xl font-bold uppercase leading-tight">
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h1>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          {data.personalInfo.nationality && <ContactItem label="Nationality" value={data.personalInfo.nationality} />}
          {data.personalInfo.phone && <ContactItem label="Phone number" value={data.personalInfo.phone} />}
          {data.personalInfo.email && <ContactItem label="Email address" value={data.personalInfo.email} />}
          {data.personalInfo.linkedin && <ContactItem label="LinkedIn" value={data.personalInfo.linkedin} />}
          {data.personalInfo.address && <ContactItem label="Address" value={data.personalInfo.address} />}
        </div>
      </div>

      {/* Right Main Content */}
      <div className="w-[65%] p-8 relative">
        {/* Europass Logo Placeholder */}
        <div className="absolute top-4 right-6 w-32 h-8 bg-blue-100 rounded flex items-center justify-center text-xs text-blue-600 font-semibold">
          EUROPASS
        </div>

        <div className="space-y-8 mt-8">
          {/* About Me Section */}
          {data.personalInfo.aboutMe && (
            <ResumeSection title="ABOUT ME">
              <p className="text-sm leading-relaxed text-justify">{data.personalInfo.aboutMe}</p>
            </ResumeSection>
          )}

          {/* Education Section */}
          {data.education.length > 0 && (
            <ResumeSection title="EDUCATION AND TRAINING">
              <div className="space-y-6">
                {data.education.map((edu, index) => (
                  <TimelineItem key={edu.id}>
                    <div className="font-bold text-blue-600 text-sm">
                      {edu.startYear} – {edu.endYear}
                      {edu.location && <span className="text-gray-600"> – {edu.location}</span>}
                    </div>
                    <div className="font-semibold text-sm mt-1">{edu.degree}</div>
                    <div className="text-gray-600 text-sm">{edu.institution}</div>
                  </TimelineItem>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Work Experience Section */}
          {data.experience.length > 0 && (
            <ResumeSection title="WORK EXPERIENCE">
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <TimelineItem key={exp.id}>
                    <div className="font-bold text-blue-600 text-sm">
                      {formatDate(exp.startDate)} – {exp.currentJob ? "PRESENT" : formatDate(exp.endDate)}
                      {exp.location && <span className="text-gray-600"> – {exp.location}</span>}
                    </div>
                    <div className="font-semibold text-sm mt-1">{exp.position}</div>
                    {exp.company && <div className="text-gray-600 text-sm">{exp.company}</div>}
                    {exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside text-sm mt-2 space-y-1 ml-4">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </TimelineItem>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Language Skills Section */}
          {(data.motherTongue || data.languages.length > 0) && (
            <ResumeSection title="LANGUAGE SKILLS">
              <div className="space-y-4">
                {data.motherTongue && (
                  <div>
                    <div className="font-semibold text-sm">MOTHER TONGUE(S):</div>
                    <div className="text-sm uppercase font-medium">{data.motherTongue}</div>
                  </div>
                )}
                {data.languages.map((lang) => (
                  <div key={lang.id}>
                    <div className="font-semibold text-sm">OTHER LANGUAGE(S):</div>
                    <div className="text-sm uppercase font-medium">{lang.language}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Reading: {lang.reading} | Speaking: {lang.speaking} | Writing: {lang.writing}
                    </div>
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Medical Skills Section */}
          {data.medicalSkills.length > 0 && (
            <ResumeSection title="MEDICAL SKILLS">
              <div className="flex flex-wrap gap-2">
                {data.medicalSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-50 border border-blue-600 text-blue-600 px-3 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Hobbies Section */}
          {data.hobbies && (
            <ResumeSection title="HOBBIES AND INTERESTS">
              <div className="text-sm">
                {data.hobbies
                  .split(",")
                  .map((h) => h.trim())
                  .join(" | ")}
              </div>
            </ResumeSection>
          )}
        </div>
      </div>
    </div>
  )
}

function ContactItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-bold text-sm mb-1">{label}:</div>
      <div className="text-sm break-words">{value}</div>
    </div>
  )
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">{title}</h2>
      {children}
    </div>
  )
}

function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-1 w-3 h-3 bg-blue-600 rounded-full"></div>
      <div className="absolute left-1.5 top-4 w-0.5 h-full bg-blue-600"></div>
      <div className="pb-2">{children}</div>
    </div>
  )
}
