export default function WordGamePage() {
  return (
    <main className="fixed inset-0 z-[100] bg-black">
      <iframe
        src="/play/word-game/index.html"
        title="Word Game"
        className="h-full w-full border-0"
        allow="fullscreen; autoplay"
      />
    </main>
  )
}
