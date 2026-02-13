"use client";

import { useRef, useState, useEffect } from "react"
import { ArrowUpRight, X } from "lucide-react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import Lenis from "lenis"
import { SectionHeader } from "./section-header";
import { SectionWatermark } from "./section-watermark";
import { projects } from "../projects"

export function Projects() {
  const containerRef = useRef(null)
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <>
      <section ref={containerRef} id="work" className="py-40 px-6 lg:px-8 relative overflow-hidden bg-[#fcfcfc]">
        <SectionWatermark text="PORTFOLIO" />
        
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
              key={project.id} 
              project={project} 
              index={index} 
              total={projects.length}
              onOpenCaseStudy={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {selectedProject && (
          <CaseStudyModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </>
  )
}

function ProjectCard({ project, index, total, onOpenCaseStudy }) {
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
                {project.technologies[0]}
              </span>
              <span className="text-lg font-semibold text-gray-600">2024</span>
            </div>
          </div>
          
          {project.link !== "#" && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-300/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-gray-600">Live</span>
            </div>
          )}
        </motion.div>

        <motion.a
          href={project.link !== "#" ? project.link : undefined}
          target={project.link !== "#" ? "_blank" : undefined}
          rel={project.link !== "#" ? "noopener noreferrer" : undefined}
          className="relative block group cursor-pointer"
          whileHover="hover"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          viewport={{ once: true, margin: "-200px" }}
        >
          <div className="relative w-full aspect-[16/9] lg:aspect-[18/9]">
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
              </motion.div>
            </div>

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
                  <motion.div 
                    className="relative bg-gradient-to-br from-black via-gray-900 to-black px-8 py-3 rounded-2xl shadow-[0_0px_15px_rgba(0,0,0,0.2)] overflow-hidden"
                    variants={{
                      hover: { scale: 1.02 }
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      initial={{ skewX: -20, opacity: 0 }}
                      whileInView={{ skewX: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="relative text-lg sm:text-xl md:text-7xl font-medium overflow-hidden inline-block"
                    >
                      <motion.span 
                        className="inline-block text-white"
                        variants={{
                          hover: { y: '-100%' }
                        }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                      >
                        {project.title}
                      </motion.span>
                      
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-20 lg:mt-16 px-1">
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
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onOpenCaseStudy()
              }}
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

function CaseStudyModal({ project, onClose }) {
  const modalContentRef = useRef<HTMLDivElement>(null)
  const modalLenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const mainLenis = (window as any).lenis
    
    // Stop main page Lenis
    if (mainLenis) {
      mainLenis.stop()
    }

    // Create new Lenis instance for modal only
    if (modalContentRef.current) {
      const modalLenis = new Lenis({
        wrapper: modalContentRef.current,
        content: modalContentRef.current.firstElementChild as HTMLElement,
        duration: 1.8,
        lerp: 0.3,
        smoothWheel: true,
        wheelMultiplier: 1,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
      })

      modalLenisRef.current = modalLenis

      function raf(time: number) {
        modalLenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }

    return () => {
      // Destroy modal Lenis
      if (modalLenisRef.current) {
        modalLenisRef.current.destroy()
        modalLenisRef.current = null
      }
      
      // Restart main page Lenis
      if (mainLenis) {
        mainLenis.start()
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99999] flex flex-col bg-black/95 backdrop-blur-xl"
    >
      {/* Close Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={onClose}
        className="fixed top-8 right-8 z-[100000] h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
      >
        <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      {/* Modal Scroll Container - No scrollbar, uses Lenis */}
      <div 
        ref={modalContentRef}
        className="flex-1 overflow-hidden relative"
      >
        <div className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <motion.span 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-accent text-sm font-bold tracking-[0.3em] uppercase mb-4 block"
              >
                Case Study
              </motion.span>
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-6xl lg:text-8xl font-black text-white mb-6 leading-none"
              >
                {project.title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl lg:text-2xl text-gray-300 max-w-3xl font-light leading-relaxed"
              >
                {project.caseStudyDetail}
              </motion.p>
            </motion.div>

            {/* Video Section */}
            {project.video && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mb-20 rounded-3xl overflow-hidden shadow-2xl"
              >
                <video
                  src={project.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                />
              </motion.div>
            )}

            {/* Main Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mb-20 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto"
              />
            </motion.div>

            {/* Tech Stack & Deliverables Grid */}
            <div className="grid lg:grid-cols-2 gap-12 mb-20">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Technology Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + idx * 0.1 }}
                      className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white font-medium hover:bg-white/10 transition-colors duration-300"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Key Deliverables</h3>
                <ul className="space-y-3">
                  {project.deliverables.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1 + idx * 0.1 }}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-lg">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Screenshots Gallery */}
            {project.screenshots && project.screenshots.length > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <h3 className="text-4xl font-bold text-white mb-10 tracking-tight">Visual Showcase</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {project.screenshots.map((screenshot, idx) => (
                    <motion.div
                      key={screenshot.id}
                      initial={{ scale: 0.8, opacity: 0, y: 30 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.3 + idx * 0.15 }}
                      className="group relative rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-900">
                        <img
                          src={screenshot.url}
                          alt={screenshot.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                      >
                        <h4 className="text-white font-bold text-lg">{screenshot.title}</h4>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA */}
            {project.link !== "#" && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mt-20 text-center pb-20"
              >
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-accent hover:text-white transition-all duration-500 shadow-xl hover:shadow-2xl group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Visit Live Project</span>
                  <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
                </motion.a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}