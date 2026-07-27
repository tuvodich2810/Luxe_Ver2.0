import React, { useState } from 'react';
import { Eye, RotateCw, Maximize2, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function CarGallery({ images = [], carName = 'Supercar' }) {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | '360'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const galleryList =
    images && images.length > 0
      ? images
          .map((img) => {
            if (typeof img === 'string') return img;
            if (img && typeof img.url === 'string') return img.url;
            return null;
          })
          .filter(Boolean)
      : [
          'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',
        ];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % galleryList.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);

  return (
    <div className="space-y-4">
      {/* Gallery Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`font-mono-lux text-xs uppercase tracking-widest pb-2 border-b-2 transition-all ${
              activeTab === 'gallery'
                ? 'border-[#D4AF37] text-[#D4AF37] font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Bộ Ảnh HD Showcase ({galleryList.length})
          </button>
          <button
            onClick={() => setActiveTab('360')}
            className={`font-mono-lux text-xs uppercase tracking-widest pb-2 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === '360'
                ? 'border-[#D4AF37] text-[#D4AF37] font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            Trải Nghiệm Xoay 360°
          </button>
        </div>

        <button
          onClick={() => setFullscreenOpen(true)}
          className="flex items-center gap-1.5 text-xs font-mono-lux text-slate-400 hover:text-[#D4AF37] transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Toàn màn hình</span>
        </button>
      </div>

      {/* Main Display Container */}
      {activeTab === 'gallery' ? (
        <div className="relative w-full aspect-[16/10] bg-[#0A0A0E] rounded-lg overflow-hidden border border-white/10 group">
          <img
            src={galleryList[currentIndex]}
            alt={`${carName} photo ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
          />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#D4AF37] hover:text-[#070709] transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-[#D4AF37] hover:text-[#070709] transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image Counter Badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded bg-black/80 text-xs font-mono-lux text-[#D4AF37] border border-white/10">
            {currentIndex + 1} / {galleryList.length}
          </div>
        </div>
      ) : (
        /* 360 Degree View Simulator */
        <div className="relative w-full aspect-[16/10] bg-[#0A0A0E] rounded-lg overflow-hidden border border-[#D4AF37]/30 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={galleryList[Math.floor((rotationAngle / 360) * galleryList.length) % galleryList.length]}
              alt="360 view"
              className="max-h-full object-contain filter drop-shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
              style={{ transform: `rotateY(${rotationAngle / 10}deg)` }}
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 max-w-md bg-black/80 backdrop-blur border border-white/20 p-4 rounded-md space-y-2">
            <div className="flex justify-between text-xs font-mono-lux text-slate-300">
              <span>Xoay góc nhìn 360°</span>
              <span className="text-[#D4AF37]">{rotationAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Thumbnails Carousel */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {galleryList.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setActiveTab('gallery');
            }}
            className={`relative aspect-[16/10] rounded overflow-hidden border-2 transition-all ${
              currentIndex === idx && activeTab === 'gallery'
                ? 'border-[#D4AF37] scale-105 shadow-lg shadow-[#D4AF37]/20'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-6 right-6 p-3 text-slate-400 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={galleryList[currentIndex]}
            alt="Fullscreen view"
            className="max-w-full max-h-[90vh] object-contain rounded"
          />
        </div>
      )}
    </div>
  );
}
