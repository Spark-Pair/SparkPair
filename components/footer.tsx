import { ArrowUpRight } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { label: "Brand & Identity", href: "#" },
      { label: "Web Development", href: "#" },
      { label: "Product Design", href: "#" },
      { label: "Digital Strategy", href: "#" },
    ],
    company: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
    ],
    social: [
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Dribbble", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  }

  return (
    <footer className="border-t border-border bg-accent/95 rounded-t-4xl">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4 space-y-6">
            <a href="#" className="inline-block">
              <img 
                src="/images/spark-pair6.png" 
                alt="SparkPair" 
                className="h-13 w-auto" 
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
            <p className="text-white/55 leading-relaxed max-w-xs">
              Digital solutions that ignite growth. Strategy, design, and development for forward-thinking brands.
            </p>
          </div>

          {/* Services */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="font-semibold text-white/85 mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-black/60 transition-all duration-300 text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white/85 mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-black/60 transition-all duration-300 text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white/85 mb-4 text-sm uppercase tracking-wider">Connect</h3>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-black/60 transition-all duration-300 text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/65 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-white/55">© {currentYear} SparkPair. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-white/55 hover:text-black/60 transition-all duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-white/55 hover:text-black/60 transition-all duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
