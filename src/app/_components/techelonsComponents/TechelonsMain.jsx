import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation"

// Lazy load the SplineScene component
const SplineScene = lazy(() =>
    import("@/components/ui/splite").then(mod => ({ default: mod.SplineScene }))
);

const TechelonsMain = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Combined useEffect for both event listeners
    useEffect(() => {
        // Check mobile on mount and resize
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);

        // Scroll handler
        const handleScroll = () => setScrolled(window.scrollY > 50);

        // Initialize
        checkMobile();

        // Add event listeners
        window.addEventListener('resize', checkMobile);
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Features data
    const features = [
        { title: "Competitions", icon: "🏆", description: "Participate in coding, design, and robotics competitions with exciting prizes." },
        { title: "Workshops", icon: "💡", description: "Learn cutting-edge technologies through hands-on workshops led by industry experts." },
        { title: "Networking", icon: "🌐", description: "Connect with tech enthusiasts, professionals, and potential employers." }
    ];

    const router = useRouter()
    const handleExit = () => {
        router.push("/registrationclosed")
        // window.open("/registrationclosed", "_self");
        // window.open("/workshopregistration", "_blank");
  };

    return (
        <section className="relative py-8 md:py-8 overflow-hidden">
            {/* Background elements */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl"></div>
                <div className="absolute bottom-20 -left-40 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Top badge */}
                <div className="flex justify-center mb-6 md:mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 rounded-full bg-green-50 border border-green-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-green-600 font-bold text-sm md:text-md">Registration Open</span>
                    </div>
                </div>

                {/* Main heading section */}
                <div className="text-center mb-8 md:mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 leading-none">
                        Techelons'25
                    </h1>
                    <p className="mt-4 md:mt-6 text-gray-700 text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
                        Shivaji College's leading technical festival, where creativity and innovation converge.
                    </p>
                </div>

                {/* Main content card */}
                <div className={`${isMobile ? "" : "grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch"}`}>
                    {/* Right column: Festival information */}
                    <div className="h-full flex flex-col space-y-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 md:p-8 shadow-xl border border-gray-100">
                            <h2 className="text-xl md:text-2xl text-center font-bold text-gray-900 mb-3">About Techelons</h2>
                            <p className="text-gray-600 text-sm md:text-base">
                                Techelons is the annual technical festival organized by Webster's, the Computer Science Society of Shivaji
                                College, University of Delhi. It has grown into a national platform for students to showcase their technical
                                skills and creativity through various competitions, workshops, and events.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl p-5 md:p-8 shadow-xl">
                            <h2 className="text-xl md:text-2xl text-center font-bold mb-3">Explore the Future of Technology</h2>
                            <p className="text-indigo-100 mb-4 text-sm md:text-base">
                                Join us for three days of innovation, competition, and creativity at Shivaji College.
                                Showcase your skills and connect with tech enthusiasts from across the nation.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
                                <button onClick={handleExit} className="w-full sm:w-auto bg-white text-indigo-800 py-2 px-4 md:py-2.5 md:px-5 font-semibold rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
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
                                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading 3D scene...</div>}>
                                        <SplineScene
                                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                            className="w-full h-full"
                                        />
                                    </Suspense>
                                </div>

                                {/* Text overlay */}
                                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 z-20 pointer-events-none">
                                    <div className="text-white text-center">
                                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Tech<span className="text-blue-400">elons</span></div>
                                        <div className="text-base md:text-lg lg:text-xl text-blue-200 mb-4 md:mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">February 2025</div>
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