'use client'
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script" // ← ✅ 追加
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* ✅ Plausibleトラッキングスクリプト */}
        <Script
          defer
          data-domain="slot-record.vercel.app"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
