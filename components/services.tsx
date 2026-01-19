"use client";

import { motion } from "framer-motion";
import { Code2, Headphones, ShoppingCart, Layers, Cpu, Settings, ArrowUpRight } from "lucide-react";

export function Services() {
  const services = [
    { icon: Code2, title: "Web & Mobile Apps", description: "Lightning-fast apps and websites, built for performance, simplicity, and seamless user experience.", number: "01" },
    { icon: ShoppingCart, title: "eCommerce Solutions", description: "Create online stores that are simple to manage, fully integrated, and ready for a global audience.", number: "02" },
    { icon: Layers, title: "ERP / CRM / HRM", description: "Streamline operations with tailor-made systems that boost productivity and clarity.", number: "03" },
    { icon: Cpu, title: "POS & Hardware Integration", description: "Connect your devices, from printers to scanners, for effortless business operations.", number: "04" },
    { icon: Settings, title: "Automation", description: "Automate workflows, optimize processes, and make smarter, data-driven decisions.", number: "05" },
    { icon: Headphones, title: "Support & Maintenance", description: "Reliable, ongoing support to keep your digital presence evolving with your business.", number: "06" },
  ];

  return (
    <section id="services" className="py-32 px-6 lg:px-8 relative bg-[#fcfcfc] overflow-hidden">
      {/* Texture & Depth */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none grain" />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header - High-End Focus Reveal */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-28">
          <motion.div
            initial={{ opacity: 0, filter: "blur(20px)", y: 40 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-bold text-accent uppercase tracking-[0.4em] mb-6">Capabilities</p>
            <h2 className="text-6xl lg:text-7xl font-bold text-black leading-[0.85] tracking-tighter">
              Services tailored <br /> 
              <span className="text-gray-300/78 italic font-serif font-light">to your vision</span>
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-gray-400 max-w-sm text-md font-light leading-relaxed border-l border-gray-200 pl-6 py-2"
          >
            We bridge the gap between complex technology and intuitive design to scale your brand.
          </motion.p>
        </div>

        {/* Services Grid - Magnetic Wave Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 lg:gap-x-16 lg:gap-y-24">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 1.2, 
                  delay: i * 0.1, 
                  ease: [0.19, 1, 0.22, 1] // Apple-style smooth finish
                }}
                className="group relative flex flex-col h-full cursor-pointer"
              >
                {/* 1. Ultra-Thin Animated Line - Minimalist & Sharp */}
                <div className="relative w-full h-[1px] bg-gray-100 mb-10 overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-accent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-[0.19, 1, 0.22, 1]" 
                  />
                </div>

                <div className="flex-grow space-y-8">
                  <div className="flex justify-between items-start">
                    {/* 2. Soft Icon Reveal - No heavy rotations */}
                    <div className="relative">
                      <div className="relative z-10 h-10 w-10 flex items-center justify-center text-gray-900 group-hover:text-accent transition-colors duration-500">
                        <Icon className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      {/* Subtle background bloom */}
                      <div className="absolute inset-0 bg-accent/5 scale-0 group-hover:scale-[2.5] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl" />
                    </div>
                    
                    <span className="text-[10px] font-mono tracking-widest text-gray-300 group-hover:text-accent transition-colors duration-500">
                      {service.number}
                    </span>
                  </div>

                  {/* 3. Balanced Typography */}
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
                  <motion.div 
                    className="flex flex-col transition-transform duration-500 ease-[0.19, 1, 0.22, 1] group-hover:-translate-y-5"
                  >
                    <div className="h-5 flex items-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Discovery Phase</span>
                    </div>
                    <div className="h-5 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">View Expertise</span>
                      <ArrowUpRight className="w-3 h-3 text-accent" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}