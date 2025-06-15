import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  const footerSections = [
    {
      title: "Studio",
      links: [
        { name: "Products", href: "#" },
        { name: "Geco Ads", href: "#" },
        { name: "Subscription", href: "#" },
        { name: "Resellers", href: "#" },
      ],
    },
    {
      title: "Engineering",
      links: [
        { name: "Web Hosting", href: "#" },
        { name: "Domain Registration", href: "#" },
        { name: "Web Development", href: "#" },
        { name: "Application Development", href: "#" },
        { name: "UI/UX Design", href: "#" },
      ],
    },
    {
      title: "Education",
      links: [
        { name: "Students", href: "#" },
        { name: "Educators", href: "#" },
        { name: "Institutions", href: "#" },
        { name: "Certifications", href: "#" },
        { name: "Learn", href: "#" },
        { name: "Center of Excellence", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Learn Platform", href: "#" },
        { name: "Community", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "Geco QA", href: "#" },
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
    <footer className="bg-black dark:bg-gray-900 py-12 text-white border-t border-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-4 group">
            <Image
              src="/logo-dark.png"
              alt="Geco Games Studios"
              width={60}
              height={60}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <div>
              <h3 className="text-2xl font-bold gradient-text">Geco Games Studios</h3>
              <p className="text-gray-400 text-sm">Creating Amazing Gaming Experiences</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {footerSections.map((section, index) => (
            <div key={section.title} className="slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
              <h3 className="font-semibold text-lg mb-4 gradient-text">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Currency and Social Section */}
        <div className="mt-12 border-t border-gray-700 dark:border-gray-600 pt-6 text-center">
          <p className="mb-4 text-lg">
            Currency: <span className="font-semibold text-yellow-400">ZMK</span>
          </p>
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social) => {
              const IconComponent = social.icon
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className="hover:text-yellow-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-700"
                  aria-label={social.name}
                >
                  <IconComponent className="h-6 w-6" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 dark:border-gray-600 text-center text-sm text-gray-400">
          <p>&copy; 2025 Geco Games Studios. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
