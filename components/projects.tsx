"use client";

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SectionHeader } from "./section-header";
import { SectionWatermark } from "./section-watermark";

export function Projects() {
  const projects = [
    { title: "Finova", description: "A modern fintech platform with real-time analytics and seamless transaction flows.", category: "Web App", year: "2024", image: "/minimal-fintech-dashboard-dark-mode-clean-interfac.jpg" },
    { title: "Bloom", description: "E-commerce experience for a sustainable fashion brand with immersive product showcases.", category: "E-Commerce", year: "2024", image: "/minimal-ecommerce-fashion-website-clean-modern.jpg" },
    { title: "Nexus", description: "Enterprise SaaS platform serving thousands of teams with intuitive collaboration tools.", category: "SaaS", year: "2023", image: "/minimal-saas-collaboration-platform-interface-clea.jpg" },
  ]

  return (
    <section id="work" className="py-40 px-6 lg:px-8 relative overflow-hidden bg-[#fcfcfc]">
      {/* Background Studio Detail */}
      <SectionWatermark text="PORTFOLIO" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <SectionHeader 
          label="Case Studies"
          title="Featured"
          italicTitle="projects"
          description="Transforming complex ideas into simple, functional digital products."
        />

        {/* The Stack Container */}
        <div className="flex flex-col gap-20">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null)
  
  // Isse scroll lag nahi hoga kyunki hum image parallax ke liye use kar rahe hain
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100])

  return (
    <div 
      ref={cardRef}
      className="sticky top-24 w-full"
      style={{ marginTop: `calc(${index * 2}rem)` }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full overflow-hidden bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] group"
      >
        <div className="flex flex-col lg:flex-row h-full min-h-[500px] lg:h-[70vh]">
          
          {/* Content: Left Side */}
          <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-between">
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold tracking-widest uppercase py-1.5 px-3 bg-gray-50 rounded-full text-gray-400 border border-gray-100">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-gray-300">/ {project.year}</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl lg:text-6xl font-bold tracking-tight text-black group-hover:text-accent transition-colors duration-500">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-lg lg:text-xl font-light leading-relaxed max-w-sm">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group/btn cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center group-hover/btn:bg-accent transition-all duration-500">
                <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover/btn:rotate-45" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-black">View Case Study</span>
            </div>
          </div>

          {/* Image: Right Side with Parallax */}
          <div className="w-full lg:w-1/2 relative overflow-hidden bg-gray-50 min-h-[300px]">
            <motion.div 
              style={{ y }} 
              className="absolute -inset-20"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
              />
            </motion.div>
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-100 lg:opacity-100" />
          </div>

        </div>
      </motion.div>
    </div>
  )
}