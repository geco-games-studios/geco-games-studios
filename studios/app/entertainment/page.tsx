"use client"

import { useState } from "react"
import AnimatedCounter from "@/components/animated-counter"
import { Play, Film, Music, Headphones, Calendar, Star, Users, Clock, Heart, Share2 } from "lucide-react"

export default function EntertainmentPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [likedItems, setLikedItems] = useState<number[]>([])

  const entertainmentContent = [
    {
      id: 1,
      title: "Behind the Scenes: Fruit Valley Development",
      type: "video",
      category: "documentary",
      duration: "15:32",
      views: "25K",
      likes: 1200,
      description: "Go behind the scenes and see how our hit game Fruit Valley was created from concept to release.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "2025-01-15",
    },
    {
      id: 2,
      title: "Epic Gaming Soundtrack Collection",
      type: "music",
      category: "soundtrack",
      duration: "45:20",
      views: "18K",
      likes: 890,
      description: "A curated collection of our best game soundtracks and ambient music for your listening pleasure.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "2025-01-10",
    },
    {
      id: 3,
      title: "Developer Diary: Creating Block Cat Fill",
      type: "podcast",
      category: "interview",
      duration: "32:15",
      views: "12K",
      likes: 650,
      description: "Our lead developer discusses the challenges and breakthroughs in creating our puzzle game.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "2025-01-08",
    },
    {
      id: 4,
      title: "Geco Games Animation Showcase",
      type: "video",
      category: "showcase",
      duration: "8:45",
      views: "35K",
      likes: 1800,
      description: "Watch stunning animations and cutscenes from our upcoming games in this visual showcase.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "2025-01-05",
    },
    {
      id: 5,
      title: "Community Highlights Reel",
      type: "video",
      category: "community",
      duration: "12:30",
      views: "22K",
      likes: 1100,
      description: "Celebrating our amazing community with player highlights, fan art, and memorable moments.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "2025-01-03",
    },
    {
      id: 6,
      title: "Relaxing Game Music for Focus",
      type: "music",
      category: "ambient",
      duration: "60:00",
      views: "40K",
      likes: 2200,
      description: "Perfect background music for work, study, or relaxation featuring our ambient game tracks.",
      thumbnail: "/placeholder.svg?height=200&width=300",
      date: "2025-01-01",
    },
  ]

  const categories = [
    { id: "all", name: "All Content", icon: Play },
    { id: "documentary", name: "Documentaries", icon: Film },
    { id: "soundtrack", name: "Soundtracks", icon: Music },
    { id: "interview", name: "Interviews", icon: Headphones },
    { id: "showcase", name: "Showcases", icon: Star },
    { id: "community", name: "Community", icon: Users },
    { id: "ambient", name: "Ambient", icon: Heart },
  ]

  const filteredContent =
    selectedCategory === "all"
      ? entertainmentContent
      : entertainmentContent.filter((item) => item.category === selectedCategory)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Film
      case "music":
        return Music
      case "podcast":
        return Headphones
      default:
        return Play
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-500"
      case "music":
        return "bg-green-500"
      case "podcast":
        return "bg-purple-500"
      default:
        return "bg-blue-500"
    }
  }

  const handleLike = (id: number) => {
    setLikedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 py-20 px-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text floating-animation">Entertainment Hub</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover exclusive content, behind-the-scenes footage, and amazing soundtracks
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                <AnimatedCounter end={150} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Videos & Content</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-green-300 mb-2">
                <AnimatedCounter end={500} suffix="K+" />
              </div>
              <p className="text-sm opacity-80">Total Views</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-300 mb-2">
                <AnimatedCounter end={25} suffix="K+" />
              </div>
              <p className="text-sm opacity-80">Subscribers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-300 mb-2">
                <AnimatedCounter end={50} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Hours of Content</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 px-8 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-pink-500 text-white shadow-lg transform scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Featured Content</h2>
            <p className="text-gray-600 text-lg">
              {filteredContent.length} piece{filteredContent.length !== 1 ? "s" : ""} of entertainment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type)
              const isLiked = likedItems.includes(item.id)

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Type Badge */}
                    <div
                      className={`absolute top-4 left-4 ${getTypeColor(item.type)} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1`}
                    >
                      <TypeIcon className="h-3 w-3" />
                      <span className="capitalize">{item.type}</span>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.duration}</span>
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                        <Play className="h-8 w-8 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 gradient-text line-clamp-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{item.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className={`h-4 w-4 ${isLiked ? "text-red-500 fill-current" : ""}`} />
                          <span>{item.likes + (isLiked ? 1 : 0)}</span>
                        </div>
                      </div>
                      <span className="text-xs">{new Date(item.date).toLocaleDateString()}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>Play</span>
                      </button>
                      <button
                        onClick={() => handleLike(item.id)}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                          isLiked ? "bg-red-500 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Content */}
      <section className="py-16 px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Coming Soon</h2>
            <p className="text-xl opacity-90">Exciting new content in the pipeline</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Game Development Masterclass",
                type: "Series",
                date: "January 2025",
                description: "Learn game development from our expert team",
              },
              {
                title: "Live Developer Q&A",
                type: "Live Stream",
                date: "Every Friday",
                description: "Ask questions directly to our development team",
              },
              {
                title: "Original Game Soundtrack Album",
                type: "Music Album",
                date: "February 2025",
                description: "Complete soundtrack collection from all our games",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">{item.type}</span>
                  <div className="flex items-center space-x-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{item.date}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
