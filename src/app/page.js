"use client";

import { useCallback, useState, useEffect, memo } from "react";
import { usePathname } from 'next/navigation';
import { Loader2, Code2, Sparkles, Binary, Gauge } from "lucide-react";
import dynamic from 'next/dynamic';

// Component imports - consider using dynamic imports for these if they're large
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Banner from "./_components/Banner";
import About from "./_components/About";
import Workshop from "./_components/Workshop";
import PastEvent from "./_components/PastEvent";
import Council from "./_components/Council";

// Optimized UI components
const LoadingMessage = memo(({ icon, text }) => (
  <div className="backdrop-blur-sm py-2 sm:py-3">
    <div className="flex items-center justify-center space-x-2 sm:space-x-3 px-3 sm:px-4">
      <div className="text-gradient-blue-purple animate-pulse">{icon}</div>
      <span className="text-xs sm:text-sm md:text-base font-light tracking-wide text-gray-300">{text}</span>
    </div>
  </div>
));

// Reduced number of particles for better performance
const ParticlesBackground = memo(() => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Reduced from 20 to 12 particles
    const newParticles = Array(12).fill().map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 4 + 2}px`,
      height: `${Math.random() * 4 + 2}px`,
      opacity: Math.random() * 0.5 + 0.3,
      animationDuration: `${Math.random() * 10 + 15}s`,
      animationDelay: `${Math.random() * -15}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {particles.map((style, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-400"
          style={{
            top: style.top,
            left: style.left,
            width: style.width,
            height: style.height,
            opacity: style.opacity,
            animation: `float ${style.animationDuration} linear infinite`,
            animationDelay: style.animationDelay,
          }}
        />
      ))}
    </div>
  );
});

const Logo = memo(() => (
  <div className="relative p-3 sm:p-4 overflow-visible w-full text-center animate-fade-in">
    <div className="absolute -inset-8 sm:-inset-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-wider bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      WEBSTERS
    </h1>
    <div className="absolute -right-2 sm:-right-4 -top-2 sm:-top-4 w-4 sm:w-8 h-4 sm:h-8">
      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
    </div>
  </div>
));

const ProgressIndicator = memo(({ progress }) => (
  <div className="space-y-3 sm:space-y-4 group">
    <div className="h-1.5 sm:h-2 w-full bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm group-hover:h-2 sm:group-hover:h-2.5 transition-all duration-300">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
    <div className="flex items-center justify-between text-xs sm:text-sm md:text-base text-gray-400">
      <span className="group-hover:text-white transition-colors duration-300">{progress.toFixed(0)}%</span>
      <span className="group-hover:text-white transition-colors duration-300">Loading...</span>
    </div>
  </div>
));

const AnimatedDots = memo(() => (
  <div className="flex justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-8">
    {[0, 1, 2].map((i) => (
      <div key={i} className="relative">
        <div
          className="absolute inset-0 bg-blue-500/30 rounded-full blur-md animate-ping"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
        <div
          className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      </div>
    ))}
  </div>
));

// Loading messages are now defined outside the component
const LOADING_MESSAGES = [
  { icon: <Binary className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Initializing systems..." },
  { icon: <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Optimizing performance..." },
  { icon: <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Almost there..." },
  { icon: <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Loading components..." },
  { icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Preparing interface..." },
];

const LoadingScreenComponent = memo(({ progress = 0, children }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Set message rotation interval
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-black text-white z-50">
      <ParticlesBackground />
      
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md px-3 sm:px-4 md:px-8 space-y-4 sm:space-y-6 md:space-y-8 relative z-10">
        <Logo />
        <div className="space-y-1 sm:space-y-2 text-center">
          <p className="text-sm sm:text-base md:text-2xl font-light tracking-wide">
            The Computer Science Society of Shivaji College
          </p>
          <p className="text-xs sm:text-sm md:text-lg text-gray-400 font-light">
            University of Delhi
          </p>
        </div>
        <ProgressIndicator progress={progress} />
        <LoadingMessage {...LOADING_MESSAGES[currentMessageIndex]} />
        <AnimatedDots />
      </div>
      
      {/* Hidden div to preload components */}
      <div className="hidden">{children}</div>
    </div>
  );
});

// Client-side only loading screen
const LoadingScreen = dynamic(() => Promise.resolve(LoadingScreenComponent), {
  ssr: false
});

// Preload all main content components in a single hidden div
const PreloadedMainContent = memo(() => (
  <div style={{ display: 'none' }}>
    <Header />
    <Banner />
    <About />
    <Workshop />
    <PastEvent />
    <Council />
    <Footer />
  </div>
));

const ScrollIndicator = memo(({ visible }) => (
  <div 
    className={`fixed bottom-8 w-full flex justify-center z-50 transition-opacity duration-500 ${
      visible ? 'opacity-80 hover:opacity-100' : 'opacity-0 pointer-events-none'
    }`}
  >
    <div className="flex flex-col items-center animate-bounce">
      <span className="text-sm text-gray-600 mb-1 text-center px-4">
        Scroll to explore
      </span>
      <svg 
        className="w-5 h-5 text-blue-500" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 14l-7 7m0 0l-7-7m7 7V3" 
        />
      </svg>
    </div>
  </div>
));

const ScrollToTopButton = memo(({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-4 right-4 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-40"
    aria-label="Scroll to top"
  >
    <svg 
      className="w-5 h-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M5 10l7-7m0 0l7 7m-7-7v18" 
      />
    </svg>
  </button>
));

// Custom hooks
const useLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [componentsPreloaded, setComponentsPreloaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    
    // Skip loading if we've already shown it or if using hash navigation
    const hasLoadingBeenShown = sessionStorage.getItem('loadingShown');
    if (hasLoadingBeenShown || window.location.hash) {
      setIsLoading(false);
      setProgress(100);
    }
  }, []);

  // Loading animation and component preloading
  useEffect(() => {
    if (!isMounted || !isLoading) return;
    
    // More efficient progress incrementing
    const loadingTimer = setInterval(() => {
      setProgress(prev => {
        // Faster initial loading
        if (prev < 30) return prev + 3;
        if (prev < 60 && !componentsPreloaded) return prev + 1;
        if (prev >= 100) {
          clearInterval(loadingTimer);
          setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem('loadingShown', 'true');
          }, 300); // Reduced from 500ms
          return 100;
        }
        return prev + 4;
      });
    }, 60); // Slightly slower interval but larger increments

    // Mark components as preloaded sooner
    const preloadTimer = setTimeout(() => {
      setComponentsPreloaded(true);
    }, 600); // Reduced from 800ms

    return () => {
      clearInterval(loadingTimer);
      clearTimeout(preloadTimer);
    };
  }, [isMounted, componentsPreloaded, isLoading]);

  return { isLoading, progress, isMounted };
};

// More efficient scroll indicator implementation
const useScrollIndicator = (isMounted) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    if (!isMounted) return;
    
    // Use requestAnimationFrame for smoother scrolling
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollIndicator(window.scrollY < 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  return showScrollIndicator;
};

// Optimized hash scroll handling
const useHashScroll = (isLoading, isMounted) => {
  useEffect(() => {
    if (!isMounted || isLoading) return;
    
    const scrollToHashSection = () => {
      const hash = window.location.hash.substring(1);
      
      if (hash) {
        requestAnimationFrame(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(scrollToHashSection, 50); // Reduced from 100ms
    
    window.addEventListener('hashchange', scrollToHashSection, { passive: true });
    return () => {
      window.removeEventListener('hashchange', scrollToHashSection);
      clearTimeout(timer);
    };
  }, [isLoading, isMounted]);
};

export default function Home() {
  const { isLoading, progress, isMounted } = useLoading();
  const showScrollIndicator = useScrollIndicator(isMounted);
  
  // Handle hash-based scrolling
  useHashScroll(isLoading, isMounted);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // SSR placeholder
  if (!isMounted) {
    return <div className="min-h-screen bg-black"></div>;
  }

  if (isLoading) {
    return (
      <LoadingScreen progress={progress}>
        <PreloadedMainContent />
      </LoadingScreen>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Banner />
        <About />
        <Workshop />
        <PastEvent />
        <Council />
        
        <ScrollIndicator visible={showScrollIndicator} />
        <ScrollToTopButton onClick={scrollToTop} />
      </main>
      <Footer />
    </>
  );
}