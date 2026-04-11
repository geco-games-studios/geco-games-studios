import Link from "next/link"
import MerchandiseCard from "../../components/merchandise-card"

export default function MarketplacePage() {
  const merchandise = [
    {
      title: "GECO T-Shirt",
      category: "Apparel",
      price: "ZMW 250",
      description: "Premium cotton t-shirt with embroidered GECO logo. Available in black, white, and navy.",
      image: "/GECO GAMES merchandise .png",
      rating: 4.8,
    },
    {
      title: "GECO Shambala",
      category: "Accessories",
      price: "ZMW 20",
      description: "Comfortable and stylish shambala bracelet with GECO branding. Perfect for gaming sessions.",
      image: "/GECO GAMES merchandise .png",
      rating: 4.6,
    },
    {
      title: "GECO Bracelet",
      category: "Accessories",
      price: "ZMW 30",
      description: "Durable silicone bracelet featuring the GECO Studios logo. Show your support in style.",
      image: "/GECO GAMES merchandise .png",
      rating: 4.7,
    },
    {
      title: "GECO Snapback Cap",
      category: "Headwear",
      price: "ZMW 180",
      description: "Classic snapback cap with embroidered GECO logo. Adjustable fit for everyone.",
      image: "/GECO GAMES merchandise .png",
      rating: 4.9,
    },
    {
      title: "GECO Premium Pen",
      category: "Stationery",
      price: "ZMW 30",
      description: "High-quality ballpoint pen with elegant GECO branding. Perfect for work or school.",
      image: "/GECO GAMES merchandise .png",
      rating: 4.5,
    },
    {
      title: "GECO Diary",
      category: "Stationery",
      price: "ZMW 280",
      description: "Premium leather-bound diary with GECO Studios branding. Daily planner featuring gaming inspiration.",
      image: "/GECO GAMES merchandise .png",
      rating: 4.8,
    },
    {
      title: "GECO Hoodie",
      category: "Apparel",
      price: "ZMW 380",
      description: "Comfortable and warm hoodie with GECO embroidery. Available in multiple colors.",
      image: "/GECO GAMES merchandise .png",
      rating: 4.9,
    },
    {
      title: "GECO Water Bottle",
      category: "Drinkware",
      price: "ZMW 200",
      description: "Insulated stainless steel water bottle. Keep your beverages at the perfect temperature.",
      image: "/GECO GAMES merchandise .png",
      rating: 4.7,
    },
    {
      title: "GECO Backpack",
      category: "Bags",
      price: "ZMW 450",
      description: "Durable gaming backpack with GECO logo and multiple compartments for all your gear.",
      image: "/GECO GAMES merchandise .png",
      rating: 5.0,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 py-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-cyan-400/20 px-4 py-2 text-sm font-semibold text-cyan-100 uppercase tracking-[0.24em]">
                Official Merch
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
                Rock the GECO brand. Level up your style.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
                Introducing our exclusive GECO Studios merchandise collection. From apparel to accessories, discover what we have to offer.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="#products" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  View collection
                </Link>
                <Link href="/support" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Inquire with us
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Quality</p>
                  <p className="mt-3 text-3xl font-semibold">Premium Materials</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-8">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Shipping</p>
                  <p className="mt-3 text-3xl font-semibold">Worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-6 lg:px-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Exclusive Collection
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Wear your passion. Support the studio.
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              High-quality merchandise representing GECO Studios excellence
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {merchandise.map((item) => (
              <MerchandiseCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-12 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What we offer
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900 mb-6">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Carefully selected products featuring GECO branding and quality craftsmanship.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Diverse Collection</h3>
              <p className="text-slate-600 dark:text-slate-400">
                From apparel to accessories, a wide range of merchandise to choose from.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">GECO Branding</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Showcase your support for GECO Studios and our creative vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Interested in GECO merchandise?
          </h2>
          <p className="mt-6 text-lg text-white/90">
            Get in touch with us to learn more about our merchandise collection and availability.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="#products"
              className="inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-slate-100"
            >
              View all items
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
