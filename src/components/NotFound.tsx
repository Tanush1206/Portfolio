import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-section-gap px-margin-safe">
      {/* Background Atmospheric Element */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        {/* Content Section */}
        <div className="md:col-span-7 flex flex-col gap-8 order-2 md:order-1">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">SYSTEM_STATUS: ERROR_DETECTED</span>
          </div>
          
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary glitch-text uppercase">
            ERROR_SYSTEM_FAILURE
          </h1>
          
          <div className="glass-panel p-8 bg-surface-container-lowest/50 border-l-4 border-l-primary flex flex-col gap-4">
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              &gt; The requested module could not be located in the current directory. <br/>
              &gt; Data packet lost in transit through hyper-thread protocols.
            </p>
            <div className="flex items-center gap-2 font-code-snippet text-code-snippet text-tertiary">
              <span className="material-symbols-outlined">terminal</span>
              <span>ERR_CODE: 0x00000404_NULL_REF</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Link className="group relative inline-flex items-center justify-center px-10 py-5 font-code-snippet text-code-snippet bg-transparent border border-primary text-primary transition-all duration-300 hover:bg-primary hover:text-black active:scale-95 glow-indigo" to="/">
              <span className="mr-2">_</span> RETURNING_TO_MAIN_FRAME
            </Link>
          </div>
        </div>
        
        {/* Visual Section */}
        <div className="md:col-span-5 order-1 md:order-2 flex justify-center items-center">
          <div className="relative w-full aspect-square max-w-[500px]">
            {/* Wireframe Cube Glitch Visual */}
            <div className="absolute inset-0 border border-primary/20 rotate-12 flex items-center justify-center overflow-hidden">
              <img alt="3D Wireframe Glitch" className="w-full h-full object-cover opacity-60 mix-blend-screen grayscale contrast-150" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHZEuz-m63nVU8HKv0eYXjoJ2-cDR40thwi2j_ptYSCHZrHw0w8MdPauXuPHyqveFxADGBc6bjnNrFdMIAkLfaVBttUHbiyIwgT40lXW2XZScja7XPVobYOG1XVXukrXcUwsI73GPDdNSNhVpdgx7v2-WWJA7qC4ziGWj0JiYTzrwtJ9jYYo8KrCfpiEftIQS3mPa3nMMqVSusCfcbc0NmCymAKmL8uXyj6xbQxV2HeBF3zd3Xhd0qGPjxpVEgAcTXiJZo4UKKv0K0"/>
            </div>
            {/* Status Indicators in corners */}
            <div className="absolute top-0 left-0 p-4 font-code-snippet text-[10px] text-primary/40 uppercase">Sector_7G</div>
            <div className="absolute bottom-0 right-0 p-4 font-code-snippet text-[10px] text-primary/40 uppercase">Buffer_Overflow</div>
            {/* Floating Mascot Fragment */}
            <div className="absolute -top-10 -right-10 w-32 h-32 glass-panel p-2 flex items-center justify-center rounded-none rotate-6">
              <span className="material-symbols-outlined text-[64px] text-tertiary opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>extension_off</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terminal Output Log */}
      <div className="w-full max-w-container-max mx-auto mt-20 border-t border-white/5 pt-12 overflow-hidden">
        <div className="font-code-snippet text-[12px] text-on-surface-variant/40 flex flex-col gap-1">
          <div>[14:23:01] INITIALIZING SEARCH FOR MODULE 'PAGE_IDENTITY'...</div>
          <div>[14:23:01] CHECKING CACHE: MISS</div>
          <div>[14:23:02] CHECKING CLUSTER_B: MISS</div>
          <div>[14:23:03] CHECKING ARCHIVE_V3: FAILED (PERMISSION_DENIED)</div>
          <div className="text-primary/60">[14:23:04] EXCEPTION RAISED: ROUTE_NOT_FOUND_EXCEPTION</div>
        </div>
      </div>

      {/* Global Scanline Overlay */}
      <div className="scanline fixed inset-0 z-[100] opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default NotFound;
