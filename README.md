# PDF to PPTX Converter

AI-powered PDF to PowerPoint converter using Google Gemini API. Converts PDF files to editable PPTX presentations while preserving images and text layout.

## Features

- Google OAuth 2.0 authentication
- Google Gemini AI integration for intelligent content analysis
- PDF parsing with text and image extraction
- PPTX generation with editable content
- Download converted files
- Secure API key management

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js (Google OAuth)
- **PDF Processing**: pdf-parse, pdf2pic, pdf-lib
- **PPTX Generation**: pptxgenjs
- **AI**: Google Gemini API
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google Cloud project with:
  - OAuth 2.0 credentials (Client ID & Secret)
  - Gemini API key

### Installation

1. Clone the repository

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/pdf_to_pptx
```

4. Set up the database:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in with your Google account
2. Enter your Gemini API key
3. Upload a PDF file
4. Click "Convert to PPTX"
5. Download the generated PPTX file

## Google Cloud Setup

### Enable APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Google Cloud Storage JSON API
   - Cloud Storage API
   - Generative Language API (for Gemini)

### Configure OAuth 2.0

1. Go to APIs & Services > Credentials
2. Create OAuth 2.0 client ID
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`
4. Copy Client ID and Secret to `.env`

### Get Gemini API Key

1. Go to [AI Studio](https://aistudio.google.com/app/apikey)
2. Create new API key
3. Use this key in the application

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   ├── convert/               # PDF conversion endpoint
│   │   └── download/[filename]/   # File download endpoint
│   ├── page.tsx                   # Main page
│   └── layout.tsx                 # Root layout
├── lib/
│   ├── pdfParser.ts               # PDF parsing logic
│   ├── pptxGenerator.ts          # PPTX generation
│   └── geminiService.ts          # AI integration
└── types/
    └── index.ts                  # TypeScript types
```

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.