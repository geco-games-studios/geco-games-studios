"use client"

import { useState } from "react"
import { Download, Eye, Star, Users, Trophy, Smartphone, Apple } from "lucide-react"

interface GameCardProps {
  title: string
  description: string
  image: string
  downloadUrl: string
  previewUrl?: string
  rating?: number
  downloads?: string
  achievements?: number
}

export default function GameCard({
  title,
  description,
  image,
  downloadUrl,
  previewUrl,
  rating = 4.5,
  downloads = "10K+",
  achievements = 15,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)

  const handleDownload = (platform: string) => {
    setDownloadCount((prev) => prev + 1)
    if (platform === "android") {
      window.open(downloadUrl, "_blank")
    } else if (platform === "ios") {
      window.open("#", "_blank") // Replace with actual iOS link
    } else if (platform === "huawei") {
      window.open("#", "_blank") // Replace with actual Huawei link
    }
  }

  return (
    <div
      className="game-card card-bg rounded-lg shadow-2xl overflow-hidden relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Achievement Badge */}
      <div className="absolute top-4 right-4 z-10 achievement-badge bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
        <Trophy className="h-3 w-3" />
        <span>{achievements}</span>
      </div>

      {/* Game Image */}
      <div className="relative overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className={`w-full h-48 object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        {/* Overlay on hover */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-white text-center">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm">{rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">{downloads}</span>
              </div>
            </div>
            <p className="text-xs opacity-80">Click to explore!</p>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-800 dark:to-blue-700">
        <h3 className="text-2xl font-bold mb-2 gradient-text">{title}</h3>
        <p className="text-purple-600 dark:text-purple-400 mb-4 line-clamp-3">{description}</p>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 text-sm text-purple-500 dark:text-purple-400">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>{downloads}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{achievements}</span>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDownload("android")}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 hover:scale-105 text-xs"
            >
              <Smartphone className="h-3 w-3" />
              <span>Android</span>
            </button>
            <button
              onClick={() => handleDownload("ios")}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105 text-xs"
            >
              <Apple className="h-3 w-3" />
              <span>iOS</span>
            </button>
            <button
              onClick={() => handleDownload("huawei")}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 hover:scale-105 text-xs"
            >
              <Smartphone className="h-3 w-3" />
              <span>Huawei</span>
            </button>
          </div>

          {previewUrl && (
            <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
          )}
        </div>

        {downloadCount > 0 && (
          <div className="mt-3 text-center">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              +{downloadCount} downloads from you!
            </span>
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div
        className={`absolute inset-0 border-2 border-transparent transition-all duration-300 rounded-lg ${
          isHovered ? "border-purple-400 shadow-lg shadow-purple-400/25" : ""
        }`}
      ></div>
    </div>
  )
}
