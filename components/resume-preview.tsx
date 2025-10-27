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
      <div className="w-[30%] bg-[#fafafa] p-8 border-r border-gray-200">

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
        <div className="space-y-4 mb-8 ml-6">
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
        <div className="space-y-2">
        {/* About Me Section */}
        {data.personalInfo.aboutMe && (
          <div className="mb-6">
            <h2 className="text-base font-normal text-black uppercase tracking-wider mb-1">
              ABOUT ME:
            </h2>
            <p className="text-sm text-black leading-relaxed">
              {data.personalInfo.aboutMe}
            </p>
          </div>
        )}

          {/* Education Section */}
          {data.education.length > 0 && (
            <ResumeSection title="EDUCATION AND TRAINING">
              <div className="space-y-1 relative ">
                <div className="absolute left-[6px] top-0 bottom-0 w-[2px] bg-[#003399]"></div>
                {data.education.map((edu, index) => (
                  <TimelineItem key={edu.id}>
                    <div className="font-extrabold text-[#003399] text-xs mb-1">
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
            <ResumeSection title="WORK EXPERIENCE" className="!mb-1">

              <div className="space-y-1 relative">
                <div className="absolute left-[6px] top-0 bottom-0 w-[2px] bg-[#003399]"></div>
                {data.experience.map((exp, index) => (
                  <TimelineItem key={exp.id}>
                    <div className="font-extrabold text-[#003399] text-xs mb-1">
                      <span style={{ fontWeight: 800 }}>
                        {formatDate(exp.startDate)} – {exp.currentJob ? "PRESENT" : formatDate(exp.endDate)}
                      </span>
                      {exp.location && <span className="font-normal"> – {exp.location}</span>}
                    </div>

                    <div className="font-bold text-black text-sm mb-1">{exp.position}</div>
                    {exp.company && <div className="text-black text-sm mb-2">{exp.company}</div>}
                    {exp.responsibilities.length > 0 && (
                      <ul className="list-disc ml-12 text-sm space-y-1">
                        {exp.responsibilities
                         .flatMap((r) => r.split(/[.]+/)) // split on period for display only
                         .map((resp, idx) =>
                          resp.trim() ? (
                          <li key={idx} className="text-black">
                          {resp.trim()}
                          </li>
                          ) : null
                        )}
                      </ul>
                    )}
                  </TimelineItem>
                ))}
              </div>
            </ResumeSection>
          )}

           {/* Language Skills Section */}
        {(data.motherTongue || data.languages.length > 0) && (
          <ResumeSection title="LANGUAGE SKILLS" className="ml-12">
            <div className="text-black text-xs tracking-wide mt-0 ">
              
              {/* Mother Tongue */}
              {data.motherTongue && (
                <div className="mb-2 ml-2">
                  <span className="font-bold uppercase">MOTHER TONGUE(S): </span>
                  <span className="font-medium uppercase">{data.motherTongue}</span>
                </div>
              )}

              {/* Other Languages */}
              {data.languages.map((lang) => (
                <div key={lang.id} className="mb-4 ml-2">
                  <div>
                    <span className="font-bold uppercase">OTHER LANGUAGE(S): </span>
                    <span className="font-medium uppercase">{lang.language}</span>
                  </div>

                  <div className="mt-2 space-y-1 ">
                    <div className="flex justify-between w-24">
                      <span className="font-semibold">Reading</span>
                      <span>{lang.reading}</span>
                    </div>
                    <div className="flex justify-between w-24">
                      <span className="font-semibold">Speaking</span>
                      <span>{lang.speaking}</span>
                    </div>
                    <div className="flex justify-between w-24">
                      <span className="font-semibold">Writing</span>
                      <span>{lang.writing}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ResumeSection>
        )}

          {/* Digital Skills Section */}
          {data.medicalSkills.length > 0 && (
            <ResumeSection title="DIGITAL SKILLS" className="ml-12">
              <div className="text-xs text-black mt-0 ml-2 flex flex-wrap gap-x-6 gap-y-1">
              {data.medicalSkills.map((skill, index) => (
                <span key={index} className="font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </ResumeSection>
        )}


          {/* Hobbies Section */}
          {data.hobbies && (
            <ResumeSection title="HOBBIES AND INTERESTS" className="ml-12">
               <div className="text-xs text-black mt-0 ml-2 flex flex-wrap gap-x-6 gap-y-1">
                {data.hobbies
                .split(",")
                .map((hobby, index) => (
                  <span key={index} className="font-medium">
                    {hobby.trim()}
                  </span>
                ))}
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

function ResumeSection({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`mb-4 ${className}`}>
      <h2 className="text-base font-normal text-text-black uppercase tracking-wider mb-2 ml-2 border-b-0">
        {title}
      </h2>
      {children}
    </div>
  )
}


function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pl-8 pb-4">
      {/* Blue Line Dot */}
      <div className="absolute left-0 top-6 flex items-center justify-center">
        <div className="w-3 h-3 bg-[#003776] rounded-full"></div>
      </div>
      <div className="ml-0.5">{children}</div>
    </div>
  )
}

