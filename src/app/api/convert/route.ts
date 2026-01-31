import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PDFParser } from "@/lib/pdfParser"
import { PPTXGenerator } from "@/lib/pptxGenerator"
import { GeminiService } from "@/lib/geminiService"
import { writeFile, mkdir, readFile, unlink } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const apiKey = formData.get("apiKey") as string

    if (!file || !apiKey) {
      return NextResponse.json({ error: "File and API key are required" }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "temp")
    const outputDir = path.join(process.cwd(), "public", "output")
    await mkdir(uploadDir, { recursive: true })
    await mkdir(outputDir, { recursive: true })

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileId = randomUUID()
    const filePath = path.join(uploadDir, `${fileId}.pdf`)
    await writeFile(filePath, fileBuffer)

    const pdfParser = new PDFParser(uploadDir)
    const pages = await pdfParser.parsePDF(filePath)

    const geminiService = new GeminiService(apiKey)
    const fullText = pages.map(p => p.text).join("\n")
    const analysis = await geminiService.analyzePDFContent(fullText)

    const pptxGenerator = new PPTXGenerator(outputDir)
    const pptxFilename = `${fileId}_${analysis.title.replace(/[^a-zA-Z0-9]/g, "_")}.pptx`
    const pptxPath = await pptxGenerator.generatePPTX(pages, pptxFilename)

    await unlink(filePath)
    const imagesDir = path.join(uploadDir, "images")
    try { await unlink(imagesDir) } catch {}

    return NextResponse.json({
      success: true,
      filename: pptxFilename,
      downloadUrl: `/api/download/${pptxFilename}`,
      analysis
    })
  } catch (error) {
    console.error("Conversion error:", error)
    return NextResponse.json(
      { error: "Failed to convert PDF to PPTX" },
      { status: 500 }
    )
  }
}
