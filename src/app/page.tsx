"use client"
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin } from "lucide-react";
import Link from "next/link";
export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStory = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % userStories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? userStories.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-6">
          <div className="text-3xl flex justify-center gap-x-1 font-bold text-gray-800">
            <Image src="/geneline-x-main-x.jpg" alt="Geneline-X Logo" width={150} height={50} />
            <div>
            <span>Geneline-</span><h3>X</h3>
            </div>
          </div>
          <nav className="space-x-6">
            <a href="#services" className="text-lg font-medium text-gray-700 hover:text-gray-900">
              Services
            </a>
            <a href="#products" className="text-lg font-medium text-gray-700 hover:text-gray-900">
              Products
            </a>
            <a href="#team" className="text-lg font-medium text-gray-700 hover:text-gray-900">
              Team
            </a>
            <a href="#stories" className="text-lg font-medium text-gray-700 hover:text-gray-900">
              User Stories
            </a>
            <a href="#contact" className="text-lg font-medium text-gray-700 hover:text-gray-900">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white py-20">
        <div className="container mx-auto text-center">
          <motion.h1
            className="text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Empowering Innovation with Generative AI
          </motion.h1>
          <motion.p
            className="text-2xl mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Revolutionizing industries and enhancing lives through innovative AI solutions.
          </motion.p>
          <motion.button
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 opacity-70"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto py-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Image src={service.image} alt={service.title} width={400} height={300} className="rounded-md mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Image src={product.image} alt={product.title} width={400} height={300} className="rounded-md mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h3>
                <p className="text-gray-600">{product.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="container mx-auto py-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Image src={member.image} alt={member.name} width={400} height={300} className="rounded-full mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* User Stories Section */}
      <section id="stories" className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">User Stories</h2>
          <div className="relative flex items-center justify-center">
            <button
              onClick={prevStory}
              className="absolute left-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              &lt;
            </button>
            <div className="w-full overflow-hidden">
              <AnimatePresence>
                <motion.div
                  key={currentIndex}
                  className="flex-shrink-0 w-full"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image src={userStories[currentIndex].image} alt={userStories[currentIndex].name} width={400} height={300} className="rounded-full mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{userStories[currentIndex].name}</h3>
                  <p className="text-gray-600">{userStories[currentIndex].feedback}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              onClick={nextStory}
              className="absolute right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              &gt;
            </button>
          </div>
        </div>
      </section>

     {/* Footer section  */}
      <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto text-center">
        <div className="mb-6">
          <Image src="/geneline-x-main-x.jpg" alt="Geneline-X Logo" width={150} height={50} />
        </div>
        <div className="mb-6 space-x-6">
          <Link className="text-lg font-medium hover:underline" href="#services">
            Services
          </Link>
          <Link className="text-lg font-medium hover:underline" href="#products">
            Products
          </Link>
          <Link className="text-lg font-medium hover:underline" href="#team">
            Team
          </Link>
          <Link className="text-lg font-medium hover:underline" href="#user-stories">
            User Stories
          </Link>
          <Link className="text-lg font-medium hover:underline" href="#contact">
            Contact
          </Link>
        </div>
        <div className="mb-6 space-x-6">
          <Link className="text-white hover:text-gray-400 mx-2" href="https://twitter.com/genelinex">
              <Twitter size={24} />
          </Link>
          <Link className="text-white hover:text-gray-400 mx-2" href="https://linkedin.com/company/geneline-x">
           
              <Linkedin size={24} />
            
          </Link>
          <Link className="text-white hover:text-gray-400 mx-2" href="https://facebook.com/genelinex">
         
              <Facebook size={24} />
            
          </Link>
          <Link className="text-white hover:text-gray-400 mx-2" href="https://instagram.com/genelinex">
            
              <Instagram size={24} />
           
          </Link>
        </div>
        <div className="mb-6 space-y-2">
          <div className="flex justify-center items-center space-x-2">
            <Mail size={20} />
            <span className="text-gray-400">info@geneline-x.net</span>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <MapPin size={20} />
            <span className="text-gray-400">20 Collier Street, Off Solo B Drive, Goderich, Freetown, Sierra Leone</span>
          </div>
        </div>
        <p className="text-gray-400">© 2024 Geneline-X. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
}

const services = [
  {
    title: "Generative AI Solutions",
    description: "Creating innovative AI solutions tailored to your needs.",
    image: "/generative-soln.jpeg",
  },
  {
    title: "Software Development",
    description: "Building robust and scalable software applications.",
    image: "/Software-Development.jpg",
  },
  {
    title: "Animated Video Production",
    description: "Producing engaging and high-quality animated videos.",
    image: "/animated-1.png",
  },
];

const products = [
  {
    title: "Xplain AI",
    description: "Interact with your documents and media files using AI.",
    image: "/top-logo-x.jpg",
  },
  {
    title: "Custom Chatbots",
    description: "Tailored chatbots for customer service, education, and more.",
    image: "/generative-ai-image-1.png",
  },
  {
    title: "AI-Powered Analytics",
    description: "Gain insights and make data-driven decisions with AI.",
    image: "/generative-ai-data-analytics.webp",
  },
];

const team = [
  {
    name: "DENNIS STEPHEN KAMARA",
    role: "CEO/CTO",
    image: "/my picture.jpg",
  },
  {
    name: "MOHAMED J BAH",
    role: "CFO",
    image: "/jaward-pic.jpg",
  },
  {
    name: "DEVELOPERS ",
    role: "TEAM OF DEVELOPERS",
    image: "/developer-image.jpeg",
  },
];

const userStories = [
  {
    name: "Alice Brown",
    feedback: "Xplain AI has transformed the way we interact with our documents.",
    image: "/users/alice-brown.jpg",
  },
  {
    name: "Bob Johnson",
    feedback: "The custom chatbots have improved our customer service immensely.",
    image: "/users/bob-johnson.jpg",
  },
  {
    name: "Catherine Davis",
    feedback: "The AI-powered analytics helped us make better business decisions.",
    image: "/users/catherine-davis.jpg",
  },
];
