"use client"

import type React from "react"

import { useState } from "react"
import AnimatedCounter from "@/components/animated-counter"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
  CreditCard,
  HelpCircle,
  Book,
  Users,
  Send,
  CheckCircle,
  Gift,
  Shield,
} from "lucide-react"

export default function SupportPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  })
  const [donationAmount, setDonationAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const supportCategories = [
    {
      icon: HelpCircle,
      title: "General Support",
      description: "Get help with games, accounts, and technical issues",
      color: "from-[#2eec6e] to-[#06b6d4]",
      responseTime: "2-4 hours",
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Questions about purchases, refunds, and subscriptions",
      color: "from-[#8b5cf6] to-[#ec4899]",
      responseTime: "1-2 hours",
    },
    {
      icon: Book,
      title: "Game Development",
      description: "Support for our development tools and services",
      color: "from-[#f97316] to-[#eab308]",
      responseTime: "4-6 hours",
    },
    {
      icon: Users,
      title: "Community Issues",
      description: "Report inappropriate behavior or community concerns",
      color: "from-[#007fff] to-[#8b5cf6]",
      responseTime: "1-3 hours",
    },
  ]

  const donationTiers = [
    { amount: "K50", title: "Supporter", benefits: ["Thank you message", "Community badge"] },
    { amount: "K100", title: "Contributor", benefits: ["All Supporter benefits", "Early game access", "Discord role"] },
    {
      amount: "K250",
      title: "Champion",
      benefits: ["All Contributor benefits", "Exclusive content", "Monthly newsletter"],
    },
    {
      amount: "K500",
      title: "Legend",
      benefits: ["All Champion benefits", "Direct developer contact", "Beta testing access"],
    },
  ]

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer:
        "Go to the login page and click 'Forgot Password'. Enter your email and follow the instructions sent to you.",
    },
    {
      question: "Can I get a refund for my purchase?",
      answer: "Yes, we offer refunds within 14 days of purchase if you haven't played more than 2 hours.",
    },
    {
      question: "How do I report a bug?",
      answer: "Use our contact form below with 'Bug Report' as the subject, or email us directly at bugs@gecogames.com",
    },
    {
      question: "Do you offer student discounts?",
      answer:
        "Yes! Students get 20% off all our educational content. Contact us with your student ID for verification.",
    },
  ]

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setContactForm({ name: "", email: "", subject: "", message: "", priority: "medium" })
  }

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setDonationAmount("")
    setCustomAmount("")
    setDonorName("")
    setDonorEmail("")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative colorful-bg-1 py-20 px-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 floating-animation">Support Center</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">We're here to help you succeed</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                <AnimatedCounter end={24} suffix="/7" />
              </div>
              <p className="text-sm opacity-80">Support Available</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-green-300 mb-2">
                <AnimatedCounter end={2} suffix=" hrs" />
              </div>
              <p className="text-sm opacity-80">Avg Response Time</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-300 mb-2">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="text-sm opacity-80">Satisfaction Rate</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-300 mb-2">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Issues Resolved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16 px-8 section-bg">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">How Can We Help?</h2>
            <p className="text-xl text-purple-600 dark:text-purple-400">Choose your support category</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportCategories.map((category, index) => (
              <div
                key={category.title}
                className="card-bg rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-purple-200 dark:border-purple-700"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6`}
                >
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold gradient-text mb-3">{category.title}</h3>
                <p className="text-purple-600 dark:text-purple-400 mb-4">{category.description}</p>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>Response: {category.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Get In Touch</h2>
            <p className="text-xl text-purple-600 dark:text-purple-400">Send us a message and we'll respond quickly</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card-bg rounded-2xl shadow-xl p-8 border-2 border-purple-200 dark:border-purple-700">
              <h3 className="text-2xl font-bold gradient-text mb-6">Contact Form</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-100"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-100"
                  />
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-100"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-purple-300 dark:border-purple-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-100"
                ></textarea>

                <button
                  type="submit"
                  className="w-full colorful-bg-2 hover:opacity-90 text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="card-bg rounded-2xl shadow-xl p-8 border-2 border-purple-200 dark:border-purple-700">
                <h3 className="text-2xl font-bold gradient-text mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 colorful-bg-1 rounded-xl flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-800 dark:text-purple-200">Email</p>
                      <p className="text-purple-600 dark:text-purple-400">support@gecogames.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 colorful-bg-2 rounded-xl flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-800 dark:text-purple-200">Phone</p>
                      <p className="text-purple-600 dark:text-purple-400">+260 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 colorful-bg-3 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-800 dark:text-purple-200">Address</p>
                      <p className="text-purple-600 dark:text-purple-400">Lusaka, Zambia</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 colorful-bg-4 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-800 dark:text-purple-200">Hours</p>
                      <p className="text-purple-600 dark:text-purple-400">24/7 Support Available</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-bg rounded-2xl shadow-xl p-8 border-2 border-purple-200 dark:border-purple-700">
                <h3 className="text-2xl font-bold gradient-text mb-6">Quick Links</h3>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="block text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                  >
                    📚 Knowledge Base
                  </a>
                  <a
                    href="#"
                    className="block text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                  >
                    💬 Community Forum
                  </a>
                  <a
                    href="#"
                    className="block text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                  >
                    🎮 Game Guides
                  </a>
                  <a
                    href="#"
                    className="block text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                  >
                    🔧 Troubleshooting
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 px-8 colorful-bg-3 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Support Our Mission</h2>
            <p className="text-xl opacity-90">Help us create amazing games and experiences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Donation Tiers */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Donation Tiers</h3>
              <div className="space-y-4">
                {donationTiers.map((tier, index) => (
                  <div
                    key={tier.title}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold">{tier.title}</h4>
                      <span className="text-2xl font-bold text-yellow-300">{tier.amount}</span>
                    </div>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-300" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Make a Donation</h3>
              <form onSubmit={handleDonationSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Choose Amount</label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {["K50", "K100", "K250", "K500"].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDonationAmount(amount)}
                        className={`py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                          donationAmount === amount
                            ? "bg-yellow-400 text-purple-900"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Custom Amount (K)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setDonationAmount("")
                    }}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-white placeholder-white/70"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-white placeholder-white/70"
                  />
                  <input
                    type="email"
                    placeholder="Your Email (Optional)"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-white placeholder-white/70"
                  />
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-300" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-pink-300" />
                    <span>Tax Deductible</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Heart className="h-5 w-5" />
                  <span>Donate Now</span>
                  <Gift className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8 section-bg">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-purple-600 dark:text-purple-400">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div
                key={item.question}
                className="card-bg rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-700"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-bold gradient-text mb-3">{item.question}</h3>
                <p className="text-purple-600 dark:text-purple-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Message */}
      {submitted && (
        <div className="fixed bottom-4 right-4 z-50 colorful-bg-1 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <CheckCircle className="h-6 w-6" />
          <span>Message sent successfully!</span>
        </div>
      )}
    </div>
  )
}
