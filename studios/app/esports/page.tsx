"use client"

import { useState } from "react"
import AnimatedCounter from "@/components/animated-counter"
import { Trophy, Users, Calendar, Target, Crown, Gamepad2, Clock, Shield } from "lucide-react"

export default function EsportsPage() {
  const [selectedTab, setSelectedTab] = useState("tournaments")
  const [registeredTournaments, setRegisteredTournaments] = useState<number[]>([])
  const [joinedClans, setJoinedClans] = useState<number[]>([])

  const tournaments = [
    {
      id: 1,
      name: "Fruit Valley Championship",
      game: "Fruit Valley",
      prizePool: "K50,000",
      participants: 256,
      startDate: "2025-02-15",
      endDate: "2025-02-18",
      status: "upcoming",
      registrationFee: "K200",
      format: "Single Elimination",
      platform: "Mobile",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Block Cat Masters",
      game: "Block Cat Fill",
      prizePool: "K30,000",
      participants: 128,
      startDate: "2025-02-20",
      endDate: "2025-02-22",
      status: "registration",
      registrationFee: "K150",
      format: "Round Robin",
      platform: "Mobile",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Chef's Challenge Cup",
      game: "Become A Chef",
      prizePool: "K75,000",
      participants: 512,
      startDate: "2025-03-01",
      endDate: "2025-03-05",
      status: "upcoming",
      registrationFee: "K300",
      format: "Swiss System",
      platform: "Mobile",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Winter Gaming Festival",
      game: "Multi-Game",
      prizePool: "K100,000",
      participants: 1024,
      startDate: "2025-03-15",
      endDate: "2025-03-20",
      status: "live",
      registrationFee: "K500",
      format: "Multiple Formats",
      platform: "Multi-Platform",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const clans = [
    {
      id: 1,
      name: "Lightning Strikers",
      tag: "[LS]",
      members: 25,
      level: 15,
      wins: 124,
      losses: 23,
      rank: 1,
      points: 2450,
      description: "Elite competitive clan focused on puzzle games and strategy",
      requirements: "Level 10+, 70% win rate",
      avatar: "/placeholder.svg?height=80&width=80",
      color: "from-yellow-400 to-orange-500",
      isRecruiting: true,
    },
    {
      id: 2,
      name: "Puzzle Masters",
      tag: "[PM]",
      members: 18,
      level: 12,
      wins: 98,
      losses: 34,
      rank: 2,
      points: 2280,
      description: "Dedicated to mastering all puzzle games in our catalog",
      requirements: "Level 8+, Active daily",
      avatar: "/placeholder.svg?height=80&width=80",
      color: "from-purple-500 to-pink-500",
      isRecruiting: true,
    },
    {
      id: 3,
      name: "Chef Legends",
      tag: "[CL]",
      members: 30,
      level: 18,
      wins: 156,
      losses: 45,
      rank: 3,
      points: 2150,
      description: "Restaurant simulation specialists and cooking game experts",
      requirements: "Level 12+, Chef game experience",
      avatar: "/placeholder.svg?height=80&width=80",
      color: "from-green-500 to-teal-500",
      isRecruiting: false,
    },
    {
      id: 4,
      name: "Block Breakers",
      tag: "[BB]",
      members: 22,
      level: 14,
      wins: 89,
      losses: 28,
      rank: 4,
      points: 1980,
      description: "Casual competitive clan welcoming all skill levels",
      requirements: "Level 5+, Friendly attitude",
      avatar: "/placeholder.svg?height=80&width=80",
      color: "from-blue-500 to-cyan-500",
      isRecruiting: true,
    },
    {
      id: 5,
      name: "Fruit Crushers",
      tag: "[FC]",
      members: 16,
      level: 11,
      wins: 67,
      losses: 19,
      rank: 5,
      points: 1850,
      description: "Match-3 specialists with a focus on high scores",
      requirements: "Level 7+, Match-3 expertise",
      avatar: "/placeholder.svg?height=80&width=80",
      color: "from-red-500 to-pink-500",
      isRecruiting: true,
    },
  ]

  const rankings = [
    {
      rank: 1,
      player: "ProGamer_2025",
      clan: "Lightning Strikers",
      points: 3450,
      wins: 89,
      losses: 11,
      winRate: 89,
      avatar: "/placeholder.svg?height=50&width=50",
      title: "Grand Master",
      badge: "👑",
    },
    {
      rank: 2,
      player: "SkillMaster99",
      clan: "Puzzle Masters",
      points: 3280,
      wins: 76,
      losses: 14,
      winRate: 84,
      avatar: "/placeholder.svg?height=50&width=50",
      title: "Master",
      badge: "🥈",
    },
    {
      rank: 3,
      player: "ChefExpert",
      clan: "Chef Legends",
      points: 3150,
      wins: 82,
      losses: 18,
      winRate: 82,
      avatar: "/placeholder.svg?height=50&width=50",
      title: "Expert",
      badge: "🥉",
    },
    {
      rank: 4,
      player: "BlockMaster",
      clan: "Block Breakers",
      points: 2980,
      wins: 68,
      losses: 22,
      winRate: 76,
      avatar: "/placeholder.svg?height=50&width=50",
      title: "Expert",
      badge: "⭐",
    },
    {
      rank: 5,
      player: "FruitNinja",
      clan: "Fruit Crushers",
      points: 2850,
      wins: 59,
      losses: 21,
      winRate: 74,
      avatar: "/placeholder.svg?height=50&width=50",
      title: "Advanced",
      badge: "🌟",
    },
    {
      rank: 6,
      player: "GameWarrior",
      clan: "Lightning Strikers",
      points: 2720,
      wins: 54,
      losses: 26,
      winRate: 68,
      avatar: "/placeholder.svg?height=50&width=50",
      title: "Advanced",
      badge: "⚡",
    },
    {
      rank: 7,
      player: "PuzzleQueen",
      clan: "Puzzle Masters",
      points: 2650,
      wins: 51,
      losses: 29,
      winRate: 64,
      avatar: "/placeholder.svg?height=50&width=50",
      title: "Skilled",
      badge: "🧩",
    },
    {
      rank: 8,
      player: "CookingPro",
      clan: "Chef Legends",
      points: 2580,
      wins: 48,
      losses: 32,
      winRate: 60,
      avatar: "/placeholder.svg?height=50&width=50",
      title: "Skilled",
      badge: "👨‍🍳",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500"
      case "registration":
        return "bg-green-500"
      case "upcoming":
        return "bg-blue-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "Live Now"
      case "registration":
        return "Registration Open"
      case "upcoming":
        return "Coming Soon"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  const handleRegister = (tournamentId: number) => {
    setRegisteredTournaments((prev) =>
      prev.includes(tournamentId) ? prev.filter((id) => id !== tournamentId) : [...prev, tournamentId],
    )
  }

  const handleJoinClan = (clanId: number) => {
    setJoinedClans((prev) => (prev.includes(clanId) ? prev.filter((id) => id !== clanId) : [...prev, clanId]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-red-50 dark:from-slate-900 dark:to-red-900">
      {/* Hero Section */}
      <section className="relative colorful-bg-3 py-20 px-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 floating-animation">Esports Arena</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Compete in tournaments, join clans, and climb the leaderboards
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                <AnimatedCounter end={25} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Active Tournaments</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-green-300 mb-2">
                <AnimatedCounter end={5000} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Registered Players</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-300 mb-2">
                <AnimatedCounter end={500} suffix="K" />
              </div>
              <p className="text-sm opacity-80">Total Prize Pool</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-300 mb-2">
                <AnimatedCounter end={150} suffix="+" />
              </div>
              <p className="text-sm opacity-80">Active Clans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 px-8 bg-white dark:bg-slate-800 shadow-sm">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: "tournaments", label: "Tournaments", icon: Trophy },
              { id: "clans", label: "Clans", icon: Shield },
              { id: "rankings", label: "Rankings", icon: Crown },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-8 py-4 rounded-full font-medium transition-all duration-300 ${
                  selectedTab === tab.id
                    ? "colorful-bg-1 text-white shadow-lg scale-105"
                    : "bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 hover:scale-105"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments Tab */}
      {selectedTab === "tournaments" && (
        <section className="py-16 px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold gradient-text mb-4">Active Tournaments</h2>
              <p className="text-gray-600 text-lg">Join the competition and win amazing prizes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tournaments.map((tournament, index) => {
                const isRegistered = registeredTournaments.includes(tournament.id)

                return (
                  <div
                    key={tournament.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group border-2 border-purple-200 dark:border-purple-700"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Tournament Image */}
                    <div className="relative">
                      <img
                        src={tournament.image || "/placeholder.svg"}
                        alt={tournament.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Status Badge */}
                      <div
                        className={`absolute top-4 left-4 ${getStatusColor(tournament.status)} text-white px-3 py-1 rounded-full text-xs font-bold`}
                      >
                        {getStatusText(tournament.status)}
                      </div>

                      {/* Prize Pool */}
                      <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Trophy className="h-3 w-3" />
                        <span>{tournament.prizePool}</span>
                      </div>
                    </div>

                    {/* Tournament Info */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold gradient-text mb-2">{tournament.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Game: {tournament.game}</p>

                      {/* Tournament Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{tournament.participants} players</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-purple-500" />
                          <span>{tournament.format}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Gamepad2 className="h-4 w-4 text-red-500" />
                          <span>{tournament.platform}</span>
                        </div>
                      </div>

                      {/* Registration Fee and Action */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-green-600">{tournament.registrationFee}</span>
                          <span className="text-sm text-gray-500 ml-1">entry fee</span>
                        </div>
                        <button
                          onClick={() => handleRegister(tournament.id)}
                          className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                            isRegistered ? "bg-green-500 text-white" : "colorful-bg-2 text-white"
                          }`}
                        >
                          {isRegistered ? "Registered" : "Register Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Clans Tab */}
      {selectedTab === "clans" && (
        <section className="py-16 px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold gradient-text mb-4">Gaming Clans</h2>
              <p className="text-gray-600 text-lg">Join a clan and compete together</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clans.map((clan, index) => {
                const hasJoined = joinedClans.includes(clan.id)

                return (
                  <div
                    key={clan.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-purple-200 dark:border-purple-700"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Clan Header */}
                    <div className={`bg-gradient-to-r ${clan.color} p-6 text-white relative`}>
                      <div className="flex items-center space-x-4">
                        <img
                          src={clan.avatar || "/placeholder.svg"}
                          alt={clan.name}
                          className="w-16 h-16 rounded-full border-4 border-white"
                        />
                        <div>
                          <h3 className="text-xl font-bold">{clan.name}</h3>
                          <p className="text-sm opacity-90">{clan.tag}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Level {clan.level}</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">Rank #{clan.rank}</span>
                          </div>
                        </div>
                      </div>
                      {clan.isRecruiting && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Recruiting
                        </div>
                      )}
                    </div>

                    {/* Clan Info */}
                    <div className="p-6">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{clan.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
                        <div>
                          <div className="font-bold text-blue-600">{clan.members}</div>
                          <div className="text-gray-500">Members</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-600">{clan.wins}</div>
                          <div className="text-gray-500">Wins</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-600">{clan.points}</div>
                          <div className="text-gray-500">Points</div>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mb-4">
                        <h4 className="font-bold text-sm mb-1">Requirements:</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{clan.requirements}</p>
                      </div>

                      {/* Join Button */}
                      <button
                        onClick={() => handleJoinClan(clan.id)}
                        disabled={!clan.isRecruiting}
                        className={`w-full py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                          hasJoined
                            ? "bg-green-500 text-white"
                            : clan.isRecruiting
                              ? `bg-gradient-to-r ${clan.color} text-white`
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {hasJoined ? "Joined" : clan.isRecruiting ? "Join Clan" : "Not Recruiting"}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Rankings Tab */}
      {selectedTab === "rankings" && (
        <section className="py-16 px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold gradient-text mb-4">Player Rankings</h2>
              <p className="text-gray-600 text-lg">Top performing players this season</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border-2 border-purple-200 dark:border-purple-700">
              <div className="colorful-bg-1 text-white p-6">
                <h3 className="text-2xl font-bold text-center">Season Rankings</h3>
              </div>

              <div className="p-6">
                {rankings.map((player, index) => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-4 rounded-lg mb-4 transition-all duration-300 hover:scale-105 ${
                      player.rank <= 3
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700"
                        : "bg-purple-50 dark:bg-slate-700"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                          player.rank === 1
                            ? "bg-yellow-500"
                            : player.rank === 2
                              ? "bg-gray-400"
                              : player.rank === 3
                                ? "bg-orange-500"
                                : "bg-purple-600"
                        }`}
                      >
                        {player.rank <= 3 ? player.badge : player.rank}
                      </div>

                      {/* Player Info */}
                      <div className="flex items-center space-x-3">
                        <img
                          src={player.avatar || "/placeholder.svg"}
                          alt={player.player}
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-300"
                        />
                        <div>
                          <h4 className="font-bold text-lg gradient-text">{player.player}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{player.clan}</span>
                            <span>•</span>
                            <span className="text-purple-600 font-medium">{player.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-purple-600">{player.points}</div>
                        <div className="text-gray-500">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{player.wins}</div>
                        <div className="text-gray-500">Wins</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-red-600">{player.losses}</div>
                        <div className="text-gray-500">Losses</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{player.winRate}%</div>
                        <div className="text-gray-500">Win Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="py-16 px-8 colorful-bg-4 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-xl opacity-90">Don't miss these exciting competitions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Weekly Puzzle Challenge",
                date: "Every Monday",
                time: "7:00 PM",
                prize: "K5,000",
                participants: "Open to all",
              },
              {
                title: "Speed Run Championship",
                date: "March 1, 2025",
                time: "2:00 PM",
                prize: "K25,000",
                participants: "Qualified players only",
              },
              {
                title: "Team Battle Royale",
                date: "March 15, 2025",
                time: "6:00 PM",
                prize: "K40,000",
                participants: "Teams of 4",
              },
            ].map((event, index) => (
              <div
                key={event.title}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                <div className="space-y-2 text-sm opacity-80">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span>{event.prize} Prize Pool</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{event.participants}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
