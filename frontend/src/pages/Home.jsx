import EventList from '../components/events/EventList.jsx';

export default function Home() {
  return (
    <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
      <div className="text-center max-w-4xl mb-24">
        <div className="inline-block px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-800 text-sm font-semibold mb-6 animate-pulse">
          The 2026 Season
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-stone-900 leading-tight mb-6 tracking-tight">
          Curated Experiences. <br />
          <span className="text-orange-800 italic">Unforgettable Nights.</span>
        </h1>
        <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto">
          Secure your spot at the most exclusive live events. A completely seamless booking
          experience designed for true enthusiasts.
        </p>
      </div>

      <div className="w-full max-w-6xl pb-32">
        <div className="flex justify-between items-end mb-8 border-b border-stone-200 pb-4">
          <h2 className="text-2xl font-bold text-stone-800">Trending Now</h2>
        </div>

        <EventList />
      </div>
    </div>
  );
}
