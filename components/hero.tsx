"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Play } from "lucide-react"
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion"

export function Hero() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  function Counter({ value }: { value: number }) {
    const { count } = useSpring({ count: 0 }); // Agar Framer use kar rahe hain toh simple display bhi chalega
    // Simple Framer Motion implementation:
    return (
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onUpdate={(latest) => Math.round(latest)}
      >
        {/* Agar aap Framer Motion useSpring use nahi karna chahte, toh niche wala code use karein: */}
        <motion.span
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </motion.span>
    );
  }

  // Loading Screen Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setLoading(false), 600)
          return 100
        }
        return prev + 1
      })
    }, 15) // Thora fast progress
    return () => clearInterval(timer)
  }, [])

  // Aesthetic Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08, 
        delayChildren: 0.4,
      },
    },
  }

  // Smooth slide up with "Spring" physics
  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1] // Custom "Expo" easing
      } 
    },
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            exit={{ 
              y: "-100%", 
              transition: { duration: 1.1, ease: [0.85, 0, 0.15, 1] } 
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F9F9F9] text-[#121212] overflow-hidden"
          >
            {/* 1. ARCHITECTURAL GRID (Light Version) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="absolute inset-0" style={{ 
                backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
                backgroundSize: '4vw 4vw' 
              }} />
            </div>

            {/* 2. AMBIENT SOFT LIGHT (Instead of Glow) */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.6, 0.4] 
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute w-[60vw] h-[60vw] bg-accent/5 rounded-full blur-[100px] pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-center">
              
              {/* TOP DATA POINTS */}
              <div className="absolute -top-32 flex gap-16 opacity-40">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] uppercase tracking-[0.4em] mb-1 font-bold">Latency</span>
                  <span className="text-[10px] font-mono">0.004MS</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] uppercase tracking-[0.4em] mb-1 font-bold">Node</span>
                  <span className="text-[10px] font-mono">ASSET_LOAD</span>
                </div>
              </div>

              {/* MAIN KINETIC COUNTER */}
              <div className="relative">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="relative flex items-center"
                >
                  {/* Ghost Number (Light Mode) */}
                  <span className="absolute text-[20vw] font-bold text-black/[0.02] tracking-tighter italic select-none -translate-x-1/4">
                    {progress}
                  </span>

                  <div className="flex items-baseline relative z-10">
                    <span className="text-[14vw] font-serif italic font-light leading-none tabular-nums tracking-tighter">
                      {progress}
                    </span>
                    <span className="text-[2vw] font-sans font-black text-accent mb-4 ml-2">
                      %
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* THE PROGRESS "SCANLINE" */}
              <div className="mt-12 w-[25vw] h-[1px] bg-black/5 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-black shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                  initial={{ left: "-100%" }}
                  animate={{ left: `${progress - 100}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              {/* DYNAMIC STATUS */}
              <div className="mt-16 flex flex-col items-center gap-6">
                <div className="h-4 overflow-hidden relative w-48 text-center">
                  <AnimatePresence mode="popLayout">
                    <motion.p 
                      key={progress}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/40"
                    >
                      {progress < 40 ? "Assembling Vision" : progress < 80 ? "Rendering Context" : "Studio Ready"}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Light Minimal Spinner */}
                <div className="w-6 h-6 border-[1px] border-black/5 rounded-full flex items-center justify-center p-1">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full border-t-[1px] border-accent rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* CORNER METADATA */}
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end opacity-20">
              <span className="text-[9px] font-mono tracking-widest uppercase italic">Design Engine v.2.6</span>
              <span className="text-[9px] font-mono tracking-widest uppercase">Global / {new Date().getFullYear()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden selection:bg-accent/20">
        {/* Background Elements (Exactly as yours) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay">
          <svg className="h-full w-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float opacity-70" />
        <div
          className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-float opacity-60"
          style={{ animationDelay: "2s", animationDirection: "reverse" }}
        />

        {/* Content Wrapper */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={loading ? "hidden" : "visible"}
          className="relative z-10 max-w-5xl mx-auto w-full pt-20 lg:pt-32"
        >
          <div className="flex flex-col items-center text-center space-y-10">
            
            {/* Badge Reveal */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(7px)", y: -20, skewX: 60, scale: 0.9 }}
              animate={!loading ? { opacity: 1, filter: "blur(0px)", y: 0, skewX: 0, scale: 1 } : {}}
              transition={{ 
                duration: 1.6, 
                delay: 0.8, 
                ease: [0.22, 1.1, 0.28, 1.2] 
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-background/50 backdrop-blur-sm shadow-sm hover:border-accent/50 transition-colors duration-300 cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-xs font-medium text-foreground/80 tracking-wide uppercase">Available for new projects</span>
            </motion.div>

            {/* Headline with Mask Effect (Keeping your original UI/Tags) */}
            <motion.div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground leading-[1.1] sm:leading-[0.95] tracking-tight text-balance">
                
                {/* Line 1: Digital Solutions - Atmospheric Reveal */}
                <motion.span
                  initial={{ opacity: 0, filter: "blur(20px)", y: 40, scale: 1.1 }}
                  animate={!loading ? { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 } : {}}
                  transition={{ 
                    duration: 1.8, 
                    delay: 0.6, 
                    ease: [0.19, 1, 0.22, 1] // Extreme exponential ease
                  }}
                  className="inline-block"
                >
                  Digital solutions
                </motion.span>

                <br />

                {/* Line 2: That Spark Growth - Elegant Perspective Reveal */}
                <motion.div
                  initial={{ opacity: 0, filter: "blur(15px)", y: 30, skewX: -20, scale: 0.9 }}
                  animate={!loading ? { opacity: 1, filter: "blur(0px)", y: 0, skewX: 0, scale: 1 } : {}}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.7, 
                    ease: [0.19, 1, 0.22, 1] 
                  }}
                  className="flex flex-wrap justify-center items-baseline origin-center"
                >
                  <span className="font-serif italic font-light text-muted-foreground tracking-normal mr-3 sm:mr-4">
                    that spark
                  </span>
                  
                  <span className="relative inline-block text-foreground">
                    growth
                    <svg 
                      className="absolute -bottom-2 left-0 w-full h-3 sm:h-5" 
                      viewBox="0 0 200 12" 
                      fill="none"
                      style={{ overflow: 'visible' }}
                    >
                      <motion.path
                        d="M2 10C50 4 150 4 198 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-accent"
                        initial={{ pathLength: 0, opacity: 0, pathOffset: 1 }}
                        animate={!loading ? { pathLength: 1, opacity: 1, pathOffset: 0 } : {}}
                        transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
                      />
                    </svg>
                  </span>
                </motion.div>
              </h1>
            </motion.div>

            {/* Subheadline Fade */}
            <motion.p 
              className="text-lg text-muted-foreground/90 max-w-xl leading-relaxed text-balance font-light flex flex-wrap justify-center overflow-hidden"
            >
              {"We partner with ambitious brands to create exceptional digital experiences through strategy, design, and technology."
                .split(" ")
                .map((word, i) => (
                  <span key={i} className="inline-block mr-[0.3em]">
                    <motion.span
                      initial={{ 
                        opacity: 0, 
                        y: 15, 
                        rotateX: 25,
                        skewX: 10
                      }}
                      animate={!loading ? { 
                        opacity: 1, 
                        y: 0, 
                        rotateX: 0,
                        skewX: 0
                      } : {}}
                      transition={{ 
                        duration: 1, 
                        delay: 1 + (i * 0.02), // Signature stagger
                        ease: [0.215, 0.61, 0.355, 1] // Awwwards standard cubic-bezier
                      }}
                      className="inline-block origin-bottom"
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
            </motion.p>
            
            {/* Buttons - Elastic hover added */}
            <motion.div 
              initial={{ opacity: 0, y: -30, skewX: -50, scale: 0.4 }}
              animate={!loading ? { opacity: 1, y: 0, skewX: 0, scale: 1 } : {}}
              transition={{ 
                duration: 1, 
                delay: 0.6, 
                ease: [0.19, 1, 0.22, 1] 
              }}
              className="flex flex-col sm:flex-row gap-4 pt-2 w-full justify-center"
            >
              {/* Primary CTA */}
              <Button
                size="lg"
                asChild
                className="h-14 px-8 rounded-full text-base font-medium bg-accent text-accent-foreground shadow-md shadow-accent/15 hover:shadow-lg hover:shadow-accent/25 transition-all duration-500 group cursor-pointer overflow-hidden relative"
              >
                <motion.a 
                  href="#contact"
                >
                  {/* Subtle dark overlay sweep */}
                  <span className="absolute inset-0 bg-black/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  
                  {/* Text with slide effect */}
                  <span className="relative z-10 flex items-center h-5 overflow-hidden">
                    <span className="flex items-center transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                      Start a project
                      
                      {/* Arrow with diagonal swap */}
                      <span className="relative w-4 h-4 ml-2 overflow-hidden">
                        <ArrowUpRight className="w-4 h-4 absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-5 group-hover:-translate-y-5" />
                        <ArrowUpRight className="w-4 h-4 absolute inset-0 -translate-x-5 translate-y-5 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                      </span>
                    </span>
                  </span>
                </motion.a>
              </Button>

              {/* Secondary CTA */}
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 rounded-full text-base bg-background/50 backdrop-blur-sm border-border/60 hover:border-foreground/20 transition-all duration-500 cursor-pointer overflow-hidden relative group"
              >
                <motion.a 
                  href="#showreel"
                  whileHover={{ y: -2 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Fill sweep from left */}
                  <span className="absolute inset-0 bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center group-hover:text-background transition-colors duration-300 delay-100">
                    {/* Play icon with pulse */}
                    <span className="relative mr-2">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="absolute inset-0 animate-ping opacity-30">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </span>
                    </span>
                    Watch showreel
                  </span>
                </motion.a>
              </Button>
            </motion.div>

            {/* Stats - Sequential Reveal with Number Counter & Masked Text Reveal */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 mt-8 border-t border-border/60 w-full max-w-4xl relative">
              {[
                { value: 150, suffix: "+", label: "Projects delivered" },
                { value: 8, suffix: "yrs", label: "Experience" },
                { value: 98, suffix: "%", label: "Client satisfaction" },
                { value: 12, suffix: "", label: "Design Awards" },
              ].map((stat, index) => {
                const springValue = useSpring(0, { stiffness: 40, damping: 20 });
                const displayValue = useTransform(springValue, (latest) => Math.round(latest));

                useEffect(() => {
                  if (!loading) {
                    const timer = setTimeout(() => {
                      springValue.set(stat.value);
                    }, 1000 + (index * 150)); // Syncing with entrance
                    return () => clearTimeout(timer);
                  }
                }, [loading, stat.value, springValue, index]);

                return (
                  <div key={stat.label} className="flex flex-col items-center justify-center">
                    {/* Number Reveal Mask */}
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={!loading ? { y: 0, opacity: 1 } : {}}
                        transition={{ 
                          duration: 1, 
                          delay: 0.8 + (index * 0.1), 
                          ease: [0.16, 1, 0.3, 1] 
                        }}
                        className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight tabular-nums"
                      >
                        <motion.span>{displayValue}</motion.span>
                        {stat.suffix}
                      </motion.div>
                    </div>

                    {/* Label Reveal Mask */}
                    <div className="overflow-hidden">
                      <motion.p
                        initial={{ y: "100%", opacity: 0 }}
                        animate={!loading ? { y: 0, opacity: 1 } : {}}
                        transition={{ 
                          duration: 1, 
                          delay: 0.9 + (index * 0.1), 
                          ease: [0.16, 1, 0.3, 1] 
                        }}
                        className="text-sm font-medium text-muted-foreground mt-1"
                      >
                        {stat.label}
                      </motion.p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* Improved Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={loading ? { opacity: 0 } : { opacity: 0.5, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-muted-foreground/20 to-muted-foreground overflow-hidden relative">
            <motion.div 
              animate={{ top: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 w-full h-1/2 bg-accent" 
            />
          </div>
        </motion.div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, 20px); }
          }
          .animate-float { animation: float 10s ease-in-out infinite; }
        `}</style>
      </section>
    </>
  )
}