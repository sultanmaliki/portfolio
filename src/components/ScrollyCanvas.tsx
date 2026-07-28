"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Overlay from "./Overlay";

const FRAME_COUNT = 150;

// Helper to pad the frame number like 000, 001, etc.
const currentFrame = (index: number) =>
  `/sequence/frame_${index.toString().padStart(3, "0")}_delay-0.067s.webp`;

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  const imagesLoaded = loadedCount === FRAME_COUNT;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to a frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let currentLoaded = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        currentLoaded++;
        setLoadedCount(currentLoaded);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId: number;

    const render = (index: number) => {
      const img = images[index];
      if (!img) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Object-fit: cover logic
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    const updateFrame = () => {
      const currentIdx = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(frameIndex.get()))
      );
      render(currentIdx);
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    updateFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imagesLoaded, frameIndex, images]);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#121212]">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#121212]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        {/* Loading State Overlay */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] z-50">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-white text-sm font-light tracking-[0.3em] mb-6 uppercase"
            >
              Loading Experience
            </motion.div>
            <div className="text-[#6EA8FF] text-5xl font-extralight tracking-tight">
              {loadedCount} <span className="text-[#F5F5F5]/30 text-3xl">/ {FRAME_COUNT}</span>
            </div>
          </div>
        )}
        <Overlay progress={scrollYProgress} />
      </div>
    </div>
  );
}
