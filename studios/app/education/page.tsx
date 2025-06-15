"use client"

import { useState } from "react"
import AnimatedCounter from "@/components/animated-counter"
import { BookOpen, Users, Award, Play, Clock, Star, CheckCircle, Trophy, Target, Zap } from "lucide-react"

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([])

  const courses = [
    {
      id: 1,
      title: "Game Development Fundamentals",
      description: "Learn the basics of game development using Unity and C#",
      category: "development",
      level: "Beginner",
      duration: "8 weeks",
      students: 1250,
      rating: 4.9,
      price: "K2,500",
      instructor: "John Smith",
      lessons: 24,
      projects: 3,
      certificate: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Advanced Unity Programming",
      description: "Master advanced Unity features and optimization techniques",
      category: "development",
      level: "Advanced",
      duration: "12 weeks",
      students: 850,
      rating: 4.8,
      price: "K3,800",
      instructor: "Sarah Johnson",
      lessons: 36,
      projects: 5,
      certificate: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Game Design Principles",
      description: "Understanding game mechanics, player psychology, and design theory",
      category: "design",
      level: "Intermediate",
      duration: "6 weeks",
      students: 920,
      rating: 4.7,
      price: "K1,800",
      instructor: "Mike Chen",
      lessons: 18,
      projects: 2,
      certificate: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "3D Modeling for Games",
      description: "Create stunning 3D models and animations using Blender",
      category: "art",
      level: "Beginner",
      duration: "10 weeks",
      students: 1100,
      rating: 4.6,
      price: "K2,200",
      instructor: "Lisa Wang",
      lessons: 30,
      projects: 4,
      certificate: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "Mobile Game Development",
      description: "Build mobile games for iOS and Android platforms",
      category: "development",
      level: "Intermediate",
      duration: "9 weeks",
      students: 750,
      rating: 4.8,
      price: "K3,200",
      instructor: "David Brown",
      lessons: 27,
      projects: 3,
      certificate: true,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "Game Audio Design",
      description: "Create immersive soundscapes and music for games",
      category: "audio",
      level: "Beginner",
      duration: "7 weeks",
      students: 650,
      rating: 4.5,
      price: "K1,900",
      instructor: "Emma Davis",
      lessons: 21,
      projects: 2,
      certificate: true,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const categories = [
    { id: "all", name: "All Courses", icon: BookOpen },
    { id: "development", name: "Development", icon: Play },
    { id: "design", name: "Design", icon: Target },
    { id: "art", name: "Art & Animation", icon: Star },
    { id: "audio", name: "Audio Design", icon: Zap },
  ]

  const learningPaths = [
    {
      title: "Complete Game Developer",
      description: "From beginner to professional game developer",
      courses: 6,
      duration: "6 months",
      students: 2500,
      color: "from-blue-500 to-purple-500",
    },
    {
      title: "Game Artist Specialist",
      description: "Master the art of game visuals and animation",
      courses: 4,
      duration: "4 months",
      students: 1800,
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Indie Game Creator",
      description: "Build and publish your own indie games",
      courses: 5,
      duration: "5 months",
      students: 1200,
      color: "from-purple-500 to-pink-500",
    },
  ]

  const filteredCourses =
    selectedCategory === "all" ? courses : courses.filter((course) => course.category === selectedCategory)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEnroll = (courseId: number) => {
    setEnrolledCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 py-20 px-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text floating-animation">Game Dev Academy</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Master game development with expert-led courses and hands-on projects
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                <AnimatedCounter end={50} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Courses Available</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-green-300 mb-2">
                <AnimatedCounter end={8500} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Students Enrolled</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-300 mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <p className="text-sm opacity-80">Completion Rate</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-300 mb-2">
                <AnimatedCounter end={4.8} suffix="" />
              </div>
              <p className="text-sm opacity-80">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Learning Paths</h2>
            <p className="text-gray-600 text-lg">Structured learning journeys to achieve your goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <div
                key={path.title}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-2 bg-gradient-to-r ${path.color}`}></div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold gradient-text mb-3">{path.title}</h3>
                  <p className="text-gray-600 mb-4">{path.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{path.courses}</div>
                      <div className="text-xs text-gray-500">Courses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{path.duration}</div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{path.students}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg text-white font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r ${path.color}`}
                  >
                    Start Learning Path
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 px-8 bg-gray-100">
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
                      ? "bg-green-500 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:scale-105"
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

      {/* Courses Grid */}
      <section className="py-16 px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              {selectedCategory === "all" ? "All Courses" : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600 text-lg">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => {
              const isEnrolled = enrolledCourses.includes(course.id)

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Course Image */}
                  <div className="relative">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Level Badge */}
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(course.level)}`}
                    >
                      {course.level}
                    </div>

                    {/* Certificate Badge */}
                    {course.certificate && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>Certificate</span>
                      </div>
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                        <Play className="h-8 w-8 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 gradient-text line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <p className="text-sm text-gray-500 mb-4">Instructor: {course.instructor}</p>

                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span className="font-bold">{course.lessons}</span>
                        </div>
                        <div className="text-gray-500">Lessons</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="font-bold">{course.duration}</span>
                        </div>
                        <div className="text-gray-500">Duration</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{course.projects}</span>
                        </div>
                        <div className="text-gray-500">Projects</div>
                      </div>
                    </div>

                    {/* Rating and Students */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>

                    {/* Price and Enroll */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">{course.price}</span>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                          isEnrolled
                            ? "bg-green-500 text-white"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        }`}
                      >
                        {isEnrolled ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Enrolled</span>
                          </div>
                        ) : (
                          "Enroll Now"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Our Academy */}
      <section className="py-16 px-8 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Geco Game Dev Academy?</h2>
            <p className="text-xl opacity-90">Learn from industry experts and build real projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Expert Instructors",
                description: "Learn from professional game developers with years of industry experience",
              },
              {
                icon: Trophy,
                title: "Hands-on Projects",
                description: "Build real games and add them to your portfolio",
              },
              {
                icon: Award,
                title: "Industry Certificates",
                description: "Earn recognized certificates to boost your career",
              },
              {
                icon: Target,
                title: "Career Support",
                description: "Get job placement assistance and career guidance",
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
