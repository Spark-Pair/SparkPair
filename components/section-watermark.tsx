"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionWatermarkProps {
  text: string;
}

export function SectionWatermark({ text }: SectionWatermarkProps) {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Ye text ko scroll ke saath left move karega
  const x = useTransform(scrollYProgress, [0, 1], [100, -200]);

  return (
    <div 
      ref={ref}
      className="absolute top-20 right-0 opacity-[0.05] select-none pointer-events-none whitespace-nowrap z-0"
    >
      <motion.h2
        style={{ x }}
        className="text-[20vw] font-black leading-none uppercase tracking-tighter"
      >
        {text}
      </motion.h2>
    </div>
  );
}