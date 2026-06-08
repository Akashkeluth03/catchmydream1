import React from "react";
import MapWrapper from "@/components/MapWrapper";

export default function StudyDestinationsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#212121] tracking-tight">
            Explore Study Destinations
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto">
            Discover top-ranked universities, available scholarships, and vibrant student cities across the globe. Click on any marker to view details.
          </p>
        </div>

        {/* Map Section */}
        <div className="relative w-full rounded-2xl bg-white shadow-xl p-2 md:p-4 border border-zinc-100">
          <MapWrapper />
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="font-bold text-[#212121] text-lg">Global Reach</h3>
            <p className="text-zinc-600 mt-2">Explore institutions from North America to Europe and the Asia-Pacific region.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="font-bold text-[#212121] text-lg">Top Universities</h3>
            <p className="text-zinc-600 mt-2">Find programs tailored to your career goals in the most student-friendly cities.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-bold text-[#212121] text-lg">Scholarships</h3>
            <p className="text-zinc-600 mt-2">Unlock fully funded and merit-based scholarship opportunities to support your journey.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
