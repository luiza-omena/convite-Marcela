import { motion } from 'framer-motion';
import { TimelineItem } from './sections/TimelineItem';
import { assetUrl } from '@/lib/utils';

const milestones = [
  {
    year: '2011',
    title: 'Foi aqui que tudo começou',
    description: 'cheguei ao mundo pronta pra viver com muita intensidade.',
    image: assetUrl('/timeline/marcela1.jpeg'),
  },
  {
    year: '',
    title: 'Curiosa desde sempre',
    description: 'observando tudo e aprontando um pouquinho também.',
    image: assetUrl('/timeline/marcela2.jpeg'),
  },
  {
    year: '',
    title: 'Chegaram meus irmãos',
    description: 'e meu mundo ficou ainda mais completo',
    image: assetUrl('/timeline/marcela3.jpeg'),
  },
  {
    year: '',
    title: 'Nosso maior presente',
    description: 'ter você como a melhor mãe do mundo',
    image: assetUrl('/timeline/marcela4.jpeg'),
  },
  {
    year: '',
    title: 'Tentei carreira de bailarina',
    description: 'e até que eu tava arrasando',
    image: assetUrl('/timeline/marcela5.jpeg'),
  },
  {
    year: '',
    title: 'Minha base, meu tudo',
    description: 'com eles, qualquer momento vira festa',
    image: assetUrl('/timeline/marcela6.jpeg'),
  },
  {
    year: '',
    title: 'Curtindo e amando cada momento',
    description: 'com quem faz tudo ser ainda melhor',
    image: assetUrl('/timeline/marcela7.jpeg'),
  },
  {
    year: '',
    title: 'Colecionando conquistas',
    description: 'porque sonhar grande sempre fez parte de mim',
    image: assetUrl('/timeline/marcela8.jpeg'),
  },
  {
    year: '',
    title: 'Entre notas e sentimentos',
    description: 'aprendi a transformar emoção em música',
    image: assetUrl('/timeline/marcela9.jpeg'),
  },

  {
    year: '2026',
    title: 'E agora… estou prestes a completar 15 anos',
    description: 'pronta pra viver tudo que ainda está por vir',
    image: assetUrl('/timeline/marcela10.jpeg'),
  },
];

export default function Timeline() {
  return (
    <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-bold text-center mb-16 font-timeline bg-clip-text text-transparent"
        style={{ backgroundImage: 'linear-gradient(to right, #fcd34d, #a78bfa, #818cf8)' }}
      >
        Trajetória de Ma
      </motion.h2>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px sm:w-px bg-gradient-to-b from-amber-200/40 via-violet-400/30 to-transparent -translate-x-1/2" />
        {milestones.map((item, i) => (
          <TimelineItem key={`${item.title}-${i}`} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
