import React from 'react'
import { cn, constructMetaData } from '@/lib/utils'
import '../globals.css'
import "react-loading-skeleton/dist/skeleton.css"
import "simplebar-react/dist/simplebar.min.css"
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from '@/components/Navbar'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'

interface Props {}
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return (
        <html lang="en">
            <head>
            {/* <meta name="google-adsense-account" content="ca-pub-1827922289519800"/> */}
            <meta name="google-site-verification" content="xqSq2gtf73XFTo_Z-8FEfgbwYD2xrJuZ8ityqXyGL4s" />
            </head>

            <body className={cn(
                'min-h-screen font-sans antialiased grainy',
                inter.className
            )}>
            <Toaster/>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Navbar />
                  <main className="flex-1 p-6 bg-gray-100">
                    {children}
                  </main>
                </div>
              </div>
              <SpeedInsights/>
              <Analytics />

          </body>
        </html>
    )

}