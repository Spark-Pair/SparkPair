"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef } from "react"
import { ArrowUpRight, Check, Mail, Send, Phone, MapPin } from "lucide-react"
import { motion, AnimatePresence, useInView } from "framer-motion"

export function CTA() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
    }, 3000)
  }

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="py-20 md:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-foreground text-background"
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), 
                                  linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          {/* Minimal gradient accent */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-accent/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Content container */}
          <div className="relative p-8 sm:p-12 lg:p-20">
            
            {/* Top label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-12"
            >
              <motion.div 
                initial={{ width: 0 }}
                animate={isInView ? { width: 40 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-px bg-background/20"
              />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-background/40">
                Let's Connect
              </span>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-end">
              
              {/* Left Content */}
              <div className="space-y-8">
                
                {/* Headline with character reveal */}
                <div>
                  <div className="overflow-hidden py-1">
                    <motion.h2 
                      initial={{ y: "100%" }}
                      animate={isInView ? { y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight"
                    >
                      Ready to start
                    </motion.h2>
                  </div>
                  
                  <div className="overflow-hidden py-1">
                    <motion.h2 
                      initial={{ y: "100%" }}
                      animate={isInView ? { y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
                    >
                      <span className="italic font-serif font-light text-background/50">
                        something great?
                      </span>
                    </motion.h2>
                  </div>
                </div>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-background/50 text-base md:text-lg leading-relaxed max-w-md font-light"
                >
                  Let's discuss your next project and explore how we can bring your ideas to life.
                </motion.p>

                {/* Stats or trust indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex items-center gap-8 pt-4"
                >
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold">48h</span>
                    <span className="text-xs text-background/40 tracking-wide">Response time</span>
                  </div>
                  <div className="w-px h-10 bg-background/10" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold">150+</span>
                    <span className="text-xs text-background/40 tracking-wide">Projects done</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Form */}
              {/* Right Form */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="space-y-8"
              >
                {/* Form Card Header */}
                <div className="space-y-6">
                  
                  {/* Top Row: Label + Availability */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.6, type: "spring" }}
                        className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center"
                      >
                        <Mail className="w-4.5 h-4.5 text-accent" />
                      </motion.div>
                      <div>
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.7 }}
                          className="text-[10px] font-medium tracking-[0.2em] uppercase text-background/40 block"
                        >
                          Get in Touch
                        </motion.span>
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.8 }}
                          className="text-sm font-medium text-background/80"
                        >
                          Quick Response
                        </motion.span>
                      </div>
                    </div>
                    
                    {/* Online indicator */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.9 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/5 border border-background/10"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-medium tracking-wider uppercase text-background/50">Online</span>
                    </motion.div>
                  </div>

                  {/* Contact Details Grid */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.9 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {/* Phone */}
                    <a 
                      href="tel:+923165825495" 
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-background/5 border border-background/5 hover:border-accent/30 hover:bg-background/10 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                        <Phone className="w-3.5 h-3.5 text-background/50 group-hover:text-accent transition-colors duration-300" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-background/30">Call us</span>
                        <span className="text-xs font-medium text-background/70 group-hover:text-background transition-colors duration-300">+92 316 5825495</span>
                      </div>
                    </a>

                    {/* Location */}
                    <div className="group flex items-center gap-3 p-3 rounded-2xl bg-background/5 border border-background/5">
                      <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-background/50" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-background/30">Location</span>
                        <span className="text-xs font-medium text-background/70">Karachi, Pakistan</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.8, delay: 1 }}
                      className="flex-1 h-px bg-background/10 origin-left"
                    />
                    <span className="text-[9px] tracking-[0.2em] uppercase text-background/30">or drop your email</span>
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.8, delay: 1.1 }}
                      className="flex-1 h-px bg-background/10 origin-right"
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Input with animated border */}
                  <div className="relative group">
                    <div className={`absolute -inset-px rounded-full transition-colors duration-300 ${
                      isFocused ? 'bg-accent' : 'bg-background/10'
                    }`} />
                    
                    <div className="relative flex items-center bg-foreground rounded-full">
                      <Mail className={`w-5 h-5 ml-6 flex-shrink-0 transition-colors duration-300 ${
                        isFocused ? 'text-accent' : 'text-background/30'
                      }`} />
                      
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        required
                        className="flex-1 h-14 px-4 bg-transparent border-0 text-background placeholder:text-background/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSubmitted}
                        className="h-10 w-10 mr-2 rounded-full bg-accent text-accent-foreground hover:bg-accent transition-all duration-300 group/btn p-0"
                      >
                        <AnimatePresence mode="wait">
                          {isSubmitted ? (
                            <motion.span
                              key="success"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Check className="w-4 h-4" />
                            </motion.span>
                          ) : (
                            <span className="relative w-4 h-4 overflow-hidden block">
                              <Send className="w-4 h-4 absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-x-5 group-hover/btn:-translate-y-5" />
                              <Send className="w-4 h-4 absolute inset-0 -translate-x-5 translate-y-5 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
                            </span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  </div>

                  {/* Mobile button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitted}
                    className="w-full sm:hidden h-14 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 group/btn overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitted ? (
                        <motion.span
                          key="success"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="flex items-center"
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Sent!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="send"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="flex items-center"
                        >
                          Get in touch
                          <span className="relative w-5 h-5 ml-2 overflow-hidden">
                            <ArrowUpRight className="w-5 h-5 absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-x-6 group-hover/btn:-translate-y-6" />
                            <ArrowUpRight className="w-5 h-5 absolute inset-0 -translate-x-6 translate-y-6 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </form>

                {/* Email link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.2 }}
                  className="flex items-center justify-center sm:justify-start gap-2 text-sm text-background/40"
                >
                  <span>or email directly at</span>
                  <a
                    href="mailto:hello@sparkpair.dev"
                    className="relative text-background/70 hover:text-accent transition-colors duration-300 group/link"
                  >
                    hello@sparkpair.dev
                    <span className="absolute left-0 -bottom-px w-0 h-px bg-accent group-hover/link:w-full transition-all duration-300" />
                  </a>
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom decorative element */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="flex items-center justify-between mt-16 pt-8 border-t border-background/5"
            >
              <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-background/30">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Available for projects
              </div>
              
              <div className="hidden sm:flex items-center gap-6 text-[10px] tracking-[0.2em] uppercase text-background/30">
                <span>Karachi, PK</span>
                <span>•</span>
                <span>{new Date().getFullYear()}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}