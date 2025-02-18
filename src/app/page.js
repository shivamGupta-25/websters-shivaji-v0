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
import { useState, useEffect } from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Banner from "./_components/Banner";
import About from "./_components/About";
import Workshop from "./_components/Workshop";
import PastEvent from "./_components/PastEvent";
import Council from "./_components/Council";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust timing if needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black text-white text-center transition-opacity duration-1000 opacity-100 animate-fadeInOut">
          <h1 className="text-4xl md:text-6xl font-bold tracking-wide animate-pulse">
            WEBSTERS
          </h1>
          <p className="text-lg md:text-2xl mt-2 font-light">
            The Computer Science Society of Shivaji College
          </p>
          <p className="text-md md:text-xl mt-2 text-gray-300">
            University of Delhi
          </p>
        </div>
      ) : (
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
      )}
    </>
  );
}

