"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CharacterTshirtCarouselProps {
  images: string[]
  price: string
}

export default function CharacterTshirtCarousel({ images, price }: CharacterTshirtCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((currentIndex + images.length - 1) % images.length)
  }

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length)
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-100 p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 lg:max-w-xl">
          <span className="inline-flex rounded-full bg-cyan-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
            Featured Drop
          </span>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              GECO Character T-Shirts
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Each tee is ZMW {price} and includes a collectible GECO character design. Browse the full set of styles below.
            </p>
          </div>
          <div className="rounded-3xl bg-white/90 p-5 shadow-sm dark:bg-slate-950/80">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Price</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">ZMW {price}</p>
          </div>
        </div>

        <div className="relative w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="relative aspect-[4/3] w-full bg-slate-200 dark:bg-slate-900">
            <Image
              src={images[currentIndex]}
              alt={`GECO Character T-Shirt design ${currentIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              quality={80}
              priority
              className="object-contain"
            />
          </div>

          <div className="absolute inset-x-0 top-1/2 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-900 dark:text-white dark:ring-0 dark:hover:bg-slate-800"
              aria-label="Previous design"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-slate-900 dark:text-white dark:ring-0 dark:hover:bg-slate-800"
              aria-label="Next design"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-6 gap-3 p-4">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`overflow-hidden rounded-2xl border p-1 transition focus:outline-none ${
                  index === currentIndex
                    ? "border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-900/50"
                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                }`}
                aria-label={`View design ${index + 1}`}
              >
                <div className="relative h-20 w-full">
                  <Image src={src} alt={`Design ${index + 1}`} fill className="object-cover" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
