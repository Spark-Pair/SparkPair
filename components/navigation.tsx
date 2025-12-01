"use client"

import { useState, useEffect } from "react"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Toggle body scroll lock when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle scroll detection for sticky header background
  useEffect(() => {
    const handleScroll = () => {
      // Use a slightly larger scroll threshold for a smoother transition point
      setIsScrolled(window.scrollY > 50) 
    }
    // Optimization: Use passive listener if possible, but standard is fine for most cases
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
    // 1. Fixed height and padding on scroll for a smoother shrink effect
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-background/90 backdrop-blur-lg border-b border-border/60 shadow-lg shadow-background/5" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div 
          className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo/Brand: Added subtle movement on scroll */}
          <a href="#" className="flex items-center group transition-transform duration-300">
            <img
              src="/images/spark-pair6.png"
              alt="SparkPair Logo"
              className={`w-auto transition-all duration-300 ${
                isScrolled ? "h-8" : "h-10"
              } group-hover:opacity-80`}
            />
          </a>

          {/* 2. Desktop Navigation: Subtle hover border refinement */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                {link.label}
                {/* Underline: Use a taller height and opacity for better visual weight */}
                <span className="absolute inset-x-4 -bottom-0.5 h-[2px] bg-accent/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </a>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Button size="sm" 
              className="font-medium tracking-wide rounded-full px-5 h-9 bg-accent hover:bg-accent/90 text-accent-foreground group 
                         shadow-md shadow-accent/10 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
            >
              Let's Talk
              <ArrowUpRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>

          {/* 3. Mobile Menu Button: Cleaner icon size and hover */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-secondary/50 border border-transparent hover:border-border z-[60]" // z-index elevated for layer stability
            aria-label="Toggle menu"
          >
            {isOpen 
              ? <X className="w-6 h-6 text-foreground" /> 
              : <Menu className="w-6 h-6 text-foreground" />
            }
          </button>
        </div>

        {/* 4. Mobile Navigation: Full-screen overlay and slide-in effect */}
        {/* Full-width overlay */}
        <div 
            className={`fixed inset-0 bg-background/95 backdrop-blur-md md:hidden z-40 transition-opacity duration-300 ${
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsOpen(false)} // Close on background click
        />

        {/* Menu content slides down from the top */}
        <div
          className={`fixed top-0 left-0 w-full md:hidden z-50 transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-y-20" : "-translate-y-full"
          } bg-background border-b border-border shadow-2xl`}
        >
          <div className="px-6 pb-6 space-y-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-3 text-lg font-medium text-foreground hover:bg-secondary/70 rounded-lg transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 px-4">
              <Button
                className="w-full h-11 font-medium tracking-wide rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Let's Talk
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}