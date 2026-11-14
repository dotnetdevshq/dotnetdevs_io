'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

// Bucksy, the site pet. He idles, watches the pointer, wanders along the bottom of the
// window, sits, falls asleep when nothing happens, and hops when clicked. The drawing is
// two inline SVGs (front and side view); every motion is CSS in globals.css under "Site pet".
// Nothing here loads from the network or tracks anyone. Hiding him is remembered in local storage.

const storageKey = 'dotnetdevs-pet';
const toggleEvent = 'dotnetdevs:pet';
type PetState = 'idle' | 'happy' | 'sit' | 'sleep' | 'walk';

function readHidden(): boolean {
  try { return window.localStorage.getItem(storageKey) === 'hidden'; } catch { return false; }
}

function writeHidden(hidden: boolean) {
  try {
    if (hidden) window.localStorage.setItem(storageKey, 'hidden');
    else window.localStorage.removeItem(storageKey);
  } catch { /* Remain usable when storage is blocked. */ }
  window.dispatchEvent(new CustomEvent(toggleEvent, { detail: hidden }));
}

function useHidden(): boolean | null {
  const [hidden, setHidden] = useState<boolean | null>(null);
  useEffect(() => {
    setHidden(readHidden());
    const sync = (event: Event) => setHidden(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener(toggleEvent, sync);
    return () => window.removeEventListener(toggleEvent, sync);
  }, []);
  return hidden;
}

// Footer control, so a hidden pet can be brought back.
export function PetToggleButton() {
  const hidden = useHidden();
  if (hidden === null) return null;
  return <button type="button" className="footer-button" onClick={() => writeHidden(!hidden)}>{hidden ? 'Show Bucksy' : 'Hide Bucksy'}</button>;
}

export function SitePet() {
  const hidden = useHidden();
  const innerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hidden !== false) return;
    const inner = innerRef.current;
    const button = buttonRef.current;
    const rig = button?.querySelector<SVGSVGElement>('.bk-rig');
    if (!inner || !button || !rig) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = 46;                       // pixels per second
    const sleepAfter = 120_000;             // no pointer or key activity for this long
    let state: PetState = 'idle';
    let x = 0, dir = 1, target: number | null = null;
    let lastFrame = 0, frame = 0, lookFrame = 0;
    let nextTimer = 0, happyTimer = 0, restTimer = 0, sleepTimer = 0;

    const range = () => Math.max(0, window.innerWidth / 2 - inner.offsetWidth / 2 - 12);
    const place = () => { inner.style.transform = `translateX(${x.toFixed(1)}px)`; };
    const look = (lx: number, ly: number) => {
      rig.style.setProperty('--lx', lx.toFixed(3));
      rig.style.setProperty('--ly', ly.toFixed(3));
    };
    const between = (min: number, max: number) => min + Math.random() * (max - min);

    function setState(next: PetState) {
      state = next;
      rig!.setAttribute('data-state', next);
      button!.setAttribute('data-state', next);
      button!.setAttribute('aria-label', next === 'sleep' ? 'Wake Bucksy, the site pet' : 'Pet Bucksy, the site pet');
      if (next === 'sleep' || next === 'walk') look(0, 0);
      if (next === 'walk') { if (!frame) { lastFrame = 0; frame = requestAnimationFrame(step); } }
      else { cancelAnimationFrame(frame); frame = 0; target = null; }
    }

    function step(now: number) {
      frame = 0;
      if (state !== 'walk' || target === null) return;
      const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
      lastFrame = now;
      dir = target >= x ? 1 : -1;
      x += dir * speed * dt;
      button!.setAttribute('data-dir', String(dir));
      place();
      if (Math.abs(target - x) < 2) { setState('idle'); plan(); return; }
      frame = requestAnimationFrame(step);
    }

    // Decide what he does after standing around for a while: wander off, or sit down.
    function plan() {
      window.clearTimeout(nextTimer);
      nextTimer = window.setTimeout(() => {
        if (state === 'sit') { setState('idle'); plan(); return; }
        if (state !== 'idle') return;
        const room = range();
        if (!reduceMotion && room > 40 && Math.random() < 0.6) {
          let goal = x;
          for (let i = 0; i < 8 && Math.abs(goal - x) < room * 0.4; i++) goal = between(-room, room);
          setState('walk');
          target = goal;
        } else {
          setState('sit');
          plan();
        }
      }, state === 'sit' ? between(8_000, 14_000) : between(9_000, 18_000));
    }

    function armSleep() {
      window.clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(() => {
        if (state === 'idle' || state === 'sit') { window.clearTimeout(nextTimer); setState('sleep'); }
        else armSleep();
      }, sleepAfter);
    }

    function happy() {
      window.clearTimeout(nextTimer);
      window.clearTimeout(happyTimer);
      setState('happy');
      happyTimer = window.setTimeout(() => { setState('idle'); plan(); }, 2400);
      armSleep();
    }

    function onPointerMove(event: PointerEvent) {
      armSleep();
      if (state !== 'idle' && state !== 'sit') return;
      if (lookFrame) return;
      const { clientX, clientY } = event;
      lookFrame = requestAnimationFrame(() => {
        lookFrame = 0;
        const box = rig!.getBoundingClientRect();
        // The head centre sits at (100, 100) in a view box of 0 -30 200 270.
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height * (130 / 270);
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));
        look(clamp((clientX - cx) / 320), clamp((clientY - cy) / 320));
        window.clearTimeout(restTimer);
        restTimer = window.setTimeout(() => look(0, 0), 3000);
      });
    }

    function onResize() {
      const room = range();
      x = Math.max(-room, Math.min(room, x));
      place();
    }

    // He starts near the right edge, out of the way of the page content.
    x = range() - 8;
    place();
    setState('idle');
    plan();
    armSleep();

    button.addEventListener('click', happy);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('keydown', armSleep);
    window.addEventListener('resize', onResize);
    return () => {
      button.removeEventListener('click', happy);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('keydown', armSleep);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(lookFrame);
      for (const timer of [nextTimer, happyTimer, restTimer, sleepTimer]) window.clearTimeout(timer);
    };
  }, [hidden]);

  if (hidden !== false) return null;
  return <div className="site-pet">
    <div className="site-pet-inner" ref={innerRef}>
      <button type="button" className="site-pet-button" ref={buttonRef} data-state="idle" aria-label="Pet Bucksy, the site pet">
        <BucksyFront />
        <BucksySide />
      </button>
      <button type="button" className="site-pet-hide" onClick={() => writeHidden(true)} aria-label="Hide Bucksy" title="Hide Bucksy"><X size={14} aria-hidden="true" /></button>
    </div>
  </div>;
}

function BucksyFront() {
  return (
    <svg className="bk-rig" data-state="idle" viewBox="0 -30 200 270" aria-hidden="true">
    <ellipse className="bk-shadow" cx="100" cy="224" rx="46" ry="6" fill="#000000" opacity="0.22" />
    <g className="bk-all">
    <g className="bk-tail">
    <path d="M132 190 C158 190 172 168 164 146 C160 138 150 142 151 151 C152 166 144 176 130 178 Z" fill="#FFF8EE" />
    <path d="M132 190 C150 190 162 180 165 166 C158 178 146 184 130 184 Z" fill="#E4D9C8" />
    </g>
    <ellipse className="bk-footL" cx="68" cy="216" rx="13" ry="8" fill="#C4854A" />
    <ellipse className="bk-footR" cx="132" cy="216" rx="13" ry="8" fill="#C4854A" />
    <g className="bk-body-g">
    <rect x="62" y="150" width="76" height="66" rx="30" fill="#D99A5B" />
    <path d="M62 190 a30 26 0 0 0 76 0 v-4 a38 30 0 0 1 -76 0 Z" fill="#C4854A" />
    <path d="M76 152 C76 150 124 150 124 152 C128 176 118 200 100 204 C82 200 72 176 76 152 Z" fill="#FFF8EE" />
    <circle cx="100" cy="170" r="10" fill="#6A3DE8" />
    <path d="M96 166 L92 170 L96 174 M104 166 L108 170 L104 174" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="100" cy="170" r="1.6" fill="#FFFFFF" />
    </g>
    <g className="bk-legs-g">
    <rect x="76" y="186" width="20" height="36" rx="10" fill="#FFF8EE" />
    <rect x="104" y="186" width="20" height="36" rx="10" fill="#FFF8EE" />
    <path d="M76 212 h20 a10 10 0 0 1 -20 0 Z" fill="#E4D9C8" />
    <path d="M104 212 h20 a10 10 0 0 1 -20 0 Z" fill="#E4D9C8" />
    </g>
    <g className="bk-pose-head">
    <g className="bk-look-head">
    <g className="bk-tilt">
    <g className="bk-earL">
    <path d="M44 78 C24 84 20 124 30 146 C36 156 48 152 50 140 C54 120 54 96 52 82 Z" fill="#A9643A" />
    <path d="M30 146 C36 156 48 152 50 140 C44 146 36 146 30 138 Z" fill="#8C4F2C" />
    </g>
    <g className="bk-earR">
    <path d="M156 78 C176 84 180 124 170 146 C164 156 152 152 150 140 C146 120 146 96 148 82 Z" fill="#A9643A" />
    <path d="M170 146 C164 156 152 152 150 140 C156 146 164 146 170 138 Z" fill="#8C4F2C" />
    </g>
    <path d="M100 40 C62 40 40 64 40 98 C34 106 34 122 44 128 C52 148 76 158 100 158 C124 158 148 148 156 128 C166 122 166 106 160 98 C160 64 138 40 100 40 Z" fill="#D99A5B" />
    <path d="M44 128 C52 148 76 158 100 158 C124 158 148 148 156 128 C140 142 120 148 100 148 C80 148 60 142 44 128 Z" fill="#C4854A" />
    <path d="M64 52 C76 44 90 42 100 42 C112 42 124 45 134 51 C122 48 110 47 100 47 C88 47 76 48 64 52 Z" fill="#EDB77C" />
    <path d="M100 44 C92 62 92 84 100 100 C108 84 108 62 100 44 Z" fill="#F0CFA4" />
    <ellipse cx="100" cy="124" rx="30" ry="24" fill="#FFF8EE" />
    <g className="bk-look-eyes">
    <g className="bk-eyes-open bk-blink">
    <ellipse cx="74" cy="100" rx="8" ry="9" fill="#2A1A14" />
    <ellipse cx="126" cy="100" rx="8" ry="9" fill="#2A1A14" />
    <circle cx="77" cy="96" r="3" fill="#FFFFFF" />
    <circle cx="129" cy="96" r="3" fill="#FFFFFF" />
    </g>
    <path className="bk-eyes-sleep" d="M66 100 Q74 107 82 100 M118 100 Q126 107 134 100" fill="none" stroke="#2A1A14" strokeWidth="3.5" strokeLinecap="round" />
    <path className="bk-eyes-happy" d="M65 103 Q74 91 83 103 M117 103 Q126 91 135 103" fill="none" stroke="#2A1A14" strokeWidth="4" strokeLinecap="round" />
    </g>
    <ellipse cx="60" cy="116" rx="8" ry="5" fill="#F09A8A" opacity="0.55" />
    <ellipse cx="140" cy="116" rx="8" ry="5" fill="#F09A8A" opacity="0.55" />
    <ellipse cx="100" cy="114" rx="9" ry="6.5" fill="#9C5A4E" />
    <ellipse cx="97" cy="112" rx="3" ry="1.5" fill="#C58A7E" />
    <path className="bk-smile" d="M100 121 V127 M90 129 Q100 138 110 129" fill="none" stroke="#5A3327" strokeWidth="2.5" strokeLinecap="round" />
    <g className="bk-mouth-open">
    <path d="M100 121 V126" fill="none" stroke="#5A3327" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M88 127 Q100 124 112 127 Q110 144 100 144 Q90 144 88 127 Z" fill="#5A3327" />
    <ellipse cx="100" cy="139" rx="6" ry="4.5" fill="#F0718A" />
    </g>
    </g>
    </g>
    </g>
    </g>
    <text className="bk-zz bk-z1" x="150" y="96" fontWeight="700" fontSize="16" fill="#B9A2FF">z</text>
    <text className="bk-zz bk-z2" x="160" y="76" fontWeight="700" fontSize="20" fill="#B9A2FF">z</text>
    <text className="bk-zz bk-z3" x="172" y="52" fontWeight="700" fontSize="26" fill="#B9A2FF">Z</text>
    <path className="bk-spark" d="M22 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" fill="#FFD86B" />
    <path className="bk-spark" d="M178 30 l2.5 7 7 2.5 -7 2.5 -2.5 7 -2.5 -7 -7 -2.5 7 -2.5 Z" fill="#FFD86B" />
    <path className="bk-spark" d="M170 -8 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#B9A2FF" />
    </svg>
  );
}

function BucksySide() {
  return (
    <svg className="bk-side" viewBox="0 -30 200 270" aria-hidden="true">
    <ellipse className="bk-w-shadow" cx="100" cy="224" rx="52" ry="6" fill="#000000" opacity="0.22" />
    <g className="bk-w-all">
    <g transform="translate(-16 0)">
    <g className="bk-w-tail">
    <path d="M58 178 C34 176 20 154 28 132 C32 124 43 128 42 138 C41 152 50 163 64 165 Z" fill="#FFF8EE" />
    <path d="M58 178 C40 177 28 166 26 150 C32 164 44 171 60 172 Z" fill="#E4D9C8" />
    </g>
    <rect className="bk-w-leg bk-w-legB" style={{ transformOrigin: '81px 190px' }} x="72" y="184" width="18" height="38" rx="9" fill="#E4D9C8" />
    <rect className="bk-w-leg bk-w-legA" style={{ transformOrigin: '133px 190px' }} x="124" y="184" width="18" height="38" rx="9" fill="#E4D9C8" />
    <rect x="46" y="150" width="96" height="54" rx="27" fill="#D99A5B" />
    <path d="M46 180 a27 24 0 0 0 27 24 h42 a27 24 0 0 0 27 -24 v-3 a27 24 0 0 1 -27 20 h-42 a27 24 0 0 1 -27 -20 Z" fill="#C4854A" />
    <ellipse cx="84" cy="164" rx="15" ry="10" fill="#FFF8EE" />
    <path d="M120 152 C142 156 146 188 130 204 L104 204 C116 192 120 172 120 152 Z" fill="#FFF8EE" />
    <rect className="bk-w-leg bk-w-legA" style={{ transformOrigin: '67px 190px' }} x="58" y="184" width="18" height="38" rx="9" fill="#FFF8EE" />
    <ellipse cx="66" cy="184" rx="19" ry="18" fill="#CF8E50" />
    <rect className="bk-w-leg bk-w-legB" style={{ transformOrigin: '119px 190px' }} x="110" y="184" width="18" height="38" rx="9" fill="#FFF8EE" />
    <g className="bk-w-head" transform="translate(34 -2)">
    <g className="bk-w-headbob">
    <g className="bk-w-earL">
    <path d="M44 78 C24 84 20 124 30 146 C36 156 48 152 50 140 C54 120 54 96 52 82 Z" fill="#A9643A" />
    <path d="M30 146 C36 156 48 152 50 140 C44 146 36 146 30 138 Z" fill="#8C4F2C" />
    </g>
    <g className="bk-w-earR">
    <path d="M156 78 C176 84 180 124 170 146 C164 156 152 152 150 140 C146 120 146 96 148 82 Z" fill="#A9643A" />
    <path d="M170 146 C164 156 152 152 150 140 C156 146 164 146 170 138 Z" fill="#8C4F2C" />
    </g>
    <path d="M100 40 C62 40 40 64 40 98 C34 106 34 122 44 128 C52 148 76 158 100 158 C124 158 148 148 156 128 C166 122 166 106 160 98 C160 64 138 40 100 40 Z" fill="#D99A5B" />
    <path d="M44 128 C52 148 76 158 100 158 C124 158 148 148 156 128 C140 142 120 148 100 148 C80 148 60 142 44 128 Z" fill="#C4854A" />
    <path d="M64 52 C76 44 90 42 100 42 C112 42 124 45 134 51 C122 48 110 47 100 47 C88 47 76 48 64 52 Z" fill="#EDB77C" />
    <path d="M100 44 C92 62 92 84 100 100 C108 84 108 62 100 44 Z" fill="#F0CFA4" />
    <ellipse cx="100" cy="124" rx="30" ry="24" fill="#FFF8EE" />
    <g className="bk-w-eyes">
    <g className="bk-blink">
    <ellipse cx="74" cy="100" rx="8" ry="9" fill="#2A1A14" />
    <ellipse cx="126" cy="100" rx="8" ry="9" fill="#2A1A14" />
    <circle cx="77" cy="96" r="3" fill="#FFFFFF" />
    <circle cx="129" cy="96" r="3" fill="#FFFFFF" />
    </g>
    </g>
    <ellipse cx="60" cy="116" rx="8" ry="5" fill="#F09A8A" opacity="0.55" />
    <ellipse cx="140" cy="116" rx="8" ry="5" fill="#F09A8A" opacity="0.55" />
    <ellipse cx="100" cy="114" rx="9" ry="6.5" fill="#9C5A4E" />
    <ellipse cx="97" cy="112" rx="3" ry="1.5" fill="#C58A7E" />
    <path className="bk-w-smile" d="M100 121 V127 M90 129 Q100 138 110 129" fill="none" stroke="#5A3327" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    </g>
    </g>
    </g>
    </svg>
  );
}
