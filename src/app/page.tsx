
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight, Bot, Code, BarChart, Check, Globe, MessageSquare, Zap, Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Navbar from "@/components/Navbar";

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
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">
            GeniStudio is now live!
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Create Custom Chatbots with Ease on <span className="text-blue-600">GeniStudio</span>
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          GeniStudio empowers businesses to build and deploy customized chatbots in minutes without any coding. Enhance customer engagement across multiple platforms and streamline your operations.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {user ? (
            <Link href="/chatbot-dashboard" className={buttonVariants({ size: "lg" })}>
              Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <RegisterLink className={buttonVariants({ size: "lg" })}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </RegisterLink>
          )}
          <Link href="#features" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Learn More
          </Link>
        </div>

        <div className="mt-16 flex justify-center">
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
        </div>
      </MaxWidthWrapper>

      <div className="bg-gray-50 py-20">
        <MaxWidthWrapper>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Why Choose GeniStudio?</h2>
            <p className="text-xl text-gray-600">Powerful features to supercharge your customer interactions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Deploy Across Multiple Channels</h2>
          <p className="text-xl text-gray-600">Reach your customers wherever they are</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {deploymentChannels.map((channel) => (
            <div key={channel} className="bg-blue-100 text-blue-800 rounded-full px-6 py-3 text-sm font-medium">
              {channel}
            </div>
          ))}
        </div>
      </MaxWidthWrapper>

      <div className="bg-blue-600 text-white py-20">
        <MaxWidthWrapper>
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Ready to transform your customer interactions?</h2>
            <p className="text-xl mb-8">Join thousands of businesses already using GeniStudio to create engaging chatbots across multiple platforms.</p>
            {user ? (
              <Link href="/chatbot-dashboard" className={buttonVariants({ size: "lg", variant: "secondary" })}>
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <RegisterLink className={buttonVariants({ size: "lg", variant: "secondary" })}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </RegisterLink>
            )}
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Start Building Your Chatbot Today</h2>
            <p className="text-xl text-gray-600 mb-6">Create, customize, and deploy your chatbot in minutes with our intuitive platform.</p>
            <ul className="space-y-4">
              {['Easy to use interface', 'AI-powered responses', 'Multi-channel support', 'Detailed analytics'].map((item) => (
                <li key={item} className="flex items-center">
                  <Check className="h-6 w-6 text-green-500 mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <Image
              src="/chatbot-builder.png"
              width={500}
              height={400}
              alt="Chatbot builder interface"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
