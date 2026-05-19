import { useState, useEffect, useMemo } from 'react';

const HERO_SENTENCE =
  "Your agent just wrote you eight paragraphs about why it chose useReducer over useState — don't read it, half-listen while you stare at the diff.";

const HERO_WORDS = HERO_SENTENCE.split(/\s+/);

function useKaraoke(words, wpm = 230, pauseMs = 1400) {
  const [idx, setIdx] = useState(-1);
  useEffect(() => {
    let cancelled = false;
    let t;
    const perWord = 60000 / wpm;
    function step(i) {
      if (cancelled) return;
      setIdx(i);
      if (i >= words.length - 1) {
        t = setTimeout(() => step(-1), pauseMs);
      } else if (i === -1) {
        t = setTimeout(() => step(0), 300);
      } else {
        const w = words[i] || "";
        const punct = /[.,;:!?]$/.test(w) ? perWord * 0.7 : 0;
        const lenBoost = Math.min(perWord * 0.9, (w.length - 3) * 12);
        t = setTimeout(() => step(i + 1), perWord + punct + Math.max(0, lenBoost));
      }
    }
    step(-1);
    return () => { cancelled = true; clearTimeout(t); };
  }, [words, wpm, pauseMs]);
  return idx;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function GhIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 0Z" />
    </svg>
  );
}

function TopBar() {
  return (
    <div className="topbar">
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", width: "100%" }}>
        <div className="brand">
          <span className="dot"></span>
          <span>recite</span>
          <span className="brand-version">v0.1</span>
        </div>
        <div className="nav">
          <a className="nav-section" href="#workflow">workflow</a>
          <a className="nav-section" href="#how">how it works</a>
          <a className="nav-section" href="#keys">keys</a>
          <a className="nav-section" href="#install">install</a>
          <a className="pill" href="https://github.com/michaldobiezynski/recite" target="_blank" rel="noreferrer">
            <GhIcon /> github
          </a>
        </div>
      </div>
    </div>
  );
}

function HeroKaraoke() {
  const idx = useKaraoke(HERO_WORDS, 240, 1600);

  const N = 64;
  const bars = useMemo(() => Array.from({ length: N }, (_, i) => {
    const seed = Math.sin(i * 1.7) * Math.cos(i * 0.5);
    return 7 + Math.abs(seed) * 22 + (i % 5) * 1.6;
  }), []);
  const progress = idx < 0 ? 0 : (idx + 1) / HERO_WORDS.length;
  const head = Math.floor(progress * N);

  return (
    <div className="karaoke-stage">
      <div className="term-chrome">
        <div className="lights"><span></span><span></span><span></span></div>
        <div className="term-title">
          <span className="live">recite · daniel @ 200 wpm · aligner: heuristic</span>
        </div>
        <div style={{ width: 60, textAlign: "right", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-4)" }}>
          1 / 1
        </div>
      </div>

      <div className="karaoke-body">
        <div className="karaoke-meta">
          <div><span className="k">paste</span><span className="ok">● 142 words</span></div>
          <div><span className="k">queue</span>1 synthesised · 0 pending</div>
          <div><span className="k">state</span><span style={{ color: "var(--amber)" }}>▶ playing</span></div>
        </div>

        <div className="karaoke-line">
          {HERO_WORDS.map((w, i) => {
            const cls = i < idx ? "spoken" : i === idx ? "active" : "upcoming";
            return <span key={i} className={"w " + cls}>{w}</span>;
          })}
        </div>

        <div className="waveform" aria-hidden>
          {bars.map((h, i) => {
            const cls = i < head ? "past" : i === head ? "head" : "";
            return (
              <span
                key={i}
                className={"bar " + cls}
                style={{ height: i === head ? Math.max(h, 22) + "px" : h + "px" }}
              />
            );
          })}
        </div>
      </div>

      <div className="transport">
        <div className="left">
          <span className="kbd"><span className="key">space</span><span className="label">play / pause</span></span>
          <span className="kbd"><span className="key">j</span><span className="key">k</span><span className="label">next / prev</span></span>
          <span className="kbd"><span className="key">r</span><span className="label">replay</span></span>
        </div>
        <div className="right">
          <span className="kbd"><span className="key">v</span><span className="label">voice</span></span>
          <span className="kbd"><span className="key">+</span><span className="key">−</span><span className="label">rate</span></span>
          <span className="kbd"><span className="key">q</span><span className="label">quit</span></span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="page">
        <div className="h1-wrap">
          <div className="eyebrow">macOS · terminal · MIT</div>
          <h1>
            Listen to what your <span className="accent">AI writes.</span>
          </h1>
          <p className="lede hero-sub">
            A macOS terminal TTS player for the walls of text Claude Code, Cursor, Aider, and friends keep
            generating. Paste it in, hear it out, get on with your day. Offline. No API keys. No account.
          </p>

          <div className="install-row">
            <div className="cmd">
              <span className="dollar">$</span>
              <span>pipx install git+https://github.com/michaldobiezynski/recite.git</span>
              <span className="copy" onClick={(e) => {
                navigator.clipboard?.writeText("pipx install git+https://github.com/michaldobiezynski/recite.git");
                const o = e.currentTarget.textContent;
                e.currentTarget.textContent = "copied";
                setTimeout(() => { if (e.currentTarget) e.currentTarget.textContent = o; }, 1200);
              }}>copy</span>
            </div>
            <a className="ghbtn" href="https://github.com/michaldobiezynski/recite" target="_blank" rel="noreferrer">
              <GhIcon /> view on github
            </a>
          </div>
        </div>

        <HeroKaraoke />
      </div>
    </section>
  );
}

function MockChat() {
  return (
    <div className="mockchat">
      <div className="ai-tag">▍ assistant</div>
      <div>Sure — the reason I reached for <span style={{ color: "var(--ink)" }}>useReducer</span> here is that the auth flow has four mutually-exclusive states, and modelling that with three boolean <span style={{ color: "var(--ink)" }}>useState</span> hooks invites contradictions.</div>
      <div className="codeblk">
        <span className="kw">function</span>{" "}
        <span className="fn">authReducer</span>(state, action){" {"}<br />
        {"  "}<span className="kw">switch</span> (action.type) {"{"}<br />
        {"    "}<span className="kw">case</span> <span className="str">'login'</span>: <span className="kw">return</span> {"{"} status: <span className="str">'pending'</span> {"}"};<br />
        {"  "}{"}"}<br />
        {"}"}
      </div>
      <div>This also means React batches the related transitions, so you won't get the flicker you saw with the boolean approach.</div>
      <div className="more">… 23 more paragraphs</div>
    </div>
  );
}

function StepPanel({ n, label, kbd, caption, children }) {
  return (
    <div className="panel reveal">
      <div className="panel-num">
        <span><span className="step">step {n}</span> · {label}</span>
        {kbd ? (
          <span className="kbd">{kbd.map((k, i) => <span key={i} className="key">{k}</span>)}</span>
        ) : null}
      </div>
      <div className="panel-body">
        {children}
        <div className="panel-cap">{caption}</div>
      </div>
    </div>
  );
}

const TERM_WORDS = "React batches the related transitions, so you won't get the flicker you saw with the boolean approach.".split(/\s+/);
function ActiveKaraokeTerm() {
  const i = useKaraoke(TERM_WORDS, 220, 1200);
  return (
    <>
      {TERM_WORDS.map((w, k) => (
        <span key={k} className={"w " + (k < i ? "spoken" : k === i ? "active" : "")}>{w}</span>
      ))}
    </>
  );
}

function PasteWorkflow() {
  return (
    <section id="workflow">
      <div className="page">
        <div className="section-head reveal">
          <div className="eyebrow">the paste loop</div>
          <h2 style={{ maxWidth: 18 + "ch" }}>The whole workflow is one keystroke each step.</h2>
          <p className="lede" style={{ marginTop: 16 }}>
            Whatever's in your clipboard is the input. Whatever's in your ears is the output. Nothing in between
            uploads, syncs, or opens a Chrome tab.
          </p>
        </div>

        <div className="workflow-grid">
          <StepPanel n="01" label="your agent writes" caption={<><b>Eight paragraphs.</b> Most of it is prose you don't actually need to read, just absorb.</>}>
            <MockChat />
          </StepPanel>

          <StepPanel n="02" label="select the prose" kbd={["⌘", "C"]} caption={<><b>Copy the answer.</b> Skip the code blocks if you want — recite reads what you give it.</>}>
            <div className="selection-overlay">
              <MockChat />
              <div className="sel-highlight" style={{ top: 38, height: 56 }}></div>
              <div className="caret-cmdc">⌘ <span style={{ color: "var(--ink-3)" }}>+</span> C</div>
            </div>
          </StepPanel>

          <StepPanel n="03" label="paste into recite" kbd={["⌘", "V"]} caption={<><b>recite --paste</b> opens a text box. Drop the prose. <span style={{ color: "var(--amber)" }}>Ctrl+S</span> reflows the wraps and starts playback.</>}>
            <div className="term">
              <div className="term-head">
                <div className="l"><span></span><span></span><span></span></div>
                <div className="ttl">~/work — recite --paste</div>
              </div>
              <div className="term-body">
                <div className="prompt"><span className="glyph">›</span> recite --paste</div>
                <div className="hinttop" style={{ marginTop: 8 }}>
                  <span>paste then press <span style={{ color: "var(--amber)" }}>Ctrl+S</span></span>
                  <span style={{ color: "var(--green)" }}>● ready</span>
                </div>
                <div className="pasted">
                  Sure — the reason I reached for useReducer here is that the auth flow has four mutually-exclusive states<span className="caret"></span>
                </div>
                <div className="dim" style={{ marginTop: 8, fontSize: 10 }}>847 chars · 142 words · ~43 sec @ 200 wpm</div>
              </div>
            </div>
          </StepPanel>

          <StepPanel n="04" label="listen, hands free" kbd={["space"]} caption={<><b>Karaoke as it speaks.</b> Drop in mid-sentence and the active word tells you exactly where you are.</>}>
            <div className="term">
              <div className="term-head">
                <div className="l"><span></span><span></span><span></span></div>
                <div className="ttl">recite · ▶ playing</div>
              </div>
              <div className="term-body">
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-3)", fontSize: 10 }}>
                  <span>sentence 3 / 7</span>
                  <span style={{ color: "var(--amber)" }}>00:14 / 00:43</span>
                </div>
                <div className="term-karaoke">
                  <ActiveKaraokeTerm />
                </div>
                <div className="miniwave">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const h = 4 + (Math.abs(Math.sin(i * 1.3)) * 12);
                    let cls = "b";
                    if (i < 14) cls = "b p";
                    if (i === 14) cls = "b h";
                    return <span key={i} className={cls} style={{ height: h + "px" }}></span>;
                  })}
                </div>
              </div>
            </div>
          </StepPanel>
        </div>

        <div className="flow-caption" style={{ marginTop: 28, justifyContent: "center" }}>
          when the next response lands, <span style={{ color: "var(--ink)", marginLeft: 6, marginRight: 6 }}>Ctrl+N</span> clears and you paste the new one.
        </div>
      </div>
    </section>
  );
}

function Pitch() {
  return (
    <section>
      <div className="page">
        <div className="pitch">
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 0 }}>30-second pitch</div>
          </div>
          <div className="reveal">
            <p>
              Your AI agent just wrote you <span className="mute">eight paragraphs</span> about why it chose
              useReducer over useState.
            </p>
            <p>
              You don't want to <span className="mute">read</span> it; you want to half-listen while you stare at the diff.
            </p>
            <p>
              <span style={{ color: "var(--amber)" }}>recite</span> is a tiny macOS TUI that takes whatever you paste
              and reads it aloud with word-level karaoke. Offline, free, no API keys, no account, no usage caps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="how">
      <div className="page">
        <div className="section-head reveal">
          <div className="eyebrow">how it works</div>
          <h2>Three Unix-y stages. No magic.</h2>
          <p className="lede" style={{ marginTop: 16 }}>
            recite splits, synthesises, and plays in three coordinated stages. Everything happens on your
            laptop, in a background asyncio task, in roughly 1,400 lines of Python.
          </p>
        </div>

        <div className="how reveal">
          <div className="how-cell">
            <div className="how-step">01 · SPLIT</div>
            <div className="how-title">Sentence-aware chunking</div>
            <div className="how-desc">
              Input is broken into sentences with an abbreviation-aware splitter (so "Dr. Smith" stays one
              sentence). Hard wraps from a producing terminal collapse first, so a copied paragraph arrives
              whole; lists and headings keep their breaks. Each chunk goes onto a synth queue.
            </div>
            <div className="how-art how-art-1">
              <span className="sent"><span className="num">01</span>Sure — the reason I reached for useReducer here…</span>
              <span className="sent"><span className="num">02</span>The auth flow has four mutually-exclusive states.</span>
              <span className="sent" style={{ borderColor: step === 0 ? "var(--amber)" : "var(--line)", color: step === 0 ? "var(--amber-glow)" : "var(--ink-3)" }}>
                <span className="num">03</span>React batches the related transitions…
              </span>
            </div>
          </div>

          <div className="how-cell">
            <div className="how-step">02 · SYNTH + ALIGN</div>
            <div className="how-title"><code style={{ fontFamily: "var(--mono)", color: "var(--ink)", fontSize: 14 }}>say -o</code> + per-word timings</div>
            <div className="how-desc">
              Each sentence is rendered to an aiff by Apple's <code style={{ fontFamily: "var(--mono)", color: "var(--amber)" }}>say</code>.
              The heuristic aligner distributes the duration across word tokens, weighted by length and
              punctuation.
            </div>
            <div className="how-art how-art-2" aria-hidden>
              {["React","batches","the","related","transitions"].map((label, i) => {
                const heights = [
                  [10, 22, 14, 28, 12],
                  [16, 12, 20, 8, 18, 24],
                  [8, 10, 9],
                  [12, 18, 22, 16, 10, 14, 20],
                  [14, 22, 28, 24, 16, 10],
                ];
                return (
                  <div key={i} className={"col" + (step === 1 && i === 2 ? " active" : "")}>
                    {heights[i].map((h, j) => (
                      <div key={j} className="b" style={{ height: h + "px" }}></div>
                    ))}
                    <div className="label">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="how-cell">
            <div className="how-step">03 · KARAOKE PLAYBACK</div>
            <div className="how-title">30 ms ticker, binary search</div>
            <div className="how-desc">
              <code style={{ fontFamily: "var(--mono)", color: "var(--amber)" }}>afplay</code> drives the audio.
              A 30 ms loop reads its position and binary-searches the timing array to find the word being
              spoken right now — then highlights it.
            </div>
            <div className="how-art how-art-3">
              {"React batches the related transitions".split(" ").map((w, i) => (
                <span key={i} className={"w" + (step === 2 && i === 2 ? " active" : "")}>{w}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    glyph: "⌘V",
    title: "Built for the paste loop",
    body: "Copy your AI's last response, paste into recite, press Ctrl+S. When the next one lands, Ctrl+N clears and you paste again. That's the whole workflow.",
    meta: "no upload · no sync · no Chrome tab",
  },
  {
    glyph: "◉",
    title: "Your prompts stay local",
    body: "Apple's say has been on every Mac since 1984 and it never phones home. recite is the player it never had. No \"your code is being used to train\" small print.",
    meta: "offline · on-device · no telemetry",
  },
  {
    glyph: "≡",
    title: "Karaoke highlight",
    body: "A 30 ms ticker reads afplay's position and binary-searches a pre-aligned timing array. The word you hear is the word that lights up.",
    meta: "word-level · 30 ms tick",
  },
  {
    glyph: "k j",
    title: "Vim-style transport",
    body: "Space, j/k, r, g/G, v, +/-, Ctrl+N. Made for people who already live in a terminal and never wanted to leave it.",
    meta: "keyboard-first",
  },
  {
    glyph: "▶",
    title: "Instant first word",
    body: "First word starts speaking ~300 ms after you press play. Subsequent sentences are pre-rendered in a background task, so playback never stalls waiting on synth.",
    meta: "~300 ms cold · pre-rendered queue",
  },
  {
    glyph: "≈",
    title: "Two aligners",
    body: "Heuristic is instant and ~85% accurate — great for any sentence under ~25 words. Switch to aeneas for forced alignment at ~99% accuracy when you need it.",
    meta: "--align heuristic · --align aeneas",
  },
];

function Features() {
  return (
    <section>
      <div className="page">
        <div className="section-head reveal">
          <div className="eyebrow">what's in the box</div>
          <h2>Six things, no roadmap padding.</h2>
        </div>
        <div className="features reveal">
          {FEATURES.map((f, i) => (
            <div className="feat" key={i}>
              <div className="feat-glyph">{f.glyph}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <div className="meta">{f.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const KEYS = [
  { keys: ["space"], action: "play / pause current sentence", group: "transport" },
  { keys: ["j", "→", "n"], action: "next sentence", group: "transport" },
  { keys: ["k", "←", "p"], action: "previous sentence", group: "transport" },
  { keys: ["r"], action: "replay current sentence", group: "transport" },
  { keys: ["g"], action: "jump to start", group: "transport" },
  { keys: ["G"], action: "jump to end", group: "transport" },
  { keys: ["+"], action: "speak faster (+20 wpm)", group: "rate" },
  { keys: ["−"], action: "speak slower (−20 wpm)", group: "rate" },
  { keys: ["v"], action: "cycle voice (Daniel → Samantha → …)", group: "voice" },
  { keys: ["Ctrl", "N"], action: "new text · clear and paste again", group: "buffer" },
  { keys: ["?"], action: "toggle help overlay", group: "help" },
  { keys: ["q", "esc"], action: "quit", group: "exit" },
  { keys: ["Ctrl", "Q"], action: "panic exit · kill afplay too", group: "exit" },
];

function Keys() {
  return (
    <section id="keys">
      <div className="page">
        <div className="section-head reveal">
          <div className="eyebrow">keybindings</div>
          <h2>Vim-flavoured, terminal-native.</h2>
        </div>
        <div className="keys-wrap reveal">
          {KEYS.map((k, i) => (
            <div className="keys-row" key={i}>
              <div className="kbds">
                {k.keys.map((kk, j) => (
                  <span key={j} className="key" style={{ display: "inline-flex", padding: "4px 10px", fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)", background: "var(--bg-3)", border: "1px solid var(--line-2)", borderRadius: 4, boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>{kk}</span>
                ))}
              </div>
              <div className="action">{k.action}</div>
              <div className="group">{k.group}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Install() {
  return (
    <section id="install">
      <div className="page">
        <div className="section-head reveal">
          <div className="eyebrow">install</div>
          <h2>One of three depending on how deep you want to go.</h2>
          <p className="lede" style={{ marginTop: 16 }}>
            All three are macOS. The default is enough for 95% of sentences. Aeneas is the upgrade if you want
            karaoke-grade alignment on long paragraphs.
          </p>
        </div>

        <div className="install-grid reveal">
          <div className="codecard">
            <div className="codecard-head">
              <span className="label">default</span>
              <span className="tag">recommended</span>
            </div>
            <div className="codecard-body">
              <div><span className="dollar">$</span><span className="b">brew install pipx</span></div>
              <div><span className="dollar">$</span><span className="b">pipx install</span> git+https://<br />&nbsp;&nbsp;github.com/michaldobiezynski/recite.git</div>
              <div><span className="cmnt"># done — heuristic aligner, ~0 extra deps</span></div>
            </div>
          </div>

          <div className="codecard">
            <div className="codecard-head">
              <span className="label">editable dev</span>
              <span className="tag">hack on it</span>
            </div>
            <div className="codecard-body">
              <div><span className="dollar">$</span><span className="b">git clone</span> https://github.com/<br />&nbsp;&nbsp;michaldobiezynski/recite</div>
              <div><span className="dollar">$</span><span className="b">cd recite &amp;&amp; make link</span></div>
              <div><span className="cmnt"># symlink into ~/.local/bin</span></div>
            </div>
          </div>

          <div className="codecard">
            <div className="codecard-head">
              <span className="label">aeneas upgrade</span>
              <span className="tag">precise</span>
            </div>
            <div className="codecard-body">
              <div><span className="dollar">$</span><span className="b">brew install espeak ffmpeg</span></div>
              <div><span className="dollar">$</span><span className="b">pipx install</span> 'git+https://github.com/<br />&nbsp;&nbsp;michaldobiezynski/recite.git[align]'</div>
              <div><span className="cmnt"># then: recite --align aeneas</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Limits() {
  return (
    <section>
      <div className="page">
        <div className="section-head reveal">
          <div className="eyebrow">honest caveats</div>
          <h2>What it doesn't do.</h2>
        </div>
        <div className="limits reveal">
          <div className="limit">
            <div className="limit-tag">⌘ PLATFORM</div>
            <h3>macOS only.</h3>
            <p>The codebase shells out to <code>say</code>, <code>afplay</code>, and <code>afinfo</code>. Replacing with <code>espeak-ng</code> + <code>paplay</code> would port the architecture to Linux — but it's not done.</p>
          </div>
          <div className="limit">
            <div className="limit-tag">≡ MARKDOWN</div>
            <h3>Best on prose.</h3>
            <p>Code blocks get read literally — backtick foo backtick equals one. Either copy just the prose, or learn to tune it out. <code>--strip-markdown</code> is on the roadmap.</p>
          </div>
          <div className="limit">
            <div className="limit-tag">≈ ALIGNMENT</div>
            <h3>Heuristic drifts on long sentences.</h3>
            <p>The default aligner accumulates small errors past ~25 words. <code>--align aeneas</code> fixes it at the cost of a one-time install step.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="page">
        <div className="foot">
          <div className="left">
            <span className="brand" style={{ fontFamily: "var(--mono)" }}>
              <span style={{ width: 6, height: 6, background: "var(--amber)", borderRadius: "50%", display: "inline-block", marginRight: 8 }}></span>
              recite
            </span>
            <span style={{ color: "var(--ink-4)" }}>·</span>
            <span>MIT licensed</span>
            <span style={{ color: "var(--ink-4)" }}>·</span>
            <span>offline forever</span>
          </div>
          <div className="right">
            <a href="https://github.com/michaldobiezynski/recite" target="_blank" rel="noreferrer">github</a>
            <a href="https://github.com/michaldobiezynski/recite/blob/master/LICENSE" target="_blank" rel="noreferrer">license</a>
            <a href="https://github.com/michaldobiezynski/recite#known-limitations" target="_blank" rel="noreferrer">caveats</a>
            <span style={{ color: "var(--ink-4)" }}>·</span>
            <span>made by michał</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();
  return (
    <>
      <TopBar />
      <Hero />
      <PasteWorkflow />
      <Pitch />
      <HowItWorks />
      <Features />
      <Keys />
      <Install />
      <Limits />
      <Footer />
    </>
  );
}
