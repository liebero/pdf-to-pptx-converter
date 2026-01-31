import { GoogleGenerativeAI } from "@google/generative-ai"

export class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
  }

  async analyzePDFContent(textContent: string): Promise<{
    title: string
    sections: { title: string; content: string }[]
    summary: string
  }> {
    try {
      const prompt = `
        Analyze the following PDF content and provide:
        1. A clear title for the presentation
        2. Break down into logical sections with titles and content
        3. A brief summary

        Content:
        ${textContent}

        Response format as JSON:
        {
          "title": "Presentation Title",
          "sections": [
            { "title": "Section 1", "content": "Content for section 1" }
          ],
          "summary": "Brief summary"
        }
      `

      const result = await this.model.generateContent(prompt)
      const response = result.response.text()
      
      try {
        return JSON.parse(response)
      } catch {
        return {
          title: "Presentation",
          sections: [{ title: "Content", content: textContent.substring(0, 500) }],
          summary: "PDF content analyzed"
        }
      }
    } catch (error) {
      console.error("Gemini analysis error:", error)
      return {
        title: "Presentation",
        sections: [{ title: "Content", content: textContent.substring(0, 500) }],
        summary: "Analysis unavailable"
      }
    }
  }

  async optimizeForPPTX(originalText: string): Promise<string> {
    try {
      const prompt = `
        Optimize the following text for a PowerPoint presentation:
        - Make it concise and bullet-point friendly
        - Highlight key points
        - Use clear structure

        Original text:
        ${originalText}
      `

      const result = await this.model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      console.error("PPTX optimization error:", error)
      return originalText
    }
  }
}
