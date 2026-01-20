"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "./section-header";
import { SectionWatermark } from "./section-watermark";

export function Team() {
  const team = [
    { id: "01", name: "Hasan Raza", role: "Co-Founder & Creative Lead", image: "/hasan.png" },
    { id: "02", name: "Muhammad Hassan", role: "Co-Founder & Technical Lead", image: "/hasan.png" },
  ];  

  return (
    <section id="about" className="py-40 px-6 lg:px-8 relative overflow-hidden bg-[#fcfcfc]">
      
      {/* Stable Watermark - Iska parallax bhi minor rakha hai ya aap SectionWatermark se hata sakte hain */}
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
              className={`relative group ${index % 2 === 1 ? "lg:mt-32" : ""}`}
            >
              {/* Image Frame - Ab ye bilkul stable hai */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-100 border border-gray-100 transform-gpu">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale transition-all duration-[1.2s] ease-[0.22, 1, 0.36, 1] group-hover:grayscale-0 group-hover:scale-105"
                />
                
                {/* Floating Elements */}
                <div className="absolute top-8 left-8 mix-blend-difference z-20">
                  <span className="text-white text-xs font-mono opacity-50 tracking-widest">{member.id}</span>
                </div>

                <div className="absolute bottom-10 right-10 h-16 w-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl z-20 text-black">
                  <span className="text-[10px] font-black uppercase tracking-tighter">Bio</span>
                </div>
              </div>

              {/* Text Info */}
              <div className="mt-10 flex items-start justify-between px-4">
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-black tracking-tighter">{member.name}</h3>
                  <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">{member.role}</p>
                </div>
                <div className="h-[1px] w-12 bg-gray-200 mt-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}