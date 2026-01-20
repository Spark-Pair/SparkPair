"use client"

import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"

// Scramble text hook (previous reveal effect)
function useTextScramble(text: string, trigger: boolean) {
  const [output, setOutput] = useState("")
  const chars = "!<>-_\\/[]{}—=+*^?#"
  
  useEffect(() => {
    if (!trigger) {
      setOutput("")
      return
    }
    
    let frame = 0
    let frameRequest: number
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = []
    
    for (let i = 0; i < text.length; i++) {
      queue.push({
        from: "",
        to: text[i],
        start: Math.floor(Math.random() * 15),
        end: Math.floor(Math.random() * 15) + 15,
      })
    }
    
    const update = () => {
      let complete = 0
      let outputStr = ""
      
      for (let i = 0; i < queue.length; i++) {
        const { from, to, start, end } = queue[i]
        let { char } = queue[i]
        
        if (frame >= end) {
          complete++
          outputStr += to
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)]
            queue[i].char = char
          }
          outputStr += char
        } else {
          outputStr += from
        }
      }
      
      setOutput(outputStr)
      
      if (complete < queue.length) {
        frame++
        frameRequest = requestAnimationFrame(update)
      }
    }
    
    update()
    return () => cancelAnimationFrame(frameRequest)
  }, [text, trigger])
  
  return output
}

// Subtle magnetic letter
function MagneticLetter({ 
  children, 
  index 
}: { 
  children: string
  index: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [isNear, setIsNear] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 400 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
      
      const maxDistance = 100
      
      if (distance < maxDistance) {
        const power = (maxDistance - distance) / maxDistance
        x.set(distanceX * power * 0.12)
        y.set(distanceY * power * 0.12)
        setIsNear(true)
      } else {
        x.set(0)
        y.set(0)
        setIsNear(false)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [x, y])

  return (
    <motion.span
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      className={`
        inline-block cursor-default will-change-transform
        transition-colors duration-300
        ${isNear ? 'text-accent' : ''}
      `}
    >
      {children === " " ? "\u00A0" : children}
    </motion.span>
  )
}

// Animated Spark SVG
function SparkSVG({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
      />
      <motion.circle
        cx="12"
        cy="10"
        r="2"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ delay: delay + 0.5, duration: 0.4 }}
      />
    </motion.svg>
  )
}

// Interactive floating spark that follows cursor slightly
function FloatingSpark({ initialX, initialY }: { initialX: number; initialY: number }) {
  const x = useMotionValue(initialX)
  const y = useMotionValue(initialY)
  const springX = useSpring(x, { damping: 30, stiffness: 100 })
  const springY = useSpring(y, { damping: 30, stiffness: 100 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('spark-container')?.getBoundingClientRect()
      if (!rect) return
      
      const relX = e.clientX - rect.left
      const relY = e.clientY - rect.top
      
      // Subtle parallax - moves slightly towards cursor
      x.set(initialX + (relX - rect.width / 2) * 0.02)
      y.set(initialY + (relY - rect.height / 2) * 0.02)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [initialX, initialY, x, y])

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className="absolute pointer-events-none"
    >
      <motion.svg
        viewBox="0 0 16 16"
        className="w-3 h-3 md:w-4 md:h-4 text-accent/40"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <path
          d="M8 0L9 6L15 7.5L9 9L8 15L7 9L1 7.5L7 6L8 0Z"
          fill="currentColor"
        />
      </motion.svg>
    </motion.div>
  )
}

// Animated decorative line
function DecorativeLine({ side }: { side: 'left' | 'right' }) {
  return (
    <motion.svg
      viewBox="0 0 100 20"
      className={`absolute top-1/2 -translate-y-1/2 w-16 md:w-24 h-5 text-accent/20 ${
        side === 'left' ? 'left-4 md:left-8' : 'right-4 md:right-8 rotate-180'
      }`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.path
        d="M0 10 Q 25 10, 40 5 T 80 10 T 100 10"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
      />
      <motion.circle
        cx="100"
        cy="10"
        r="2"
        fill="currentColor"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 2 }}
        viewport={{ once: true }}
      />
    </motion.svg>
  )
}

// Animated bracket decorations
function AnimatedBracket({ side }: { side: 'left' | 'right' }) {
  return (
    <motion.svg
      viewBox="0 0 20 60"
      className={`absolute top-1/2 -translate-y-1/2 w-4 md:w-5 h-12 md:h-16 text-muted-foreground/10 ${
        side === 'left' ? '-left-6 md:-left-10' : '-right-6 md:-right-10 rotate-180'
      }`}
      initial={{ opacity: 0, x: side === 'left' ? -10 : 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.path
        d="M15 5 L5 5 L5 55 L15 55"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        viewport={{ once: true }}
      />
    </motion.svg>
  )
}

// Interactive orbit ring
function OrbitRing() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <motion.svg
        viewBox="0 0 400 100"
        className="w-full max-w-3xl h-auto opacity-[0.03]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        transition={{ delay: 1.5 }}
        viewport={{ once: true }}
      >
        <motion.ellipse
          cx="200"
          cy="50"
          rx="180"
          ry="35"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
          viewport={{ once: true }}
        />
      </motion.svg>
      
      {/* Orbiting dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-accent/30"
        animate={{
          x: [0, 150, 0, -150, 0],
          y: [30, 0, -30, 0, 30],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [isInView, setIsInView] = useState(false)
  const [showReal, setShowReal] = useState(false)
  
  const brandName = "SparkPair"
  const scrambledText = useTextScramble(brandName, isInView)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowReal(true), 600)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  const fadeUp = {
    initial: { y: 20, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }

  return (
    <footer className="bg-background pt-16 md:pt-20 pb-6 border-t border-border/40 selection:bg-accent selection:text-accent-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 mb-16 md:mb-24">
          
          <motion.div {...fadeUp} className="max-w-md space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]">
              Refining digital chaos <br className="hidden sm:block" /> 
              <span className="text-muted-foreground/60 font-serif italic font-light">into functional art.</span>
            </h2>
            
            <div className="group w-fit relative">
              <a href="mailto:hello@sparkpair.com" className="text-lg sm:text-xl md:text-2xl font-medium relative overflow-hidden inline-block">
                <motion.span className="inline-block transition-transform duration-500 cubic-bezier(0.76, 0, 0.24, 1) group-hover:-translate-y-[120%]">
                  hello@sparkpair.com
                </motion.span>
                <span className="absolute top-full left-0 inline-block transition-transform duration-500 cubic-bezier(0.76, 0, 0.24, 1) group-hover:-translate-y-[100%] text-accent italic font-serif">
                  hello@sparkpair.com
                </span>
              </a>
              <div className="h-[1px] bg-border w-full group-hover:bg-accent transition-colors duration-500" />
            </div>
          </motion.div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 md:gap-24 w-full md:w-auto">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="space-y-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">Navigation</p>
              <ul className="space-y-2.5">
                {["Work", "Services", "About", "Contact"].map((item) => (
                  <li key={item} className="overflow-hidden h-4">
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 flex flex-col group leading-none">
                      <span className="transition-transform duration-300 group-hover:-translate-y-full">{item}</span>
                      <span className="transition-transform duration-300 group-hover:-translate-y-full text-accent font-medium">{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="space-y-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">Socials</p>
              <ul className="space-y-2.5">
                {["LinkedIn", "Twitter", "Instagram"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group leading-none">
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">{item}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 md:group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Identity - INTERACTIVE WITH SVGs */}
        <div className="border-t border-border/40 pt-10">
          <motion.div 
            id="spark-container"
            onViewportEnter={() => setIsInView(true)}
            className="flex flex-col items-center mb-10 relative"
          >
            {/* Floating sparks - parallax effect */}
            <FloatingSpark initialX={-120} initialY={-20} />
            <FloatingSpark initialX={130} initialY={-15} />
            <FloatingSpark initialX={-80} initialY={30} />
            <FloatingSpark initialX={100} initialY={25} />

            {/* Main text container with brackets */}
            <div className="relative">
              <AnimatedBracket side="left" />
              <AnimatedBracket side="right" />
              
              {/* Scramble text layer */}
              <AnimatePresence>
                {!showReal && isInView && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[15vw] md:text-[12vw] font-bold leading-[0.8] tracking-tighter text-center select-none text-muted-foreground/20 font-mono absolute inset-0 flex items-center justify-center"
                  >
                    {scrambledText}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Main interactive text */}
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: showReal ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="text-[15vw] md:text-[12vw] font-bold leading-[0.8] tracking-tighter text-center select-none relative"
              >
                {brandName.split("").map((char, index) => (
                  <MagneticLetter key={index} index={index}>
                    {char}
                  </MagneticLetter>
                ))}
              </motion.h1>
            </div>
            
            {/* Spark decorations around text */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-0 left-1/4 -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                viewport={{ once: true }}
              >
                <SparkSVG className="w-4 h-4 md:w-6 md:h-6 text-accent/30" delay={1.2} />
              </motion.div>
              
              <motion.div
                className="absolute bottom-0 right-1/4 translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                viewport={{ once: true }}
              >
                <SparkSVG className="w-3 h-3 md:w-5 md:h-5 text-accent/20" delay={1.4} />
              </motion.div>
            </div>
            
            {/* Subtitle with animated lines */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-6 flex items-center gap-3"
            >
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 24 }}
                transition={{ delay: 1, duration: 0.6 }}
                viewport={{ once: true }}
                className="h-px bg-accent/40 md:w-6" 
              />
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.1, type: "spring" }}
                  viewport={{ once: true }}
                >
                  <svg viewBox="0 0 12 12" className="w-2 h-2 text-accent/50">
                    <path d="M6 0L7 4.5L11 5.5L7 6.5L6 11L5 6.5L1 5.5L5 4.5L6 0Z" fill="currentColor" />
                  </svg>
                </motion.div>
                <span className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] uppercase text-muted-foreground/50 whitespace-nowrap">
                  Digital Design Studio
                </span>
                <motion.div
                  initial={{ scale: 0, rotate: 90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.1, type: "spring" }}
                  viewport={{ once: true }}
                >
                  <svg viewBox="0 0 12 12" className="w-2 h-2 text-accent/50">
                    <path d="M6 0L7 4.5L11 5.5L7 6.5L6 11L5 6.5L1 5.5L5 4.5L6 0Z" fill="currentColor" />
                  </svg>
                </motion.div>
              </div>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 24 }}
                transition={{ delay: 1, duration: 0.6 }}
                viewport={{ once: true }}
                className="h-px bg-accent/40 md:w-6" 
              />
            </motion.div>
          </motion.div>

          {/* Bottom Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center py-8 border-t border-border/10 gap-8 md:gap-4">
            {/* Time / Location */}
            <div className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-muted-foreground/50 justify-center md:justify-start">
              <motion.span 
                className="w-1.5 h-1.5 rounded-full bg-accent"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              KARACHI, PK — {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
            </div>

            {/* Copyright */}
            <div className="text-[10px] font-medium tracking-widest text-muted-foreground/40 text-center uppercase order-last md:order-none">
              © {currentYear} <span className="hidden sm:inline">SparkPair Ltd.</span>
            </div>

            {/* Legal & Back to top */}
            <div className="flex items-center gap-6 text-[10px] font-medium tracking-widest text-muted-foreground/50 justify-center md:justify-end uppercase">
              <a href="#" className="hover:text-accent transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-accent transition-colors duration-300">Terms</a>
              <motion.button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full border border-border/40 flex items-center justify-center hover:bg-accent hover:border-accent group transition-all duration-300"
              >
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-background transition-colors -rotate-45" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}