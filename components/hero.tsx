"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "150+", label: "Projects delivered" },
  { value: "8yrs", label: "Experience" },
  { value: "98%", label: "Client satisfaction" },
  { value: "12", label: "Design Awards" },
]

export function Hero({ show = true }: { show?: boolean }) {
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

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden selection:bg-accent/20">
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        className="relative z-10 max-w-5xl mx-auto w-full pt-20 lg:pt-32"
      >
        <div className="flex flex-col items-center text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, filter: "blur(7px)", y: -20, skewX: 60, scale: 0.9 }}
            animate={show ? { opacity: 1, filter: "blur(0px)", y: 0, skewX: 0, scale: 1 } : {}}
            transition={{
              duration: 1.6,
              delay: 0.8,
              ease: [0.22, 1.1, 0.28, 1.2],
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-background/50 backdrop-blur-sm shadow-sm hover:border-accent/50 transition-colors duration-300 cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-medium text-foreground/80 tracking-wide uppercase">Available for new projects</span>
          </motion.div>

          <motion.div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground leading-[1.1] sm:leading-[0.95] tracking-tight text-balance">
              <motion.span
                initial={{ opacity: 0, filter: "blur(20px)", y: 40, scale: 1.1 }}
                animate={show ? { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 } : {}}
                transition={{
                  duration: 1.8,
                  delay: 0.6,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="inline-block"
              >
                Digital solutions
              </motion.span>

              <br />

              <motion.div
                initial={{ opacity: 0, filter: "blur(15px)", y: 30, skewX: -20, scale: 0.9 }}
                animate={show ? { opacity: 1, filter: "blur(0px)", y: 0, skewX: 0, scale: 1 } : {}}
                transition={{
                  duration: 1.2,
                  delay: 0.7,
                  ease: [0.19, 1, 0.22, 1],
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
                    style={{ overflow: "visible" }}
                  >
                    <motion.path
                      d="M2 10C50 4 150 4 198 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-accent"
                      initial={{ pathLength: 0, opacity: 0, pathOffset: 1 }}
                      animate={show ? { pathLength: 1, opacity: 1, pathOffset: 0 } : {}}
                      transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
                    />
                  </svg>
                </span>
              </motion.div>
            </h1>
          </motion.div>

          <motion.p className="text-lg text-muted-foreground/90 max-w-xl leading-relaxed text-balance font-light flex flex-wrap justify-center overflow-hidden">
            {"We partner with ambitious brands to create exceptional digital experiences through strategy, design, and technology."
              .split(" ")
              .map((word, i) => (
                <span key={i} className="inline-block mr-[0.3em]">
                  <motion.span
                    initial={{
                      opacity: 0,
                      y: 15,
                      rotateX: 25,
                      skewX: 10,
                    }}
                    animate={
                      show
                        ? {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            skewX: 0,
                          }
                        : {}
                    }
                    transition={{
                      duration: 1,
                      delay: 1 + i * 0.02,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    className="inline-block origin-bottom"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: -30, skewX: -50, scale: 0.4 }}
            animate={show ? { opacity: 1, y: 0, skewX: 0, scale: 1 } : {}}
            transition={{
              duration: 1,
              delay: 0.6,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="flex flex-col sm:flex-row gap-4 pt-2 w-full justify-center"
          >
            <Button
              size="lg"
              asChild
              className="h-14 px-8 rounded-full text-base font-medium bg-accent text-accent-foreground shadow-md shadow-accent/15 hover:shadow-lg hover:shadow-accent/25 transition-all duration-500 group cursor-pointer overflow-hidden relative"
            >
              <motion.a href="#contact">
                <span className="absolute inset-0 bg-black/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 flex items-center h-5 overflow-hidden">
                  <span className="flex items-center transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    Start a project
                    <span className="relative w-4 h-4 ml-2 overflow-hidden">
                      <ArrowUpRight className="w-4 h-4 absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-5 group-hover:-translate-y-5" />
                      <ArrowUpRight className="w-4 h-4 absolute inset-0 -translate-x-5 translate-y-5 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                    </span>
                  </span>
                </span>
              </motion.a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-8 rounded-full text-base bg-background/50 backdrop-blur-sm border-border/60 hover:border-foreground/20 transition-all duration-500 cursor-pointer overflow-hidden relative group"
            >
              <motion.a href="#work" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <span className="absolute inset-0 bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 flex items-center group-hover:text-background transition-colors duration-300 delay-100">
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

          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 mt-8 border-t border-border/60 w-full max-w-4xl relative">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex flex-col items-center justify-center">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={show ? { y: 0, opacity: 1 } : {}}
                    transition={{
                      duration: 1,
                      delay: 0.8 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight tabular-nums"
                  >
                    {stat.value}
                  </motion.div>
                </div>

                <div className="overflow-hidden">
                  <motion.p
                    initial={{ y: "100%", opacity: 0 }}
                    animate={show ? { y: 0, opacity: 1 } : {}}
                    transition={{
                      duration: 1,
                      delay: 0.9 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-sm font-medium text-muted-foreground mt-1"
                  >
                    {stat.label}
                  </motion.p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={show ? { opacity: 0.5, y: 0 } : { opacity: 0 }}
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
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 20px);
          }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
