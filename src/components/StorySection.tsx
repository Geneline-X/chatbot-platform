"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
interface Props {}

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

const StorySection = () => {

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
  )
}

export default StorySection