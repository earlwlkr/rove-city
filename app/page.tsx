import Link from "next/link";

const featuredCities = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    description: "A city where tradition meets the future — neon-lit alleys, ancient temples, and world-class cuisine.",
    emoji: "🗼",
    tag: "Asia",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    description: "The City of Light beckons with iconic art, Haussmann boulevards, and bistros on every corner.",
    emoji: "🗺️",
    tag: "Europe",
  },
  {
    id: "new-york",
    name: "New York",
    country: "USA",
    description: "The city that never sleeps — skylines, street food, museums, and boundless energy.",
    emoji: "🗽",
    tag: "Americas",
  },
  {
    id: "ho-chi-minh-city",
    name: "Ho Chi Minh City",
    country: "Vietnam",
    description: "A vibrant metropolis of motorbikes, French-colonial architecture, and incredible street food.",
    emoji: "🛵",
    tag: "Asia",
  },
  {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    description: "Where mountains meet the ocean — beaches, vineyards, and the iconic Table Mountain.",
    emoji: "🏔️",
    tag: "Africa",
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    description: "A gleaming city-state of Gardens by the Bay, hawker centres, and dazzling skylines.",
    emoji: "🌿",
    tag: "Asia",
  },
];

const tags = ["All", "Asia", "Europe", "Americas", "Africa"];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-stone-900">
            🌍 Rove City
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
            <a href="#explore" className="hover:text-stone-900 transition-colors">Explore</a>
            <a href="#about" className="hover:text-stone-900 transition-colors">About</a>
            <button className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm hover:bg-stone-700 transition-colors">
              Plan a Trip
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="max-w-3xl mx-auto">
          <p className="inline-block text-xs font-semibold tracking-widest text-amber-600 uppercase mb-4 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Your next adventure starts here
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-stone-900 leading-tight mb-6">
            Rove the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              World&#39;s Cities
            </span>
          </h1>
          <p className="text-lg text-stone-500 mb-10 max-w-xl mx-auto">
            Discover curated guides, hidden gems, and local insights for the world&#39;s most exciting cities. Wherever you wander, Rove City has you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#explore"
              className="bg-stone-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-stone-700 transition-colors"
            >
              Start Exploring
            </a>
            <a
              href="#about"
              className="border border-stone-300 text-stone-700 px-8 py-3 rounded-full font-semibold hover:border-stone-500 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-stone-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "100+", label: "Cities" },
            { value: "50+", label: "Countries" },
            { value: "1,000+", label: "Local Tips" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-extrabold text-amber-400">{stat.value}</p>
              <p className="text-sm text-stone-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore */}
      <section id="explore" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-stone-900">Featured Cities</h2>
              <p className="text-stone-500 mt-1">Handpicked destinations worth roving to</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCities.map((city) => (
              <div
                key={city.id}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-6xl">
                  {city.emoji}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg leading-tight">{city.name}</h3>
                      <p className="text-xs text-stone-400">{city.country}</p>
                    </div>
                    <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full">{city.tag}</span>
                  </div>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">{city.description}</p>
                  <button className="text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors group-hover:underline">
                    Explore {city.name} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 bg-stone-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">Why Rove City?</h2>
          <p className="text-stone-500 text-lg mb-12">
            We believe travel is about genuine discovery. Not tourist traps — real neighbourhoods, real flavours, real stories.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: "🗺️", title: "Curated Guides", desc: "Every city guide is crafted by locals and seasoned travellers." },
              { icon: "⚡", title: "Real-time Tips", desc: "Up-to-date recommendations so you never miss what's happening now." },
              { icon: "💬", title: "Community Driven", desc: "Thousands of traveller reviews and insider notes from the ground." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-stone-200">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-stone-900 mb-2">{f.title}</h3>
                <p className="text-sm text-stone-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-stone-900 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Rove?</h2>
          <p className="text-stone-400 mb-8">
            Join thousands of explorers discovering the world one city at a time.
          </p>
          <button className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3 rounded-full transition-colors">
            Get Started — It&#39;s Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8 px-6 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Rove City. Built with ❤️ for explorers everywhere.
      </footer>
    </main>
  );
}
