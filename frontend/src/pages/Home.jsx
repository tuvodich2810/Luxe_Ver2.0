import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Chatbot from '@/components/common/Chatbot';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCars from '@/components/home/FeaturedCars';
import BrandsSection from '@/components/home/BrandsSection';
import PrivateInquiryCallout from '@/components/home/PrivateInquiryCallout';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero Showcase: Tích hợp trực tiếp Bộ Lọc Tìm Kiếm & 4 Thumbnails không bị đè lớp */}
        <HeroSection />

        {/* 2. Bộ Sưu Tập Siêu Xe 4K: Dạng Slider trượt ngang toàn cảnh theo lựa chọn */}
        <FeaturedCars />

        {/* 3. Phân Hệ Thương Hiệu Độc Bản Chính Hãng */}
        <BrandsSection />

        {/* 4. Banner VIP Concierge & 2 Flagship Showrooms Tinh Gọn */}
        <PrivateInquiryCallout />
      </main>

      {/* Cụm Phím Nổi Trợ Năng Xếp Dọc (Zalo VIP, FAQ Modal, AI Chatbot) */}
      <Chatbot />
      <Footer />
    </div>
  );
}