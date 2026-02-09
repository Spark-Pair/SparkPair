"use client"

import { useState, useEffect } from "react"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function Navigation({ show }: { show: boolean }) { // Accept show prop from Hero/Page
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50) 
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 1.2, ease: [0.225, 1.3, 0.385, 1.2] }}
          className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
              ? "bg-background/90 backdrop-blur-lg border-b border-border/60 shadow-lg shadow-background/5" 
              : "bg-transparent"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
              <a href="#" className="flex items-center">
                <img
                  src="/images/spark-pair6.png"
                  alt="SparkPair Logo"
                  className={`w-auto transition-all duration-300 ${isScrolled ? "h-8" : "h-10"}`}
                />
              </a>

              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="relative px-4 py-2 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                  >
                    {link.label}
                    <span className="absolute inset-x-4 -bottom-0.5 h-[2px] bg-accent/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                  </a>
                ))}
              </div>

              <div className="hidden md:block">
                <Button
                  size="sm"
                  className="px-6 h-10 rounded-full text-base font-medium bg-accent text-accent-foreground shadow-md shadow-accent/15 hover:shadow-lg hover:shadow-accent/25 transition-all duration-500 group cursor-pointer overflow-hidden relative"
                >
                  <motion.a 
                    href="#contact"
                  >
                    {/* Subtle dark overlay sweep */}
                    <span className="absolute inset-0 bg-black/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    
                    {/* Text with slide effect */}
                    <span className="relative z-10 flex items-center h-4 overflow-hidden">
                      <span className="flex items-center">
                        Let's Talk
                        {/* Arrow with diagonal swap */}
                        <span className="relative w-4 h-4 ml-2 overflow-hidden">
                          <ArrowUpRight className="w-4 h-4 absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-5 group-hover:-translate-y-5" />
                          <ArrowUpRight className="w-4 h-4 absolute inset-0 -translate-x-5 translate-y-5 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                        </span>
                      </span>
                    </span>
                  </motion.a>
                </Button>
              </div>

              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg z-[60]">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu with Framer Motion */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-background border-b border-border overflow-hidden"
              >
                <div className="px-6 pb-8 space-y-2">
                  {navLinks.map((link) => (
                    <a key={link.label} href={link.href} className="block py-3 text-lg font-medium border-b border-border/10" onClick={() => setIsOpen(false)}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}