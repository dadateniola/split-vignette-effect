"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";

// Imports
import gsap from "gsap";
import { banner_avatar_data } from "./data";
import Gallery from "@/components/gallery/gallery";

const Home = () => {
  // Refs
  const vignettesRef = useRef<(HTMLDivElement | null)[]>([]);
  const vignetteDimensionsRef = useRef({ width: 0, height: 0 });

  // Memos
  const { isTouchDevice } = useMemo(() => {
    const isTouchDevice =
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    return { isTouchDevice };
  }, []);

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

    if (isTouchDevice) setVignettesInCenter();
  }, [isTouchDevice, setVignettesInCenter]);

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

  useEffect(() => {
    // Initialize dimensions on mount
    updateVignetteDimensions();

    if (isTouchDevice) {
      setVignettesInCenter();
    } else {
      window.addEventListener("mousemove", onMove);
    }

    window.addEventListener("resize", updateVignetteDimensions);

    return () => {
      // Clean up event listeners on unmount
      window.removeEventListener("resize", updateVignetteDimensions);
      if (!isTouchDevice) window.removeEventListener("mousemove", onMove);
    };
  }, [onMove, isTouchDevice, setVignettesInCenter, updateVignetteDimensions]);

  return (
    <main>
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
