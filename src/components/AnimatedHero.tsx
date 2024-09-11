'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

interface AnimatedHeroProps {
  isLoggedIn: boolean;
  primaryActionText: string;
  primaryActionHref: string;
  onPrimaryActionClick?: () => void;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ 
  isLoggedIn, 
  primaryActionText, 
  primaryActionHref,
  onPrimaryActionClick 
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50"
      >
        <p className="text-sm font-semibold text-gray-700">
          GeniStudio is now live!
        </p>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl"
      >
        Create Custom Chatbots with Ease on <span className="text-blue-600">GeniStudio</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-5 max-w-prose text-zinc-700 sm:text-lg"
      >
        GeniStudio empowers businesses to build and deploy customized chatbots in minutes without any coding. Enhance customer engagement across multiple platforms and streamline your operations.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex flex-col sm:flex-row gap-4"
      >
        <Link 
          href={primaryActionHref}
          className={buttonVariants({ size: "lg" })}
          onClick={onPrimaryActionClick}
        >
          {primaryActionText} <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <Link href="#features" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Learn More
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 flex justify-center"
      >
        <div className="relative w-full max-w-lg">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="relative">
            <Image
              src="/genistudio-dash.png"
              width={600}
              height={400}
              alt="Dashboard preview"
              className="rounded-md shadow-2xl border border-gray-200"
            />
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default AnimatedHero