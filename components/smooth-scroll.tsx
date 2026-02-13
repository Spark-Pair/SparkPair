"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      lerp: 0.3,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;
    
    // CRITICAL: Expose to window so modal can access it
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        (window as any).lenis = null;
      }
    };
  }, []);

  return <>{children}</>;
}