import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metadata } from "next"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function constructMetaData({
  title =  "Xplain-ai - the SaaS for interacting with your document(pdf,ppt,doc,etc) files",
  description = "Xplain-ai is a software that makes chatting with your Documents(pdf,ppt,doc,etc) files easy.",
  image = "/cover-xplain.jpg",
  icons = "/favicon.ico",
  noIndex = false,
  manifest="/manifest.json"
}: {
  title?: string
  manifest?: string
  description?: string
  image?: string
  icons?: string
  noIndex?:boolean
} = {}) : Metadata {
  return {
    manifest,
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url:image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@DKamara36931"
    },
    icons,
    metadataBase: new URL("https://cph-nine.vercel.app"),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index:false,
        follow:false
      }
    })
  }
}