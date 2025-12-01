import { Code2, Palette, Lightbulb, Rocket, BarChart3, Headphones } from "lucide-react"

export function Services() {
  const services = [
    {
      icon: Palette,
      title: "Brand & Identity",
      description: "Strategic brand development that captures your essence and resonates with your audience.",
      number: "01",
    },
    {
      icon: Code2,
      title: "Web Development",
      description: "Lightning-fast, accessible websites built with modern technologies and best practices.",
      number: "02",
    },
    {
      icon: Lightbulb,
      title: "Product Design",
      description: "User-centered design that transforms complex problems into elegant solutions.",
      number: "03",
    },
    {
      icon: Rocket,
      title: "Digital Strategy",
      description: "Data-driven strategies that align technology with your business objectives.",
      number: "04",
    },
    {
      icon: BarChart3,
      title: "Growth & SEO",
      description: "Organic growth strategies that increase visibility and drive qualified traffic.",
      number: "05",
    },
    {
      icon: Headphones,
      title: "Ongoing Support",
      description: "Dedicated partnership ensuring your digital presence evolves with your business.",
      number: "06",
    },
  ]

  return (
    <section id="services" className="py-32 px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-secondary/50" />
      <div className="absolute inset-0 grain" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <div className="space-y-4">
            <p className="text-sm font-medium text-accent uppercase tracking-widest">What we do</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight text-balance">
              Services tailored
              <br />
              to your vision
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed lg:text-right">
            From concept to launch and beyond, we provide end-to-end digital solutions that drive real results.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="group bg-background p-8 lg:p-10 hover:bg-card transition-colors duration-300 relative"
              >
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground/40">{service.number}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </div>

                {/* Hover accent line with brand orange */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent group-hover:w-full transition-all duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
