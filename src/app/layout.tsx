import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { BusinessProvider } from "@/components/business/BusinessContext";
import { constructMetaData } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetaData()


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <Providers>
        <BusinessProvider>
            <body className={inter.className}>
               {children}
            </body>
        </BusinessProvider>
      </Providers>
    </html>
  );
}
