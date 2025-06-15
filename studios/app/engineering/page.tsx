"use client"

import { useState } from "react"
import AnimatedCounter from "@/components/animated-counter"
import { Code, Server, Smartphone, Globe, Shield, Zap, CheckCircle, Star, Users } from "lucide-react"

export default function EngineeringPage() {
  const [selectedService, setSelectedService] = useState("web")

  const services = [
    {
      id: "web",
      name: "Web Development",
      icon: Globe,
      description: "Custom websites and web applications built with modern technologies",
      technologies: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS"],
      projects: 150,
      satisfaction: 98,
    },
    {
      id: "mobile",
      name: "Mobile Development",
      icon: Smartphone,
      description: "Native and cross-platform mobile applications for iOS and Android",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Unity"],
      projects: 85,
      satisfaction: 96,
    },
    {
      id: "backend",
      name: "Backend Development",
      icon: Server,
      description: "Scalable server-side solutions and API development",
      technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB", "AWS"],
      projects: 120,
      satisfaction: 97,
    },
    {
      id: "game",
      name: "Game Development",
      icon: Code,
      description: "Custom game development and interactive experiences",
      technologies: ["Unity", "Unreal Engine", "C#", "C++", "Blender"],
      projects: 45,
      satisfaction: 99,
    },
  ]

  const packages = [
    {
      name: "Starter Package",
      price: "K3,360",
      originalPrice: "K4,200",
      description: "Perfect for small businesses and personal projects",
      features: ["1-3 Pages Website", "Responsive Design", "Basic SEO", "Contact Form", "1 Month Support"],
      popular: false,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Business Package",
      price: "K4,480",
      originalPrice: "K5,600",
      description: "Ideal for growing businesses and professional websites",
      features: [
        "5-10 Pages Website",
        "Custom Design",
        "Advanced SEO",
        "CMS Integration",
        "3 Months Support",
        "Analytics Setup",
      ],
      popular: true,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Premium Package",
      price: "K11,240",
      originalPrice: "K14,000",
      description: "Comprehensive solution for large businesses",
      features: [
        "Unlimited Pages",
        "E-commerce Integration",
        "Advanced Features",
        "Custom Functionality",
        "6 Months Support",
        "Performance Optimization",
        "Security Features",
      ],
      popular: false,
      color: "from-green-500 to-teal-500",
    },
  ]

  const hostingPlans = [
    {
      name: "Basic Plan",
      price: "K70",
      period: "month",
      description: "Perfect for personal websites and small blogs",
      features: [
        "4 GB Storage",
        "10 Email Accounts",
        "3 FTP Accounts",
        "2 MySQL Databases",
        "Node.js, Python, PHP Support",
      ],
      color: "from-blue-500 to-purple-500",
    },
    {
      name: "Standard Plan",
      price: "K90",
      period: "month",
      description: "Ideal for growing businesses and medium websites",
      features: [
        "8 GB Storage",
        "20 Email Accounts",
        "10 FTP Accounts",
        "10 MySQL Databases",
        "Node.js, Python, PHP Support",
        "SSL Certificate",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Premium Plan",
      price: "K160",
      period: "month",
      description: "Best for large-scale websites and enterprises",
      features: [
        "20 GB Storage",
        "Unlimited Email Accounts",
        "20 FTP Accounts",
        "Unlimited MySQL Databases",
        "All Language Support",
        "SSL Certificate",
        "Daily Backups",
      ],
      color: "from-green-500 to-teal-500",
    },
  ]

  const selectedServiceData = services.find((s) => s.id === selectedService)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 py-20 px-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text floating-animation">
            Engineering Excellence
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Building the future with cutting-edge technology solutions
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                <AnimatedCounter end={400} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Projects Completed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-green-300 mb-2">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="text-sm opacity-80">Client Satisfaction</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-300 mb-2">
                <AnimatedCounter end={50} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Technologies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-300 mb-2">
                <AnimatedCounter end={5} />
              </div>
              <p className="text-sm opacity-80">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg">Comprehensive engineering solutions for your business</p>
          </div>

          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-300 ${
                    selectedService === service.id
                      ? "bg-blue-500 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:scale-105"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{service.name}</span>
                </button>
              )
            })}
          </div>

          {/* Selected Service Details */}
          {selectedServiceData && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <selectedServiceData.icon className="h-8 w-8 text-blue-500" />
                    <h3 className="text-3xl font-bold gradient-text">{selectedServiceData.name}</h3>
                  </div>
                  <p className="text-gray-600 text-lg mb-6">{selectedServiceData.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        <AnimatedCounter end={selectedServiceData.projects} />
                      </div>
                      <p className="text-sm text-gray-600">Projects</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        <AnimatedCounter end={selectedServiceData.satisfaction} suffix="%" />
                      </div>
                      <p className="text-sm text-gray-600">Satisfaction</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-4">Technologies We Use</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedServiceData.technologies.map((tech, index) => (
                      <div
                        key={tech}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-center font-medium hover:scale-105 transition-transform duration-300"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Web Development Packages */}
      <section className="py-16 px-8 bg-gradient-to-br from-gray-100 to-blue-100">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Web Development Packages</h2>
            <p className="text-gray-600 text-lg">Choose the perfect package for your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                  pkg.popular ? "ring-4 ring-purple-500 ring-opacity-50" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {pkg.popular && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 font-bold">
                    Most Popular
                  </div>
                )}

                <div className="p-6">
                  <div className={`h-2 bg-gradient-to-r ${pkg.color} mb-4`}></div>

                  <h3 className="text-2xl font-bold gradient-text mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-green-600">{pkg.price}</span>
                      <span className="text-lg text-gray-500 line-through">{pkg.originalPrice}</span>
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      Save{" "}
                      {Math.round(
                        (1 -
                          Number.parseInt(pkg.price.replace("K", "").replace(",", "")) /
                            Number.parseInt(pkg.originalPrice.replace("K", "").replace(",", ""))) *
                          100,
                      )}
                      %
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg text-white font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r ${pkg.color}`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting Plans */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Hosting Solutions</h2>
            <p className="text-gray-600 text-lg">Reliable and fast hosting for your applications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hostingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-2 bg-gradient-to-r ${plan.color}`}></div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold gradient-text mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold text-blue-600">{plan.price}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg text-white font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r ${plan.color}`}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-8 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Engineering Team?</h2>
            <p className="text-xl opacity-90">We deliver excellence in every project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Fast Delivery",
                description: "Quick turnaround times without compromising quality",
              },
              {
                icon: Shield,
                title: "Secure Solutions",
                description: "Security-first approach in all our developments",
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Experienced developers and engineers",
              },
              {
                icon: Star,
                title: "Quality Assured",
                description: "Rigorous testing and quality control processes",
              },
            ].map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="text-center hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="opacity-80">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
