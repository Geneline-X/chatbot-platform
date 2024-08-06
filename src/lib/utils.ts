import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metadata } from "next"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function constructMetaData({
  title =  "GeniStudio - the Platform to fully build and customize your chatbots with no code",
  description = "GeniStudio is Platform that makes building chatbots easily, with no code at all.",
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
    metadataBase: new URL("https://geneline-x.net"),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index:false,
        follow:false
      }
    })
  }
}