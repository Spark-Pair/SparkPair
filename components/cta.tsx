"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ArrowUpRight, Check } from "lucide-react"

export function CTA() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
    }, 3000)
  }

  return (
    <section id="contact" className="py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-12 lg:p-20">
          {/* Background decorations with brand orange */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-balance">
                Ready to start
                <br />
                something great?
              </h2>
              <p className="text-background/70 text-lg leading-relaxed max-w-md">
                Let's discuss your next project. We'd love to hear about your ideas and explore how we can help bring
                them to life.
              </p>
            </div>

            {/* Right Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-14 px-6 rounded-full bg-background/10 border-background/20 text-background placeholder:text-background/50 focus-visible:ring-accent"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 px-8 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 group"
                    disabled={isSubmitted}
                  >
                    {isSubmitted ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Sent!
                      </>
                    ) : (
                      <>
                        Get in touch
                        <ArrowUpRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
              <p className="text-sm text-background/50">
                Or email us directly at{" "}
                <a
                  href="mailto:hello@sparkpair.com"
                  className="text-background/80 hover:text-accent underline underline-offset-4 transition-colors"
                >
                  hello@sparkpair.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
