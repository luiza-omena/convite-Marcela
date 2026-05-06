import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TimelineItemProps {
  item: {
    year: string;
    title: string;
    description: string;
    image: string;
  };
  index: number;
}

export function TimelineItem({ item, index }: TimelineItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`flex items-center gap-4 sm:gap-8 mb-12 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'} flex-col sm:flex-row`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className={`flex-1 ${isLeft ? 'sm:text-right' : 'sm:text-left'} text-center`}>
        <div className="glass galaxy-panel galaxy-panel-comet p-5 sm:p-6 inline-block overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl mb-3 mx-auto sm:mx-0"
          />
          {item.year && (
            <span className="text-xs font-timeline opacity-60 block mb-1 tracking-wider">{item.year}</span>
          )}
          <h3 className="text-lg font-semibold font-timeline mb-1">{item.title}</h3>
          <p className="text-sm opacity-70 font-timeline">{item.description}</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-center">
        <div className="w-4 h-4 rounded-full shadow-lg" style={{ background: 'linear-gradient(135deg, #fcd34d, #a78bfa)', boxShadow: '0 0 14px rgba(167,139,250,0.45)' }} />
      </div>

      <div className="flex-1 hidden sm:block" />
    </motion.div>
  );
}
