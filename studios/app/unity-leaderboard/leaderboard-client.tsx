"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"

type LeaderboardEntry = {
  playerId: string
  playerName: string
  score: number
  updatedAt: string
}

type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[]
  updatedAt?: string
  storage?: string
}

const unityExample = `using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

public class UnityLeaderboardSubmitter : MonoBehaviour
{
    [SerializeField] private string endpoint = "https://YOUR_DOMAIN/api/unity-leaderboard";
    [SerializeField] private string apiKey = "";

    public void SubmitScore(string playerId, string playerName, int score)
    {
        StartCoroutine(PostScore(playerId, playerName, score));
    }

    private IEnumerator PostScore(string playerId, string playerName, int score)
    {
        string json = JsonUtility.ToJson(new ScorePayload
        {
            playerId = playerId,
            playerName = playerName,
            score = score
        });

        using UnityWebRequest request = new UnityWebRequest(endpoint, "POST");
        byte[] body = Encoding.UTF8.GetBytes(json);
        request.uploadHandler = new UploadHandlerRaw(body);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            request.SetRequestHeader("x-api-key", apiKey);
        }

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError(request.error + " " + request.downloadHandler.text);
        }
        else
        {
            Debug.Log("Leaderboard updated: " + request.downloadHandler.text);
        }
    }

    [System.Serializable]
    private class ScorePayload
    {
        public string playerId;
        public string playerName;
        public int score;
    }
}`

const buttonPlayers = [
  { playerId: "sir-bacon", playerName: "Sir Bacon" },
  { playerId: "lord-stove", playerName: "Lord Stove" },
  { playerId: "master-pantoise", playerName: "Master Pantoise" },
  { playerId: "myekule", playerName: "Myekule" },
]

export default function UnityLeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [lastMessage, setLastMessage] = useState("Ready for Unity Editor data")
  const [isPosting, setIsPosting] = useState(false)

  const totalScore = useMemo(() => entries.reduce((sum, entry) => sum + entry.score, 0), [entries])

  const loadLeaderboard = useCallback(async () => {
    const response = await fetch("/api/unity-leaderboard", { cache: "no-store" })
    const data = (await response.json()) as LeaderboardResponse
    setEntries(data.leaderboard)
  }, [])

  useEffect(() => {
    loadLeaderboard().catch(() => setLastMessage("Could not load leaderboard"))
    const timer = window.setInterval(() => {
      loadLeaderboard().catch(() => undefined)
    }, 2500)

    return () => window.clearInterval(timer)
  }, [loadLeaderboard])

  const submitScore = async (playerId: string, playerName: string, currentScore = 0) => {
    setIsPosting(true)
    const nextScore = currentScore + 10

    try {
      const response = await fetch("/api/unity-leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, playerName, score: nextScore }),
      })

      if (!response.ok) {
        throw new Error(`Score rejected: ${response.status}`)
      }

      const data = (await response.json()) as LeaderboardResponse
      setEntries(data.leaderboard)
      setLastMessage(`${playerName} submitted ${nextScore}`)
    } catch (error) {
      setLastMessage(error instanceof Error ? error.message : "Score submission failed")
    } finally {
      setIsPosting(false)
    }
  }

  const resetScores = async () => {
    setIsPosting(true)

    try {
      const response = await fetch("/api/unity-leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      })

      if (!response.ok) {
        throw new Error(`Reset rejected: ${response.status}`)
      }

      const data = (await response.json()) as LeaderboardResponse
      setEntries(data.leaderboard)
      setLastMessage("Leaderboard reset")
    } catch (error) {
      setLastMessage(error instanceof Error ? error.message : "Reset failed")
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div data-leaderboard-root className="min-h-screen w-full overflow-x-hidden bg-[#07196d] bg-[linear-gradient(rgba(7,25,109,.84),rgba(0,111,207,.84)),url('/leaderboard-reference.webp')] bg-cover bg-center px-0 py-0 text-white sm:px-4 sm:py-10">
      <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:mx-auto lg:max-w-6xl lg:grid-cols-[410px_1fr]">
        <section data-phone-shell className="w-full min-w-0 max-w-full overflow-hidden rounded-none border-0 border-[#061238] bg-gradient-to-b from-[#10a9f6] via-[#096bd0] to-[#052481] shadow-2xl sm:mx-auto sm:max-w-[410px] sm:rounded-[28px] sm:border-8">
          <header className="grid h-24 min-w-0 grid-cols-[46px_minmax(0,1fr)_auto_42px] items-center gap-2 border-b-4 border-[#05206c] bg-gradient-to-b from-[#16c1ff] to-[#0c7adb] px-3 pt-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl border-2 border-[#29baff] bg-gradient-to-b from-[#1973d0] to-[#083f9f] text-sm font-black shadow-inner">
              LV
            </div>
            <div>
              <p className="m-0 text-sm font-black uppercase [text-shadow:0_2px_#00194f]">LEV M.</p>
              <p className="mt-1 w-fit rounded bg-[#06296e] px-2 py-0.5 text-[10px] font-black text-[#ffd51d]">RANK 6</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[#083071] px-3 py-2 text-xs font-black text-[#ffd51d]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#20ff32]" />
              ONLINE: 10
            </div>
            <Link className="grid h-9 w-9 place-items-center rounded-lg border-2 border-[#29baff] bg-[#083f9f] font-black" href="/unity-leaderboard">
              X
            </Link>
          </header>

          <div className="m-4 rounded-xl border-4 border-[#18a9ff] bg-gradient-to-b from-[#0744a0]/95 to-[#052480]/95 p-6 text-center">
            <p className="text-lg font-black uppercase [text-shadow:0_3px_#00194f]">Prize Pool</p>
            <h1 className="my-2 break-words text-4xl font-black leading-none text-[#ffd51d] [text-shadow:0_4px_#8c4c00] sm:text-5xl">{totalScore} pts</h1>
            <p className="text-sm font-black text-[#ffd51d] [text-shadow:0_2px_#00194f]">{lastMessage}</p>
            <div className="mx-auto mt-3 w-44 rounded-full border-4 border-[#06296e] bg-[linear-gradient(90deg,#58ff24_0_34%,#d9edff_34%)] px-3 py-1 text-sm font-black text-[#061238]">
              LIVE API
            </div>
          </div>

          <div className="m-4 rounded-xl border-4 border-[#18a9ff] bg-gradient-to-b from-[#0744a0]/95 to-[#052480]/95 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black uppercase [text-shadow:0_3px_#00194f]">Game Page</h2>
              <button
                className="rounded-md bg-gradient-to-b from-[#51f032] to-[#16a50a] px-3 py-2 text-[10px] font-black uppercase disabled:opacity-60"
                disabled={isPosting}
                onClick={resetScores}
                type="button"
              >
                Reset
              </button>
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-3">
              {buttonPlayers.map((player) => {
                const currentScore = entries.find((entry) => entry.playerId === player.playerId)?.score ?? 0

                return (
                  <button
                    className="min-h-36 min-w-0 rounded-xl border-2 border-[#2eafff] bg-gradient-to-b from-[#1d88e8] to-[#053d9a] p-3 text-left shadow-[0_5px_0_#031d66] active:translate-y-1 active:shadow-[0_1px_0_#031d66] disabled:opacity-60"
                    disabled={isPosting}
                    key={player.playerId}
                    onClick={() => submitScore(player.playerId, player.playerName, currentScore)}
                    type="button"
                  >
                    <span className="mb-3 grid h-16 w-14 place-items-center rounded-lg border-2 border-[#42c3ff] bg-gradient-to-b from-[#ffb21a] to-[#a73c13] text-2xl text-[#ffd51d]">*</span>
                    <span className="block text-sm font-black [text-shadow:0_2px_#00194f]">{player.playerName}</span>
                    <span className="block text-2xl font-black text-[#ffd51d] [text-shadow:0_3px_#8c4c00]">{currentScore}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[720px] space-y-5 px-3 pb-8 sm:px-0">
          <div className="rounded-xl border-4 border-[#18a9ff] bg-gradient-to-b from-[#0744a0] to-[#052480] p-4 shadow-2xl">
            <div className="mb-3 grid grid-cols-[36px_1fr_36px] items-center gap-3">
              <Link className="grid h-9 w-9 place-items-center rounded-lg border-2 border-[#29baff] bg-[#083f9f] font-black" href="/">
                &lt;
              </Link>
              <h2 className="text-center text-3xl font-black uppercase text-[#ffd51d] [text-shadow:0_3px_#8c4c00]">Leaderboard</h2>
              <button className="grid h-9 w-9 place-items-center rounded-lg border-2 border-[#29baff] bg-[#083f9f] font-black" onClick={loadLeaderboard} type="button">
                R
              </button>
            </div>
            <div className="grid grid-cols-[70px_1fr_110px] bg-[#05206c] px-3 py-2 text-xs font-black uppercase">
              <span>Rank</span>
              <span>Name</span>
              <span className="text-right">Highest Floor</span>
            </div>
            <ol className="m-0 list-none p-0">
              {entries.map((entry, index) => (
                <li
                  className={`grid min-h-12 grid-cols-[70px_1fr_110px] items-center gap-2 border-b border-white/15 px-3 py-2 text-sm font-black [text-shadow:0_2px_#00194f] ${
                    index === 0 ? "bg-[#064eaf] shadow-[inset_0_0_0_3px_#ffd51d]" : index % 2 === 0 ? "bg-[#0d95e7]" : "bg-[#0876ce]"
                  }`}
                  key={entry.playerId}
                >
                  <span className="text-[#ffd51d]">{index + 1}.</span>
                  <span>{entry.playerName}</span>
                  <span className="text-right text-[#ffd51d]">{entry.score}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-sky-300/40 bg-slate-950/80 p-5 shadow-2xl">
            <h2 className="text-xl font-black text-[#ffd51d]">Unity Editor feed</h2>
            <p className="mt-2 font-sans text-sm font-semibold text-sky-100">
              POST scores to <code className="rounded bg-white/10 px-1">/api/unity-leaderboard</code>. The page polls the API every 2.5 seconds, so scores sent from Play Mode will appear here.
            </p>
            <pre className="mt-4 max-h-96 overflow-auto rounded-md bg-black p-4 text-xs leading-relaxed text-sky-100">
              <code>{unityExample}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  )
}
