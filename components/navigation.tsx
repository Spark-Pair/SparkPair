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
          transition={{ delay: 0.5, duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
          className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
              ? "bg-background/90 backdrop-blur-lg border-b border-border/60 shadow-lg shadow-background/5" 
              : "bg-transparent"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
              <a href="#" className="flex items-center group transition-transform duration-300">
                <img
                  src="/images/spark-pair6.png"
                  alt="SparkPair Logo"
                  className={`w-auto transition-all duration-300 ${isScrolled ? "h-8" : "h-10"} group-hover:opacity-80`}
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
                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                  <Button size="sm" className="font-medium tracking-wide rounded-full px-5 h-9 bg-accent hover:bg-accent/90 text-accent-foreground group shadow-md shadow-accent/10 transition-all duration-300">
                    Let's Talk
                    <ArrowUpRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </motion.div>
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