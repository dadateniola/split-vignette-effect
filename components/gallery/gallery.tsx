"use client";

import Image from "next/image";
import React, { useRef, useEffect } from "react";

// Types
import type { GalleryProps } from "./types";

// Imports
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  ({ avatar, banner }, ref) => {
    const name = avatar.split(".").shift() || "empty";

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const container = containerRef.current;

      gsap.to(container, {
        scale: 1.2,
        scrollTrigger: {
          trigger: container,
          start: "top 50%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    }, []);

    return (
      <div
        className="w-full h-[120vh] overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        <div ref={containerRef} className="w-full h-full">
          <Image
            src={`/banners/${banner}`}
            alt={`${name}-banner`}
            fill
            className="object-cover"
          />
        </div>
        <div
          ref={ref}
          style={{ aspectRatio: "3/4", width: "clamp(200px, 20vw, 300px)" }}
          className="fixed top-0 rounded-3xl overflow-hidden"
        >
          <Image
            src={`/avatars/${avatar}`}
            alt={`${name}-avatar`}
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>
      </div>
    );
  }
);

Gallery.displayName = "Gallery";

export default Gallery;
