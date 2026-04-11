import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import NewsletterSubscription from "./newsletter-subscription"

export default function Footer() {
  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Game Development", href: "/services" },
        { name: "Art & Animation", href: "/services" },
        { name: "Strategy & Growth", href: "/services" },
        { name: "Esports Production", href: "/services" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Studio", href: "/" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Academy", href: "/academy" },
        { name: "Careers", href: "/support" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact", href: "#contact" },
        { name: "FAQ", href: "/support" },
        { name: "Privacy", href: "/support" },
        { name: "Terms", href: "/support" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "News", href: "/newsletters" },
        { name: "Blog", href: "/newsletters" },
        { name: "Careers", href: "/support" },
        { name: "Press", href: "/support" },
      ],
    },
  ]

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
  ]

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
      <div className="container mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm">
                <Image src="/logo-dark.png" alt="Geco Games Studios logo" width={48} height={48} className="object-contain" />
              </div>
              <div>
                <p className="text-lg font-semibold">Geco Games Studios</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">A creative partner for ambitious digital experiences.</p>
              </div>
            </div>
            <p className="mt-8 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
              We specialize in mobile game and app development, creating immersive experiences with premium execution, clear strategy, and measurable impact.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <NewsletterSubscription variant="compact" />
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{section.title}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="transition hover:text-slate-950 dark:hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Geco Games Studios. All rights reserved.</p>
            <p>hello@gecogamesstudios.com · +260 978516926</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
