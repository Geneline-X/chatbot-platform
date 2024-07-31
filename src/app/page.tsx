import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
//import ContactForm from "@/components/ContactForm";

export default async function Home() {

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">
             GeniStudio is now live!
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Create Custom Chatbots with Ease on <span className="text-blue-500">GeniStudio</span>.
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          GeniStudio empowers you to build and deploy customized chatbots in minutes without any coding. Perfect for businesses of all sizes.
          <strong className="block mt-2 font-bold">Start your journey with us today.</strong>
        </p>

        {!user ? (
          <RegisterLink className={buttonVariants({ size: "lg", className: "mt-5" })}>
            Get Started <ArrowRight className='ml-1.5 h-5 w-5' />
          </RegisterLink>
        ) : (
          <Link className={buttonVariants({ size: "lg", className: "mt-5" })} href="/chatbot-dashboard">
            Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        )}

        <div>
          <div className="relative isolate">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-80">
              <div style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.75% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
            </div>

            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:m-4 lg:rounded-2xl lg:p-4">
                  {/* <Image 
                    src="/genistudio-preview.png" 
                    width={1364} 
                    height={866}
                    alt="preview of the app"
                    quality={100}
                    className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
                  /> */}
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-80">
              <div style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.75% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
            </div>
          </div>
        </div>
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-500">Step 1</span>
              <span className="text-xl font-semibold">Sign up for an account.</span>
              <span className="mt-2 text-zinc-700">
                Start with our free trial and explore the features. Upgrade later for more advanced options.
              </span>
            </div>
          </li>
          <li className="md:flex">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-500">Step 2</span>
              <span className="text-xl font-semibold">Create your chatbot.</span>
              <span className="mt-2 text-zinc-700">
                Use our intuitive builder to design your chatbot's flow, set responses, and customize its appearance.
              </span>
            </div>
          </li>
          <li className="md:flex">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-500">Step 3</span>
              <span className="text-xl font-semibold">Deploy and manage.</span>
              <span className="mt-2 text-zinc-700">
                Integrate your chatbot with your website, social media, or any other platform. Manage and update it easily from your dashboard.
              </span>
            </div>
          </li>
        </ol>

      </MaxWidthWrapper>
    </>
  );
}
