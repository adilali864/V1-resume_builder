"use client"

import { useState } from "react"
import type { ResumeData } from "./use-resume-data"

export function usePDFGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async (resumeData: ResumeData) => {
    setIsGenerating(true)

    try {
      // Dynamically import the libraries to avoid SSR issues
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")])

      const resumeElement = document.getElementById("resume-content")
      if (!resumeElement) {
        throw new Error("Resume content not found")
      }

      // Generate canvas from HTML
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure the cloned document has proper styling
          const clonedElement = clonedDoc.getElementById("resume-content")
          if (clonedElement) {
            clonedElement.style.transform = "scale(1)"
            clonedElement.style.transformOrigin = "top left"
          }
        },
      })

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Generate filename
      const fileName = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "")

      // Download the PDF
      pdf.save(fileName || "Europass_Resume.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      throw new Error("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generatePDF,
    isGenerating,
  }
}
