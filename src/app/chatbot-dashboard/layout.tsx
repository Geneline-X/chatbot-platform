import React from 'react'
import { cn } from '@/lib/utils'
import '../globals.css'
import "react-loading-skeleton/dist/skeleton.css"
import "simplebar-react/dist/simplebar.min.css"
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@/components/ui/toaster'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from '@/components/Navbar'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import LaptopPrompt from '@/components/LaptopPrompt'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <head>
        <meta name="google-site-verification" content="xqSq2gtf73XFTo_Z-8FEfgbwYD2xrJuZ8ityqXyGL4s" />
      </head>
      <body className={cn('h-full font-sans antialiased', inter.className)}>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="flex h-[calc(100vh-4rem)]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-white p-8">
              <div className="mx-auto max-w-7xl">
                <LaptopPrompt />
                {children}
              </div>
            </main>
          </div>
        </div>
        <Toaster />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
