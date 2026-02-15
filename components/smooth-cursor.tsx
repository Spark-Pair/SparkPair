"use client";

import { useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

interface SmoothCursorProps {
  children?: React.ReactNode;
  text?: string;
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SmoothCursor({ 
  children, 
  text = "VIEW", 
  icon = <ArrowUpRight className="w-4 h-4" />,
  className = "",
}: SmoothCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  const animate = () => {
    const dx = targetPos.current.x - currentPos.current.x;
    const dy = targetPos.current.y - currentPos.current.y;
    
    currentPos.current.x += dx * 0.15;
    currentPos.current.y += dy * 0.15;

    if (cursorRef.current) {
      cursorRef.current.style.left = `${currentPos.current.x}px`;
      cursorRef.current.style.top = `${currentPos.current.y}px`;
    }

    if (isHovering.current || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animationRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    isHovering.current = true;

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    isHovering.current = false;
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative cursor-none group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <div 
        ref={cursorRef}
        className={`absolute py-2.5 ps-6 pe-5 border bg-white rounded-full flex items-center justify-center gap-1 scale-0 group-hover:scale-100 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 shadow-lg transition-transform duration-200`}
      >
        <span className="font-semibold text-nowrap uppercase text-black flex items-center gap-1">
          {text} {icon}
        </span>
      </div>
    </div>
  );
}