import HeroSection from '@/components/HeroSection';

const features = [
  {
    icon: '📥',
    title: 'Заявки в одном месте',
    desc: 'Клиенты оставляют заказы — вы сразу видите их в личном кабинете.',
  },
  {
    icon: '👷',
    title: 'Распределение по исполнителям',
    desc: 'Назначайте задачи нужному работнику в пару кликов.',
  },
  {
    icon: '🔔',
    title: 'Мгновенные уведомления',
    desc: 'Исполнитель получает уведомление о новом заказе сразу после назначения.',
  },
];

const Index = () => {
  return (
    <main>
      <HeroSection />

      {/* Features */}
      <section className="bg-black py-24">
        <div className="container mx-auto px-8 md:px-16">
          <p className="mb-16 text-xs font-semibold uppercase tracking-widest text-white/40">
            Как это работает
          </p>
          <div className="grid gap-12 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col gap-4">
                <span className="text-4xl">{f.icon}</span>
                <h3 className="text-xl font-semibold text-white">{f.title}</h3>
                <p className="text-base font-light leading-relaxed text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section id="order-form" className="bg-neutral-950 py-24">
        <div className="container mx-auto max-w-xl px-8 md:px-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
            Оставить заявку
          </p>
          <h2 className="mb-10 text-3xl font-light text-white md:text-4xl">
            Расскажите о вашем заказе
          </h2>
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Ваше имя"
              className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-white"
            />
            <input
              type="tel"
              placeholder="Телефон"
              className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-white"
            />
            <textarea
              rows={4}
              placeholder="Опишите ваш заказ"
              className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-white resize-none"
            />
            <button
              type="submit"
              className="mt-4 inline-flex items-center justify-center rounded-none bg-white px-8 py-4 text-sm font-semibold uppercase tracking-widest text-black transition-all hover:bg-white/90 active:scale-95"
            >
              Отправить заявку
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10">
        <div className="container mx-auto px-8 md:px-16">
          <p className="text-sm text-white/30">© 2026 · Все права защищены</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
