"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { postJson, postFormData, putFormData, patchJson, fetchJson } from "@/lib/api"

interface SubmitGameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGameCreated: (game: any) => void
  onGameUpdated?: (game: any) => void
  developerName?: string
  studioName?: string
  editGame?: Game | null
}

interface Game {
  id: number
  title: string
  description: string
  platforms: string[]
  status: string
  version: string
  average_rating: number
  developer_name: string
  studio_name: string
  game_image: string
  screenshot_1?: string
  screenshot_2?: string
  screenshot_3?: string
  screenshot_4?: string
  gameplay_video?: string
  game_currency?: string
  has_iaps: boolean
  iap_provider?: string | null
  has_ads: boolean
  ad_provider?: string | null
  api_key: string
}

export function SubmitGameDialog({
  open,
  onOpenChange,
  onGameCreated,
  onGameUpdated,
  developerName,
  studioName,
  editGame,
}: SubmitGameDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platforms: [] as string[],
    status: "production",
    version: "1.0.0",
    studio_name: studioName || "",
    game_currency: "ZMW",
    has_iaps: false,
    iap_provider: "",
    has_ads: false,
    ad_provider: "",
    screenshot_1: "",
    screenshot_2: "",
    screenshot_3: "",
    screenshot_4: "",
  })
  const [fileInputs, setFileInputs] = useState<{
    game_image_file: File | null
    screenshot_1_file: File | null
    screenshot_2_file: File | null
    screenshot_3_file: File | null
    screenshot_4_file: File | null
    gameplay_video_file: File | null
  }>({
    game_image_file: null,
    screenshot_1_file: null,
    screenshot_2_file: null,
    screenshot_3_file: null,
    screenshot_4_file: null,
    gameplay_video_file: null,
  })
  const [platforms, setPlatforms] = useState<string[]>([])
  const [statuses, setStatuses] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [createdGame, setCreatedGame] = useState<Game | null>(null)

  useEffect(() => {
    if (!open) {
      setSubmitError("")
      setCreatedGame(null)
      setFormData({
        title: "",
        description: "",
        platforms: [],
        status: "production",
        version: "1.0.0",
        studio_name: studioName || "",
        game_currency: "ZMW",
        has_iaps: false,
        iap_provider: "",
        has_ads: false,
        ad_provider: "",
        screenshot_1: "",
        screenshot_2: "",
        screenshot_3: "",
        screenshot_4: "",
      })
      setFileInputs({
        game_image_file: null,
        screenshot_1_file: null,
        screenshot_2_file: null,
        screenshot_3_file: null,
        screenshot_4_file: null,
        gameplay_video_file: null,
      })
    } else if (editGame) {
      // Populate form with existing game data for editing
      setFormData({
        title: editGame.title,
        description: editGame.description,
        platforms: editGame.platforms,
        status: editGame.status,
        version: editGame.version,
        studio_name: editGame.studio_name,
        game_currency: editGame.game_currency || "ZMW",
        has_iaps: editGame.has_iaps,
        iap_provider: editGame.iap_provider || "",
        has_ads: editGame.has_ads,
        ad_provider: editGame.ad_provider || "",
        screenshot_1: editGame.screenshot_1 || "",
        screenshot_2: editGame.screenshot_2 || "",
        screenshot_3: editGame.screenshot_3 || "",
        screenshot_4: editGame.screenshot_4 || "",
      })
    }
  }, [open, studioName, editGame])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const platformsData = await fetchJson<string[]>("developer/games/platforms/")
        if (Array.isArray(platformsData)) {
          setPlatforms(platformsData)
        } else {
          console.warn("Platforms data is not an array, using defaults")
          setPlatforms(["pc", "web", "ios", "android", "ps", "xbox", "wii"])
        }
        const statusesData = await fetchJson<string[]>("developer/games/statuses/")
        if (Array.isArray(statusesData)) {
          setStatuses(statusesData)
        } else {
          console.warn("Statuses data is not an array, using defaults")
          setStatuses(["production", "published"])
        }
      } catch (error) {
        console.warn("Failed to fetch platforms/statuses from backend, using defaults")
        setPlatforms(["pc", "web", "ios", "android", "ps", "xbox", "wii"])
        setStatuses(["production", "published"])
      }
    }
    fetchOptions()
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target
    const { name, value } = target
    const type = (target as HTMLInputElement).type
    const checked = (target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target
    setFileInputs((prev) => ({
      ...prev,
      [name]: files?.[0] ?? null,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitError("")

    // Validation
    if (formData.platforms.length === 0) {
      setSubmitError("Please select at least one platform.")
      return
    }
    if (!formData.studio_name || formData.studio_name.trim() === "") {
      setSubmitError("Studio name is required.")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        title: formData.title,
        platforms: formData.platforms,
        status: formData.status,
        version: formData.version,
        studio_name: formData.studio_name,
        description: formData.description,
        game_currency: formData.game_currency,
        has_iaps: formData.has_iaps,
        iap_provider: formData.has_iaps ? formData.iap_provider : "",
        has_ads: formData.has_ads,
        ad_provider: formData.has_ads ? formData.ad_provider : "",
      }

      const useFormData = Boolean(
        fileInputs.game_image_file || fileInputs.gameplay_video_file
      )

      let updatedGame: any

      if (useFormData) {
        const formPayload = new FormData()
        formPayload.append("title", payload.title)
        payload.platforms.forEach((platform) => formPayload.append("platforms", platform))
        formPayload.append("status", payload.status)
        formPayload.append("version", payload.version)
        formPayload.append("studio_name", payload.studio_name)
        if (fileInputs.game_image_file) {
          formPayload.append("game_image", fileInputs.game_image_file)
        }
        if (fileInputs.screenshot_1_file) {
          formPayload.append("screenshot_1", fileInputs.screenshot_1_file)
        }
        if (fileInputs.screenshot_2_file) {
          formPayload.append("screenshot_2", fileInputs.screenshot_2_file)
        }
        if (fileInputs.screenshot_3_file) {
          formPayload.append("screenshot_3", fileInputs.screenshot_3_file)
        }
        if (fileInputs.screenshot_4_file) {
          formPayload.append("screenshot_4", fileInputs.screenshot_4_file)
        }
        if (fileInputs.gameplay_video_file) {
          formPayload.append("gameplay_video", fileInputs.gameplay_video_file)
        }
        formPayload.append("description", payload.description)
        formPayload.append("game_currency", payload.game_currency)
        formPayload.append("has_iaps", String(payload.has_iaps))
        formPayload.append("iap_provider", payload.iap_provider)
        formPayload.append("has_ads", String(payload.has_ads))
        formPayload.append("ad_provider", payload.ad_provider)

        if (editGame) {
          updatedGame = await putFormData<any>(`developer/games/${editGame.id}/`, formPayload)
        } else {
          updatedGame = await postFormData<any>("developer/games/", formPayload)
        }
      } else {
        if (editGame) {
          updatedGame = await patchJson<any>(`developer/games/${editGame.id}/`, payload)
        } else {
          updatedGame = await postJson<any>("developer/games/", payload)
        }
      }

      if (editGame && onGameUpdated) {
        onGameUpdated(updatedGame)
      } else {
        onGameCreated(updatedGame)
      }
      setCreatedGame(updatedGame)
    } catch (error) {
      console.error("Submit game error:", error)
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit game."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-white border border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>{editGame ? "Edit Game" : "Submit a New Game"}</DialogTitle>
          <DialogDescription>
            {editGame ? "Update your game details below." : "Fill in the game details below to create a new developer game record."}
          </DialogDescription>
        </DialogHeader>

        {createdGame ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-200">
              Game "{createdGame.title}" {editGame ? "updated" : "created"} successfully!
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                API Key
              </label>
              <div className="flex gap-2">
                <Input
                  value={createdGame.api_key}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(createdGame.api_key)}
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Keep this API key safe. You'll need it to integrate your game with our platform.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[72vh] overflow-y-auto pr-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Title
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Version
              </label>
              <Input
                name="version"
                value={formData.version}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Studio Name
              </label>
              <Input
                name="studio_name"
                value={formData.studio_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Game Currency
              </label>
              <Input
                name="game_currency"
                value={formData.game_currency}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Platforms
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Array.isArray(platforms) ? platforms.map((platform) => (
                <label key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          platforms: [...prev.platforms, platform],
                        }))
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          platforms: prev.platforms.filter((p) => p !== platform),
                        }))
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">{platform.toUpperCase()}</span>
                </label>
              )) : null}
            </div>
          </div>
            <div>
              <label htmlFor="status" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-white text-slate-950 dark:bg-slate-900 dark:text-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
              >
                {Array.isArray(statuses) ? statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                )) : null}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-input bg-white text-slate-950 dark:bg-slate-900 dark:text-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Game Image
              </label>
              <input
                type="file"
                name="game_image_file"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload game image file"
                className="w-full rounded-md border border-input bg-white text-slate-950 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
              />
              {fileInputs.game_image_file && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Selected file: {fileInputs.game_image_file.name}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Gameplay Video
              </label>
              <input
                type="file"
                name="gameplay_video_file"
                accept="video/*"
                onChange={handleFileChange}
                aria-label="Upload gameplay video file"
                className="w-full rounded-md border border-input bg-white text-slate-950 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
              />
              {fileInputs.gameplay_video_file && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Selected file: {fileInputs.gameplay_video_file.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Screenshot 1
              </label>
              <input
                type="file"
                name="screenshot_1_file"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload screenshot 1 file"
                className="w-full rounded-md border border-input bg-white text-slate-950 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
              />
              {fileInputs.screenshot_1_file && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Selected file: {fileInputs.screenshot_1_file.name}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Screenshot 2
              </label>
              <input
                type="file"
                name="screenshot_2_file"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload screenshot 2 file"
                className="w-full rounded-md border border-input bg-white text-slate-950 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
              />
              {fileInputs.screenshot_2_file && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Selected file: {fileInputs.screenshot_2_file.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Screenshot 3
              </label>
              <input
                type="file"
                name="screenshot_3_file"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload screenshot 3 file"
                className="w-full rounded-md border border-input bg-white text-slate-950 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
              />
              {fileInputs.screenshot_3_file && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Selected file: {fileInputs.screenshot_3_file.name}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Screenshot 4
              </label>
              <input
                type="file"
                name="screenshot_4_file"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload screenshot 4 file"
                className="w-full rounded-md border border-input bg-white text-slate-950 px-3 py-2 text-sm dark:bg-slate-900 dark:text-white"
              />
              {fileInputs.screenshot_4_file && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Selected file: {fileInputs.screenshot_4_file.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Screenshot 1 URL
              </label>
              <Input
                name="screenshot_1"
                value={formData.screenshot_1}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Screenshot 2 URL
              </label>
              <Input
                name="screenshot_2"
                value={formData.screenshot_2}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Screenshot 3 URL
              </label>
              <Input
                name="screenshot_3"
                value={formData.screenshot_3}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Screenshot 4 URL
              </label>
              <Input
                name="screenshot_4"
                value={formData.screenshot_4}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <input
                id="has_iaps"
                name="has_iaps"
                type="checkbox"
                checked={formData.has_iaps}
                onChange={handleChange}
                className="h-4 w-4 rounded border-input text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="has_iaps" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Has in app purchases?
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="has_ads"
                name="has_ads"
                type="checkbox"
                checked={formData.has_ads}
                onChange={handleChange}
                className="h-4 w-4 rounded border-input text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="has_ads" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Has Ads?
              </label>
            </div>
          </div>

          {formData.has_iaps && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                IAP Provider
              </label>
              <Input
                name="iap_provider"
                value={formData.iap_provider}
                onChange={handleChange}
                placeholder="com.example.iap"
              />
            </div>
          )}

          {formData.has_ads && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Ad Provider
              </label>
              <Input
                name="ad_provider"
                value={formData.ad_provider}
                onChange={handleChange}
                placeholder="AdMob, Unity"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Game Currency
            </label>
            <Input
              name="game_currency"
              value={formData.game_currency}
              onChange={handleChange}
              placeholder="ZMW"
            />
          </div>

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
              {submitError}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (editGame ? "Update Game" : "Submit Game")}
            </Button>
          </DialogFooter>
          </form>
        )}

        <DialogClose asChild>
          <button className="absolute right-4 top-4 rounded-full border border-transparent bg-slate-100/80 px-3 py-1 text-slate-700 opacity-70 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-slate-800/90 dark:text-slate-200">
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
