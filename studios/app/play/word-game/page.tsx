export default function WordGamePage() {
  return (
    <main className="fixed inset-0 z-[100] h-dvh w-dvw overflow-hidden bg-black overscroll-none">
      <iframe
        src="/play/word-game/index.html"
        title="Word Game"
        className="block h-dvh w-dvw border-0"
        allow="fullscreen; autoplay; gamepad; pointer-lock; screen-wake-lock"
        allowFullScreen
        scrolling="no"
      />
    </main>
  )
}
