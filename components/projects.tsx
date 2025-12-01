import { ArrowUpRight } from "lucide-react"

export function Projects() {
  const projects = [
    {
      title: "Finova",
      description: "A modern fintech platform with real-time analytics and seamless transaction flows.",
      category: "Web App",
      year: "2024",
      image: "/minimal-fintech-dashboard-dark-mode-clean-interfac.jpg",
    },
    {
      title: "Bloom",
      description: "E-commerce experience for a sustainable fashion brand with immersive product showcases.",
      category: "E-Commerce",
      year: "2024",
      image: "/minimal-ecommerce-fashion-website-clean-modern.jpg",
    },
    {
      title: "Nexus",
      description: "Enterprise SaaS platform serving thousands of teams with intuitive collaboration tools.",
      category: "SaaS",
      year: "2023",
      image: "/minimal-saas-collaboration-platform-interface-clea.jpg",
    },
  ]

  return (
    <section id="work" className="py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <div className="space-y-4">
            <p className="text-sm font-medium text-accent uppercase tracking-widest">Selected work</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight text-balance">
              Projects that
              <br />
              speak for themselves
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors group"
          >
            View all projects
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Projects */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <a key={project.title} href="#" className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-secondary/50 border border-border hover:border-accent/40 transition-all duration-500">
                <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
                  {/* Content */}
                  <div className={`flex flex-col justify-between space-y-8 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-accent uppercase tracking-wider">
                          {project.category}
                        </span>
                        <span className="text-muted-foreground/30">—</span>
                        <span className="text-xs text-muted-foreground">{project.year}</span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-md">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-accent transition-colors">
                      View case study
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Image */}
                  <div
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-muted ${index % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
