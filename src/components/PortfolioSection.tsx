import { useEffect, useState } from 'react';
import { getPortfolio } from '@/api';

type PortfolioItem = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
};

const FALLBACK_IMAGES = [
  'https://cdn.poehali.dev/templates/creative-portfolio-ru/gallery-1.jpg',
  'https://cdn.poehali.dev/templates/creative-portfolio-ru/gallery-2.jpg',
  'https://cdn.poehali.dev/templates/creative-portfolio-ru/gallery-4.jpg',
  'https://cdn.poehali.dev/templates/creative-portfolio-ru/gallery-5.jpg',
  'https://cdn.poehali.dev/templates/creative-portfolio-ru/gallery-1.jpg',
  'https://cdn.poehali.dev/templates/creative-portfolio-ru/gallery-2.jpg',
];

export default function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    getPortfolio().then((data) => {
      if (data.items) setItems(data.items);
    });
  }, []);

  return (
    <section className="bg-neutral-900 py-24">
      <div className="container mx-auto px-8 md:px-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
          Портфолио
        </p>
        <h2 className="mb-16 text-3xl font-light text-white md:text-4xl">Наши работы</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.id} className="group relative overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-lg font-semibold text-white">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm text-white/70">{item.description}</p>
                )}
              </div>
              <div className="mt-4">
                <p className="font-medium text-white">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm text-white/50">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
