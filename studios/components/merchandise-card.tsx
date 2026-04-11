"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, MapPin, Star } from "lucide-react"

interface MerchandiseCardProps {
  title: string
  category: string
  price: string
  description: string
  image: string
  rating: number
}

export default function MerchandiseCard({
  title,
  category,
  price,
  description,
  image,
  rating,
}: MerchandiseCardProps) {
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    // Payment/checkout functionality for Zambian market
    alert(`Initiating purchase for ${title}...`)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : i < rating
                  ? "fill-amber-200 text-amber-400"
                  : "text-slate-300 dark:text-slate-600"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800 overflow-hidden">
      {/* Image Container */}
      <div className="relative mb-6 rounded-xl bg-slate-100 dark:bg-slate-700 aspect-square flex items-center justify-center overflow-hidden">
        <div className="w-full h-full relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Location Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900 dark:text-amber-200 items-center gap-1">
            <MapPin className="h-3 w-3" />
            Zambia
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
          {category}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* Rating */}
        <div className="mt-4">
          {renderStars(rating)}
        </div>

        {/* Price and Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="mb-4">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {price}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                isAdded
                  ? "bg-green-500 text-white"
                  : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 dark:bg-cyan-900 dark:text-cyan-100 dark:hover:bg-cyan-800"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {isAdded ? "Added!" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
