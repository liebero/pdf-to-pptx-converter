import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export interface PDFPage {
  text: string
  images: { data: Buffer; filename: string }[]
  pageNumber: number
}

export interface ConversionResult {
  success: boolean
  message: string
  pptxPath?: string
}
