export async function parseFileContent(file: File): Promise<string> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  try {
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return await parsePDF(file)
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      return await parseDocx(file)
    } else if (fileType === "application/msword" || fileName.endsWith(".doc")) {
      return await parseDoc(file)
    } else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      return await file.text()
    } else {
      throw new Error(`Unsupported file type: ${fileType}`)
    }
  } catch (error) {
    console.error("File parsing error:", error)
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

async function parsePDF(file: File): Promise<string> {
  // For PDF parsing, we'll use a simple approach that works in the browser
  // In a production environment, you might want to use a more robust solution
  const arrayBuffer = await file.arrayBuffer()

  // This is a simplified approach - in reality, you'd want to use a proper PDF parser
  // For now, we'll return a message indicating PDF parsing needs to be implemented
  throw new Error("PDF parsing requires additional setup. Please convert your PDF to text first.")
}

async function parseDocx(file: File): Promise<string> {
  // For DOCX parsing, you would typically use a library like mammoth.js
  // For now, we'll return a message indicating DOCX parsing needs to be implemented
  throw new Error("DOCX parsing requires additional setup. Please convert your document to text first.")
}

async function parseDoc(file: File): Promise<string> {
  // For DOC parsing, you would need specialized libraries
  // For now, we'll return a message indicating DOC parsing needs to be implemented
  throw new Error("DOC parsing requires additional setup. Please convert your document to text first.")
}

export function validateFileType(file: File): boolean {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ]

  const allowedExtensions = [".pdf", ".docx", ".doc", ".txt"]
  const fileName = file.name.toLowerCase()

  return allowedTypes.includes(file.type) || allowedExtensions.some((ext) => fileName.endsWith(ext))
}
