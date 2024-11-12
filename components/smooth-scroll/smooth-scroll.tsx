"use client";

import React, { useEffect, useRef } from "react";

// Types
import type { SmoothScrollProps } from "./types";

// Imports
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LenisRef, ReactLenis } from "lenis/react";

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Ensure Lenis only initializes on the client
    if (typeof window === "undefined" || !lenisRef.current?.lenis) return;

    const lenis = lenisRef.current.lenis;

    // Attach scroll events and sync with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.5 }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
