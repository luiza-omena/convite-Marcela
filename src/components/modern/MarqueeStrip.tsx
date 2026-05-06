import { MARQUEE_ITEMS } from '@/components/shared/constants';

export function MarqueeStrip() {
  const repeatedItems = Array.from({ length: 6 }, () => MARQUEE_ITEMS).flat();

  return (
    <div className="overflow-hidden py-6 border-y border-white/[0.08]">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 gap-12 pr-12">
            {repeatedItems.map((item, i) => (
              <span key={`${group}-${i}`} className="flex items-center gap-12">
                <span className="font-modern text-xl sm:text-2xl font-bold whitespace-nowrap opacity-30 hover:opacity-100 hover:text-violet-300 transition-all duration-300 cursor-default">
                  {item}
                </span>

                <span className="text-amber-200/60 opacity-50">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
