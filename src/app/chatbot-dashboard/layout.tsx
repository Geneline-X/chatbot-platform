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
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="xqSq2gtf73XFTo_Z-8FEfgbwYD2xrJuZ8ityqXyGL4s" />
      </head>
      <body className={cn('min-h-screen font-sans antialiased bg-gray-50', inter.className)}>
        <LaptopPrompt />
        <Toaster />
        <div className="relative flex h-screen">
          
          {/* Sidebar with z-index */}
          <div className="fixed top-0 left-0 h-full w-64 z-50">
            <Sidebar />
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col ml-64 z-50">
            {/* Navbar with same z-index */}
            <Navbar />
            
            {/* Children container with same z-index */}
            <main className="flex-1 p-6 bg-gray-100 overflow-auto z-50">
            <LaptopPrompt />
              {children}
            </main>
          </div>
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
