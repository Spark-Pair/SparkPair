export function Team() {
  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & Creative Director",
      image: "/professional-asian-woman-minimal-portrait-headshot.jpg",
    },
    {
      name: "Marcus Reid",
      role: "Technical Lead",
      image: "/professional-man-minimal-portrait-headshot.jpg",
    },
    {
      name: "Elena Vasquez",
      role: "Design Director",
      image: "/professional-latina-woman-portrait-headshot.jpg",
    },
    {
      name: "James Okonkwo",
      role: "Strategy Director",
      image: "/professional-african-man-portrait-headshot.jpg",
    },
  ]

  return (
    <section id="about" className="py-32 px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-secondary/50" />
      <div className="absolute inset-0 grain" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">The team</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-6 text-balance">
            Creative minds, driven by impact
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A collective of strategists, designers, and developers united by a passion for crafting meaningful digital
            experiences.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="group relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted mb-4 border-2 border-transparent group-hover:border-accent/30 transition-all duration-300">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
