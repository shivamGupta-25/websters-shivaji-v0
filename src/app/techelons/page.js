"use client";

{/* <>

"use client"

import Header from "../_components/Header"
import Footer from "../_components/Footer"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

const TechelonsHero = ({
  events = [
    {
      title: "Dark Coding",
      desc: "A competitive coding challenge testing problem-solving skills under time constraints.",
      img: "/assets/Poster.png",
      date: "March 15, 2025",
      venue: "Hall A",
      time: "10:00 AM - 12:00 PM",
    },
    {
      title: "Googler",
      desc: "An event assessing search efficiency and information retrieval capabilities.",
      img: "/assets/Poster.png",
      date: "March 15, 2025",
      venue: "Lab 1",
      time: "1:00 PM - 3:00 PM",
    },
    {
      title: "Web Hive",
      desc: "A web designing competition encouraging creativity and technical expertise.",
      img: "/assets/Poster.png",
      date: "March 16, 2025",
      venue: "Hall B",
      time: "11:00 AM - 1:00 PM",
    },
    {
      title: "Whatzapper",
      desc: "An event emphasizing rapid texting and effective communication.",
      img: "/assets/Poster.png",
      date: "March 16, 2025",
      venue: "Lab 2",
      time: "2:00 PM - 4:00 PM",
    },
    {
      title: "AI Artistry",
      desc: "A competition exploring AI-generated art and creativity.",
      img: "/assets/Poster.png",
      date: "March 17, 2025",
      venue: "Hall C",
      time: "12:00 PM - 2:00 PM",
    },
    {
      title: "E-Lafda",
      desc: "A LAN gaming competition for gaming enthusiasts.",
      img: "/assets/Poster.png",
      date: "March 17, 2025",
      venue: "Gaming Zone",
      time: "3:00 PM - 5:00 PM",
    },
  ],
}) => {
  const router = useRouter()

  const handleExit = () => {
    window.open("/registrationclosed", "_self")
    // window.open("/techelonsregistration", "_blank");
  }

  return (
    <>
      <Header />
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="overflow-hidden">
        <motion.div className="flex items-center justify-center w-full mt- px-4" variants={fadeIn}>
          <div className="inline-flex items-center space-x-2 px-5 py-4 rounded-full bg-gray-900 text-white text-sm">
            <motion.span
              className="w-3 h-3 rounded-full bg-red-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            />
            <span className="font-bold">Registration Closed</span>
          </div>
        </motion.div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 sm:py-12">
          <motion.h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-tight" variants={fadeIn}>
            Techelons'25
          </motion.h1>
          <motion.p className="mt-4 text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4" variants={fadeIn}>
            Techelons is the annual technical festival organized by Webster's, the Computer Science Society of Shivaji
            College, University of Delhi. It has grown into a national platform for students to showcase their technical
            skills and creativity.
          </motion.p>
          <motion.div className="mt-8 sm:mt-12 flex justify-center px-4" variants={scaleUp}>
            <img
              src="/assets/Poster2.jpg"
              alt="Techelons 25 Poster"
              className="w-full max-w-4xl rounded-md shadow-lg"
            />
          </motion.div>
          <motion.h1 className="text-6xl sm:text-5xl lg:text-8xl font-extrabold text-gray-900 mt-12 sm:mt-16" variants={fadeIn}>
            Events
          </motion.h1>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-screen-xl mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="bg-white p-4 shadow-lg rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl text-left cursor-pointer group"
                >
                  <img
                    src={event.img || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full rounded-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 transition-colors duration-300 group-hover:text-blue-600">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{event.desc}</p>
                    <p className="text-gray-500 text-xs">
                      <strong>Date:</strong> {event.date}
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Venue:</strong> {event.venue}
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Time:</strong> {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <motion.div className="mt-12 sm:mt-16 text-center px-4" variants={fadeIn}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Join Us</h2>
            <p className="text-base sm:text-lg text-gray-900 max-w-lg mx-auto mt-3 sm:mt-4 mb-5 sm:mb-6">
              Be part of an inspiring journey into the world of technology and innovation at Techelons'25.
            </p>
            <motion.button
              className="bg-gray-900 text-white py-2 sm:py-3 px-6 sm:px-8 text-base sm:text-lg font-bold rounded-full shadow-md"
              whileHover={{ scale: 1.05, backgroundColor: "#1a202c" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExit}
            >
              Register Now
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  )
}

export default TechelonsHero

</> */}

// Coming Soon Page to be removed later
import { useEffect, useState } from 'react';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize particles
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;

      const particleCount = 15;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 6 + 2;

        particle.style.position = 'absolute';
        particle.style.backgroundColor = '#88888815';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        const duration = Math.random() * 4 + 3;
        const delay = Math.random() * 3;
        particle.style.animation = `float ${duration}s infinite ease-in-out ${delay}s`;

        container.appendChild(particle);
      }
    };

    createParticles();

    // Cleanup function
    return () => {
      const container = document.getElementById('particles');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center overflow-hidden relative px-4 sm:px-6 lg:px-8">
      {/* Particle effect container */}
      <div id="particles" className="absolute inset-0 z-0"></div>

      {/* Main content */}
      <div className="z-10 text-center w-full max-w-4xl relative">
        <div className="relative mb-8 inline-block">
          {/* Animated logo with increased font weight and letter spacing */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent" style={{ fontWeight: 900, WebkitTextStroke: '1px rgba(0,0,0,0.1)' }}>
            <span className="inline-block" style={{ letterSpacing: '0.05em' }}>Techelons-25</span>
          </h1>

          {/* Accent line - made slightly thicker */}
          <div className="h-1.5 w-20 sm:w-24 md:w-28 lg:w-32 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mt-2 md:mt-3 rounded-full"></div>
        </div>

        {/* Tagline with typewriter effect */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 opacity-0 animate-fadeIn" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          Coming Soon!
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 text-gray-600 opacity-0 animate-fadeIn" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
          We're crafting something extraordinary at the intersection of innovation and possibility.
          Join us on this exciting journey into the future of technology.
        </p>

        <p className="text-base sm:text-lg md:text-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 text-gray-600 opacity-0 animate-fadeIn" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
          Follow us to stay updated!
        </p>

        {/* Animated socials */}
        <div className="flex justify-center gap-4 sm:gap-5 md:gap-6 opacity-0 animate-fadeIn" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
          <a
            href="https://www.instagram.com/websters.shivaji?igsh=MTRxaWFhMGUwMGR2eQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 -z-10 scale-0 group-hover:scale-125"></div>
            <FaInstagram size={28} className="sm:text-4xl text-gray-800 hover:scale-110 transition-transform duration-300 group-hover:text-white" />
          </a>

          <a
            href="https://www.linkedin.com/company/websters-shivaji-college/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 -z-10 scale-0 group-hover:scale-125"></div>
            <FaLinkedin size={28} className="sm:text-4xl text-gray-800 hover:scale-110 transition-transform duration-300 group-hover:text-white" />
          </a>
        </div>

        {/* Interactive elements */}
        <div className="mt-10 sm:mt-12 md:mt-16 flex flex-col items-center opacity-0 animate-fadeIn" style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}>
          <button
            className="group relative overflow-hidden py-2 sm:py-3 px-6 sm:px-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base md:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => window.open('/', '_self')} // Redirect to home page
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-2">
              Back to Home page
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-3 h-3 sm:w-4 sm:h-4">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Decorative elements - responsive */}
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-tr-full z-0"></div>
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-bl from-purple-500/10 to-indigo-500/10 rounded-bl-full z-0"></div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        @media (max-width: 640px) {
          .tracking-wider {
            letter-spacing: 0.03em;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .tracking-wider {
            letter-spacing: 0.04em;
          }
        }
        
        @media (min-width: 769px) {
          .tracking-wider {
            letter-spacing: 0.05em;
          }
        }
        
        /* Font optimization for better boldness visualization */
        h1 {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </main>
  );
}