
import React from 'react';

const HEROES = [
  { name: 'Ahri', img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Yasuo', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Lux', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Jinx', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Garen', img: 'https://images.unsplash.com/photo-1560253023-3ee71f219fa0?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Seraphine', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Zed', img: 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Ezreal', img: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Vi', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Akali', img: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=200&h=200&auto=format&fit=crop' },
];

export const HeroCarousel: React.FC = () => {
  return (
    <section className="py-20 overflow-hidden relative mt-10">
      <div className="text-center mb-12">
        <h2 className="font-orbitron text-2xl font-bold tracking-[0.4em] uppercase text-emerald-200 opacity-60">
          Герои Wild Rift
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-4"></div>
      </div>
      
      <div className="relative">
        <div className="animate-scroll gap-8 md:gap-16 px-8">
          {[...HEROES, ...HEROES].map((hero, idx) => (
            <div key={idx} className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-emerald-500/30 group-hover:border-emerald-400 p-1 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-500">
                <img 
                  src={hero.img} 
                  alt={hero.name} 
                  className="w-full h-full object-cover rounded-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                />
              </div>
              <span className="mt-4 font-orbitron text-[10px] md:text-xs font-bold tracking-widest text-slate-500 group-hover:text-emerald-400 transition-colors uppercase">
                {hero.name}
              </span>
            </div>
          ))}
        </div>

        {/* Masking gradients for smooth entry/exit */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#020617] to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#020617] to-transparent z-10"></div>
      </div>
    </section>
  );
};