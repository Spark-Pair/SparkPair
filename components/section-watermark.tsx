interface SectionWatermarkProps {
  text: string;
}

export function SectionWatermark({ text }: SectionWatermarkProps) {
  return (
    <div className="absolute top-20 right-0 opacity-[0.05] select-none pointer-events-none whitespace-nowrap z-0">
      <h2 className="text-[20vw] font-black leading-none uppercase tracking-tighter translate-x-6">
        {text}
      </h2>
    </div>
  );
}
