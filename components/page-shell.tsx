"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Projects } from "@/components/projects"
import { Team } from "@/components/team"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

function LoaderScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startedAt = performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const nextProgress = Math.min(100, Math.round((elapsed / 950) * 100))
      setProgress(nextProgress)

      if (nextProgress < 100) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f9f9f7] text-[#121212] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-[42vw] w-[42vw] rounded-full bg-accent/10 blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-6 text-[11px] font-semibold uppercase tracking-[0.45em] text-black/45">
          SparkPair Studio
        </span>

        <div className="relative flex items-end gap-2">
          <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[18vw] font-bold italic tracking-tighter text-black/[0.03] select-none">
            {progress}
          </span>
          <span className="text-[12vw] leading-none font-serif italic font-light tabular-nums tracking-tighter">
            {progress}
          </span>
          <span className="mb-[1.2vw] text-[2vw] font-black text-accent">%</span>
        </div>

        <div className="mt-10 h-[2px] w-[240px] overflow-hidden rounded-full bg-black/8">
          <motion.div
            className="h-full bg-black"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.15 }}
          />
        </div>

        <motion.p
          key={progress < 35 ? "vision" : progress < 75 ? "systems" : "launch"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-8 text-[10px] font-bold uppercase tracking-[0.35em] text-black/40"
        >
          {progress < 35 ? "Aligning vision" : progress < 75 ? "Preparing systems" : "Launching experience"}
        </motion.p>
      </div>
    </motion.div>
  )
}

export function PageShell() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoaded(true)
    }, 1150)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background relative">
      <AnimatePresence mode="wait">{!isLoaded && <LoaderScreen />}</AnimatePresence>
      <Navigation show={isLoaded} />
      <Hero show={isLoaded} />
      <Services />
      <Projects />
      <Team />
      <CTA />
      <Footer />
    </main>
  )
}
