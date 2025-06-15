"use client"

import type React from "react"

import { useState } from "react"
import AnimatedCounter from "@/components/animated-counter"
import { Mail, Bell, Star, Users, Calendar, Gift, Zap, Trophy, CheckCircle, Send, Eye, ArrowRight } from "lucide-react"

export default function NewslettersPage() {
  const [email, setEmail] = useState("")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [subscribed, setSubscribed] = useState(false)
  const [subscribedNewsletters, setSubscribedNewsletters] = useState<number[]>([])

  const newsletters = [
    {
      id: 1,
      title: "Game Dev Weekly",
      description: "Latest updates on game development, new releases, and industry insights",
      subscribers: "25K+",
      frequency: "Weekly",
      topics: ["Development", "Releases", "Industry News"],
      color: "from-blue-500 to-purple-500",
      icon: Zap,
      latestIssue: {
        title: "Unity 2025 Updates & Mobile Gaming Trends",
        date: "December 15, 2025",
        preview:
          "This week we dive into Unity's latest features, explore mobile gaming trends, and showcase indie developer success stories...",
        readTime: "5 min read",
      },
    },
    {
      id: 2,
      title: "Player Spotlight",
      description: "Community highlights, player achievements, and exclusive interviews",
      subscribers: "18K+",
      frequency: "Bi-weekly",
      topics: ["Community", "Achievements", "Interviews"],
      color: "from-green-500 to-teal-500",
      icon: Trophy,
      latestIssue: {
        title: "Meet Sarah Chen: Puzzle Game Champion",
        date: "December 10, 2025",
        preview:
          "Meet Sarah Chen, our top player who achieved 100% completion in all our puzzle games. Learn about her strategies and gaming journey...",
        readTime: "3 min read",
      },
    },
    {
      id: 3,
      title: "Tech Insider",
      description: "Deep dives into game technology, tutorials, and development tips",
      subscribers: "12K+",
      frequency: "Monthly",
      topics: ["Technology", "Tutorials", "Tips"],
      color: "from-purple-500 to-pink-500",
      icon: Star,
      latestIssue: {
        title: "Procedural Generation in Modern Games",
        date: "December 1, 2025",
        preview:
          "Deep dive into procedural generation techniques and how we use them in our games. Includes code examples and best practices...",
        readTime: "8 min read",
      },
    },
    {
      id: 4,
      title: "Event Updates",
      description: "Gaming events, tournaments, competitions, and special announcements",
      subscribers: "30K+",
      frequency: "As needed",
      topics: ["Events", "Tournaments", "Announcements"],
      color: "from-orange-500 to-red-500",
      icon: Calendar,
      latestIssue: {
        title: "Winter Tournament Series Announcement",
        date: "November 28, 2025",
        preview:
          "Get ready for our biggest tournament series yet! K500,000 prize pool, multiple games, and exclusive rewards for participants...",
        readTime: "4 min read",
      },
    },
  ]

  const featuredArticles = [
    {
      id: 1,
      title: "The Future of Mobile Gaming",
      category: "Industry Insights",
      date: "December 18, 2025",
      readTime: "6 min read",
      preview: "Exploring the latest trends in mobile gaming, from AR integration to cloud gaming solutions...",
      image: "/placeholder.svg?height=200&width=300",
      featured: true,
    },
    {
      id: 2,
      title: "Building Your First Game: A Complete Guide",
      category: "Tutorial",
      date: "December 16, 2025",
      readTime: "12 min read",
      preview: "Step-by-step guide for beginners to create their first game using our development tools...",
      image: "/placeholder.svg?height=200&width=300",
      featured: false,
    },
    {
      id: 3,
      title: "Community Spotlight: Amazing Fan Creations",
      category: "Community",
      date: "December 14, 2025",
      readTime: "4 min read",
      preview: "Showcasing incredible fan art, mods, and community-created content from our talented players...",
      image: "/placeholder.svg?height=200&width=300",
      featured: false,
    },
    {
      id: 4,
      title: "Game Development Tools: 2025 Review",
      category: "Technology",
      date: "December 12, 2025",
      readTime: "8 min read",
      preview: "Comprehensive review of the best game development tools and frameworks available this year...",
      image: "/placeholder.svg?height=200&width=300",
      featured: true,
    },
  ]

  const topics = [
    "Game Development",
    "New Releases",
    "Industry News",
    "Community Events",
    "Tutorials",
    "Technology",
    "Esports",
    "Reviews",
    "Interviews",
    "Special Offers",
  ]

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const handleNewsletterSubscribe = (newsletterId: number) => {
    setSubscribedNewsletters((prev) =>
      prev.includes(newsletterId) ? prev.filter((id) => id !== newsletterId) : [...prev, newsletterId],
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative colorful-bg-1 py-20 px-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 floating-animation">Stay Connected</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Get the latest updates delivered straight to your inbox</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                <AnimatedCounter end={85} suffix="K+" />
              </div>
              <p className="text-sm opacity-80">Total Subscribers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-green-300 mb-2">
                <AnimatedCounter end={4} />
              </div>
              <p className="text-sm opacity-80">Newsletter Types</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-300 mb-2">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="text-sm opacity-80">Open Rate</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-300 mb-2">
                <AnimatedCounter end={150} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Issues Published</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Cards */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Our Newsletters</h2>
            <p className="text-gray-600 text-lg">Choose the content that interests you most</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsletters.map((newsletter, index) => {
              const IconComponent = newsletter.icon
              const isSubscribed = subscribedNewsletters.includes(newsletter.id)

              return (
                <div
                  key={newsletter.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group border-2 border-purple-200 dark:border-purple-700"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`h-2 bg-gradient-to-r ${newsletter.color}`}></div>

                  <div className="p-6">
                    {/* Newsletter Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${newsletter.color}`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold gradient-text">{newsletter.title}</h3>
                          <p className="text-sm text-gray-500">{newsletter.frequency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>{newsletter.subscribers}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">{newsletter.description}</p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {newsletter.topics.map((topic) => (
                        <span
                          key={topic}
                          className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Latest Issue */}
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-sm text-purple-800 dark:text-purple-200 mb-2">Latest Issue</h4>
                      <h5 className="font-bold mb-1">{newsletter.latestIssue.title}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{newsletter.latestIssue.preview}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{newsletter.latestIssue.date}</span>
                        <span>{newsletter.latestIssue.readTime}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleNewsletterSubscribe(newsletter.id)}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                          isSubscribed ? "bg-green-500 text-white" : `bg-gradient-to-r ${newsletter.color} text-white`
                        }`}
                      >
                        {isSubscribed ? (
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Subscribed</span>
                          </div>
                        ) : (
                          "Subscribe"
                        )}
                      </button>
                      <button className="px-4 py-3 border-2 border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-colors duration-300 flex items-center justify-center">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-8 section-bg">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Featured Articles</h2>
            <p className="text-gray-600 text-lg">Latest insights and stories from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredArticles.map((article, index) => (
              <div
                key={article.id}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-purple-200 dark:border-purple-700 ${
                  article.featured ? "lg:col-span-2" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className={`w-full object-cover ${article.featured ? "h-64" : "h-48"}`}
                  />
                  {article.featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold gradient-text mb-3">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{article.preview}</p>
                  <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-1 group">
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="py-16 px-8 colorful-bg-2 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Subscribe to All Updates</h2>
            <p className="text-xl opacity-90">Join thousands of gamers getting exclusive content</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <form onSubmit={handleSubscribe} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-white placeholder-white/70"
                  />
                </div>
              </div>

              {/* Topic Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Select Topics of Interest</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicToggle(topic)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedTopics.includes(topic)
                          ? "bg-yellow-400 text-black"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-bold mb-3 flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-yellow-400" />
                  Subscriber Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Exclusive game previews</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Early access to releases</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Special discounts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Developer insights</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black rounded-lg text-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Subscribe Now</span>
                <Bell className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {subscribed && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce">
          <CheckCircle className="h-5 w-5" />
          <span>Successfully subscribed!</span>
        </div>
      )}
    </div>
  )
}
