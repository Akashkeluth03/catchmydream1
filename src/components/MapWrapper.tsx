"use client";

import dynamic from "next/dynamic";
import React from "react";

// Use next/dynamic to dynamically import the Map component 
// with SSR disabled to avoid 'window is not defined' errors
const StudyMap = dynamic(() => import("./StudyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] sm:h-[600px] rounded-2xl bg-zinc-100 animate-pulse flex items-center justify-center">
      <p className="text-zinc-500 font-medium">Loading Map...</p>
    </div>
  ),
});

export default function MapWrapper() {
  return <StudyMap />;
}
