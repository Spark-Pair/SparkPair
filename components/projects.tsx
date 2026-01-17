"use client"; // <--- Add this at the very top to fix the error

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export function Projects() {
  const projects = [
    {
      title: "Finova",
      description: "A modern fintech platform with real-time analytics and seamless transaction flows.",
      category: "Web App",
      year: "2024",
      image: "/minimal-fintech-dashboard-dark-mode-clean-interfac.jpg",
    },
    {
      title: "Bloom",
      description: "E-commerce experience for a sustainable fashion brand with immersive product showcases.",
      category: "E-Commerce",
      year: "2024",
      image: "/minimal-ecommerce-fashion-website-clean-modern.jpg",
    },
    {
      title: "Nexus",
      description: "Enterprise SaaS platform serving thousands of teams with intuitive collaboration tools.",
      category: "SaaS",
      year: "2023",
      image: "/minimal-saas-collaboration-platform-interface-clea.jpg",
    },
  ]

  return (
    <section id="work" className="py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <div className="space-y-4">
            <p className="text-sm font-medium text-accent uppercase tracking-widest">Selected work</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight text-balance">
              Projects that
              <br />
              speak for themselves
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors group"
          >
            View all projects
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Stacking Container */}
        <div className="flex flex-col gap-10 lg:gap-20">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              project={project} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const container = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"], 
  })

  // Animation: Grows from 0.85 to 1.0 size as it scrolls into sticky view
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <div 
      ref={container} 
      className="h-[70vh] lg:h-[80vh] flex items-start sticky top-12 lg:top-24"
    >
      <motion.div
        style={{ 
          scale,
          opacity,
          top: `calc(${index * 30}px)` 
        }}
        className="relative w-full overflow-hidden rounded-[2rem] lg:rounded-[3rem] bg-secondary/80 backdrop-blur-xl border border-white/5 shadow-sm"
      >
        <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-14 min-h-[450px]">
          
          {/* Content side */}
          <div className={`flex flex-col justify-between ${index % 2 === 1 ? "lg:order-2" : ""}`}>
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest px-3 py-1 bg-accent/5 rounded-full border border-accent/10">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-muted-foreground/40">{project.year}</span>
              </div>
              
              <h3 className="text-4xl lg:text-6xl font-medium tracking-tight text-foreground leading-tight">
                {project.title}
              </h3>
              
              <p className="text-muted-foreground/70 text-lg leading-relaxed max-w-sm font-light">
                {project.description}
              </p>
            </div>

            <div className="group/btn flex items-center gap-4 text-sm font-medium text-foreground pt-10 cursor-pointer">
               <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border group-hover/btn:bg-foreground group-hover/btn:text-background transition-all duration-500">
                  <ArrowUpRight className="h-5 w-5" />
               </div>
               <span className="tracking-wide">Explore Case Study</span>
            </div>
          </div>

          {/* Image side */}
          <div className={`relative aspect-video lg:aspect-auto overflow-hidden rounded-2xl border border-white/5 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

        </div>
      </motion.div>
    </div>
  )
}