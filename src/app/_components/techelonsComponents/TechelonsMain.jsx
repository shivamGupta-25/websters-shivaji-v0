import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";

// Lazy load the SplineScene component
const SplineScene = lazy(() =>
  import("@/components/ui/splite").then(mod => ({ default: mod.SplineScene }))
);

const TechelonsMain = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);

    // Initialize
    checkMobile();

    // Add resize event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Features data
  const features = [
    { title: "Competitions", icon: "🏆", description: "Participate in coding, analysis, and gaming competitions with exciting prizes." },
    { title: "Seminar", icon: "🎤", description: "Gain insights from industry leaders through engaging and informative seminars." },
    { title: "Networking", icon: "🌐", description: "Connect with tech enthusiasts and industry professionals." }
  ];

  const handleRegistration = () => {
    router.push("/registrationclosed");
    // window.open("/techelonsregistration", "_blank");
  };

  // Handle 3D scene load completion
  const handle3DLoad = () => {
    console.log("3D scene loaded");
    setIs3DLoaded(true);
  };

  return (
    <section className="relative py-8 md:py-8 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top badge */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 rounded-full bg-red-50 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-red-600 font-bold text-sm md:text-md">Registration Closed</span>
          </div>
        </div>

        {/* Main heading section */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-block relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 leading-none">
            Techelons'25
          </h1>
          <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/0 via-purple-600 to-indigo-600/0 blur-sm"></div>
          </div>
          <p className="mt-4 md:mt-6 text-gray-700 text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
            Shivaji College's premier technical festival, where innovation meets creativity.
          </p>
        </div>

        {/* Main content card */}
        <div className={`${isMobile ? "" : "grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch"}`}>
          {/* Right column: Festival information */}
          <div className="h-full flex flex-col space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 md:p-8 shadow-xl border border-gray-100">
              <h2 className="text-xl md:text-2xl text-center font-bold text-gray-900 mb-3">About Techelons</h2>
              <p className="text-gray-600 text-sm md:text-base">
                Techelons is the annual tech fest by Websters, the CS Society of Shivaji College, DU. It's where students showcase technical skills through competitions, hackathons, and coding challenges.
              </p>
              <hr className="my-2" />
              <p className="text-gray-600 text-sm md:text-base">
                Beyond competitions, Techelons features expert-led seminars on emerging tech and industry trends. The fest promotes networking and collaboration among students and professionals in a celebration of technological innovation.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl p-5 md:p-8 shadow-xl">
              <h2 className="text-xl md:text-2xl text-center font-bold mb-3">Explore the Future of Technology</h2>
              <p className="text-indigo-100 mb-4 text-sm md:text-base">
                Join us for two days of innovation, competition, and creativity at Shivaji College.
                Showcase your skills and connect with tech enthusiasts from across the nation.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
                <button onClick={handleRegistration} className="w-full sm:w-auto bg-white text-indigo-800 py-2 px-4 md:py-2.5 md:px-5 font-semibold rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
                  Register Now
                </button>
                <a href="#events" className="w-full sm:w-auto text-center bg-indigo-700/50 text-white py-2 px-4 md:py-2.5 md:px-5 font-semibold rounded-full border border-indigo-500/30 hover:bg-indigo-700/70 transition-all duration-300">
                  Explore Events
                </a>
              </div>
            </div>
          </div>

          {/* Left column: 3D Scene - only rendered for non-mobile devices */}
          {!isMobile && (
            <div className="h-full flex">
              <div className="relative w-full h-full bg-gradient-to-br from-black to-indigo-950 rounded-2xl overflow-hidden shadow-2xl border border-indigo-900/20">
                {/* Spotlight effect */}
                <div className="absolute top-1/4 left-1/4 w-60 h-60 md:w-96 md:h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute top-1/2 right-1/4 w-40 h-40 md:w-64 md:h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>

                {/* 3D Scene Container */}
                <div className="absolute inset-0">
                  {/* Using our enhanced loader with SplineScene */}
                  <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                    onLoad={handle3DLoad}
                  />
                </div>

                {/* Text overlay - Always visible regardless of 3D model loading state */}
                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 z-100 pointer-events-none">
                  <div className="text-white text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Tech<span className="text-blue-400">elons</span></div>
                    <div className="text-base md:text-lg lg:text-xl text-blue-200 mb-4 md:mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">April 2025</div>
                    {!is3DLoaded && (
                      <div className="text-xs md:text-sm bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent font-medium tracking-wide animate-pulse">
                        Interactive 3D Experience Loading
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom features section */}
        <div className="mt-10 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-4">{feature.icon}</div>
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 md:mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechelonsMain;