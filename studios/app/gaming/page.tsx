"use client"

import { useState } from "react"
import GameCard from "@/components/game-card"
import AnimatedCounter from "@/components/animated-counter"
import { Gamepad2, Trophy, Users, Star, Search, Grid, List } from "lucide-react"

export default function GamingPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const games = [
    {
      title: "Fruit Valley",
      description:
        "Dive into the colorful world of Fruit Valley Adventures, the ultimate match-3 game that's perfect for puzzle lovers!",
      image: "/games/fruit-valley.png",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.GECOGamesStudios.FruitValley",
      rating: 4.8,
      downloads: "50K+",
      achievements: 25,
      category: "puzzle",
      genre: "Match-3",
      releaseDate: "2023",
    },
    {
      title: "Block Cat Fill",
      description:
        "Relax your brain solving puzzle with cute cats! Fill the blocks to solve the puzzle and rescue the cats.",
      image: "/games/block-cat-fill.png",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.GECOGamesStudios.BlockCatFill",
      rating: 4.6,
      downloads: "30K+",
      achievements: 20,
      category: "puzzle",
      genre: "Logic Puzzle",
      releaseDate: "2023",
    },
    {
      title: "Become A Chef",
      description: "In Being A Chef, you'll start from humble beginnings and build a thriving restaurant empire!",
      image: "/games/become-a-chef.png",
      downloadUrl: "https://play.google.com/store/apps/details?id=com.GECOGamesLTD.BeingAChef",
      rating: 4.7,
      downloads: "75K+",
      achievements: 30,
      category: "simulation",
      genre: "Restaurant Sim",
      releaseDate: "2022",
    },
    {
      title: "Atomic Crush",
      description: "Master the art of precision in this addictive physics-based puzzle game with atomic elements!",
      image: "/games/atomic-crush.png",
      downloadUrl: "#",
      rating: 4.9,
      downloads: "100K+",
      achievements: 45,
      category: "puzzle",
      genre: "Physics Puzzle",
      releaseDate: "2025",
    },
    {
      title: "Our Last Prayer: Arena",
      description: "Epic battle arena game set in beautiful African landscapes with strategic combat!",
      image: "/games/our-last-prayer-arena.png",
      downloadUrl: "#",
      rating: 4.5,
      downloads: "80K+",
      achievements: 35,
      category: "action",
      genre: "Battle Arena",
      releaseDate: "2023",
    },
    {
      title: "Clear Skies 3D",
      description: "Immersive 3D puzzle experience with stunning castle environments and challenging ball physics!",
      image: "/games/clear-skies-3d.png",
      downloadUrl: "#",
      rating: 4.4,
      downloads: "40K+",
      achievements: 28,
      category: "puzzle",
      genre: "3D Puzzle",
      releaseDate: "2025",
    },
    {
      title: "Letter Loop",
      description: "Challenge your vocabulary in this beautiful word puzzle adventure set in exotic locations!",
      image: "/games/letter-loop.png",
      downloadUrl: "#",
      rating: 4.3,
      downloads: "25K+",
      achievements: 22,
      category: "word",
      genre: "Word Puzzle",
      releaseDate: "2025",
    },
    {
      title: "Inshimu Two",
      description: "Join the bee adventure in this colorful platformer with exciting challenges and sweet rewards!",
      image: "/games/inshimu-two.png",
      downloadUrl: "#",
      rating: 4.6,
      downloads: "35K+",
      achievements: 30,
      category: "adventure",
      genre: "Platformer",
      releaseDate: "2025",
    },
    {
      title: "Jam Boat",
      description: "Navigate through traffic jams in this exciting boat puzzle game with vibrant graphics!",
      image: "/games/jam-boat.png",
      downloadUrl: "#",
      rating: 4.2,
      downloads: "20K+",
      achievements: 18,
      category: "puzzle",
      genre: "Logic Puzzle",
      releaseDate: "2025",
    },
  ]

  const categories = [
    { id: "all", name: "All Games", icon: Gamepad2 },
    { id: "puzzle", name: "Puzzle", icon: Trophy },
    { id: "action", name: "Action", icon: Star },
    { id: "simulation", name: "Simulation", icon: Users },
    { id: "adventure", name: "Adventure", icon: Trophy },
    { id: "word", name: "Word Games", icon: Star },
  ]

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === "all" || game.category === selectedCategory
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 py-20 px-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text floating-animation">Gaming Universe</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Explore our collection of <AnimatedCounter end={9} suffix="+" className="font-bold text-yellow-300" />{" "}
              amazing games
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-300 mb-2">
                  <AnimatedCounter end={500} suffix="K+" />
                </div>
                <p className="text-sm opacity-80">Total Downloads</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-green-300 mb-2">
                  <AnimatedCounter end={4.7} suffix="" />
                </div>
                <p className="text-sm opacity-80">Average Rating</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-300 mb-2">
                  <AnimatedCounter end={250} suffix="+" />
                </div>
                <p className="text-sm opacity-80">Achievements</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-300 mb-2">
                  <AnimatedCounter end={9} />
                </div>
                <p className="text-sm opacity-80">Games Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-8 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold gradient-text">
              {selectedCategory === "all" ? "All Games" : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-gray-600">
              {filteredGames.length} game{filteredGames.length !== 1 ? "s" : ""} found
            </span>
          </div>

          <div
            className={`grid gap-8 ${
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
          >
            {filteredGames.map((game, index) => (
              <div key={game.title} className="slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                <GameCard {...game} />
              </div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-16">
              <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No games found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-8 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 gradient-text">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Cyber Quest", genre: "RPG", eta: "Q2 2025" },
              { title: "Ocean Adventure", genre: "Adventure", eta: "Q3 2025" },
              { title: "Sky Racers", genre: "Racing", eta: "Q4 2025" },
            ].map((game, index) => (
              <div
                key={game.title}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                  <Gamepad2 className="h-12 w-12 text-white opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                <p className="text-gray-300 mb-2">{game.genre}</p>
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">{game.eta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
