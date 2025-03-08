"use client";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import TechelonsMain from "../_components/TechelonsComponents/TechelonsMain";
import ComingSoon from "../_components/TechelonsComponents/TechelonsEvent";

export default function Techelons() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <TechelonsMain />
        <hr className="h-px bg-gray-200 border-0 w-4/5 mx-auto shadow-sm" />
        <ComingSoon />
      </div>
      <Footer />
    </>

  );
}