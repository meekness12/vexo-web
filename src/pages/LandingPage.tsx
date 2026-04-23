import React, { useEffect, useRef } from 'react';
import { Shield, Activity, Clock, Zap, Target, Award, Terminal, Share2, ChevronRight, AlertTriangle, Camera, RefreshCw } from 'lucide-react';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addToReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="bg-bg text-white font-display overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-[5%] h-[68px] bg-bg/92 border-b border-white/10 backdrop-blur-[20px]">
        <a href="#" className="text-[1.4rem] font-[800] tracking-[.12em] uppercase grad-text">VEXO</a>
        <ul className="hidden md:flex items-center gap-[2.5rem] list-none">
          {['System', 'Protocol', 'Ranks', 'Debrief'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="font-mono text-[.68rem] tracking-[.12em] text-muted uppercase transition-colors hover:text-lime">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <button 
          onClick={onStart}
          className="font-mono text-[.68rem] tracking-[.15em] uppercase px-[22px] py-[9px] bg-lime text-bg border-none cursor-pointer font-[500] transition-all hover:bg-lime-hi hover:shadow-[0_0_24px_rgba(163,230,53,0.35)] rounded-[2px]"
        >
          Initialize
        </button>
      </nav>

      {/* Hero */}
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center px-[5%] pt-[100px] pb-[60px] gap-[4rem] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.07)_0%,transparent_65%)]" />
          <div className="absolute bottom-0 right-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.06)_0%,transparent_65%)]" />
        </div>

        <div className="relative z-10">
          <div className="reveal inline-flex items-center gap-[8px] font-mono text-[.62rem] tracking-[.18em] uppercase text-lime bg-lime/7 border border-lime/20 px-[14px] py-[6px] rounded-[2px] mb-[2rem]" ref={addToReveal}>
            <div className="w-[6px] h-[6px] rounded-full bg-lime animate-pulse" />
            AI Eye Online — Vexo v1.0
          </div>
          <h1 className="reveal text-[clamp(3rem,6.5vw,6.5rem)] font-[800] leading-[1.0] tracking-[-.03em] mb-[1.8rem]" ref={addToReveal}>
            Your reps.<br />
            Our <em className="not-italic grad-text">verdict.</em>
          </h1>
          <p className="reveal text-[1.05rem] font-[400] text-white/55 leading-[1.75] max-w-[460px] mb-[2.8rem]" ref={addToReveal}>
            Vexo watches every pushup through your camera. It counts only the reps that count — rejects bad form, flags bad tempo, and builds your rank rep by rep.
          </p>
          <div className="reveal flex gap-[1rem] items-center" ref={addToReveal}>
            <button onClick={onStart} className="font-mono text-[.7rem] tracking-[.18em] uppercase px-[32px] py-[14px] bg-lime text-bg border-none cursor-pointer font-[500] rounded-[2px] transition-all hover:bg-lime-hi hover:shadow-[0_0_32px_rgba(163,230,53,0.4)] hover:translate-y-[-1px]">
              Start Training
            </button>
            <button className="font-mono text-[.7rem] tracking-[.18em] uppercase px-[32px] py-[14px] bg-transparent text-muted border border-muted2 cursor-pointer rounded-[2px] transition-all hover:text-white hover:border-white/25">
              View System
            </button>
          </div>
        </div>

        <div className="reveal hidden md:block relative bg-surface border border-white/10 rounded-[8px] overflow-hidden" ref={addToReveal}>
          <div className="flex items-center gap-[10px] px-[20px] py-[14px] bg-surface2 border-b border-white/10">
            <div className="w-[8px] h-[8px] rounded-full bg-red" />
            <div className="w-[8px] h-[8px] rounded-full bg-amber" />
            <div className="w-[8px] h-[8px] rounded-full bg-lime" />
            <div className="font-mono text-[.6rem] tracking-[.2em] text-muted uppercase ml-auto">VEXO_SESSION_LIVE.exe</div>
          </div>
          <div className="p-[28px] py-[24px]">
            <div className="text-center py-[28px] border-b border-white/10 mb-[24px] relative">
              <div className="text-[5.5rem] font-[800] leading-none grad-text">63</div>
              <div className="font-mono text-[.62rem] tracking-[.3em] text-muted uppercase mt-[6px]">Validated Reps</div>
              <div className="font-mono text-[.72rem] text-muted mt-[4px]">Goal: <span className="text-lime">100 reps</span></div>
              <div className="absolute top-1/2 right-[28px] translate-y-[-50%]">
                <svg className="w-[64px] h-[64px] rotate-[-90deg]" viewBox="0 0 58 58">
                  <circle className="stroke-muted2 fill-none stroke-[3]" cx="29" cy="29" r="26"/>
                  <circle className="stroke-lime fill-none stroke-[3] [stroke-dasharray:163] [stroke-dashoffset:50] stroke-linecap-round filter drop-shadow-[0_0_4px_#A3E635]" cx="29" cy="29" r="26"/>
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <FeedbackItem type="ok" text="Rep 63 — Form Validated. Logged." time="00:07:14" />
              <FeedbackItem type="warn" text="Tempo violation — Slow the ascent." time="00:07:09" />
              <FeedbackItem type="bad" text="Rep void — Depth insufficient. 94° elbow." time="00:06:58" />
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-white/10 py-[14px] overflow-hidden bg-bg2">
        <div className="flex gap-[4rem] whitespace-nowrap animate-[ticker_22s_linear_infinite]">
          {Array(2).fill(['Form is Law', 'Rep validation active', 'AI Eye online', 'Depth = 90° elbow minimum', 'Tempo monitored', 'Only valid reps advance rank']).flat().map((item, i) => (
            <span key={i} className="font-mono text-[.65rem] tracking-[.18em] uppercase text-muted flex items-center gap-[1rem]">
              {item.includes('active') || item.includes('online') || item.includes('monitored') ? (
                <>
                  {item.split(' ')[0]} {item.split(' ')[1]} <b className="text-lime font-[500]">{item.split(' ')[2]}</b>
                </>
              ) : item}
              <span className="text-muted2 ml-[1rem]">//</span>
            </span>
          ))}
        </div>
      </div>

      {/* System Section */}
      <section id="system" className="bg-bg2">
        <div className="max-w-[1100px] mx-auto">
          <div className="reveal text-lime flex items-center gap-[10px] font-mono text-[.6rem] tracking-[.28em] uppercase mb-[1.2rem] before:content-[''] before:w-[28px] before:h-[1px] before:bg-lime" ref={addToReveal}>
            Operational Sequence
          </div>
          <h2 className="reveal text-[clamp(2rem,4.5vw,3.8rem)] font-[800] leading-[1.05] tracking-[-.025em]" ref={addToReveal}>
            How Vexo <span className="grad-text">operates</span>
          </h2>
          <p className="reveal text-[1rem] font-[400] text-white/50 leading-[1.75] max-w-[480px] mt-[1.2rem]" ref={addToReveal}>
            Four steps from setup to data dump. Built to be brutal, fast, and honest.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-[4rem] border border-white/10 rounded-[6px] overflow-hidden">
            <Step number="01" title="Set Contract" desc="Define your mission. Set a target rep count. The contract is locked before training begins." />
            <Step number="02" title="Activate Eye" desc="The Digital Eye initializes. PoseNet maps 17 body keypoints in real-time. You are now visible to the system." />
            <Step number="03" title="Execute Mission" desc="The AI counts only valid reps. Bad depth — voided. Hip sag — voided. Form is law." />
            <Step number="04" title="Data Dump" desc="Session ends. Full debrief rendered. Accuracy, credits earned, error log. Everything logged." />
          </div>
        </div>
      </section>

      {/* Protocol Section */}
      <section id="protocol" className="relative overflow-hidden">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[5rem] items-start">
          <div>
            <div className="reveal text-lime flex items-center gap-[10px] font-mono text-[.6rem] tracking-[.28em] uppercase mb-[1.2rem] before:content-[''] before:w-[28px] before:h-[1px] before:bg-lime" ref={addToReveal}>
              Detection Protocols
            </div>
            <h2 className="reveal text-[clamp(2rem,4.5vw,3.8rem)] font-[800] leading-[1.05] tracking-[-.025em]" ref={addToReveal}>
              What the AI <span className="text-red">rejects</span>
            </h2>
            <div className="reveal mt-[3rem] flex flex-col gap-[2px]" ref={addToReveal}>
              <ErrorItem code="E-01" name="Partial Depth" desc="Elbow angle above 90° at bottom position" type="void" />
              <ErrorItem code="E-02" name="Hip Sag" desc="Hip drops below the shoulder-ankle line" type="void" />
              <ErrorItem code="E-03" name="Hip Pike" desc="Hips elevated — alignment breach detected" type="void" />
              <ErrorItem code="E-04" name="Tempo Violation" desc="Ascent completed under 0.8 seconds" type="warn" />
            </div>
          </div>

          <div className="reveal hidden md:block bg-surface border border-white/10 rounded-[6px] p-[28px] sticky top-[100px]" ref={addToReveal}>
            <div className="font-mono text-[.6rem] tracking-[.2em] text-lime uppercase mb-[20px] flex items-center gap-[8px] before:content-[''] before:w-[4px] before:h-[4px] before:bg-lime before:rounded-full before:animate-pulse">
              Skeleton Tracking Active
            </div>
            <div className="bg-bg border border-white/10 rounded-[4px] h-[320px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,#A3E635,transparent)] opacity-60 shadow-[0_0_8px_#A3E635] animate-[scanH_3.5s_ease-in-out_infinite]" />
              <svg className="w-[180px] h-[300px]" viewBox="0 0 100 280">
                <circle cx="50" cy="40" r="15" className="fill-lime/20 stroke-lime stroke-[1]" />
                <line x1="50" y1="55" x2="50" y2="150" className="stroke-lime/40 stroke-[2]" />
                <line x1="50" y1="80" x2="20" y2="120" className="stroke-lime/40 stroke-[2]" />
                <line x1="50" y1="80" x2="80" y2="120" className="stroke-lime/40 stroke-[2]" />
                <line x1="50" y1="150" x2="30" y2="230" className="stroke-lime/40 stroke-[2]" />
                <line x1="50" y1="150" x2="70" y2="230" className="stroke-lime/40 stroke-[2]" />
                <circle cx="50" cy="40" r="3" className="fill-lime shadow-[0_0_5px_#A3E635]" />
                <circle cx="50" cy="80" r="3" className="fill-lime shadow-[0_0_5px_#A3E635]" />
                <circle cx="20" cy="120" r="3" className="fill-amber shadow-[0_0_5px_#F59E0B]" />
                <text x="5" y="115" className="font-mono text-[10px] fill-amber">94°</text>
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-[8px] mt-[16px]">
              <StatItem val="94°" label="Elbow" color="text-amber" />
              <StatItem val="178°" label="Hip" color="text-lime" />
              <StatItem val="VOID" label="Rep" color="text-red" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-surface text-center relative overflow-hidden py-[110px] px-[5%]">
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(163,230,53,0.08)_0%,rgba(245,158,11,0.05)_40%,transparent_70%)] pointer-events-none" />
        <div className="reveal text-lime flex items-center justify-center gap-[10px] font-mono text-[.6rem] tracking-[.28em] uppercase mb-[1.2rem] before:content-[''] before:w-[28px] before:h-[1px] before:bg-lime" ref={addToReveal}>
          System Ready
        </div>
        <h2 className="reveal text-[clamp(2rem,4.5vw,3.8rem)] font-[800] leading-[1.05] tracking-[-.025em] max-w-[640px] mx-auto" ref={addToReveal}>
          Stop counting.<br />Start <span className="grad-text">earning.</span>
        </h2>
        <p className="reveal font-mono text-[.68rem] tracking-[.2em] text-muted uppercase my-[1.2rem] mb-[2.8rem]" ref={addToReveal}>
          // The AI Eye is waiting. Your first contract is ready.
        </p>
        <div className="reveal flex gap-[1rem] justify-center flex-wrap relative z-10" ref={addToReveal}>
          <button onClick={onStart} className="font-mono text-[.7rem] tracking-[.18em] uppercase px-[32px] py-[14px] bg-lime text-bg border-none cursor-pointer font-[500] rounded-[2px] transition-all hover:bg-lime-hi hover:shadow-[0_0_32px_rgba(163,230,53,0.4)]">
            Begin First Mission
          </button>
          <button className="font-mono text-[.7rem] tracking-[.18em] uppercase px-[32px] py-[14px] bg-transparent text-muted border border-muted2 cursor-pointer rounded-[2px] transition-all hover:text-white">
            View Global Rankings
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 py-[32px] px-[5%] flex justify-between items-center flex-wrap gap-[1rem]">
        <div className="text-[1.1rem] font-[800] tracking-[.1em] grad-text">VEXO</div>
        <ul className="flex gap-[2rem] list-none">
          {['Protocol', 'Ranks', 'Credits', 'Support'].map((item) => (
            <li key={item}>
              <a href="#" className="font-mono text-[.58rem] tracking-[.14em] text-muted uppercase transition-colors hover:text-lime">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="font-mono text-[.58rem] tracking-[.14em] text-muted uppercase">
          © 2025 Vexo Systems — All operatives monitored
        </div>
      </footer>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scanH {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

const FeedbackItem = ({ type, text, time }: { type: 'ok' | 'warn' | 'bad', text: string, time: string }) => (
  <div className={`
    flex items-start gap-[12px] p-[12px] px-[14px] rounded-[4px] border-l-2
    ${type === 'ok' ? 'bg-lime/5 border-lime' : type === 'warn' ? 'bg-amber/6 border-amber' : 'bg-red/12 border-red'}
  `}>
    <div className={`
      w-[20px] h-[20px] flex-shrink-0 rounded-full flex items-center justify-center text-[.7rem]
      ${type === 'ok' ? 'bg-lime/15 text-lime' : type === 'warn' ? 'bg-amber/15 text-amber' : 'bg-red/12 text-red'}
    `}>
      {type === 'ok' ? '✓' : type === 'warn' ? '!' : '✕'}
    </div>
    <div>
      <div className={`font-mono text-[.68rem] leading-[1.5] tracking-[.03em] ${type === 'ok' ? 'text-lime' : type === 'warn' ? 'text-amber' : 'text-red'}`}>
        {text}
      </div>
      <span className="font-mono text-[.55rem] text-muted mt-[3px] block">{time}</span>
    </div>
  </div>
);

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="group p-[36px] py-[28px] border-r border-white/10 last:border-r-0 transition-colors hover:bg-surface relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,#A3E635,#F59E0B)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-400" />
    <div className="font-synemono text-[.65rem] text-lime-dim tracking-[.1em] mb-[1.4rem]">STEP {number}</div>
    <div className="w-[40px] h-[40px] border border-white/25 rounded-[4px] flex items-center justify-center mb-[1.4rem] bg-lime/4 text-lime">
      {number === '01' && <Zap size={18} />}
      {number === '02' && <Camera size={18} />}
      {number === '03' && <Activity size={18} />}
      {number === '04' && <Terminal size={18} />}
    </div>
    <h3 className="font-display text-[.95rem] font-[700] text-white mb-[.7rem]">{title}</h3>
    <p className="text-[.88rem] font-[400] text-white/45 leading-[1.65]">{desc}</p>
  </div>
);

const ErrorItem = ({ code, name, desc, type }: { code: string, name: string, desc: string, type: 'void' | 'warn' }) => (
  <div className="grid grid-cols-[44px_1fr_auto] items-center gap-[1.2rem] p-[18px] px-[20px] rounded-[4px] border border-transparent transition-all hover:bg-surface hover:border-white/10 cursor-default">
    <div className="font-synemono text-[.6rem] tracking-[.12em] text-muted uppercase">{code}</div>
    <div>
      <div className="font-display text-[.95rem] font-[700] text-white mb-[3px]">{name}</div>
      <div className="font-mono text-[.65rem] text-muted tracking-[.04em]">{desc}</div>
    </div>
    <div className={`font-mono text-[.58rem] tracking-[.12em] px-[8px] py-[3px] rounded-[2px] uppercase whitespace-nowrap ${type === 'void' ? 'bg-red/12 text-red' : 'bg-amber/10 text-amber'}`}>
      {type === 'void' ? 'Rep Void' : 'Warning'}
    </div>
  </div>
);

const StatItem = ({ val, label, color }: { val: string, label: string, color: string }) => (
  <div className="bg-bg border border-white/10 rounded-[4px] p-[10px] px-[12px] text-center">
    <div className={`font-display text-[1.1rem] font-[700] ${color}`}>{val}</div>
    <div className="font-mono text-[.55rem] tracking-[.12em] text-muted uppercase mt-[2px]">{label}</div>
  </div>
);

export default LandingPage;
