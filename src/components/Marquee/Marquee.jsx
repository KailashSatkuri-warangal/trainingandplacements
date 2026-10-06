import { MARQUEE_ITEMS } from "../../data/siteContent";

export default function Marquee() {
  const repeatedItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      className="py-5 bg-[#111318] text-white border-y border-neutral-800 overflow-hidden select-none"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] space-x-8 items-center">
        {repeatedItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-8 flex-shrink-0">
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-300 hover:text-emerald-400 transition-colors">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-60" />
          </div>
        ))}
      </div>
    </div>
  );
}
