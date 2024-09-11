import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Navbar from "@/components/Navbar";
//import ContactForm from "@/components/ContactForm";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

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
          GeniStudio empowers you to build and deploy customized chatbots in minutes without any coding. Perfect for businesses of all sizes.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {!user ? (
            <RegisterLink className={buttonVariants({ size: "lg" })}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </RegisterLink>
          ) : (
            <Link className={buttonVariants({ size: "lg" })} href="/chatbot-dashboard">
              Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
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
                src="/dashboard-preview.png"
                width={600}
                height={400}
                alt="Dashboard preview"
                className="rounded-md shadow-2xl border border-gray-200"
              />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      <div className="mx-auto max-w-5xl px-6 lg:px-8 mt-32 sm:mt-56" id="features">
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to create amazing chatbots</h2>
          <p className="mt-4 text-lg text-gray-600">
            GeniStudio provides all the tools and features you need to build, customize, and deploy chatbots that engage your audience.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8">
          {[
            {
              title: "Intuitive Builder",
              description: "Create chatbot flows with our drag-and-drop interface. No coding required.",
              icon: "🛠️",
            },
            {
              title: "AI-Powered Responses",
              description: "Leverage advanced AI to generate human-like responses and understand user intent.",
              icon: "🧠",
            },
            {
              title: "Customizable Design",
              description: "Match your brand with customizable chat widgets that seamlessly integrate with your website.",
              icon: "🎨",
            },
            {
              title: "Analytics Dashboard",
              description: "Gain insights into chatbot performance and user interactions to continually improve your bot.",
              icon: "📊",
            },
          ].map((feature) => (
            <div key={feature.title} className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-32 sm:mt-56">
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Get started in minutes</h2>
          <p className="mt-4 text-lg text-gray-600">
            Follow these simple steps to create your first chatbot and revolutionize your customer interactions.
          </p>
        </div>

        <ol className="mt-12 space-y-4 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 1</span>
              <span className="text-xl font-semibold">Sign up for an account</span>
              <span className="mt-2 text-zinc-700">
                Start with our free trial and explore the features. Upgrade later for more advanced options.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 2</span>
              <span className="text-xl font-semibold">Create your chatbot</span>
              <span className="mt-2 text-zinc-700">
                Use our intuitive builder to design your chatbot&apos;s flow, set responses, and customize its appearance.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 3</span>
              <span className="text-xl font-semibold">Deploy and manage</span>
              <span className="mt-2 text-zinc-700">
                Integrate your chatbot with your website, social media, or any other platform. Manage and update it easily from your dashboard.
              </span>
            </div>
          </li>
        </ol>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-32 sm:mt-56">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ready to transform your customer interactions?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of businesses already using GeniStudio to create engaging chatbots.
          </p>
          <div className="mt-8">
            {!user ? (
              <RegisterLink className={buttonVariants({ size: "lg" })}>
                Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
              </RegisterLink>
            ) : (
              <Link className={buttonVariants({ size: "lg" })} href="/chatbot-dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
