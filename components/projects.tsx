"use client";

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { SectionHeader } from "./section-header";
import { SectionWatermark } from "./section-watermark";

export function Projects() {
  const containerRef = useRef(null)
  const projects = [
    { title: "TexTradeOS", description: "Wholesale garments business operations and management system", category: "Web App", year: "2024", image: "/textradeos.png", url: "https://example.com" },
    { title: "Finova", description: "A modern fintech platform with real-time analytics.", category: "Web App", year: "2024", image: "/minimal-fintech-dashboard-dark-mode-clean-interfac.jpg", url: "https://example.com" },
    { title: "Bloom", description: "E-commerce experience for a sustainable fashion brand.", category: "E-Commerce", year: "2024", image: "/minimal-ecommerce-fashion-website-clean-modern.jpg" },
    { title: "Nexus", description: "Enterprise SaaS platform serving thousands of teams.", category: "SaaS", year: "2023", image: "/minimal-saas-collaboration-platform-interface-clea.jpg", url: "https://example.com" },
  ]

  return (
    <section ref={containerRef} id="work" className="py-40 px-6 lg:px-8 relative overflow-hidden bg-[#fcfcfc]">
      <SectionWatermark text="PORTFOLIO" />
      
      {/* Subtle ambient glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto">
        <SectionHeader 
          label="Case Studies"
          title="Featured"
          italicTitle="projects"
          description="Transforming complex ideas into simple, functional digital products."
        />

        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            project={project} 
            index={index} 
            total={projects.length}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index, total }) {
  const cardRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 25 })

  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [8, 0, -8])
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.94, 1, 0.94])
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const yImage = useTransform(smoothProgress, [0, 1], ["-10%", "10%"])

  return (
    <div 
      ref={cardRef} 
      className="relative w-full flex items-center justify-center px-6 lg:px-8 border-t border-gray-200 py-7"
      style={{ perspective: "2800px" }}
    >
      <motion.div 
        style={{ scale, rotateX, opacity }}
        className="relative w-full max-w-5xl"
      >
        {/* Refined Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-between items-center mb-8 px-1"
        >
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-accent/60 mb-0.5">
                Project
              </span>
              <span className="text-2xl font-bold tracking-tight text-black">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="h-10 w-px bg-gray-300 hidden sm:block" />
            <div className="flex flex-col hidden sm:flex">
              <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-accent/60 mb-0.5">
                {project.category}
              </span>
              <span className="text-lg font-semibold text-gray-600">{project.year}</span>
            </div>
          </div>
          
          {project.url && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-300/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-gray-600">Live</span>
            </div>
          )}
        </motion.div>

        {/* Premium Visual Container */}
        <motion.a
          href={project.url || "#"}
          target={project.url ? "_blank" : undefined}
          rel={project.url ? "noopener noreferrer" : undefined}
          className="relative block group cursor-pointer"
          whileHover="hover"
          
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          viewport={{ once: true, margin: "-200px" }}
        >
          <div className="relative w-full aspect-[16/9] lg:aspect-[18/9]">
            {/* Subtle border glow */}
            {/* <div className="absolute -inset-[1px] bg-gradient-to-br from-gray-200/50 via-transparent to-gray-200/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" /> */}
            
            <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-[0_0px_25px_rgba(0,0,0,0.1)] transition-shadow duration-700">
              <motion.div 
                style={{ y: yImage }} 
                className="absolute inset-0 scale-110"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
                
                {/* Refined overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" /> */}
              </motion.div>
            </div>

            {/* Elegant Title Placement */}
            <div className="absolute -bottom-8 lg:-bottom-10 left-0 lg:-left-8">
              <motion.h3
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-[10vw] sm:text-[7vw] lg:text-[5.5vw] font-black leading-none tracking-tight"
              >
                <motion.div 
                  className="relative inline-block group/title cursor-pointer"
                  whileHover="hover"
                >
                  {/* Background container with premium effects */}
                  <motion.div 
                    className="relative bg-gradient-to-br from-black via-gray-900 to-black px-8 py-3 rounded-2xl shadow-[0_0px_15px_rgba(0,0,0,0.2)] overflow-hidden"
                    variants={{
                      hover: { scale: 1.02 }
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Text animation container */}
                    <motion.div
                      initial={{ skewX: -20, opacity: 0 }}
                      whileInView={{ skewX: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="relative text-lg sm:text-xl md:text-7xl font-medium overflow-hidden inline-block"
                    >
                      {/* Main text - slides up */}
                      <motion.span 
                        className="inline-block text-white"
                        variants={{
                          hover: { y: '-100%' }
                        }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                      >
                        {project.title}
                      </motion.span>
                      
                      {/* Hover text - slides up from bottom */}
                      <motion.span 
                        className="absolute top-full left-0 inline-block text-accent italic font-serif"
                        variants={{
                          hover: { y: '-100%' }
                        }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                      >
                        {project.title}
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.h3>
            </div>
          </div>
        </motion.a>

        {/* Balanced Footer */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-20 lg:mt-16 px-1"
        >
          <motion.div
            initial={{ opacity: 0, x: 50, filter: "blur(15px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-6"
          >
            <p className="text-gray-600 text-lg lg:text-xl font-light leading-relaxed">
              {project.description}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -50, filter: "blur(15px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-5 lg:col-start-8 flex items-center lg:justify-end"
          >
            <motion.div 
              className="group/btn inline-flex items-center gap-5 cursor-pointer"
              whileHover="hover"
            >
              <div className="flex flex-col items-start lg:items-end">
                <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-accent mb-0.5">
                  Explore
                </span>
                <span className="text-xl lg:text-2xl font-bold tracking-tight text-black">
                  Case Study
                </span>
              </div>
              
              <motion.div 
                className="h-14 w-14 rounded-full bg-black flex items-center justify-center relative overflow-hidden shadow-lg group-hover/btn:shadow-xl transition-shadow duration-500"
                variants={{
                  hover: { scale: 1.08, rotate: 45 }
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  variants={{ 
                    hover: { scale: 0, rotate: -45 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </motion.div>
                <motion.div
                  className="absolute"
                  variants={{ 
                    hover: { scale: 1, rotate: 0 }
                  }}
                  initial={{ scale: 0, rotate: 45 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}