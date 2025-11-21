import type { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "SkillSync - AI Skills Assessment Platform",
  description: "Sync Your AI Skills to Opportunities",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
