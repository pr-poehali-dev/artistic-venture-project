import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import PortfolioSection from '@/components/PortfolioSection';
import { submitOrder } from '@/api';

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

export default function Index() {
  const [form, setForm] = useState({ name: '', phone: '', description: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const res = await submitOrder(form);
    if (res.ok) {
      setStatus('success');
      setForm({ name: '', phone: '', description: '' });
    } else {
      setStatus('error');
    }
  }

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

      {/* Portfolio */}
      <PortfolioSection />

      {/* Order Form */}
      <section id="order-form" className="bg-neutral-950 py-24">
        <div className="container mx-auto max-w-xl px-8 md:px-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
            Оставить заявку
          </p>
          <h2 className="mb-10 text-3xl font-light text-white md:text-4xl">
            Расскажите о вашем заказе
          </h2>

          {status === 'success' ? (
            <div className="border border-green-500/30 bg-green-500/10 p-8">
              <p className="text-lg font-light text-green-300">Заявка принята!</p>
              <p className="mt-2 text-sm text-white/50">Мы свяжемся с вами в течение 15 минут.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 text-xs text-white/40 underline hover:text-white"
              >
                Отправить ещё одну
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-white"
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-white"
              />
              <textarea
                rows={4}
                placeholder="Опишите ваш заказ"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="resize-none border-b border-white/20 bg-transparent py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-white"
              />
              {status === 'error' && (
                <p className="text-sm text-red-400">Что-то пошло не так. Попробуйте ещё раз.</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-4 inline-flex items-center justify-center bg-white px-8 py-4 text-sm font-semibold uppercase tracking-widest text-black transition-all hover:bg-white/90 active:scale-95 disabled:opacity-50"
              >
                {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-8 md:px-16">
          <p className="text-sm text-white/30">© 2026 · Все права защищены</p>
          <a
            href="/admin"
            className="text-xs text-white/20 transition-colors hover:text-white/50"
          >
            Личный кабинет
          </a>
        </div>
      </footer>
    </main>
  );
}
