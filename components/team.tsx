"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Linkedin, Twitter, Mail, User2, User, UserRound } from "lucide-react";
import { SectionHeader } from "./section-header";
import { SectionWatermark } from "./section-watermark";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: {
    intro: string;
    expertise: string[];
    achievements: string[];
    passion: string;
  };
  socials?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export function Team() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [scrolled, setScrolled] = useState(false);

  // Lock Lenis scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      // Stop Lenis smooth scroll
      document.documentElement.classList.add('modal-open');
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      // Resume Lenis smooth scroll
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [selectedMember]);

  const team: TeamMember[] = [
    {
      id: "01",
      name: "Hasan Raza",
      role: "Co-Founder & Creative Lead",
      image: "/hasan.png",
      bio: {
        intro: "A visionary creative strategist with over 8 years of experience in brand identity and digital design. Hasan believes that great design isn't just about aesthetics—it's about solving real problems and creating emotional connections that resonate with people.",
        expertise: [
          "Brand Strategy & Identity Design",
          "UI/UX Design & Product Thinking",
          "Creative Direction & Art Direction",
          "Design Systems & Visual Language",
          "Motion Design & Animation"
        ],
        achievements: [
          "Led creative campaigns for 50+ international brands across tech, fashion, and lifestyle",
          "Won multiple design awards including Red Dot, Awwwards, and CSS Design Awards",
          "Featured speaker at design conferences across Europe and Asia",
          "Mentored 100+ designers through workshops and programs",
          "Built design systems used by teams of 50+ designers"
        ],
        passion: "When not pushing pixels, Hasan explores architectural photography, studies the intersection of art and technology, and researches how human psychology influences design decisions. He's also an avid traveler who draws inspiration from different cultures and urban landscapes."
      },
      socials: {
        linkedin: "https://linkedin.com/in/hasanraza",
        twitter: "https://twitter.com/hasanraza",
        email: "hasan@company.com"
      }
    },
    {
      id: "02",
      name: "Muhammad Hassan",
      role: "Co-Founder & Technical Lead",
      image: "/hasan.png",
      bio: {
        intro: "A pragmatic engineer and system architect who transforms complex business requirements into scalable, maintainable solutions. Hassan's philosophy: write code that your future self will thank you for, and build systems that can evolve with your business.",
        expertise: [
          "Full-Stack Development (React, Next.js, Laravel, Node.js)",
          "System Architecture & Database Design",
          "API Design & Microservices Architecture",
          "DevOps & Cloud Infrastructure (AWS, Docker, Kubernetes)",
          "Performance Optimization & Scalability"
        ],
        achievements: [
          "Built and scaled platforms serving 1M+ daily active users",
          "Architected enterprise-grade SaaS applications for Fortune 500 companies",
          "Open-source contributor with 2K+ GitHub stars across multiple projects",
          "Technical advisor for 10+ startups in fintech and e-commerce",
          "Reduced infrastructure costs by 60% through optimization and smart architecture"
        ],
        passion: "Outside of code, Hassan dives deep into AI and machine learning research, contributes to open-source projects, and writes extensively about engineering philosophy and best practices. He's also passionate about mentoring junior developers and believes in giving back to the tech community."
      },
      socials: {
        linkedin: "https://linkedin.com/in/muhammadhassan",
        twitter: "https://twitter.com/muhammadhassan",
        email: "hassan@company.com"
      }
    },
  ];

  return (
    <>
      <section id="about" className="py-40 px-6 lg:px-8 relative overflow-hidden bg-[#fcfcfc]">
        <SectionWatermark text="Collective" />

        <div className="relative max-w-6xl mx-auto z-10">
          <SectionHeader
            label="The People Behind"
            title="Creative minds,"
            italicTitle="driven by impact"
            description="A collective of strategists and developers united by a passion for crafting meaningful digital experiences."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: -50, filter: "blur(15px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-300px" }}
                transition={{ delay: index * 0.1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className={`relative group ${index % 2 === 1 ? "lg:translate-y-32" : ""}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale transition-all duration-[0.9s] group-hover:grayscale-0 group-hover:scale-105"
                  />

                  <div className="absolute top-8 left-8 z-20">
                    <span className="text-white text-md font-mono opacity-50 tracking-widest">
                      {member.id}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedMember(member)}
                    className="absolute bottom-10 right-10 h-16 w-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl z-20 text-black cursor-pointer hover:scale-110 active:scale-95"
                    aria-label={`View ${member.name}'s bio`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tighter">Bio</span>
                  </button>
                </div>

                <div className="mt-7 flex items-center justify-between px-4 group-hover:px-6 transition-all duration-500">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-black tracking-tighter">{member.name}</h3>
                    <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">
                      {member.role}
                    </p>
                  </div>
                  <div className="h-[1px] w-12 bg-gray-300 group-hover:bg-accent group-hover:w-16 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto"
            data-lenis-prevent
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedMember(null)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl my-8 bg-white rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 z-30 h-12 w-12 bg-white/95 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm border border-gray-200 hover:scale-95 hover:opacity-75 cursor-pointer group"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 group-hover:rotate-90 transition-all duration-300" />
              </button>

              {/* Scrollable Content */}
              <div
                className="max-h-[calc(100vh-4rem)] overflow-y-auto p-0.5"
                onScroll={(e) => {
                  const target = e.target as HTMLElement
                  if (target.scrollTop > 0) {
                    setScrolled(true);
                  } else {
                    setScrolled(false);
                  }
                }}
              >
                {/* Header Section */}
                <div className={`${scrolled ? "h-65" : "h-85"} overflow-hidden rounded-3xl bg-foreground text-background group sticky top-0 transition-all duration-300`}>
                  {/* Subtle grid pattern background */}
                  <div className="absolute inset-0 opacity-[0.03]">
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), 
                                          linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                      }}
                    />
                  </div>

                  {/* Accent Glow sutil */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/13 via-transparent to-transparent pointer-events-none" />

                  {/* --- EL AVATAR FADED / CUT-OFF --- */}
                  <div className="absolute -bottom-37 -right-14 h-100 opacity-14 pointer-events-none">
                    <img 
                      src="/images/spark-pair.png" 
                      alt="Spark Pair Decor" 
                      className="w-full h-full object-contain brightness-100"
                    />
                  </div>

                  {/* Contenido Principal */}
                  <div className="absolute bottom-8 left-8 right-8 z-10">
                    <span className="text-white/40 text-xs font-mono tracking-[0.4em] block mb-3 uppercase">
                      Member // {selectedMember.id}
                    </span>

                    <div className="mb-4">
                      <h2 className="group/name cursor-default inline-block">
                        <div className="text-4xl md:text-5xl font-bold relative overflow-hidden leading-none flex flex-col h-12">
                          {/* Nombre normal */}
                          <motion.span className="transition-transform duration-500 cubic-bezier(0.76, 0, 0.24, 1) group-hover/name:-translate-y-[120%]">
                            {selectedMember.name}
                          </motion.span>
                          {/* Nombre con estilo (Hover) */}
                          <span className="transition-transform duration-500 cubic-bezier(0.76, 0, 0.24, 1) group-hover/name:-translate-y-[100%] text-accent italic font-serif text-nowrap">
                            {selectedMember.name}
                          </span>
                        </div>
                      </h2>
                      <p className="text-white/60 text-sm font-light uppercase tracking-wider mt-2">
                        {selectedMember.role}
                      </p>
                    </div>

                    {/* Social Links - FILLED & CLEAN */}
                    {selectedMember.socials && (
                      <div className="flex gap-3.5 mt-6">
                        {Object.entries(selectedMember.socials).map(([platform, url]) => {
                          const Icon = platform === 'linkedin' ? Linkedin : platform === 'twitter' ? Twitter : Mail;
                          return (
                            <a
                              key={platform}
                              href={platform === 'email' ? `mailto:${url}` : url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-accent/15 text-accent-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(var(--accent),0.4)]"
                              aria-label={platform}
                            >
                              <Icon className="w-4 h-4 text-accent/90" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Borde inferior decorativo */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Content Section */}
                <div className="px-8 py-12 lg:px-12 lg:py-16 space-y-10">
                  {/* Intro */}
                  <div>
                    <p className="text-xl text-gray-700 leading-relaxed font-light">
                      {selectedMember.bio.intro}
                    </p>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Expertise */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6 flex items-center gap-3">
                      <span className="h-px w-8 bg-accent" />
                      Expertise
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedMember.bio.expertise.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3 group"
                        >
                          <span className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          </span>
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Achievements */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6 flex items-center gap-3">
                      <span className="h-px w-8 bg-accent" />
                      Key Achievements
                    </h3>
                    <div className="space-y-4">
                      {selectedMember.bio.achievements.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-4 group"
                        >
                          <span className="text-accent font-mono text-xs mt-1 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                  {/* Passion */}
                  <div className="bg-gray-100/75 rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4 flex items-center gap-3">
                      <span className="h-px w-8 bg-accent" />
                      Beyond Work
                    </h3>
                    <p className="text-gray-600 leading-relaxed italic">
                      {selectedMember.bio.passion}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}