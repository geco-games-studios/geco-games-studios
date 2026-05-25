"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, HelpCircle, MessageSquare, Mail, Phone, FileText, ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react"
import { fetchJson, postJson } from "@/lib/api"

interface FAQ {
  question: string
  answer: string
}

interface SupportTicket {
  id: string
  subject: string
  status: "open" | "in-progress" | "resolved"
  createdAt?: string
  created_at?: string
  priority: "low" | "medium" | "high"
}

export default function DeveloperSupportPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [formError, setFormError] = useState("")
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "medium"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchSupportData()
  }, [router])

  const fetchSupportData = async () => {
    try {
      setIsLoading(true)

      const userData = localStorage.getItem("currentUser")

      if (!userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)

      // Only allow developer users
      if (parsedUser.type !== "developer") {
        router.push("/login")
        return
      }

      const mockFaqs: FAQ[] = [
        {
          question: "How do I submit a new game for review?",
          answer: "Go to the Developer Portal homepage and fill out the game submission form with all required details including game title, genre, platforms, and description. Our team will review your submission within 2-3 business days."
        },
        {
          question: "What are the requirements for game submission?",
          answer: "You need to provide: game title, genre, target platforms, development stage, game description, and optionally a website/demo link. All submissions must comply with our content guidelines."
        },
        {
          question: "How long does the review process take?",
          answer: "Game reviews typically take 2-3 business days. You'll receive an email notification once the review is complete. Premium developers may have priority review."
        },
        {
          question: "Can I update my game information after submission?",
          answer: "Yes, you can edit your game details from the 'My Games' section in your dashboard. Changes will be reviewed again before going live."
        },
        {
          question: "What analytics are available for my games?",
          answer: "You can view download counts, ratings, revenue data, and user engagement metrics in the Analytics dashboard. Data is updated daily."
        },
        {
          question: "How do I get paid for my game downloads?",
          answer: "Payments are processed monthly for games that meet our minimum payout threshold. You'll receive payment via your preferred method on file."
        },
        {
          question: "What if my game gets rejected?",
          answer: "If your game is rejected, you'll receive detailed feedback explaining the reasons. You can address the issues and resubmit your game."
        },
        {
          question: "How can I improve my game's visibility?",
          answer: "Focus on high-quality screenshots, compelling descriptions, and positive user ratings. We also recommend regular updates and community engagement."
        }
      ]

      setFaqs(mockFaqs)

      const url = `developer/support/`
      const response = await fetchJson<SupportTicket[]>(url)
      setTickets(response.map((ticket) => ({
        ...ticket,
        createdAt: ticket.createdAt || ticket.created_at || new Date().toISOString().split('T')[0],
      })))
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching support data:", err)
      setError(`Failed to load support data`)
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  const handleFaqToggle = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitSupport = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!contactForm.subject.trim() || !contactForm.category.trim() || !contactForm.message.trim()) {
      setFormError("Please complete all required fields before submitting.")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        subject: contactForm.subject,
        category: contactForm.category,
        priority: contactForm.priority,
        description: contactForm.message,
        message: contactForm.message,
      }

      const createdTicket = await postJson<SupportTicket>(`developer/support/`, payload)

      const ticketToAdd = {
        ...createdTicket,
        createdAt: createdTicket.createdAt || createdTicket.created_at || new Date().toISOString().split('T')[0],
      }

      setTickets(prev => [ticketToAdd, ...prev])
      setSubmitSuccess(true)
      setContactForm({
        subject: "",
        category: "",
        message: "",
        priority: "medium"
      })

      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (err) {
      console.error("Error submitting support request:", err)
      setFormError(err instanceof Error ? err.message : "Failed to submit support request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading support...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-red-200 border-t-red-600 animate-spin mx-auto mb-4"></div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Developer Portal
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Support Center
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-slate-200 dark:border-slate-800 pt-4 pb-0 -mb-px overflow-x-auto">
            <Link
              href="/developer/dashboard"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Dashboard
            </Link>
            <Link
              href="/developer/profile"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Profile
            </Link>
            <Link
              href="/developer/games"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              My Games
            </Link>
            <Link
              href="/developer/analytics"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Analytics
            </Link>
            <Link
              href="/developer/leaderboards"
              className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-sm transition"
            >
              Leaderboards
            </Link>
            <Link
              href="/developer/support"
              className="px-4 py-3 border-b-2 border-cyan-600 text-cyan-600 font-semibold dark:border-cyan-400 dark:text-cyan-400 text-sm"
            >
              Support
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Developer Support Center
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Get help with your game development journey. Find answers to common questions or contact our support team.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                    <button
                      onClick={() => handleFaqToggle(index)}
                      className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      <span className="font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4 text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Contact Support</h3>
              </div>

              {submitSuccess && (
                <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-700 dark:text-green-400 text-sm">Support ticket created successfully!</p>
                  </div>
                </div>
              )}

              {formError && (
                <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-400 text-sm">{formError}</p>
                </div>
              )}

              <form onSubmit={handleSubmitSupport} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label htmlFor="support-category" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    id="support-category"
                    name="category"
                    value={contactForm.category}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select a category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="submission">Game Submission</option>
                    <option value="analytics">Analytics</option>
                    <option value="account">Account Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="support-priority" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Priority
                  </label>
                  <select
                    id="support-priority"
                    name="priority"
                    value={contactForm.priority}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Describe your issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-cyan-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Support Request
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                    <a href="mailto:hello@gecogamesstudios.com" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                      hello@gecogamesstudios.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Phone</p>
                    <a href="tel:+260978516926" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                      +260 978516926
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Documentation</p>
                    <a href="/documentation" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                      Developer Documentation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Tickets */}
        {tickets.length > 0 && (
          <div className="mt-12 rounded-xl bg-white shadow-lg dark:bg-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Your Support Tickets</h3>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{ticket.subject}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace("-", " ")}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-600 dark:text-slate-400">
                    <p>Ticket #{ticket.id}</p>
                    <p>{ticket.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
