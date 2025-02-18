'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import { motion } from "framer-motion";

const councilMembers = [
    {
        name: "Shivani Singh",
        role: "President",
        image: "/assets/Council/Shivani Singh.jpg",
        linkedin: "#"
    },
    {
        name: "Jai Solanki",
        role: "Vice-President",
        image: "/assets/Council/Jai.JPG",
        linkedin: "https://www.linkedin.com/in/jai-solanki-a84078295"
    },
    {
        name: "Manish Pathak",
        role: "Vice-President",
        image: "/assets/Council/Manish Pathak.jpg",
        linkedin: "#"
    },
    {
        name: "Shivam Raj Gupta",
        role: "Technical Head",
        image: "/assets/Council/Shivam Raj Gupta.png",
        linkedin: "https://www.linkedin.com/in/shivam-raj-gupta/"
    },
    {
        name: "Keshav",
        role: "Creative Head",
        image: "/assets/Council/keshav.jpg",
        linkedin: "https://www.linkedin.com/in/keshavjangra075?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
        name: "Yugal",
        role: "Secretary",
        image: "/assets/Council/Yugal.jpg",
        linkedin: "https://www.linkedin.com/in/yugalofficial"
    },
    {
        name: "Prateek",
        role: "PR & Social Media Head",
        image: "/assets/Council/Prateek Tiwari.jpg",
        linkedin: "https://www.linkedin.com/in/prateek-tiwari-a01243277?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
        name: "Gaurav Rai",
        role: "PR & Social Media Head",
        image: "/assets/Council/Gaurav.jpg",
        linkedin: "https://www.linkedin.com/in/gaurav-rai-228b32269?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    }
];

const Council = () => {
    return (
        <section id="council" className="mt-8 px-4 max-w-[1400px] mx-auto">
            <motion.h1
                className="text-center text-6xl sm:text-8xl lg:text-9xl font-extrabold text-gray-900 dark:text-white mb-8 sm:mb-10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                viewport={{ amount: 0.5 }}
                transition={{ type: 'spring', stiffness: 50, damping: 20, duration: 0.8 }}
            >
                Council
            </motion.h1>

            <Swiper
                modules={[Autoplay, EffectCoverflow]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                spaceBetween={24}
                loop={true}
                coverflowEffect={{
                    rotate: 15,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 12
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 16
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 28
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 28
                    }
                }}
                className="w-full"
            >
                {councilMembers.map((member, index) => (
                    <SwiperSlide key={index} className="h-auto">
                        <Card className="overflow-hidden bg-white">
                            <div className="relative w-full h-[380px]">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    className="object-cover"
                                    width={300}
                                    height={300}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </div>
                            <CardContent className="p-4 text-center">
                                <h2 className="text-lg font-bold truncate mb-1">
                                    {member.name}
                                </h2>
                                <p className="text-md text-gray-600 mb-3">
                                    {member.role}
                                </p>
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center text-blue-500"
                                    aria-label={`LinkedIn profile of ${member.name}`}
                                >
                                    <Linkedin className="w-6 h-6" />
                                </a>
                            </CardContent>
                        </Card>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Council;
