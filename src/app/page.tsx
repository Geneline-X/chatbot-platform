import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight, Bot, Code, BarChart, Globe, MessageSquare, Zap, Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Navbar from "@/components/Navbar";
import AnimatedHero from "@/components/AnimatedHero";

//import ContactForm from "@/components/ContactForm";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const features = [
    { icon: Bot, title: "AI-Powered Chatbots", description: "Create intelligent chatbots that understand and respond to user queries effectively." },
    { icon: Code, title: "No-Code Builder", description: "Design and customize your chatbot without any coding knowledge." },
    { icon: BarChart, title: "Analytics Dashboard", description: "Track and analyze chatbot performance with detailed insights." },
    { icon: Globe, title: "Multi-Channel Deployment", description: "Deploy your chatbots across websites, social media, and messaging apps." },
    { icon: MessageSquare, title: "Natural Language Processing", description: "Enhance user interactions with advanced NLP capabilities." },
    { icon: Zap, title: "Quick Integration", description: "Easily integrate chatbots into your existing business systems." },
    { icon: Shield, title: "Secure & Compliant", description: "Ensure data privacy and compliance with industry standards." },
  ];

  const deploymentChannels = [
    "Websites", "Facebook Messenger", "WhatsApp", "Telegram", "Slack", "Discord", "SMS"
  ];

  return (
    <>
      <Navbar />
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <AnimatedHero isLoggedIn={!!user} />
      </MaxWidthWrapper>

      <div className="mx-auto max-w-5xl px-6 lg:px-8 mt-32 sm:mt-56" id="features">
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to create amazing chatbots</h2>
          <p className="mt-4 text-lg text-gray-600">
            GeniStudio provides all the tools and features you need to build, customize, and deploy chatbots that engage your audience across multiple channels.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base text-center text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-32 sm:mt-56">
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Deploy Across Multiple Channels</h2>
          <p className="mt-4 text-lg text-gray-600">
            Reach your customers wherever they are. GeniStudio allows you to deploy your chatbots across various platforms.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {deploymentChannels.map((channel) => (
            <div key={channel} className="bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-800">
              {channel}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-32 sm:mt-56 mb-16">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ready to transform your customer interactions?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of businesses already using GeniStudio to create engaging chatbots across multiple platforms.
          </p>
          <AnimatedHero isLoggedIn={!!user} />
        </div>
      </div>
    </>
  );
}
