"use client";

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCards, Autoplay } from "swiper/modules"
import Image from "next/image"
import { motion } from "framer-motion"
import "swiper/css"
import "swiper/css/effect-cards"

const slides = [
  {
    title: "UI/UX Workshop",
    imageUrl: "/assets/Events/UI-UX_Workshop.png",
  },
  {
    title: "AI Artistry-23",
    imageUrl: "/assets/Events/AI_Artistry_23.jpg",
  },
  {
    title: "AI Artistry-24",
    imageUrl: "/assets/Events/AI_Artistry_24.jpg",
  },
  {
    title: "Dark Coding-23",
    imageUrl: "/assets/Events/DarkCoding_23.jpg",
  },
  {
    title: "Dark Coding-24",
    imageUrl: "/assets/Events/DarkCoding_24.jpg",
  },
  {
    title: "E-Lafda-24",
    imageUrl: "/assets/Events/E-Lafda_24.jpg",
  },
  {
    title: "Git & GitHub Workshop",
    imageUrl: "/assets/Events/Git_GitHub.jpg",
  },
  {
    title: "Googler-23",
    imageUrl: "/assets/Events/Googler_23.jpg",
  },
  {
    title: "Googler-24",
    imageUrl: "/assets/Events/Googler_24.jpg",
  },
  {
    title: "Techelons-23",
    imageUrl: "/assets/Events/Techelons_23.jpg",
  },
  {
    title: "Techelons-24",
    imageUrl: "/assets/Events/Techelons_24.jpg",
  },
  {
    title: "TechnoQuiz-24",
    imageUrl: "/assets/Events/TechnoQuiz_24.jpg",
  },
  {
    title: "Web Hive-23",
    imageUrl: "/assets/Events/Web_Hive_23.jpg",
  },
  {
    title: "Whatzapper-23",
    imageUrl: "/assets/Events/Whatzapper_23.jpg",
  },
]

const StackedCarousel = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl aspect-[16/9] rounded-lg shadow-xl overflow-hidden"
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        speed={800}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="rounded-xl shadow-lg overflow-hidden">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="relative w-full h-full">
              <Image src={slide.imageUrl || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold">{slide.title}</h2>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  )
}

const PastEvent = () => {
  return (
    <div className="flex items-center justify-center container mx-auto overflow-hidden mt-8">
      <section id="pastevent" className="text-white py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-6xl sm:text-8xl lg:text-9xl font-extrabold text-gray-900 dark:text-white mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            viewport={{ amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 50, damping: 20, duration: 0.8 }}
          >
            Past Event
          </motion.h1>
          <StackedCarousel />
        </div>
      </section>
    </div>
  )
}

export default PastEvent;