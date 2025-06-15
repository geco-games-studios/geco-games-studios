"use client"

import { useState } from "react"
import AnimatedCounter from "@/components/animated-counter"
import { Package, Star, Download, Eye, ShoppingCart, Zap, Shield, Rocket, Crown, Gift } from "lucide-react"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const products = [
    {
      id: 1,
      name: "Game Development Kit Pro",
      description: "Complete toolkit for indie game developers with advanced features and templates",
      price: "K2,500",
      originalPrice: "K3,500",
      category: "development",
      rating: 4.9,
      downloads: "5K+",
      features: ["Unity Templates", "Asset Library", "Code Generators", "Documentation"],
      badge: "Best Seller",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "UI/UX Design Suite",
      description: "Professional design tools and components for creating stunning game interfaces",
      price: "K1,800",
      originalPrice: "K2,200",
      category: "design",
      rating: 4.8,
      downloads: "3K+",
      features: ["UI Components", "Icon Library", "Animation Tools", "Prototyping"],
      badge: "Popular",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Sound Effects Library",
      description: "High-quality audio assets for games including music, SFX, and ambient sounds",
      price: "K1,200",
      originalPrice: "K1,500",
      category: "audio",
      rating: 4.7,
      downloads: "8K+",
      features: ["1000+ SFX", "Background Music", "Voice Overs", "Royalty Free"],
      badge: "New",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Analytics Dashboard",
      description: "Advanced analytics and monitoring tools for game performance tracking",
      price: "K900",
      originalPrice: "K1,200",
      category: "analytics",
      rating: 4.6,
      downloads: "2K+",
      features: ["Real-time Data", "Custom Reports", "Player Insights", "Revenue Tracking"],
      badge: "Pro",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "Marketing Automation",
      description: "Comprehensive marketing tools to promote your games and reach more players",
      price: "K1,500",
      originalPrice: "K2,000",
      category: "marketing",
      rating: 4.5,
      downloads: "1.5K+",
      features: ["Social Media Tools", "Email Campaigns", "Ad Management", "Analytics"],
      badge: "Featured",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "Cloud Gaming Platform",
      description: "Deploy and host your games on our high-performance cloud infrastructure",
      price: "K3,000",
      originalPrice: "K4,000",
      category: "hosting",
      rating: 4.9,
      downloads: "500+",
      features: ["Global CDN", "Auto Scaling", "99.9% Uptime", "24/7 Support"],
      badge: "Enterprise",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const categories = [
    { id: "all", name: "All Products", icon: Package },
    { id: "development", name: "Development", icon: Rocket },
    { id: "design", name: "Design", icon: Star },
    { id: "audio", name: "Audio", icon: Zap },
    { id: "analytics", name: "Analytics", icon: Shield },
    { id: "marketing", name: "Marketing", icon: Crown },
    { id: "hosting", name: "Hosting", icon: Gift },
  ]

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Best Seller":
        return "bg-red-500"
      case "Popular":
        return "bg-blue-500"
      case "New":
        return "bg-green-500"
      case "Pro":
        return "bg-purple-500"
      case "Featured":
        return "bg-yellow-500"
      case "Enterprise":
        return "bg-gray-800"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20 px-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text floating-animation">Premium Products</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Professional tools and resources for game developers</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                <AnimatedCounter end={50} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Products Available</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-green-300 mb-2">
                <AnimatedCounter end={20} suffix="K+" />
              </div>
              <p className="text-sm opacity-80">Happy Customers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-300 mb-2">
                <AnimatedCounter end={4.8} suffix="" />
              </div>
              <p className="text-sm opacity-80">Average Rating</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-300 mb-2">
                <AnimatedCounter end={99} suffix="%" />
              </div>
              <p className="text-sm opacity-80">Satisfaction Rate</p>
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
                      ? "bg-purple-500 text-white shadow-lg transform scale-105"
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

      {/* Products Grid */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              {selectedCategory === "all" ? "All Products" : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600 text-lg">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Product Badge */}
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-4 right-4 ${getBadgeColor(product.badge)} text-white px-3 py-1 rounded-full text-xs font-bold`}
                  >
                    {product.badge}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 gradient-text">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {product.features.slice(0, 2).map((feature) => (
                        <span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                      {product.features.length > 2 && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          +{product.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{product.downloads}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-green-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                    </div>
                    <div className="text-sm text-green-600 font-bold">
                      Save{" "}
                      {Math.round(
                        (1 -
                          Number.parseInt(product.price.replace("K", "").replace(",", "")) /
                            Number.parseInt(product.originalPrice.replace("K", "").replace(",", ""))) *
                          100,
                      )}
                      %
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Buy Now</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 px-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all duration-300">
              <Gift className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Bundle Deal</h3>
              <p className="mb-4">Get all development tools for 50% off!</p>
              <button className="bg-white text-orange-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Claim Offer
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all duration-300">
              <Crown className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Premium Membership</h3>
              <p className="mb-4">Access all products with monthly subscription</p>
              <button className="bg-white text-orange-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
