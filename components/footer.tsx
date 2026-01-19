"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const fadeUp = {
    initial: { y: 20, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }

  return (
    <footer className="bg-background pt-20 pb-8 border-t border-border/40 selection:bg-accent selection:text-accent-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section - Reduced Bottom Margin */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          
          <motion.div {...fadeUp} className="max-w-md space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]">
              Refining digital chaos <br /> 
              <span className="text-muted-foreground/60 font-serif italic font-light">into functional art.</span>
            </h2>
            
            <div className="group w-fit relative">
              <a href="mailto:hello@sparkpair.com" className="text-xl md:text-2xl font-medium relative overflow-hidden inline-block py-1">
                <motion.span className="inline-block transition-transform duration-500 cubic-bezier(0.76, 0, 0.24, 1) group-hover:-translate-y-[120%]">
                  hello@sparkpair.com
                </motion.span>
                <span className="absolute top-full left-0 inline-block transition-transform duration-500 cubic-bezier(0.76, 0, 0.24, 1) group-hover:-translate-y-[120%] text-accent italic font-serif">
                  hello@sparkpair.com
                </span>
              </a>
              <div className="h-[1px] bg-border w-full group-hover:bg-accent transition-colors duration-500" />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-12 md:gap-24">
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
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Identity - Tightened Margins */}
        <div className="border-t border-border/40 pt-10 mt-10">
          <div className="flex flex-col items-center mb-10 overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] font-bold leading-[0.8] tracking-tighter text-center"
            >
              SparkPair<span className="text-accent">.</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 flex items-center gap-3"
            >
              <div className="h-px w-6 bg-accent/30" />
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted-foreground/50">
                Digital Design Studio
              </span>
              <div className="h-px w-6 bg-accent/30" />
            </motion.div>
          </div>

          {/* Compact Bottom Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center py-6 border-t border-border/10 gap-6">
            <div className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-muted-foreground/50 justify-center md:justify-start">
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
              KARACHI, PK — {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
            </div>

            <div className="text-[10px] font-medium tracking-widest text-muted-foreground/40 text-center uppercase">
              © {currentYear} SparkPair Ltd.
            </div>

            <div className="flex items-center gap-6 text-[10px] font-medium tracking-widest text-muted-foreground/50 justify-center md:justify-end uppercase">
              <a href="#" className="hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms</a>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                className="w-7 h-7 rounded-full border border-border/40 flex items-center justify-center hover:bg-accent group transition-all"
              >
                <ArrowUpRight className="w-3 h-3 group-hover:text-background transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}