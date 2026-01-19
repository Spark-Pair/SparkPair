"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  italicTitle: string;
  description: string;
}

export function SectionHeader({ label, title, italicTitle, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-28">
      <motion.div
        initial={{ opacity: 0, filter: "blur(20px)", y: 40 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-3xl"
      >
        <p className="text-xs font-bold text-accent uppercase tracking-[0.4em] mb-6">
          {label}
        </p>
        <h2 className="text-6xl lg:text-7xl font-bold text-black leading-[0.85] tracking-tighter">
          {title} <br />
          <span className="text-accent opacity-50 italic font-serif font-light">
            {italicTitle}
          </span>
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-gray-500 max-w-sm text-md font-light leading-relaxed border-l border-gray-300 pl-6 py-2"
      >
        {description}
      </motion.p>
    </div>
  );
}