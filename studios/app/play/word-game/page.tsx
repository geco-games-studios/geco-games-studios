export default function WordGamePage() {
  return (
    <main className="fixed inset-0 z-[100] flex h-dvh w-dvw items-center justify-center overflow-hidden bg-black overscroll-none sm:bg-slate-950">
      <iframe
        src="/play/word-game/index.html"
        title="Word Game"
        className="block h-dvh w-dvw border-0 bg-black sm:h-[min(100dvh,calc(100dvw*16/9))] sm:max-h-dvh sm:w-[min(100dvw,calc(100dvh*9/16))] sm:max-w-[430px]"
        allow="fullscreen; autoplay; gamepad; pointer-lock; screen-wake-lock"
        allowFullScreen
        scrolling="no"
      />
    </main>
  )
}
