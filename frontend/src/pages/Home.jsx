import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import HeroSection from '@/components/home/HeroSection';
import BrandsSection from '@/components/home/BrandsSection';
import FeaturedCars from '@/components/home/FeaturedCars';
import ServicesSection from '@/components/home/ServicesSection';
import PrivateInquiryCallout from '@/components/home/PrivateInquiryCallout';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <BrandsSection />
        <FeaturedCars />
        <ServicesSection />
        <PrivateInquiryCallout />
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}