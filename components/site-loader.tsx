"use client"

import { motion, useReducedMotion } from "framer-motion"

type SiteLoaderProps = {
  progress: number
  isExiting?: boolean
}

export function SiteLoader({ progress, isExiting = false }: SiteLoaderProps) {
  const reduceMotion = useReducedMotion()
  const visibleProgress = Math.max(0, Math.min(100, Math.round(progress)))

  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      animate={
        isExiting
          ? reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: "-8%", clipPath: "inset(0% 0% 100% 0%)" }
          : { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }
      }
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "-8%", clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: reduceMotion ? 0.12 : 0.65, ease: [0.76, 0, 0.24, 1] }}
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
            {visibleProgress}
          </span>
          <span className="text-[12vw] leading-none font-serif italic font-light tabular-nums tracking-tighter">
            {visibleProgress}
          </span>
          <span className="mb-[1.2vw] text-[2vw] font-black text-accent">%</span>
        </div>

        <div className="mt-10 h-[2px] w-[240px] overflow-hidden rounded-full bg-black/8">
          <motion.div
            className="h-full bg-black"
            animate={{ width: `${visibleProgress}%` }}
            transition={{ ease: "easeOut", duration: reduceMotion ? 0 : 0.15 }}
          />
        </div>

        <motion.p
          key={visibleProgress < 35 ? "vision" : visibleProgress < 75 ? "systems" : "launch"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
          className="mt-8 text-[10px] font-bold uppercase tracking-[0.35em] text-black/40"
        >
          {visibleProgress < 35 ? "Aligning vision" : visibleProgress < 75 ? "Preparing systems" : "Launching experience"}
        </motion.p>
      </div>
    </motion.div>
  )
}
