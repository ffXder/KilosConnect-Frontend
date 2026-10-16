import React from "react";
import KilosGymImg from "../assets/images/image-5.png";
import KILOSLogo from "../assets/images/kilos-mark.png";

export const LoadingPage: React.FC = () => {
  return (
    /* flex-col for mobile (stacked), md:flex-row for desktop (side-by-side) */
    <main className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-white">
      
      {/* Left panel: 100% width on mobile, 35% on desktop */}
      <section
        className="w-full md:w-[35%] h-full flex items-center justify-center 
                   bg-[linear-gradient(180deg,#002B38_21%,#111B30_100%)]"
      >
        <img
          /* Scaled down slightly for mobile (w-[180px]) vs desktop (md:w-[238px]) */
          className="w-[180px] md:w-[238px] h-auto object-contain animate-pulse" 
          alt="KILOS Loading"
          src={KILOSLogo}
        />
      </section>

      {/* Right panel: Hidden on mobile (hidden), fills remaining space on desktop (md:flex-1) */}
      <aside className="hidden md:block md:flex-1 h-full">
        <img 
          className="w-full h-full object-cover" 
          alt="Gym interior" 
          src={KilosGymImg} 
        />
      </aside>
    </main>
  );
};