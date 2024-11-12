"use client";

import React, { useCallback, useEffect, useRef } from "react";

// Imports
import gsap from "gsap";
import { banner_avatar_data } from "./data";
import Loader from "@/components/loader/loader";
import Gallery from "@/components/gallery/gallery";

// Helper function to check for touch support in client environment
const getIsTouchDevice = () => {
  return (
    typeof window !== "undefined" &&
    (navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches)
  );
};

const Home = () => {
  // Refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const vignettesRef = useRef<(HTMLDivElement | null)[]>([]);
  const vignetteDimensionsRef = useRef({ width: 0, height: 0 });

  const setVignettesInCenter = useCallback(() => {
    const vignettes = vignettesRef.current;

    if (vignettes.length) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const { width, height } = vignetteDimensionsRef.current;

      const x = (viewportWidth - width) / 2;
      const y = (viewportHeight - height) / 2;

      gsap.set(vignettes, { x, y });
    }
  }, []);

  // Update vignette dimensions
  const updateVignetteDimensions = useCallback(() => {
    const rect = vignettesRef.current[0]?.getBoundingClientRect();
    if (rect) {
      vignetteDimensionsRef.current = {
        width: rect.width,
        height: rect.height,
      };
    }

    if (getIsTouchDevice()) setVignettesInCenter();
  }, [setVignettesInCenter]);

  // Handle mouse move for vignette animations
  const onMove = useCallback(
    (e: MouseEvent) => {
      const vignettes = vignettesRef.current;
      if (vignettes.length) {
        const { clientX, clientY } = e;
        const { width, height } = vignetteDimensionsRef.current;

        // Calculate the position so that the vignette is centered around the mouse
        let x = clientX - width / 2;
        let y = clientY - height / 2;

        // Get the viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Limit x position to stay within the viewport
        if (x < 0) x = 0; // Prevent vignette from going left
        if (x + width > viewportWidth) x = viewportWidth - width; // Prevent vignette from going right

        // Limit y position to stay within the viewport
        if (y < 0) y = 0; // Prevent vignette from going above
        if (y + height > viewportHeight) y = viewportHeight - height; // Prevent vignette from going below

        // Apply the calculated position with GSAP
        gsap.to(vignettes, { x, y, ease: "expo.out" });
      }
    },
    [] // Memoized to prevent re-creations
  );

  const showContent = useCallback(() => {
    const overlay = overlayRef.current;
    if (overlay) {
      gsap.to(overlay, { duration: 1, autoAlpha: 0, delay: 1 });
    }
  }, []);

  useEffect(() => {
    // Initialize dimensions on mount
    updateVignetteDimensions();

    const isTouchDevice = getIsTouchDevice();

    if (isTouchDevice) {
      setVignettesInCenter();
    } else {
      window.addEventListener("mousemove", onMove);
    }

    window.addEventListener("resize", updateVignetteDimensions);

    showContent();

    return () => {
      // Clean up event listeners on unmount
      window.removeEventListener("resize", updateVignetteDimensions);
      if (!isTouchDevice) window.removeEventListener("mousemove", onMove);
    };
  }, [onMove, showContent, setVignettesInCenter, updateVignetteDimensions]);

  return (
    <main className="relative">
      <div
        ref={overlayRef}
        className="fixed z-10 inset-0 w-screen h-screen bg-white flex items-center justify-center"
      >
        <Loader />
      </div>
      {Object.entries(banner_avatar_data).map(([name, data], idx) => (
        <Gallery
          key={`${name}-${idx}`}
          ref={(el) => {
            vignettesRef.current[idx] = el;
          }}
          {...data}
        />
      ))}
    </main>
  );
};

export default Home;
