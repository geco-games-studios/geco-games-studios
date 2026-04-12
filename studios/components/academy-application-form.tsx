"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Alert, AlertDescription } from "./ui/alert"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  learningPath: string
  isDeveloper: "yes" | "no"
  languages: string[]
  rolledOutProject: "yes" | "no"
  unity: "yes" | "no"
  unreal: "yes" | "no"
}

export default function AcademyApplicationForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      languages: [],
    },
  })
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const languages = watch("languages")

  const onSubmit = async (data: FormData) => {
    setErrorMessage("")
    setSuccess(false)

    try {
      const response = await fetch("/api/academy-apply", {
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
      // Reset form or show success message
    } catch (error) {
      setErrorMessage("Failed to submit form. Please try again.")
      console.error(error)
    }
  }

  const toggleLanguage = (language: string) => {
    const current = languages || []
    if (current.includes(language)) {
      setValue("languages", current.filter((l) => l !== language))
    } else {
      setValue("languages", [...current, language])
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
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-1">Application Submitted!</h3>
          <p className="text-sm text-green-800 dark:text-green-300">
            Thank you for applying. We've received your application and will review it shortly. Check your email for further instructions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <span className="inline-flex rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-300 uppercase tracking-[0.24em] mb-3">
          🚀 Application Form
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Apply for the Academy</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Complete the form below and submit your details. Our admissions team will review your application and contact you within 5-7 business days.
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

          {/* Personal Information Section */}
          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-5 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20">
                <span className="text-sm">👤</span>
              </div>
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName", { required: "First name is required" })}
                  placeholder="John"
                  className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500"
                />
                {errors.firstName && <p className="text-red-500 text-xs font-medium">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName", { required: "Last name is required" })}
                  placeholder="Doe"
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
                placeholder="john@example.com"
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

            <div className="mt-4 space-y-2">
              <Label htmlFor="learningPath" className="text-sm font-semibold">Learning Path</Label>
              <Select onValueChange={(value) => setValue("learningPath", value)}>
                <SelectTrigger className="h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:border-sky-500 focus:ring-sky-500">
                  <SelectValue placeholder="Choose your learning path..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg z-50 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                  <SelectItem value="complete-game-developer">Complete Game Developer</SelectItem>
                  <SelectItem value="game-design">Game Design & Development</SelectItem>
                  <SelectItem value="csharp-programming">C# Programming for Games</SelectItem>
                  <SelectItem value="web-development">Web Development for Games</SelectItem>
                  <SelectItem value="game-art-3d">Game Art & 3D Modeling</SelectItem>
                  <SelectItem value="game-audio">Game Audio & Sound Design</SelectItem>
                </SelectContent>
              </Select>
              {errors.learningPath && <p className="text-red-500 text-xs font-medium">{errors.learningPath.message}</p>}
            </div>
          </div>

          {/* Questions Section */}
          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                <span className="text-sm">❓</span>
              </div>
              <h3 className="text-lg font-semibold">Experience & Skills</h3>
            </div>

            {/* Are you a software developer? */}
            <div className="mb-5 pb-5 border-b border-slate-300 dark:border-slate-700">
              <Label className="text-sm font-semibold block mb-2">Are you a software developer?</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="developer-yes"
                    value="yes"
                    {...register("isDeveloper", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="developer-yes" className="font-normal cursor-pointer text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="developer-no"
                    value="no"
                    {...register("isDeveloper", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="developer-no" className="font-normal cursor-pointer text-sm">
                    No
                  </Label>
                </div>
              </div>
              {errors.isDeveloper && <p className="text-red-500 text-xs font-medium mt-1">{errors.isDeveloper.message}</p>}
            </div>

            {/* What languages are you familiar with? */}
            <div className="mb-5 pb-5 border-b border-slate-300 dark:border-slate-700">
              <Label className="text-sm font-semibold block mb-2">What programming languages are you familiar with?</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {["Javascript", "C++", "Java", "CSharp", "C"].map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${language}`}
                      checked={languages?.includes(language) || false}
                      onCheckedChange={() => toggleLanguage(language)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`language-${language}`} className="font-normal cursor-pointer text-sm">
                      {language === "CSharp" ? "C#" : language}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.languages && <p className="text-red-500 text-xs font-medium mt-1">{errors.languages.message}</p>}
            </div>

            {/* Have you ever rolled out a full project? */}
            <div className="mb-5 pb-5 border-b border-slate-300 dark:border-slate-700">
              <Label className="text-sm font-semibold block mb-2">Have you ever shipped a complete project?</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="project-yes"
                    value="yes"
                    {...register("rolledOutProject", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="project-yes" className="font-normal cursor-pointer text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="project-no"
                    value="no"
                    {...register("rolledOutProject", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="project-no" className="font-normal cursor-pointer text-sm">
                    No
                  </Label>
                </div>
              </div>
              {errors.rolledOutProject && <p className="text-red-500 text-xs font-medium mt-1">{errors.rolledOutProject.message}</p>}
            </div>

            {/* Do you know Unity 3D? */}
            <div className="mb-5 pb-5 border-b border-slate-300 dark:border-slate-700">
              <Label className="text-sm font-semibold block mb-2">Do you know Unity 3D?</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="unity-yes"
                    value="yes"
                    {...register("unity", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="unity-yes" className="font-normal cursor-pointer text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="unity-no"
                    value="no"
                    {...register("unity", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="unity-no" className="font-normal cursor-pointer text-sm">
                    No
                  </Label>
                </div>
              </div>
              {errors.unity && <p className="text-red-500 text-xs font-medium mt-1">{errors.unity.message}</p>}
            </div>

            {/* Do you know Unreal? */}
            <div>
              <Label className="text-sm font-semibold block mb-2">Do you know Unreal Engine?</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="unreal-yes"
                    value="yes"
                    {...register("unreal", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="unreal-yes" className="font-normal cursor-pointer text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="unreal-no"
                    value="no"
                    {...register("unreal", { required: "Please select an option" })}
                    className="w-4 h-4 cursor-pointer accent-sky-500"
                  />
                  <Label htmlFor="unreal-no" className="font-normal cursor-pointer text-sm">
                    No
                  </Label>
                </div>
              </div>
              {errors.unreal && <p className="text-red-500 text-xs font-medium mt-1">{errors.unreal.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
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
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
