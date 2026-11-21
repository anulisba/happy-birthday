import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Heart, Sparkles, ChevronLeft, ChevronRight, Gift, RotateCcw, ArrowRight
} from 'lucide-react';
import './style.css';

// Reverse the numbered archive filenames to preserve the original upload order.
const memories = Array.from(
  { length: 14 },
  (_, i) => `/images/memory-${String(14 - i).padStart(2, '0')}.jpg`
);

const sprinkles = ['♡', '✿', '♥', '˚', '✧'];

function App() {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);
  const [finished, setFinished] = useState(false);
  const [direction, setDirection] = useState(1);
  const [introReady, setIntroReady] = useState(false);
  const [hintPulse, setHintPulse] = useState(false);
  const touchStart = useRef(null);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setIntroReady(true), 1450);
    const pulseTimer = window.setTimeout(() => setHintPulse(true), 1900);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(pulseTimer);
    };
  }, []);

  const start = () => {
    setActive(0);
    setFinished(false);
    setOpened(true);
  };

  const next = () => {
    setDirection(1);
    if (active === memories.length - 1) setFinished(true);
    else setActive((current) => current + 1);
  };

  const previous = () => {
    setDirection(-1);
    if (finished) {
      setFinished(false);
      setActive(memories.length - 1);
    } else {
      setActive((current) => Math.max(0, current - 1));
    }
  };

  useEffect(() => {
    if (!opened) return;
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight' && !finished) next();
      if (event.key === 'ArrowLeft') previous();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [opened, active, finished]);

  const handleTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(distance) > 45) {
      if (distance < 0 && !finished) next();
      if (distance > 0) previous();
    }
    touchStart.current = null;
  };

  return (
    <main>
      <div className="grain" aria-hidden="true" />
      <div className="floating floating-one">♡</div>
      <div className="floating floating-two">✿</div>
      <div className="floating floating-three">♡</div>
      <div className="floating floating-four">✧</div>
      <div className="floating floating-five">✧</div>
      <div className="floating floating-six">♡</div>

      {!opened ? (
        <section className="hero">
          <div className="hero-inner">
            <span className="eyebrow"><Sparkles size={14} /> A tiny page, a lot of love</span>

            <p className="pretitle">someone very special was born today...</p>
            <h1>Happy Birthday<span>!</span></h1>
            <p className="hero-copy">
              I made you a little something.<br />
              It's silly, it's sweet, and it's all for you.
            </p>

            <div className={`gift-scene ${introReady ? 'gift-settled' : ''}`}>
              <span className="gift-orbit orbit-one">✦</span>
              <span className="gift-orbit orbit-two">♡</span>
              <span className="gift-orbit orbit-three">✧</span>
              <div className="gift-glow" />
              <div className="gift-box" aria-label="A wrapped birthday present">
                <div className="gift-lid">
                  <span className="gift-bow bow-left" />
                  <span className="gift-bow bow-right" />
                  <span className="gift-bow bow-center" />
                </div>
                <div className="gift-body"><span className="gift-ribbon" /></div>
              </div>
            </div>

            <div className={`reveal-prompt ${introReady ? 'show-prompt' : ''}`}>
              <p>{introReady ? 'Psst... your surprise is ready!' : 'Something is hiding in here...'}</p>
              <button
                className={`arrow-open ${hintPulse ? 'arrow-pulse' : ''}`}
                onClick={start}
                aria-label="Open your birthday surprise"
              >
                <span>Swipe or tap to open</span>
                <span className="arrow-circle"><ArrowRight size={21} /></span>
              </button>
              <span className="swipe-caption">give the gift a little swipe <span>→</span></span>
            </div>
          </div>
          <div className="hero-doodle doodle-left">✿</div>
          <div className="hero-doodle doodle-right">♡</div>
        </section>
      ) : (
        <section className="memories">
          <div className="section-heading">
            <span className="tiny-label">A LITTLE BIRTHDAY STORY</span>
            <h2>{finished ? 'One last thing...' : 'Made just for you'} <span>♡</span></h2>
            <p>{finished ? 'And that is how much you mean to me.' : 'Swipe the picture or tap the arrow for the next surprise.'}</p>
            <div className="progress-wrap">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${finished ? 100 : ((active + 1) / memories.length) * 100}%` }}
                />
              </div>
              <span>{finished ? '14 / 14' : `${active + 1} / 14`}</span>
            </div>
          </div>

          {!finished ? (
            <div className="interactive-stage">
              <div
                className={`memory-card ${direction > 0 ? 'arrive-from-right' : 'arrive-from-left'}`}
                key={active}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="card-number">
                  {String(active + 1).padStart(2, '0')} <span>—</span> a little moment
                </div>
                <div className="image-frame">
                  <img
                    src={memories[active]}
                    alt={`Birthday surprise memory ${active + 1}`}
                    draggable="false"
                  />
                  <span className="image-shine" />
                </div>
                <span className="card-sparkle" aria-hidden="true">{sprinkles[active % sprinkles.length]}</span>
                <span className="swipe-side swipe-left">‹</span>
                <span className="swipe-side swipe-right">›</span>
              </div>

              <div className="step-controls">
                <button
                  className="arrow-nav arrow-nav-left"
                  onClick={previous}
                  disabled={active === 0}
                  aria-label="Previous photo"
                  title="Previous photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <span className="keyboard-hint">swipe to explore</span>
                <button
                  className="arrow-nav arrow-nav-right"
                  onClick={next}
                  aria-label={active === memories.length - 1 ? 'Finish birthday surprise' : 'Next photo'}
                  title={active === memories.length - 1 ? 'Finish' : 'Next photo'}
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          ) : (
            <div className="ending">
              <div className="ending-confetti" aria-hidden="true">
                <span>✦</span><span>♡</span><span>✿</span><span>✧</span><span>♥</span>
              </div>
              <div className="ending-icon"><Heart fill="currentColor" size={25} /></div>
              <p className="tiny-label">THAT'S THE WHOLE SURPRISE</p>
              <h2>Happy Birthday, pretty boy!</h2>
              <p className="ending-copy">
                I hope your day is as lovely as you are.<br />
                Keep smiling, birthday boy. ♡
              </p>
              <div className="ending-hearts">♡　✿　♡</div>
              <button className="back-button" onClick={() => { setActive(0); setFinished(false); }}>
                <RotateCcw size={14} /> See it all again
              </button>
              <button className="home-button" onClick={() => { setOpened(false); setActive(0); setFinished(false); }}>
                Back to the beginning
              </button>
              <div className="made-with">made with <Heart size={11} fill="currentColor" /> and a little bit of chaos</div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
