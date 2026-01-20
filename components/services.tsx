"use client";

import { motion } from "framer-motion";
import { Code2, Headphones, ShoppingCart, Layers, Cpu, Settings, ArrowUpRight } from "lucide-react";
import { SectionWatermark } from "./section-watermark";
import { SectionHeader } from "./section-header";
import { Viewport } from "@radix-ui/react-toast";
import { once } from "events";

export function Services() {
  const services = [
    { icon: Code2, title: "Web & Mobile Apps", description: "Lightning-fast apps and websites, built for performance, simplicity, and seamless user experience.", number: "01" },
    { icon: ShoppingCart, title: "eCommerce Solutions", description: "Create online stores that are simple to manage, fully integrated, and ready for a global audience.", number: "02" },
    { icon: Layers, title: "ERP / CRM / HRM", description: "Streamline operations with tailor-made systems that boost productivity and clarity.", number: "03" },
    { icon: Cpu, title: "POS & Hardware Integration", description: "Connect your devices, from printers to scanners, for effortless business operations.", number: "04" },
    { icon: Settings, title: "Automation", description: "Automate workflows, optimize processes, and make smarter, data-driven decisions.", number: "05" },
    { icon: Headphones, title: "Support & Maintenance", description: "Reliable, ongoing support to keep your digital presence evolving with your business.", number: "06" },
  ];

  // Container variants for the grid to stagger its children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Har card 0.15s ke gap se aayega
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      filter: "blur(15px)", 
      y: 15, 
      skewX: -20, // Skew thoda kam kiya taake natural lage
      scale: 0.80 
    },
    show: { 
      opacity: 1, 
      filter: "blur(0px)", 
      y: 0, 
      skewX: 0, 
      scale: 1,
      transition: { 
        duration: 1.5, 
        ease: [0.19, 1, 0.22, 1] 
      }
    }
  };

  return (
    <section id="services" className="py-40 px-6 lg:px-8 relative overflow-hidden bg-[#fcfcfc]">
      {/* Background Studio Detail */}
      <SectionWatermark text="EXPERTISE" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header remains the same */}
        <SectionHeader 
          label="Capabilities"
          title="Services tailored"
          italicTitle="to your vision"
          description="We bridge the gap between complex technology and intuitive design to scale your brand."
        />

        {/* Updated Grid with Staggered Motion */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 lg:gap-x-16 lg:gap-y-24"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group relative flex flex-col h-full cursor-pointer"
              >
                {/* 1. Ultra-Thin Line */}
                <div className="relative w-full h-[1px] bg-gray-100 mb-10 overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-accent translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 ease-[0.19, 1, 0.22, 1]" 
                  />
                </div>

                <div className="flex-grow space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="relative">
                      <div className="relative z-10 h-10 w-10 flex items-center justify-center text-gray-900 group-hover:text-accent transition-colors duration-500">
                        <Icon className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <div className="absolute inset-0 bg-accent/5 scale-0 group-hover:scale-[2.5] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl" />
                    </div>
                    
                    <span className="text-[10px] font-mono tracking-widest text-gray-300 group-hover:text-accent transition-colors duration-500">
                      {service.number}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold tracking-tight text-gray-900 leading-none">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed font-light text-sm lg:text-[15px] max-w-[90%]">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* 4. Elegant Text-Slide Interaction */}
                <div className="mt-10 overflow-hidden h-5 relative">
                  <div className="flex flex-col transition-transform duration-500 ease-[0.19, 1, 0.22, 1] group-hover:-translate-y-5">
                    <div className="h-5 flex items-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Discovery Phase</span>
                    </div>
                    <div className="h-5 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">View Expertise</span>
                      <ArrowUpRight className="w-3 h-3 text-accent" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}