"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpRight, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden selection:bg-accent/20">
      
      {/* 1. Improved Background & Texture */}
      {/* Noise Texture (Inline SVG for self-contained grain effect) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay">
        <svg className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Floating Blobs with softer blur and better positioning */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-float opacity-70" />
      <div
        className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-float opacity-60"
        style={{ animationDelay: "2s", animationDirection: "reverse" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full pt-20 lg:pt-32">
        <div className="flex flex-col items-center text-center space-y-10">
          
          {/* 2. Refined Badge: Glassmorphic look */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-background/50 backdrop-blur-sm shadow-sm hover:border-accent/50 transition-colors duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-medium text-foreground/80 tracking-wide uppercase">Available for new projects</span>
          </div>

          {/* 3. Headline: Better spacing, serif contrast, and animated SVG */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground leading-[1.1] sm:leading-[0.95] tracking-tight text-balance">
              Digital solutions
              <br />
              {/* Mixed font-family for visual interest (assuming you have a serif font, otherwise falls back to sans italic) */}
              <span className="font-serif italic font-light text-muted-foreground tracking-normal mr-3 sm:mr-4">
                that spark
              </span>
              <span className="relative inline-block text-foreground">
                growth
                {/* SVG with CSS drawing animation */}
                <svg 
                  className="absolute -bottom-2 left-0 w-full h-3 sm:h-5" 
                  viewBox="0 0 200 12" 
                  fill="none"
                  style={{ overflow: 'visible' }}
                >
                  <path
                    d="M2 10C50 4 150 4 198 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-accent animate-draw"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                  />
                </svg>
              </span>
            </h1>
          </div>

          {/* Subheadline: Improved readability */}
          <p className="text-lg text-muted-foreground/90 max-w-xl leading-relaxed text-balance font-light">
            We partner with ambitious brands to create exceptional digital experiences through strategy, design, and
            technology.
          </p>

          {/* 4. Buttons: Added glow and better hover states */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full justify-center">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              Start a project
              <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-full text-base bg-background/50 backdrop-blur-sm border-border hover:bg-secondary/50 hover:text-foreground transition-all duration-300"
            >
              <Play className="w-3.5 h-3.5 mr-2 fill-current" />
              Watch showreel
            </Button>
          </div>

          {/* 5. Stats: Added dividers and improved responsive layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 mt-8 border-t border-border/60 w-full max-w-4xl relative">
             {/* Gradient fade on edges of border line */}
            <div className="absolute top-0 left-0 w-20 h-[1px] bg-gradient-to-r from-background to-transparent -mt-[1px]" />
            <div className="absolute top-0 right-0 w-20 h-[1px] bg-gradient-to-l from-background to-transparent -mt-[1px]" />

            {[
              { value: "150+", label: "Projects delivered" },
              { value: "8yrs", label: "Experience" },
              { value: "98%", label: "Client satisfaction" },
              { value: "12", label: "Design Awards" },
            ].map((stat, index) => (
              <div key={stat.label} className="flex flex-col items-center justify-center relative">
                {/* Vertical Divider for desktop */}
                {index !== 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border/60 -ml-6" />
                )}
                <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator: Smoother animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-500">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-muted-foreground/20 to-muted-foreground overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1/2 bg-accent animate-scroll-down"></div>
        </div>
      </div>

      {/* Styles for the custom animations to avoid external dependencies */}
      <style jsx>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw {
          animation: draw 1.5s ease-out forwards;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes scroll-down {
            0% { top: -100%; }
            100% { top: 100%; }
        }
        .animate-scroll-down {
            animation: scroll-down 2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }
      `}</style>
    </section>
  )
}