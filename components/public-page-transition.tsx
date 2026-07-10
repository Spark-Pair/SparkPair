"use client"

import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { SiteLoader } from "@/components/site-loader"

type PublicPageTransitionContextValue = {
  isPageRevealed: boolean
}

const PublicPageTransitionContext = createContext<PublicPageTransitionContextValue>({
  isPageRevealed: true,
})

const minimumVisibleMs = 850
const reducedMinimumVisibleMs = 260
const completeHoldMs = 200
const pageExitMs = 420
const reducedPageExitMs = 80
const loaderExitMs = 650
const reducedLoaderExitMs = 120
const maximumSafetyMs = 3200

function isPublicPath(pathname: string) {
  return !pathname.startsWith("/admin")
}

function getAnchorFromEvent(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) return null
  return target.closest("a[href]")
}

export function usePublicPageTransition() {
  return useContext(PublicPageTransitionContext)
}

export function PublicPageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<"revealed" | "page-exiting" | "loading" | "loader-exiting">("revealed")
  const [progress, setProgress] = useState(0)

  const phaseRef = useRef(phase)
  const readyRef = useRef(false)
  const navigatingRef = useRef(false)
  const initialLoadDoneRef = useRef(false)
  const previousPathnameRef = useRef(pathname)
  const frameRef = useRef(0)
  const holdTimerRef = useRef<number | null>(null)
  const exitTimerRef = useRef<number | null>(null)
  const startedAtRef = useRef(0)

  const publicPath = isPublicPath(pathname)
  const isPageRevealed = !publicPath || phase === "revealed"

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const clearTimers = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current)
      exitTimerRef.current = null
    }
  }, [])

  const finishLoading = useCallback(() => {
    if (phaseRef.current !== "loading") return
    setProgress(100)
    holdTimerRef.current = window.setTimeout(() => {
      phaseRef.current = "loader-exiting"
      setPhase("loader-exiting")
      exitTimerRef.current = window.setTimeout(
        () => {
          phaseRef.current = "revealed"
          setPhase("revealed")
        },
        reduceMotion ? reducedLoaderExitMs : loaderExitMs,
      )
    }, completeHoldMs)
  }, [reduceMotion])

  const runProgress = useCallback(() => {
    const minVisible = reduceMotion ? reducedMinimumVisibleMs : minimumVisibleMs

    const tick = (now: number) => {
      if (phaseRef.current !== "loading") return

      const elapsed = now - startedAtRef.current
      const safetyReady = elapsed >= maximumSafetyMs
      const ready = readyRef.current || safetyReady

      if (ready && elapsed >= minVisible) {
        finishLoading()
        return
      }

      const softCap = ready ? 98 : 94
      const eased = 1 - Math.exp(-elapsed / 520)
      const nextProgress = Math.min(softCap, Math.max(1, Math.round(eased * softCap)))
      setProgress((current) => Math.max(current, nextProgress))
      frameRef.current = window.requestAnimationFrame(tick)
    }

    frameRef.current = window.requestAnimationFrame(tick)
  }, [finishLoading, reduceMotion])

  const startLoading = useCallback(
    (ready: boolean) => {
      clearTimers()
      readyRef.current = ready
      startedAtRef.current = performance.now()
      phaseRef.current = "loading"
      setPhase("loading")
      setProgress(0)
      runProgress()
    },
    [clearTimers, runProgress],
  )

  const beginPublicNavigation = useCallback(
    (href: string) => {
      if (navigatingRef.current) return

      navigatingRef.current = true
      clearTimers()
      readyRef.current = false
      phaseRef.current = "page-exiting"
      setPhase("page-exiting")

      exitTimerRef.current = window.setTimeout(
        () => {
          startLoading(false)
          router.push(href)
        },
        reduceMotion ? reducedPageExitMs : pageExitMs,
      )
    },
    [clearTimers, reduceMotion, router, startLoading],
  )

  useEffect(() => {
    if (!publicPath) {
      clearTimers()
      readyRef.current = true
      navigatingRef.current = false
      phaseRef.current = "revealed"
      setPhase("revealed")
      setProgress(100)
      previousPathnameRef.current = pathname
      return
    }

    if (phaseRef.current === "loading") {
      readyRef.current = true
      navigatingRef.current = false
      previousPathnameRef.current = pathname
      return
    }

    if (!initialLoadDoneRef.current) {
      initialLoadDoneRef.current = true
      previousPathnameRef.current = pathname
      startLoading(true)
      return
    }

    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname
      startLoading(true)
    }
  }, [clearTimers, pathname, publicPath, startLoading])

  useEffect(() => {
    if (!publicPath) return

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const anchor = getAnchorFromEvent(event)
      if (!anchor) return

      const target = anchor.getAttribute("target")
      const href = anchor.getAttribute("href")
      if (
        !href ||
        target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return
      }

      const url = new URL(href, window.location.href)
      if (url.origin !== window.location.origin || !isPublicPath(url.pathname)) return
      if (url.pathname.startsWith("/api/")) return
      if (url.pathname === window.location.pathname && url.hash) return

      if (phaseRef.current === "revealed") {
        event.preventDefault()
        beginPublicNavigation(`${url.pathname}${url.search}${url.hash}`)
      }
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [beginPublicNavigation, publicPath])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  if (!publicPath) {
    return (
      <PublicPageTransitionContext.Provider value={{ isPageRevealed: true }}>
        {children}
      </PublicPageTransitionContext.Provider>
    )
  }

  return (
    <PublicPageTransitionContext.Provider value={{ isPageRevealed }}>
      <AnimatePresence>
        {phase === "loading" || phase === "loader-exiting" ? (
          <SiteLoader progress={progress} isExiting={phase === "loader-exiting"} />
        ) : null}
      </AnimatePresence>
      <motion.div
        initial={false}
        animate={
          isPageRevealed
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : reduceMotion
              ? { opacity: 0 }
              : phase === "page-exiting"
                ? { opacity: 0, y: -8, scale: 0.992, filter: "blur(4px)" }
                : { opacity: 0, y: 12, scale: 0.998, filter: "blur(5px)" }
        }
        transition={{
          duration: reduceMotion ? 0.08 : phase === "page-exiting" ? 0.42 : 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </PublicPageTransitionContext.Provider>
  )
}
