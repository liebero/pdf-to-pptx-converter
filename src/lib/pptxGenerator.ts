import PptxGenJS from "pptxgenjs"
import fs from "fs/promises"
import path from "path"
import type { PDFPage } from "@/types"

export class PPTXGenerator {
  private outputDir: string

  constructor(outputDir: string = "/tmp/output") {
    this.outputDir = outputDir
  }

  async generatePPTX(pages: PDFPage[], filename: string = "presentation.pptx"): Promise<string> {
    const pptx = new PptxGenJS()
    pptx.layout = "LAYOUT_16x9"
    pptx.author = "PDF to PPTX Converter"
    pptx.title = filename

    for (const page of pages) {
      const slide = pptx.addSlide()

      if (page.images.length > 0) {
        const imagePath = path.join(this.outputDir, "temp", page.images[0].filename)
        await fs.mkdir(path.dirname(imagePath), { recursive: true })
        await fs.writeFile(imagePath, page.images[0].data)

        slide.addImage({
          path: imagePath,
          x: "5%",
          y: "5%",
          w: "40%",
          h: "90%",
          sizing: { type: "contain", w: "100%", h: "100%" }
        })
      }

      if (page.text.trim()) {
        slide.addText(page.text, {
          x: "50%",
          y: "10%",
          w: "45%",
          h: "80%",
          fontSize: 14,
          color: "363636",
          align: "left",
          valign: "top",
          wrap: true,
        })
      }

      slide.addText(`Page ${page.pageNumber}`, {
        x: "90%",
        y: "95%",
        w: "8%",
        h: "5%",
        fontSize: 10,
        color: "999999",
        align: "right",
      })
    }

    const outputPath = path.join(this.outputDir, filename)
    await pptx.writeFile({ fileName: outputPath })
    
    return outputPath
  }
}
