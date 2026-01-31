import fs from "fs/promises"
import path from "path"
import pdf from "pdf-parse"
import pdf2pic from "pdf2pic"
import type { PDFPage } from "@/types"

export class PDFParser {
  private uploadDir: string

  constructor(uploadDir: string = "/tmp/uploads") {
    this.uploadDir = uploadDir
  }

  async parsePDF(filePath: string): Promise<PDFPage[]> {
    const dataBuffer = await fs.readFile(filePath)
    const pdfData = await pdf(dataBuffer)
    
    const pages: PDFPage[] = []
    const convert = pdf2pic.from(filePath, {
      density: 300,
      saveFilename: "page",
      savePath: path.join(this.uploadDir, "images"),
      format: "png",
      width: 1920,
      height: 1080,
    })

    const totalPages = pdfData.numpages
    
    for (let i = 1; i <= totalPages; i++) {
      try {
        const pageImage = await convert(i, { responseType: "buffer" })
        const imageBuffer = Buffer.from(pageImage.base64, "base64")
        
        pages.push({
          text: this.extractPageText(pdfData.text, i, totalPages),
          images: [{
            data: imageBuffer,
            filename: `page_${i}.png`
          }],
          pageNumber: i,
        })
      } catch (error) {
        console.error(`Error parsing page ${i}:`, error)
        pages.push({
          text: "",
          images: [],
          pageNumber: i,
        })
      }
    }

    return pages
  }

  private extractPageText(fullText: string, currentPage: number, totalPages: number): string {
    const lines = fullText.split("\n")
    const linesPerPage = Math.ceil(lines.length / totalPages)
    const start = (currentPage - 1) * linesPerPage
    const end = start + linesPerPage
    
    return lines.slice(start, end).join("\n").trim()
  }
}
