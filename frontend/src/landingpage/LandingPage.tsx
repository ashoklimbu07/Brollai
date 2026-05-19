import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './landingPage.css';
import { features, pricing, stats, steps, tickerItems } from './landingPageData';

const sectionPad = 'px-5 md:px-12';

/* Phone frame card with stat above */
function PhoneCard({
  src,
  stat,
  substat,
  scale = 'normal',
}: {
  src: string;
  stat: string;
  substat: string;
  scale?: 'normal' | 'large';
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`flex flex-col items-center gap-3 ${scale === 'large' ? 'z-10' : 'z-0 opacity-90'}`}>
      {/* Stat above */}
      <div className="text-center">
        <p className={`font-['Bebas_Neue'] leading-none tracking-tight text-[#f0ede8] ${scale === 'large' ? 'text-[36px]' : 'text-[28px]'}`}>
          {stat}
        </p>
        <p className="text-[11px] text-[#666666] tracking-[0.5px]">{substat}</p>
      </div>

      {/* Phone frame */}
      <div
        className={`relative rounded-[24px] overflow-hidden border-[3px] border-[#2a2a2a] bg-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${
          scale === 'large' ? 'w-[160px]' : 'w-[130px]'
        }`}
        style={{ aspectRatio: '9/16' }}
      >
        {/* Inner screen bezel */}
        <div className="absolute inset-[3px] rounded-[20px] overflow-hidden bg-[#0a0a0a]">
          <img
            src={src}
            alt={stat}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
          />
          {/* Placeholder shimmer while loading */}
          {!loaded && (
            <div className="absolute inset-0 bg-[#111111] flex items-center justify-center">
              <span className="text-[32px] opacity-10">🎬</span>
            </div>
          )}
        </div>

        {/* Subtle screen glare */}
        <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const revealRef = useRef<HTMLDivElement | null>(null);
  // Double the ticker items so the animation loops seamlessly
  const tickerLoop = useMemo(() => [...tickerItems, ...tickerItems], []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!revealRef.current) return;

    const elements = revealRef.current.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('reveal-visible'), index * 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={revealRef}
      className="bg-[#080808] text-[#f0ede8] min-h-screen overflow-x-hidden font-['DM_Sans']"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap"
      />

      {/* Subtle film grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03] bg-cover"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-4 md:py-5 ${sectionPad} border-b transition-all duration-300 ${
          isScrolled ? 'border-[#222222] bg-[rgba(8,8,8,.92)] backdrop-blur-md' : 'border-transparent'
        }`}
      >
        <a href="#" className="font-['Bebas_Neue'] text-[28px] tracking-[2px]">
          Broll<span className="text-[#ff3c00]">AI</span>
        </a>
        <ul className="hidden md:flex gap-8 text-[13px] uppercase tracking-[.5px] text-[#666666]">
          <li><a className="hover:text-[#f0ede8] transition-colors" href="#how">How It Works</a></li>
          <li><a className="hover:text-[#f0ede8] transition-colors" href="#features">Features</a></li>
          <li><a className="hover:text-[#f0ede8] transition-colors" href="#pricing">Pricing</a></li>
        </ul>
        <button
          className="bg-[#ff3c00] hover:bg-[#ff5a28] text-white text-[13px] font-medium uppercase tracking-[.5px] px-4 md:px-[22px] py-2.5 transition-all duration-200 hover:-translate-y-[1px]"
          onClick={() => navigate('/signup')}
        >
          Start Free
        </button>
      </nav>

      {/* Spacer so content starts below the fixed nav */}
      <div className="h-[57px] md:h-[69px]" />

      {/* Red ticker bar — normal flow, sits right below nav spacer */}
      <div className="w-full h-10 bg-[#ff3c00] overflow-hidden flex items-center opacity-60">
        <div className="flex whitespace-nowrap animate-ticker">
          {tickerLoop.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="font-['Bebas_Neue'] text-base tracking-[3px] text-white px-6 after:content-['✦'] after:ml-3 after:text-white/50"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className={`relative min-h-[calc(100vh-97px)] flex items-center ${sectionPad} py-16 md:py-0`}>
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_30%,rgba(255,60,0,.10)_0%,transparent_60%),radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(255,100,0,.04)_0%,transparent_50%)]" />

        {/* Two-column layout */}
        <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">

          {/* LEFT — headline + CTA */}
          <div className="flex flex-col justify-center">
            <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4 mt-10 md:mt-0">
              Best for Shorts Video
            </p>
            <h1
              data-reveal
              className="reveal-item font-['Bebas_Neue'] leading-[0.92] tracking-[-1px] text-[clamp(64px,9vw,130px)]"
            >
              Generate
              <br />
              <em className="not-italic text-transparent [-webkit-text-stroke:1px_#f0ede8]">Trending</em>
              <br />
              B-Roll <span className="text-[#ff3c00]">Fast.</span>
            </h1>
            <p data-reveal className="reveal-item mt-6 max-w-[400px] text-sm leading-[1.7] text-[#888888]">
              Five AI tools. One workspace. Generate B-roll shot lists, analyze scenes, translate scripts,
              and build short-form stories — without the manual grind.
            </p>
            <div data-reveal className="reveal-item mt-7 flex flex-col items-start gap-2">
              <button
                className="relative overflow-hidden bg-[#ff3c00] hover:bg-[#ff5a28] text-white text-[14px] font-medium tracking-[.5px] py-3.5 px-8 transition-all duration-200 hover:-translate-y-0.5 btn-shine"
                onClick={() => navigate('/signup')}
              >
                Start for Free →
              </button>
              <span className="text-[11px] tracking-[.3px] text-[#555555]">No credit card — 3 free outputs/month</span>
            </div>
          </div>

          {/* RIGHT — 3 phone frames, center elevated, like reference */}
          <div className="hidden md:flex flex-col items-center justify-center gap-4">
            {/* Three phones side by side — center larger and raised */}
            <div className="flex items-end justify-center gap-3">
              <PhoneCard src="/cards/card2.png" stat="10M+" substat="views generated" scale="normal" />
              <PhoneCard src="/cards/card1.png" stat="25M+" substat="views generated" scale="large" />
              <PhoneCard src="/cards/card3.png" stat="8M+"  substat="views generated" scale="normal" />
            </div>
            {/* Tagline below */}
            <p className="text-[11px] text-[#444444] tracking-[0.3px]">
              Made with <span className="text-[#ff3c00]">BrollAI</span> in under 5 minutes
            </p>
          </div>

        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section data-reveal className={`reveal-item bg-[#111111] border-y border-[#222222] ${sectionPad} py-7`}>
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-[#222222] gap-5 md:gap-0">
          {stats.map((stat) => (
            <div key={stat.label} className="md:px-10">
              <div className="font-['Bebas_Neue'] text-[42px] leading-none tracking-[1px] text-[#ff3c00]">
                {stat.value}
              </div>
              <div className="mt-1 text-xs tracking-[1px] uppercase text-[#666666]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className={`${sectionPad} py-16 md:py-[100px]`}>
        <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4">
          How It Works
        </p>
        <h2
          data-reveal
          className="reveal-item font-['Bebas_Neue'] leading-none tracking-[.5px] text-[clamp(40px,6vw,80px)]"
        >
          Three Steps.
          <br />
          Zero Guesswork.
        </h2>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px border border-[#222222] bg-[#222222]">
          {steps.map((step) => (
            <div
              key={step.number}
              data-reveal
              className="reveal-item group bg-[#080808] hover:bg-[#111111] p-8 md:p-10 relative overflow-hidden transition-colors duration-200"
            >
              <div className="font-['Bebas_Neue'] text-[80px] leading-none mb-6 text-[#222222] group-hover:text-[#ff3c00] transition-colors duration-200">
                {step.number}
              </div>
              <div className="text-[28px] mb-4">{step.icon}</div>
              <h3 className="text-lg font-medium mb-3">{step.title}</h3>
              <p className="text-sm leading-[1.7] text-[#888888]">{step.description}</p>
              <span className="absolute left-0 bottom-0 h-0.5 bg-[#ff3c00] w-0 group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={`${sectionPad} py-16 md:py-[100px] bg-[#111111] border-t border-[#222222]`}>
        <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4">
          Features
        </p>
        <h2
          data-reveal
          className="reveal-item font-['Bebas_Neue'] leading-none tracking-[.5px] text-[clamp(40px,6vw,80px)]"
        >
          Every Tool You Need.
          <br />
          Nothing You Don't.
        </h2>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-px border border-[#222222] bg-[#222222]">
          {features.map((feature) => (
            <div
              key={feature.title}
              data-reveal
              className={`reveal-item group relative overflow-hidden bg-[#111111] hover:bg-[#161616] transition-colors duration-200 p-10 md:p-12 ${
                feature.wide ? 'md:col-span-2' : ''
              }`}
            >
              {/* Tag badge */}
              <span className="inline-block text-[10px] tracking-[2px] uppercase text-[#ff3c00] border border-[#ff3c00]/40 py-[3px] px-[10px] mb-5">
                {feature.tag}
              </span>
              <h3 className="text-[22px] font-medium mb-3">{feature.title}</h3>
              <p className="text-sm leading-[1.8] text-[#888888] max-w-[480px]">{feature.description}</p>
              {/* Decorative icon ghost */}
              <span className="absolute right-10 bottom-10 text-[64px] opacity-[0.05] group-hover:opacity-[0.10] group-hover:scale-110 group-hover:-rotate-[5deg] transition-all duration-300 select-none">
                {feature.icon}
              </span>
              {/* Bottom accent line */}
              <span className="absolute left-0 bottom-0 h-0.5 bg-[#ff3c00] w-0 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className={`${sectionPad} py-16 md:py-[100px] border-t border-[#222222]`}>
        <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4">
          Pricing
        </p>
        <h2
          data-reveal
          className="reveal-item font-['Bebas_Neue'] leading-none tracking-[.5px] text-[clamp(40px,6vw,80px)]"
        >
          Simple Pricing.
          <br />
          No Surprises.
        </h2>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#222222] border border-[#222222]">
          {pricing.map((plan) => (
            <article
              key={plan.plan}
              data-reveal
              className={`reveal-item relative bg-[#111111] hover:bg-[#161616] transition-colors duration-200 p-9 md:p-12 ${
                plan.popular ? 'border-t-2 border-[#ff3c00]' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-px left-9 bg-[#ff3c00] text-white text-[10px] tracking-[2px] uppercase py-1 px-3">
                  Most Popular
                </span>
              )}

              <p className="text-[11px] tracking-[3px] uppercase text-[#666666] mb-5">{plan.plan}</p>
              <p className="font-['Bebas_Neue'] leading-none tracking-[-1px] mb-1">
                {plan.amount === '0' ? (
                  <span className="text-[64px]">$0</span>
                ) : (
                  <>
                    <span className="text-2xl align-super">$</span>
                    <span className="text-[56px]">{plan.amount}</span>
                  </>
                )}
              </p>
              <p className="text-[13px] text-[#666666] mb-8">{plan.period}</p>

              <ul className="flex flex-col gap-3 mb-9">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className={`text-sm flex gap-2.5 items-start ${
                      feature.muted ? 'text-[#555555] line-through' : 'text-[#aaaaaa]'
                    }`}
                  >
                    <span className={feature.muted ? 'text-[#555555]' : 'text-[#ff3c00]'}>→</span>
                    {feature.label}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 text-sm font-medium uppercase tracking-[.5px] transition-colors duration-200 ${
                  plan.buttonVariant === 'solid'
                    ? 'bg-[#ff3c00] border border-[#ff3c00] text-white hover:bg-[#ff5a28]'
                    : 'bg-transparent border border-[#333333] text-[#f0ede8] hover:border-[#f0ede8]'
                }`}
                onClick={() => navigate('/signup')}
              >
                {plan.buttonLabel}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`relative overflow-hidden text-center ${sectionPad} py-20 md:py-[120px] bg-[#111111] border-t border-[#222222]`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(255,60,0,.08)_0%,transparent_70%)]" />
        <p data-reveal className="reveal-item text-[11px] tracking-[4px] uppercase text-[#ff3c00] mb-4 relative">
          Get Started Today
        </p>
        <h2
          data-reveal
          className="reveal-item relative font-['Bebas_Neue'] leading-none text-[clamp(48px,8vw,100px)]"
        >
          Stop Wasting Time
          <br />
          <em className="not-italic text-transparent [-webkit-text-stroke:1px_#f0ede8]">On Manual Work.</em>
        </h2>
        <p data-reveal className="reveal-item relative text-base leading-[1.7] text-[#888888] max-w-[440px] mx-auto mt-6 mb-12">
          Five tools. One AI workspace. Start free — no credit card, no friction.
        </p>
        <div data-reveal className="reveal-item relative flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="relative overflow-hidden bg-[#ff3c00] hover:bg-[#ff5a28] text-white text-[15px] font-medium tracking-[.5px] py-4 px-10 transition-all duration-200 hover:-translate-y-0.5 btn-shine"
            onClick={() => navigate('/signup')}
          >
            Try It Free →
          </button>
          <button
            className="bg-transparent border border-[#2a2a2a] hover:border-[#555555] text-[#888888] hover:text-[#f0ede8] text-sm font-medium tracking-[.5px] py-3.5 px-8 transition-colors duration-200"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`${sectionPad} py-8 md:py-10 border-t border-[#222222] flex items-center justify-between`}>
        <div className="font-['Bebas_Neue'] text-[22px] tracking-[2px]">
          Broll<span className="text-[#ff3c00]">AI</span>
        </div>
        <p className="text-xs text-[#555555]">© 2026 BrollAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
