"use client";

// This Below code is Without Loading Screen 
{/* <>
  import Header from "./_components/Header";
  import Footer from "./_components/Footer";
  import Banner from "./_components/Banner";
  import About from "./_components/About";
  import Workshop from "./_components/Workshop";
  import PastEvent from "./_components/PastEvent";
  import Council from "./_components/Council";

  export default function Home() {
  return (
  <>
    <Header>
      <main>
        <Banner />
        <About />
        <Workshop />
        <PastEvent />
        <Council />
      </main>
    </Header>
    <Footer />
  </>
  );
}
</> */}

// With Loading Screen
import React, { useState, useEffect, Suspense, lazy, useCallback, memo, useMemo, useRef } from "react";
import { Loader2, Code2, Sparkles, Binary, Gauge } from "lucide-react";
import { useInView } from "react-intersection-observer";

// Improve lazy loading with custom preloader
const preloadComponent = (importFunc) => {
  const Component = lazy(importFunc);
  Component.preload = importFunc;
  return Component;
};

// Apply custom preloader to all components
const Header = preloadComponent(() => import("./_components/Header"));
const Footer = preloadComponent(() => import("./_components/Footer"));
const Banner = preloadComponent(() => import("./_components/Banner"));
const About = preloadComponent(() => import("./_components/About"));
const Workshop = preloadComponent(() => import("./_components/Workshop"));
const PastEvent = preloadComponent(() => import("./_components/PastEvent"));
const Council = preloadComponent(() => import("./_components/Council"));

// Memoized loading messages component
const LoadingMessage = memo(({ icon, text }) => (
  <div className="flex items-center justify-center space-x-2 text-gray-300 animate-fade-in transition-opacity duration-300">
    <div className="animate-spin">{icon}</div>
    <span className="text-sm md:text-base">{text}</span>
  </div>
));

const LoadingScreen = memo(({ progress = 0 }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const loadingMessages = useMemo(() => [
    { icon: <Binary className="w-5 h-5" />, text: "Initializing systems..." },
    { icon: <Gauge className="w-5 h-5" />, text: "Optimizing performance..." },
    { icon: <Loader2 className="w-5 h-5" />, text: "Almost there..." },
    { icon: <Code2 className="w-5 h-5" />, text: "Loading components..." },
    { icon: <Sparkles className="w-5 h-5" />, text: "Preparing interface..." },
  ], []);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 1000);

    return () => clearInterval(messageInterval);
  }, [loadingMessages.length]);

  const animatedDots = useMemo(() => (
    <div className="flex justify-center space-x-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce opacity-0"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1s',
            animation: `bounce 1s ${i * 0.15}s infinite, fade-in 0.5s ${0.3 + i * 0.1}s forwards`
          }}
        ></div>
      ))}
    </div>
  ), []);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-black text-white z-50">
      <div className="w-full max-w-md px-4 md:px-8 space-y-6 md:space-y-8">
        {/* Logo Container */}
        <div className="relative p-4 overflow-visible w-full text-center animate-fade-in transition-all duration-500">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider inline-block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            WEBSTERS
          </h1>
        </div>

        {/* Subtitle with staggered animation */}
        <div className="space-y-2 text-center animate-fade-in transition-all duration-500" style={{ animationDelay: '0.2s' }}>
          <p className="text-base sm:text-lg md:text-2xl font-light">
            The Computer Science Society of Shivaji College
          </p>
          <p className="text-sm md:text-lg text-gray-400">
            University of Delhi
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-4">
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                backgroundSize: '200% 100%',
                animation: 'gradient 2s linear infinite'
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm md:text-base text-gray-400">
            <span>{progress.toFixed(2)}%</span>
            <span>Loading...</span>
          </div>
        </div>

        {/* Loading Message */}
        <div className="transition-opacity duration-300">
          <LoadingMessage {...loadingMessages[currentMessageIndex]} />
        </div>

        {/* Animated Dots */}
        {animatedDots}
      </div>
    </div>
  );
});

// Optimized Error Boundary Component with reset capability
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error loading component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded-lg shadow-sm my-4 text-center transition-all duration-300">
          <h3 className="text-lg font-medium text-red-600">Something went wrong</h3>
          <p className="mt-2 text-sm text-red-500">We couldn't load this component</p>
          <button
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Further optimized section wrapper with improved threshold settings
const SectionWrapper = memo(({ children, priority = false }) => {
  const { ref, inView } = useInView({
    threshold: priority ? 0 : 0.1,
    triggerOnce: true,
    rootMargin: priority ? '0px' : '100px',
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
    >
      {inView ? children : <div className="h-32 md:h-64" />}
    </div>
  );
});

// Scroll indicator component with proper mobile positioning
const ScrollIndicator = memo(({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 w-full flex justify-center sm:left-1/2 sm:transform sm:-translate-x-1/2 z-50 transition-opacity duration-500 opacity-80 hover:opacity-100">
      <div className="flex flex-col items-center animate-bounce">
        <span className="text-sm text-gray-600 mb-1 text-center px-4">Scroll to explore</span>
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
});

// Main component
export default function Home() {
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(true);
  const isPreloaded = useRef(false);

  // Create a unique navigation ID for this component instance
  const navigationId = useRef(Math.random().toString(36).substring(2, 15));

  // Memoized sections configuration with priority settings
  const sections = useMemo(() => [
    { Component: Banner, key: 'banner', priority: true },
    { Component: About, key: 'about', priority: false },
    { Component: Workshop, key: 'workshop', priority: false },
    { Component: PastEvent, key: 'past-event', priority: true },
    { Component: Council, key: 'council', priority: true }
  ], []);

  // Memoized component list for preloading, prioritizing critical components first
  const componentsToPreload = useMemo(() => [
    // Critical components - preload first
    PastEvent, Council, Header, Footer, Banner,
    // Secondary components - preload after critical ones
    Workshop, About
  ], []);

  // Enhanced preloading strategy with prioritization
  const preloadComponents = useCallback(async () => {
    if (isPreloaded.current) return;

    try {
      // First preload critical components (header, banner, about)
      await Promise.all(
        componentsToPreload.slice(0, 4).map(component => component.preload?.() || Promise.resolve())
      );

      // Set progress to 80% once critical components are loaded
      setLoadingProgress(prev => Math.max(prev, 80));

      // Then preload remaining components
      await Promise.all(
        componentsToPreload.slice(4).map(component => component.preload?.() || Promise.resolve())
      );

      isPreloaded.current = true;
    } catch (error) {
      console.error('Error preloading components:', error);
    }
  }, [componentsToPreload]);

  // Enhanced progress simulation with faster initial loading
  const simulateProgress = useCallback(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        // Accelerate to 70% faster, then slow down
        const increment = prev < 50 ? 3 : prev < 70 ? 1.5 : prev < 90 ? 0.8 : 0.3;
        const next = prev + increment;

        if (next >= 100) clearInterval(interval);
        return Math.min(next, 99); // Cap at 99% until actual loading completes
      });
    }, 30);
    return interval;
  }, []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (window.scrollY > 100 && isScrollIndicatorVisible) {
      setIsScrollIndicatorVisible(false);
    }
  }, [isScrollIndicatorVisible]);

  // IMPORTANT: This effect sets up navigation detection system that works with both
  // window.open and router navigation by storing navigation tokens
  useEffect(() => {
    // Function to store the current navigation token
    const storeNavigationToken = () => {
      // Make this work better with SPA router navigation
      try {
        // Store the current navigation ID and timestamp
        localStorage.setItem('lastNavigationToken', navigationId.current);
        localStorage.setItem('lastNavigationTime', Date.now().toString());
      } catch (e) {
        console.warn('Could not store navigation token:', e);
      }
    };

    // Store token on mount
    storeNavigationToken();

    // Intercept navigation methods to store token before navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Monkey patch history methods to track SPA navigation
    window.history.pushState = function () {
      storeNavigationToken();
      return originalPushState.apply(this, arguments);
    };

    window.history.replaceState = function () {
      storeNavigationToken();
      return originalReplaceState.apply(this, arguments);
    };

    // Listen for popstate events (browser back/forward)
    const handlePopState = () => {
      storeNavigationToken();
    };
    window.addEventListener('popstate', handlePopState);

    // Track before unload
    const handleBeforeUnload = () => {
      storeNavigationToken();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Restore original methods
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Initial loading determination - detect if this is a fresh load or navigation 
  useEffect(() => {
    // Get the last navigation token from storage
    let lastNavigationToken;
    let lastNavigationTime;

    try {
      lastNavigationToken = localStorage.getItem('lastNavigationToken');
      lastNavigationTime = localStorage.getItem('lastNavigationTime');
    } catch (e) {
      console.warn('Could not read navigation token:', e);
    }

    const currentToken = navigationId.current;
    const currentTime = Date.now();

    // Check if this is a navigation within the app or a fresh page load
    const isInternalNavigation = (
      // If tokens match, this is probably a remount, not a fresh load
      lastNavigationToken === currentToken ||
      // If navigation happened very recently (within 1 second), it's likely internal navigation
      (lastNavigationTime && (currentTime - parseInt(lastNavigationTime)) < 1000)
    );

    // Detect if this is a page refresh using performance API
    const isRefresh = window.performance &&
      window.performance.navigation &&
      window.performance.navigation.type === 1;

    // Show loading screen only on fresh loads and refreshes, not on internal navigation
    if (!isInternalNavigation || isRefresh) {
      setIsInitialLoading(true);
    } else {
      // Skip loading screen for internal navigation
      setIsInitialLoading(false);
      isPreloaded.current = true; // Assume already preloaded for internal navigation
    }

    // Update the navigation token in storage to mark this as the latest navigation
    try {
      localStorage.setItem('lastNavigationToken', currentToken);
      localStorage.setItem('lastNavigationTime', currentTime.toString());
    } catch (e) {
      console.warn('Could not update navigation token:', e);
    }
  }, []);

  // Setup loading, initialization, and preloading - only if isInitialLoading is true
  useEffect(() => {
    if (!isInitialLoading) return;

    // Start preloading immediately
    preloadComponents();

    const progressInterval = simulateProgress();

    // Prepare for show transition
    const showTimer = setTimeout(() => {
      if (isPreloaded.current) {
        setIsInitialLoading(false);
        clearInterval(progressInterval);
        setLoadingProgress(100);
      } else {
        // If not preloaded yet, check again in 500ms
        const checkPreloadInterval = setInterval(() => {
          if (isPreloaded.current) {
            setIsInitialLoading(false);
            clearInterval(progressInterval);
            clearInterval(checkPreloadInterval);
            setLoadingProgress(100);
          }
        }, 500);

        // Safety timeout - show anyway after 8 seconds
        setTimeout(() => {
          if (!isPreloaded.current) {
            setIsInitialLoading(false);
            clearInterval(progressInterval);
            clearInterval(checkPreloadInterval);
            setLoadingProgress(100);
          }
        }, 8000);
      }
    }, 2500);

    return () => {
      clearTimeout(showTimer);
      clearInterval(progressInterval);
    };
  }, [isInitialLoading, simulateProgress, preloadComponents]);

  // Register scroll handler
  useEffect(() => {
    // Register scroll handler with throttling
    let scrollTimeout;
    const throttledScrollHandler = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 200); // 200ms throttle
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [handleScroll]);

  // Prefetch remaining resources after initial render
  useEffect(() => {
    if (!isInitialLoading) {
      // Prefetch any remaining assets or components
      const prefetchRemainingResources = async () => {
        // This would be where you'd prefetch images, additional scripts, etc.
        // Example: prefetchImages(['url1', 'url2'])
      };

      prefetchRemainingResources();
    }
  }, [isInitialLoading]);

  // Add custom navigation method that works with our token system
  const navigateTo = useCallback((path) => {
    // Store navigation token before navigating
    try {
      localStorage.setItem('lastNavigationToken', navigationId.current);
      localStorage.setItem('lastNavigationTime', Date.now().toString());
    } catch (e) {
      console.warn('Could not store navigation token before navigation:', e);
    }

    // Handle navigation based on what's available (router.push or window.open)
    try {
      // Try to use router if it exists (you would pass router as prop or use context)
      if (window.router && typeof window.router.push === 'function') {
        window.router.push(path);
      } else {
        // Fallback to window.open
        window.open(path, '_self');
      }
    } catch (e) {
      console.error('Navigation failed:', e);
      // Last resort fallback
      window.location.href = path;
    }
  }, []);

  // Optimized scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Render loading screen
  if (isInitialLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  // Main page render with optimized component loading - removed loading indicators
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Scroll indicator */}
      <ScrollIndicator isVisible={isScrollIndicatorVisible} />

      <main className="flex-grow">
        {sections.map(({ Component, key, priority }) => (
          <ErrorBoundary key={key}>
            <SectionWrapper priority={priority}>
              <Component />
            </SectionWrapper>
          </ErrorBoundary>
        ))}
      </main>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-40"
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      <Footer />
    </div>
  );
}