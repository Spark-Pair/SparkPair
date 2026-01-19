"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Projects } from "@/components/projects"
import { Team } from "@/components/team"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  // This timer should match the duration of your Hero's loading progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 2400) // 20ms * 100 + 800ms exit animation
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background relative">
      {/* 1. Synced Navigation - only slides down after load */}
      <Navigation show={isLoaded} />

      {/* 2. Hero - handles the actual loading screen overlay */}
      <Hero />

      {/* 3. Page Content - wrapped in a fade-in to match the Hero's reveal */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Services />
            <Projects />
            <Team />
            <CTA />
            
            {/* 4. Footer with reveal animation */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}