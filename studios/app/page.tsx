"use client"

import { useState, useEffect } from "react"
import {
  Sparkles,
  Award,
  Users,
  Mail,
  CheckCircle,
  Star,
  TrendingUp,
  Trophy,
  Play,
  Download,
  Heart,
  Share2,
  Calendar,
  Gift,
  Crown,
  Shield,
  Gamepad2,
  Code,
  Palette,
  Music,
  Video,
  ChevronRight,
  ArrowRight,
  Flame,
  Smartphone,
  Apple,
  Globe,
} from "lucide-react"

export default function HomePage() {
  const [userLevel, setUserLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [likedGames, setLikedGames] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("featured")

  const heroSlides = [
    {
      title: "Epic Gaming Adventures Await",
      subtitle: "Join 150K+ Players Worldwide",
      description: "Experience the most immersive games with stunning graphics and addictive gameplay",
      image: "/creativity/animation-portal.png",
      cta: "Start Playing Now",
      color: "from-[#2eec6e] via-[#007fff] via-[#8b5cf6] to-[#ec4899]",
    },
    {
      title: "Create Your Gaming Legacy",
      subtitle: "Unlock Achievements & Rewards",
      description: "Compete in tournaments, earn exclusive rewards, and become a gaming legend",
      image: "/creativity/animation-portal.png",
      cta: "Join Tournament",
      color: "from-[#f97316] via-[#eab308] via-[#06b6d4] to-[#8b5cf6]",
    },
    {
      title: "Learn Game Development",
      subtitle: "From Beginner to Pro",
      description: "Master game development with our comprehensive courses and expert guidance",
      image: "/creativity/animation-portal.png",
      cta: "Start Learning",
      color: "from-[#ec4899] via-[#8b5cf6] via-[#007fff] to-[#2eec6e]",
    },
  ]

  const games = [
    {
      id: 1,
      title: "Fruit Valley",
      description:
        "Dive into the colorful world of Fruit Valley Adventures, the ultimate match-3 game that's perfect for puzzle lovers!",
      image: "/games/fruit-valley.png",
      downloadUrls: {
        android: "https://play.google.com/store/apps/details?id=com.GECOGamesStudios.FruitValley",
        ios: "#",
        webgl: "#",
      },
      rating: 4.8,
      downloads: "50K+",
      achievements: 25,
      category: "Puzzle",
      isNew: false,
      isTrending: true,
      color: "from-[#2eec6e] to-[#06b6d4]",
    },
    {
      id: 2,
      title: "Block Cat Fill",
      description:
        "Relax your brain solving puzzle with cute cats! Fill the blocks to solve the puzzle and rescue the cats.",
      image: "/games/block-cat-fill.png",
      downloadUrls: {
        android: "https://play.google.com/store/apps/details?id=com.GECOGamesStudios.BlockCatFill",
        ios: "#",
        webgl: "#",
      },
      rating: 4.6,
      downloads: "30K+",
      achievements: 20,
      category: "Puzzle",
      isNew: true,
      isTrending: false,
      color: "from-[#8b5cf6] to-[#ec4899]",
    },
    {
      id: 3,
      title: "Become A Chef",
      description: "In Being A Chef, you'll start from humble beginnings and build a thriving restaurant empire!",
      image: "/games/become-a-chef.png",
      downloadUrls: {
        android: "https://play.google.com/store/apps/details?id=com.GECOGamesLTD.BeingAChef",
        ios: "#",
        webgl: "#",
      },
      rating: 4.7,
      downloads: "75K+",
      achievements: 30,
      category: "Simulation",
      isNew: false,
      isTrending: true,
      color: "from-[#f97316] to-[#eab308]",
    },
    {
      id: 4,
      title: "Atomic Crush",
      description: "Master the art of precision in this addictive physics-based puzzle game with atomic elements!",
      image: "/games/atomic-crush.png",
      downloadUrls: {
        android: "#",
        ios: "#",
        webgl: "#",
      },
      rating: 4.9,
      downloads: "100K+",
      achievements: 45,
      category: "Puzzle",
      isNew: true,
      isTrending: true,
      color: "from-[#8b5cf6] to-[#ec4899]",
    },
    {
      id: 5,
      title: "Our Last Prayer: Arena",
      description: "Epic battle arena game set in beautiful African landscapes with strategic combat!",
      image: "/games/our-last-prayer-arena.png",
      downloadUrls: {
        android: "#",
        ios: "#",
        webgl: "#",
      },
      rating: 4.5,
      downloads: "80K+",
      achievements: 35,
      category: "Action",
      isNew: false,
      isTrending: false,
      color: "from-[#f97316] to-[#ef4444]",
    },
    {
      id: 6,
      title: "Clear Skies 3D",
      description: "Immersive 3D puzzle experience with stunning castle environments and challenging ball physics!",
      image: "/games/clear-skies-3d.png",
      downloadUrls: {
        android: "#",
        ios: "#",
        webgl: "#",
      },
      rating: 4.4,
      downloads: "40K+",
      achievements: 28,
      category: "Puzzle",
      isNew: true,
      isTrending: false,
      color: "from-[#06b6d4] to-[#8b5cf6]",
    },
    {
      id: 7,
      title: "Letter Loop",
      description: "Challenge your vocabulary in this beautiful word puzzle adventure set in exotic locations!",
      image: "/games/letter-loop.png",
      downloadUrls: {
        android: "#",
        ios: "#",
        webgl: "#",
      },
      rating: 4.3,
      downloads: "25K+",
      achievements: 22,
      category: "Word",
      isNew: false,
      isTrending: false,
      color: "from-[#2eec6e] to-[#eab308]",
    },
    {
      id: 8,
      title: "Inshimu Two",
      description: "Join the bee adventure in this colorful platformer with exciting challenges and sweet rewards!",
      image: "/games/inshimu-two.png",
      downloadUrls: {
        android: "#",
        ios: "#",
        webgl: "#",
      },
      rating: 4.6,
      downloads: "35K+",
      achievements: 30,
      category: "Adventure",
      isNew: true,
      isTrending: true,
      color: "from-[#eab308] to-[#f97316]",
    },
    {
      id: 9,
      title: "Jam Boat",
      description: "Navigate through traffic jams in this exciting boat puzzle game with vibrant graphics!",
      image: "/games/jam-boat.png",
      downloadUrls: {
        android: "#",
        ios: "#",
        webgl: "#",
      },
      rating: 4.2,
      downloads: "20K+",
      achievements: 18,
      category: "Puzzle",
      isNew: false,
      isTrending: false,
      color: "from-[#f97316] to-[#ec4899]",
    },
  ]

  const features = [
    {
      icon: Gamepad2,
      title: "9 Amazing Games",
      description: "From puzzle games to epic adventures",
      color: "from-[#2eec6e] to-[#06b6d4]",
    },
    {
      icon: Trophy,
      title: "Global Tournaments",
      description: "Compete with players worldwide",
      color: "from-[#f97316] to-[#eab308]",
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Unlock rewards and show your skills",
      color: "from-[#8b5cf6] to-[#ec4899]",
    },
    {
      icon: Users,
      title: "Active Community",
      description: "Join 150K+ passionate gamers",
      color: "from-[#007fff] to-[#8b5cf6]",
    },
  ]

  const services = [
    {
      icon: Code,
      title: "Game Development",
      description: "Custom game development services",
      price: "From K5,000",
      popular: true,
      color: "from-[#2eec6e] to-[#007fff]",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful and intuitive designs",
      price: "From K2,500",
      popular: false,
      color: "from-[#ec4899] to-[#8b5cf6]",
    },
    {
      icon: Music,
      title: "Audio Production",
      description: "Professional game audio and music",
      price: "From K1,800",
      popular: false,
      color: "from-[#f97316] to-[#eab308]",
    },
    {
      icon: Video,
      title: "Video Production",
      description: "Game trailers and promotional videos",
      price: "From K3,200",
      popular: true,
      color: "from-[#06b6d4] to-[#8b5cf6]",
    },
  ]

  const news = [
    {
      title: "New Tournament Starting Soon!",
      description: "Join our biggest tournament yet with K100,000 prize pool",
      date: "2025-01-20",
      category: "Tournament",
      image: "/games/our-last-prayer-arena.png",
      isHot: true,
      color: "from-[#ef4444] to-[#f97316]",
    },
    {
      title: "Game Development Course Launch",
      description: "Learn to create games from industry experts",
      date: "2025-01-18",
      category: "Education",
      image: "/games/become-a-chef.png",
      isHot: false,
      color: "from-[#8b5cf6] to-[#ec4899]",
    },
    {
      title: "New Game Release: Atomic Crush",
      description: "Our latest puzzle game is now available",
      date: "2025-01-15",
      category: "Release",
      image: "/games/atomic-crush.png",
      isHot: true,
      color: "from-[#06b6d4] to-[#007fff]",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleInteraction = (points: number, achievement?: string) => {
    setExperience((prev) => {
      const newExp = prev + points
      const newLevel = Math.floor(newExp / 100) + 1
      if (newLevel > userLevel) {
        setUserLevel(newLevel)
        if (achievement) {
          setAchievements((prev) => [...prev, achievement])
        }
      }
      return newExp
    })
  }

  const handleLikeGame = (gameId: number) => {
    setLikedGames((prev) => (prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]))
    handleInteraction(5, "Game Lover!")
  }

  const handleDownload = (platform: string, url: string, gameTitle: string) => {
    if (url !== "#") {
      window.open(url, "_blank")
      handleInteraction(10, `Downloaded ${gameTitle} on ${platform}!`)
    }
  }

  const filteredGames =
    activeTab === "featured"
      ? games.slice(0, 3)
      : activeTab === "new"
        ? games.filter((game) => game.isNew)
        : activeTab === "trending"
          ? games.filter((game) => game.isTrending)
          : games

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#2eec6e] rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-[#8b5cf6] rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-[#ec4899] rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-[#f97316] rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/2 w-2 h-2 bg-[#06b6d4] rounded-full animate-pulse"></div>
        <div className="absolute bottom-60 right-1/3 w-3 h-3 bg-[#eab308] rounded-full animate-bounce"></div>
      </div>

      {/* Enhanced User Progress Bar */}
      <div className="fixed top-20 right-4 z-40 colorful-bg-1 backdrop-blur-sm text-white p-4 rounded-xl shadow-2xl border-2 border-purple-400">
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative">
            <Crown className="h-6 w-6 text-yellow-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="text-sm font-bold">Level {userLevel}</span>
            <div className="text-xs text-cyan-200">Gaming Master</div>
          </div>
        </div>
        <div className="w-40 h-3 bg-white/20 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 transition-all duration-500 rounded-full"
            style={{ width: `${experience % 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-cyan-200 flex justify-between">
          <span>{experience % 100}/100 XP</span>
          <span>{achievements.length} achievements</span>
        </div>
      </div>

      {/* Dynamic Hero Section with Carousel */}
      <section className="relative w-full h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.color}`}></div>
            <img
              className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
              <div className="max-w-4xl mx-auto">
                <div className="mb-4 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                  <Flame className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium">{slide.subtitle}</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 floating-animation">{slide.title}</h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">{slide.description}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleInteraction(10, "Hero Explorer!")}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl flex items-center space-x-2 justify-center"
                  >
                    <Play className="h-6 w-6" />
                    <span>{slide.cta}</span>
                  </button>
                  <button className="px-8 py-4 border-2 border-white text-white rounded-2xl text-xl font-bold transition-all duration-300 hover:bg-white hover:text-purple-600 hover:scale-110">
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-yellow-400 scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Character Showcase Section */}
      <section className="py-20 px-8 section-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold gradient-text mb-4">Meet Our Characters</h2>
            <p className="text-xl text-purple-600 dark:text-purple-400">
              Unique personalities that bring our games to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Lotus Character */}
            <div className="group relative">
              <div className="card-bg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-purple-200 dark:border-purple-700">
                <div className="relative">
                  <img
                    src="/characters/lotus.png"
                    alt="Lotus Character"
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    LOTUS
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold gradient-text mb-3">Lotus</h3>
                  <p className="text-purple-600 dark:text-purple-400 mb-4">
                    A mystical warrior with the power to manipulate nature's energy. Her pink magical abilities and
                    stylish appearance make her a fan favorite.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-pink-100 dark:bg-pink-800 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full">
                      Magic
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                      Warrior
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mis Fortune Character */}
            <div className="group relative">
              <div className="card-bg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-purple-200 dark:border-purple-700">
                <div className="relative">
                  <img
                    src="/characters/mis-fortune.png"
                    alt="Mis Fortune Character"
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    MIS FORTUNE
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold gradient-text mb-3">Mis Fortune</h3>
                  <p className="text-purple-600 dark:text-purple-400 mb-4">
                    A brilliant alchemist and potion master with her loyal companion. She brings wisdom and magical
                    expertise to any adventure.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                      Alchemist
                    </span>
                    <span className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                      Wise
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jeonz Character */}
            <div className="group relative">
              <div className="card-bg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-purple-200 dark:border-purple-700">
                <div className="relative">
                  <img
                    src="/characters/jeonz.png"
                    alt="Jeonz Character"
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    JEONZ
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold gradient-text mb-3">Jeonz</h3>
                  <p className="text-purple-600 dark:text-purple-400 mb-4">
                    A mysterious figure with blue flame powers and an urban edge. His unique abilities and cool demeanor
                    make him a formidable ally.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                      Fire
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                      Urban
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-purple-600 dark:text-purple-400 mb-6">
              Each character is carefully crafted with unique personalities, backstories, and abilities that enhance the
              gaming experience.
            </p>
            <button className="colorful-bg-1 hover:opacity-90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto">
              <span>Explore Character Stories</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Games Section with Tabs */}
      <section className="py-20 px-8 section-bg">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold gradient-text mb-4">Epic Game Collection</h2>
            <p className="text-xl text-purple-600 dark:text-purple-400 mb-8">Discover your next gaming obsession</p>

            {/* Game Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { id: "featured", label: "Featured", icon: Star, color: "from-[#2eec6e] to-[#06b6d4]" },
                { id: "new", label: "New Releases", icon: Sparkles, color: "from-[#8b5cf6] to-[#ec4899]" },
                { id: "trending", label: "Trending", icon: TrendingUp, color: "from-[#f97316] to-[#eab308]" },
                { id: "all", label: "All Games", icon: Gamepad2, color: "from-[#007fff] to-[#8b5cf6]" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                      : "bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 hover:scale-105"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game, index) => (
              <div key={game.id} className="relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Enhanced Game Card */}
                <div className="card-bg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-purple-200 dark:border-purple-700">
                  {/* Game Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                    {game.isNew && (
                      <span className="bg-gradient-to-r from-[#2eec6e] to-[#06b6d4] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Sparkles className="h-3 w-3" />
                        <span>NEW</span>
                      </span>
                    )}
                    {game.isTrending && (
                      <span className="bg-gradient-to-r from-[#f97316] to-[#eab308] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Flame className="h-3 w-3" />
                        <span>HOT</span>
                      </span>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLikeGame(game.id)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-purple-800/90 rounded-full hover:scale-110 transition-all duration-300"
                  >
                    <Heart
                      className={`h-5 w-5 ${likedGames.includes(game.id) ? "text-pink-500 fill-current" : "text-purple-600"}`}
                    />
                  </button>

                  {/* Game Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={game.image || "/placeholder.svg"}
                      alt={game.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-purple-500/20 backdrop-blur-sm rounded-full p-4 hover:bg-purple-500/30 transition-colors">
                        <Play className="h-8 w-8 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold gradient-text">{game.title}</h3>
                      <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                        {game.category}
                      </span>
                    </div>
                    <p className="text-purple-600 dark:text-purple-400 mb-4 line-clamp-2">{game.description}</p>

                    {/* Game Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{game.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4 text-green-500" />
                          <span>{game.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4 text-orange-500" />
                          <span>{game.achievements}</span>
                        </div>
                      </div>
                    </div>

                    {/* Platform Download Buttons */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleDownload("Android", game.downloadUrls.android, game.title)}
                          disabled={game.downloadUrls.android === "#"}
                          className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-xs font-medium ${
                            game.downloadUrls.android !== "#"
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Smartphone className="h-3 w-3" />
                          <span>Android</span>
                        </button>
                        <button
                          onClick={() => handleDownload("iOS", game.downloadUrls.ios, game.title)}
                          disabled={game.downloadUrls.ios === "#"}
                          className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-xs font-medium ${
                            game.downloadUrls.ios !== "#"
                              ? "bg-blue-500 hover:bg-blue-600 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Apple className="h-3 w-3" />
                          <span>iOS</span>
                        </button>
                        <button
                          onClick={() => handleDownload("WebGL", game.downloadUrls.webgl, game.title)}
                          disabled={game.downloadUrls.webgl === "#"}
                          className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-xs font-medium ${
                            game.downloadUrls.webgl !== "#"
                              ? "bg-purple-500 hover:bg-purple-600 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Globe className="h-3 w-3" />
                          <span>WebGL</span>
                        </button>
                      </div>

                      <button className="w-full px-4 py-2 border-2 border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2">
                        <Share2 className="h-4 w-4" />
                        <span>Share Game</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="colorful-bg-2 hover:opacity-90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto">
              <span>Explore All Games</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section className="py-20 colorful-bg-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/games/become-a-chef.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-white">Why Choose Geco Games?</h2>
            <p className="text-xl text-cyan-100">Experience gaming like never before</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group hover:scale-110 transition-all duration-500"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 border-cyan-200 dark:border-cyan-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-2xl">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-purple-800 dark:text-purple-200">{feature.title}</h3>
                  <p className="text-purple-600 dark:text-purple-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-8 section-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold gradient-text mb-4">Our Premium Services</h2>
            <p className="text-xl text-purple-600 dark:text-purple-400">Professional solutions for your gaming needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`card-bg rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 relative ${
                  service.popular
                    ? "border-pink-400 ring-4 ring-pink-400/20"
                    : "border-purple-200 dark:border-purple-700"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 gradient-text">{service.title}</h3>
                  <p className="text-purple-600 dark:text-purple-400 mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-orange-500 mb-6">{service.price}</div>
                  <button
                    className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News & Updates */}
      <section className="py-20 px-8 colorful-bg-1">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Latest News & Updates</h2>
            <p className="text-xl text-cyan-100">Stay updated with the gaming world</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <div
                key={article.title}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 group border-2 border-cyan-200 dark:border-cyan-700"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {article.isHot && (
                    <div
                      className={`absolute top-4 left-4 bg-gradient-to-r ${article.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1`}
                    >
                      <Flame className="h-3 w-3" />
                      <span>HOT</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3 text-sm text-purple-500 dark:text-purple-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 gradient-text">{article.title}</h3>
                  <p className="text-purple-600 dark:text-purple-400 mb-4">{article.description}</p>
                  <button className="text-orange-500 font-medium hover:text-orange-600 transition-colors flex items-center space-x-1">
                    <span>Read More</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-20 colorful-bg-2 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/games/clear-skies-3d.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <Gift className="h-5 w-5 text-pink-300" />
                <span className="font-medium">Exclusive Rewards Inside!</span>
              </div>
              <h2 className="text-5xl font-bold mb-4">Level Up Your Inbox!</h2>
              <p className="text-xl opacity-90 mb-8">
                Get exclusive game updates, beta access, tournament invites, and special rewards!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20 max-w-2xl mx-auto">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none text-white placeholder-white/70"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none text-white placeholder-white/70"
                  />
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  {["Game Updates", "Tournaments", "Beta Access", "Exclusive Offers"].map((interest) => (
                    <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{interest}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault()
                    handleInteraction(25, "Newsletter VIP!")
                  }}
                  className="w-full bg-white hover:bg-pink-50 text-purple-600 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Mail className="h-5 w-5" />
                  <span>Subscribe & Get 100 XP!</span>
                  <Sparkles className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span>50K+ Subscribers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-yellow-300" />
                  <span>No Spam Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Notifications */}
      {achievements.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {achievements.slice(-3).map((achievement, index) => (
            <div
              key={index}
              className="colorful-bg-3 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce border-2 border-pink-400"
            >
              <Trophy className="h-6 w-6" />
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm">{achievement}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
