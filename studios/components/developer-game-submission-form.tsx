"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Alert, AlertDescription } from "./ui/alert"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  gameTitle: string
  gameGenre: string
  platforms: string[]
  releaseStage: string
  engine: string
  website: string
  description: string
  published: "yes" | "no"
}

const platformOptions = ["Mobile", "PC", "Web", "Console"]
const releaseStages = ["Prototype", "Beta", "Ready to launch", "Live"]
const gameGenres = ["Action", "Adventure", "RPG", "Puzzle", "Strategy", "Simulation", "Sports", "Horror"]
const engines = ["Unity", "Unreal Engine", "Godot", "Custom Engine", "Other"]

export default function DeveloperGameSubmissionForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      platforms: [],
    },
  })
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const selectedPlatforms = watch("platforms")

  const onSubmit = async (data: FormData) => {
    setErrorMessage("")
    setSuccess(false)

    try {
      const response = await fetch("/api/developer-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result.message || "An error occurred. Please try again.")
        return
      }

      setSuccess(true)
    } catch (error) {
      setErrorMessage("Failed to submit your game. Please try again.")
      console.error(error)
    }
  }

  const togglePlatform = (platform: string) => {
    const current = selectedPlatforms || []
    if (current.includes(platform)) {
      setValue("platforms", current.filter((item) => item !== platform))
    } else {
      setValue("platforms", [...current, platform])
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="rounded-2xl border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-1">Game submitted successfully!</h3>
          <p className="text-sm text-green-800 dark:text-green-300">
            Thank you for sharing your game. Our developer team will review the submission and reach out if we need more details.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <span className="inline-flex rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-300 uppercase tracking-[0.24em] mb-3">
          🎮 Game Submission
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Submit your game to the studio</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Share your game details so our team can review your title and help connect it with players and partners.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
          {errorMessage && (
            <div className="mb-8 rounded-2xl border-2 border-red-500 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 p-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-800 dark:text-red-300 font-medium">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-5 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20">
                <span className="text-sm">👤</span>
              </div>
              <h3 className="text-lg font-semibold">Contact details</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName", { required: "First name is required" })}
                  placeholder="Jane"
                  className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500"
                />
                {errors.firstName && <p className="text-red-500 text-xs font-medium">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName", { required: "Last name is required" })}
                  placeholder="Smith"
                  className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500"
                />
                {errors.lastName && <p className="text-red-500 text-xs font-medium">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="jane@example.com"
                className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500"
              />
              {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone", { required: "Phone number is required" })}
                placeholder="+1 (555) 123-4567"
                className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500"
              />
              {errors.phone && <p className="text-red-500 text-xs font-medium">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-5 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                <span className="text-sm">🎮</span>
              </div>
              <h3 className="text-lg font-semibold">Game details</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gameTitle" className="text-sm font-semibold">Game Title</Label>
                <Input
                  id="gameTitle"
                  {...register("gameTitle", { required: "Game title is required" })}
                  placeholder="Phantom Odyssey"
                  className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500"
                />
                {errors.gameTitle && <p className="text-red-500 text-xs font-medium">{errors.gameTitle.message}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gameGenre" className="text-sm font-semibold">Genre</Label>
                  <Select onValueChange={(value) => setValue("gameGenre", value)}>
                    <SelectTrigger className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500">
                      <SelectValue placeholder="Choose a genre" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg z-50 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                      {gameGenres.map((genre) => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.gameGenre && <p className="text-red-500 text-xs font-medium">{errors.gameGenre.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engine" className="text-sm font-semibold">Engine</Label>
                  <Select onValueChange={(value) => setValue("engine", value)}>
                    <SelectTrigger className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500">
                      <SelectValue placeholder="Choose engine" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg z-50 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                      {engines.map((engine) => (
                        <SelectItem key={engine} value={engine}>{engine}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.engine && <p className="text-red-500 text-xs font-medium">{errors.engine.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-semibold">Website or Game Page</Label>
                <Input
                  id="website"
                  {...register("website", { required: "Website is required" })}
                  placeholder="https://yourgame.com"
                  className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500"
                />
                {errors.website && <p className="text-red-500 text-xs font-medium">{errors.website.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">Short description</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: "Description is required" })}
                  placeholder="Tell us what makes your game unique."
                  className="rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500"
                />
                {errors.description && <p className="text-red-500 text-xs font-medium">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/10 dark:bg-slate-200/10">
                <span className="text-sm">🛠️</span>
              </div>
              <h3 className="text-lg font-semibold">Release details</h3>
            </div>

            <div className="mb-5 pb-5 border-b border-slate-300 dark:border-slate-700">
              <Label className="text-sm font-semibold block mb-2">Which platforms does your game support?</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {platformOptions.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={`platform-${platform}`}
                      checked={selectedPlatforms?.includes(platform) || false}
                      onCheckedChange={() => togglePlatform(platform)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`platform-${platform}`} className="font-normal cursor-pointer text-sm">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.platforms && <p className="text-red-500 text-xs font-medium mt-1">{errors.platforms.message}</p>}
            </div>

            <div className="mb-5 pb-5 border-b border-slate-300 dark:border-slate-700">
              <Label className="text-sm font-semibold block mb-2">Release stage</Label>
              <Select onValueChange={(value) => setValue("releaseStage", value)}>
                <SelectTrigger className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500">
                  <SelectValue placeholder="Choose release stage" />
                </SelectTrigger>
                <SelectContent className="rounded-lg z-50 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                  {releaseStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.releaseStage && <p className="text-red-500 text-xs font-medium mt-1">{errors.releaseStage.message}</p>}
            </div>

            <div>
              <Label className="text-sm font-semibold block mb-2">Has your game already been published?</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="published-yes"
                    value="yes"
                    {...register("published", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="published-yes" className="font-normal cursor-pointer text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="published-no"
                    value="no"
                    {...register("published", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="published-no" className="font-normal cursor-pointer text-sm">
                    No
                  </Label>
                </div>
              </div>
              {errors.published && <p className="text-red-500 text-xs font-medium mt-1">{errors.published.message}</p>}
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                "Submit game"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
