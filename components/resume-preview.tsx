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
      <Card className="max-w-4xl mx-auto shadow-lg">
        <div id="resume-content" className="europass-resume font-sans">
          <EuropassResumeTemplate data={data} />
        </div>
      </Card>
    </div>
  )
}

function EuropassResumeTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex min-h-[842px] bg-white font-sans text-black relative">
      {/* Europass Logo - Top Right */}
      <div className="absolute top-4 right-6 flex items-center space-x-2 z-10">
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 bg-[#003776] rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-[#FFD617] rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="text-[#7B2D8E] font-bold text-lg tracking-wide">europass</span>
        </div>
      </div>

      {/* Left Sidebar - 30% width */}
      <div className="w-[30%] bg-white p-8 border-r-0">
        {/* Profile Photo */}
        <div className="text-center mb-8">
          {data.personalInfo.profilePhoto && (
            <div className="relative mb-6 mx-auto w-32 h-32">
              <img
                src={data.personalInfo.profilePhoto || "/placeholder.svg"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-2 border-gray-300 mx-auto object-cover"
              />
            </div>
          )}
          
          {/* Name */}
          <h1 className="text-2xl font-bold text-black leading-tight mb-4">
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h1>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 mb-8">
          {data.personalInfo.nationality && (
            <ContactItem label="Nationality" value={data.personalInfo.nationality} />
          )}
          {data.personalInfo.phone && (
            <ContactItem label="Phone number" value={data.personalInfo.phone} />
          )}
          {data.personalInfo.email && (
            <ContactItem label="Email address" value={data.personalInfo.email} />
          )}
          {data.personalInfo.linkedin && (
            <ContactItem label="LinkedIn" value={data.personalInfo.linkedin} />
          )}
          {data.personalInfo.address && (
            <ContactItem label="Address" value={data.personalInfo.address} />
          )}
        </div>
      </div>

      {/* Right Main Content - 70% width */}
      <div className="w-[70%] p-8 pt-16">
        <div className="space-y-8">
          {/* About Me Section */}
          {data.personalInfo.aboutMe && (
            <ResumeSection title="ABOUT ME">
              <p className="text-sm leading-relaxed text-justify text-black">
                {data.personalInfo.aboutMe}
              </p>
            </ResumeSection>
          )}

          {/* Education Section */}
          {data.education.length > 0 && (
            <ResumeSection title="EDUCATION AND TRAINING">
              <div className="space-y-6 relative">
                <div className="absolute left-[6px] top-0 bottom-0 w-[2px] bg-[#003776]"></div>
                {data.education.map((edu, index) => (
                  <TimelineItem key={edu.id}>
                    <div className="font-bold text-[#003776] text-xs mb-1">
                      {edu.startYear} – {edu.endYear}
                      {edu.location && <span className="font-normal"> – {edu.location}</span>}
                    </div>
                    <div className="font-bold text-black text-sm mb-1">{edu.degree}</div>
                    <div className="text-black text-sm">{edu.institution}</div>
                  </TimelineItem>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Work Experience Section */}
          {data.experience.length > 0 && (
            <ResumeSection title="WORK EXPERIENCE">
              <div className="space-y-6 relative">
                <div className="absolute left-[6px] top-0 bottom-0 w-[2px] bg-[#003776]"></div>
                {data.experience.map((exp, index) => (
                  <TimelineItem key={exp.id}>
                    <div className="font-bold text-[#003776] text-xs mb-1">
                      {formatDate(exp.startDate)} – {exp.currentJob ? "PRESENT" : formatDate(exp.endDate)}
                      {exp.location && <span className="font-normal"> – {exp.location}</span>}
                    </div>
                    <div className="font-bold text-black text-sm mb-1">{exp.position}</div>
                    {exp.company && <div className="text-black text-sm mb-2">{exp.company}</div>}
                    {exp.responsibilities.length > 0 && (
                      <ul className="list-disc ml-6 text-sm space-y-1">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-black">{resp}</li>
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
                    <div className="font-bold text-black text-xs tracking-wide mb-1">
                      MOTHER TONGUE(S):
                    </div>
                    <div className="text-xs text-black font-medium tracking-wide uppercase">
                      {data.motherTongue}
                    </div>
                  </div>
                )}
                {data.languages.map((lang) => (
                  <div key={lang.id}>
                    <div className="font-bold text-black text-xs tracking-wide mb-1">
                      OTHER LANGUAGE(S):
                    </div>
                    <div className="text-xs text-black font-medium tracking-wide uppercase mb-2">
                      {lang.language}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-black">
                      <div>
                        <span className="font-medium">Reading</span>
                        <div className="mt-1">{lang.reading}</div>
                      </div>
                      <div>
                        <span className="font-medium">Speaking</span>
                        <div className="mt-1">{lang.speaking}</div>
                      </div>
                      <div>
                        <span className="font-medium">Writing</span>
                        <div className="mt-1">{lang.writing}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ResumeSection>
          )}

          {/* Digital Skills Section */}
          {data.medicalSkills.length > 0 && (
            <ResumeSection title="DIGITAL SKILLS">
              <div className="text-sm text-black">
                {data.medicalSkills.join("    ")}
              </div>
            </ResumeSection>
          )}

          {/* Hobbies Section */}
          {data.hobbies && (
            <ResumeSection title="HOBBIES AND INTERESTS">
              <div className="text-sm text-black">
                {data.hobbies
                  .split(",")
                  .map((h) => h.trim())
                  .join("    ")}
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
    <div className="text-left">
      <div className="font-bold text-black text-xs mb-1">{label}:</div>
      <div className="text-xs text-black break-words leading-relaxed">{value}</div>
    </div>
  )
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-6 border-b-0">
        {title}
      </h2>
      {children}
    </div>
  )
}

function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pl-6 pb-4">
      <div className="absolute left-0 top-1 w-3 h-3 bg-[#003776] rounded-full border-2 border-white shadow-sm"></div>
      <div>{children}</div>
    </div>
  )
}
