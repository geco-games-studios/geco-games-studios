"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Pause, Play } from "lucide-react"
import styles from "./home-slider.module.css"

export default function HomeSlider({ testUrl, discordUrl }: { testUrl?: string; discordUrl: string }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const slides = [
    { title: "Play Inshimu", subtitle: "Open Play test", description: "The tales of all seasons. Multiple gameplay types. Stories to discover.", action: "Play the open test", href: testUrl || "#inshimu", image: "/games/inshimu-one.png", type: "inshimu" },
    { title: "Join our Discord server", subtitle: "Find your community", description: "Meet the team, share your feedback, and help shape our next games.", action: "Join now", href: discordUrl, image: null, type: "discord" },
    { title: "Legends of Alkebulan", subtitle: "A new legend is forming", description: "Explore the world, the characters, and the stories of our next adventure.", action: "Read about Legends of Alkebulan", href: "#legends-of-alkebulan", image: "/legends-of-alkebulan-map.jpeg", type: "legends" },
  ]

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener("change", update)
    return () => preference.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (paused || interacting || reducedMotion) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % 3)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [paused, interacting, reducedMotion, active])

  const move = (direction: number) => setActive((current) => (current + direction + 3) % 3)
  const slide = slides[active]

  return (
    <section className={styles.hero} aria-label="Featured games and community" aria-roledescription="carousel"
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setPaused(true)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault()
          setPaused(true)
          move(event.key === "ArrowLeft" ? -1 : 1)
        }
      }}>
      <div className={`${styles.frame} ${styles[slide.type]}`}>
        <div key={slide.type} className={styles.visual} aria-hidden="true">
          {slide.image ? <Image src={slide.image} alt="" fill priority={active === 0} sizes="100vw" className={styles.artwork} /> : (
            <div className={styles.communityArt}>
              <span className={styles.outlineWord}>GECO<br />GAMES</span>
              <div className={styles.communityMark}>
                <svg viewBox="0 0 127 96" fill="currentColor" aria-hidden="true"><path d="M107 8a105 105 0 0 0-26-8l-3 6a97 97 0 0 0-29 0l-3-6a105 105 0 0 0-26 8C4 31-1 53 1 75a106 106 0 0 0 32 16l7-11-10-5 2-2a76 76 0 0 0 63 0l2 2-10 5 7 11a106 106 0 0 0 32-16c3-25-4-47-19-67ZM43 65c-8 0-14-7-14-16s6-16 14-16 14 7 14 16-6 16-14 16Zm41 0c-8 0-14-7-14-16s6-16 14-16 14 7 14 16-6 16-14 16Z" /></svg>
                <div><span>JOIN OUR</span><strong>DISCORD COMMUNITY</strong></div>
              </div>
            </div>
          )}
          <div className={styles.shade} />
        </div>
        <div className={styles.topline}><span>GECO GAMES STUDIOS</span><span>GAMES. STORIES. COMMUNITY.</span></div>
        <div className={styles.content} aria-live={paused || reducedMotion ? "polite" : "off"} aria-atomic="true">
          <span className={styles.counter}>{String(active + 1).padStart(2, "0")} / 03</span>
          <div key={slide.type} className={styles.copy}>
            <p className={styles.eyebrow}>{slide.subtitle}</p>
            <h1>{slide.title}</h1>
            <p className={styles.description}>{slide.description}</p>
            <Link href={slide.href} className={styles.cta} {...(slide.href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{slide.action}<span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className={styles.controls}>
          <button type="button" aria-label={paused ? "Resume slideshow" : "Pause slideshow"} aria-pressed={paused} onClick={() => setPaused(!paused)} className={styles.pause}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
          <button type="button" aria-label="Previous slide" onClick={() => { setPaused(true); move(-1) }} className={styles.arrow}><svg viewBox="0 0 32 40" aria-hidden="true"><path d="M26 5 6 20l20 15Z" /></svg></button>
          <button type="button" aria-label="Next slide" onClick={() => { setPaused(true); move(1) }} className={styles.arrow}><svg viewBox="0 0 32 40" aria-hidden="true"><path d="m6 5 20 15L6 35Z" /></svg></button>
        </div>
        <div className={styles.dots} aria-label="Choose a slide">{slides.map((item, index) => <button type="button" key={item.type} aria-label={`Show slide ${index + 1}: ${item.title}`} aria-current={active === index ? "true" : undefined} onClick={() => { setPaused(true); setActive(index) }}><span /></button>)}</div>
      </div>
    </section>
  )
}
