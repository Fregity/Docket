"use client";

import { useEffect, useRef } from "react";
import styles from "./LandingClothesline.module.css";

/**
 * A clothesline of assignment tags that blow in the wind.
 * The markup is plain JSX; the physics and the wind canvas run imperatively
 * inside one effect (see startClothesline) and are torn down on unmount.
 */

type Vec = [x: number, y: number];
type BirdState = "away" | "perched" | "flying";

interface Item {
  name: string;
  due: number; // epoch ms
  done: boolean;
  isNew: boolean;
  /** Position along the wire, 0..1. */
  t: number;
  /** Index after sorting by due date. */
  i: number;
  /** How much wind this tag catches. */
  sail: number;
  /** False until the tag has been placed on the wire for the first time. */
  placed: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Swing angle (deg) and angular velocity. */
  th: number;
  tv: number;
  el: HTMLDivElement;
  btn: HTMLButtonElement;
  meta: HTMLElement;
}

interface Geom {
  p0: Vec;
  c: Vec;
  p2: Vec;
  w: number;
}

interface Gust {
  t0: number;
  d: number;
  s: number;
  v: number;
}

interface Streak {
  pts: Vec[];
  px: number;
  y: number;
  ph: number;
  o: number;
  k: number;
  d: number;
  lw: number;
  v: number;
}

interface Elements {
  wire: HTMLElement;
  tags: HTMLElement;
  line: SVGPathElement;
  shade: SVGPathElement;
  bird: HTMLElement;
  left: HTMLElement;
  input: HTMLInputElement;
  addBtn: HTMLButtonElement;
  canvas: HTMLCanvasElement;
  cx: CanvasRenderingContext2D;
}

const HOUR = 3600e3;
const DAY = 24 * HOUR;
const RADII = [
  "6px 22px 6px 22px",
  "20px 4px 20px 4px",
  "4px 18px 18px 4px",
  "24px 6px 6px 24px",
  "8px 8px 26px 8px",
  "14px 2px 14px 2px",
  "2px 20px 2px 20px",
];

function startClothesline(els: Elements): () => void {
  const { wire, tags: tagsEl, line, shade, bird, left: leftEl, input, addBtn, canvas: cv, cx } = els;

  /** Reduced motion keeps the wind but at half strength. "#motion" forces full motion. */
  const reduce =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches && location.hash !== "#motion";
  const wk = reduce ? 0.5 : 1;
  const dpr = Math.min(2, window.devicePixelRatio || 1);

  let disposed = false;

  // ---------------------------------------------------------------- state

  const isNarrow = (): boolean => wire.clientWidth < 720;

  function makeItem(name: string, due: number, isNew = false): Item {
    return {
      name, due, done: false, isNew,
      t: 0.5, i: 0, sail: 1, placed: false,
      x: 0, y: 0, vx: 0, vy: 0, th: 0, tv: 0,
      el: document.createElement("div"),
      btn: document.createElement("button"),
      meta: document.createElement("i"),
    };
  }

  const nowMs = Date.now();
  let items: Item[] = [
    makeItem("Calc set 6", nowMs + 30 * HOUR),
    makeItem("Bio lab report", nowMs + 2 * DAY + 4 * HOUR),
    makeItem("Read ch. 9", nowMs + 3 * DAY),
    makeItem("Quiz: Unit 4", nowMs + 4 * DAY + 2 * HOUR),
    makeItem("Essay draft", nowMs + 6 * DAY),
  ];

  // Wire drop-in spring (oy = offset, ov = velocity, oa = acceleration).
  let oy = reduce ? 0 : -(window.innerHeight + 120);
  let ov = 0;
  let oa = 0;
  let raf = 0;
  let last = 0;

  // Bird.
  let bstate: BirdState = "away";
  let bx = 0;
  let by = 0;
  let bt = 0.5;
  let btoken = 0;

  // Wind.
  let T = 0; // seconds of animation time
  let gusts: Gust[] = [];
  let streaks: Streak[] = [];
  let nextGust = -1;
  let sw = 0; // wire lift from the wind
  let cw = 0;
  let ch = 0;
  let windy = false;
  let phaseEnd = -1;
  let wb = 0; // eased 0..1 "is it windy right now"

  // -------------------------------------------------------------- helpers

  function fmt(ms: number): string {
    if (ms < HOUR) return "under 1h left";
    if (ms < DAY) return `${Math.floor(ms / HOUR)}h left`;
    const d = Math.floor(ms / DAY);
    const h = Math.floor((ms % DAY) / HOUR);
    return d < 3 ? `${d}d ${h}h left` : `${d} days left`;
  }

  function geom(): Geom {
    const w = wire.clientWidth;
    const h = wire.clientHeight - 170;
    return { p0: [-20, h * 0.2], c: [w * 0.5, h * 1.15], p2: [w + 20, h * 0.04], w };
  }

  /** Point on the wire (a quadratic Bézier) at t, including drop-in offset and wind lift. */
  function B(g: Geom, t: number): Vec {
    const u = 1 - t;
    const cy = g.c[1] + oy * 1.35 + sw;
    return [
      u * u * g.p0[0] + 2 * u * t * g.c[0] + t * t * g.p2[0],
      u * u * (g.p0[1] + oy) + 2 * u * t * cy + t * t * (g.p2[1] + oy),
    ];
  }

  const openItems = (): Item[] => items.filter((x) => !x.done);

  function sortItems(): void {
    items.sort((a, b) => a.due - b.due);
    const n = items.length;
    const w = wire.clientWidth || 800;
    const margin = Math.max(0.08, (Math.min(95, w * 0.17) + 12) / w);
    items.forEach((it, i) => {
      it.t = n > 1 ? margin + ((1 - 2 * margin) * i) / (n - 1) : 0.5;
      it.i = i;
    });
  }

  // --------------------------------------------------------------- tags

  function build(): void {
    tagsEl.innerHTML = "";
    sortItems();
    items.forEach((it, i) => {
      const el = document.createElement("div");
      el.style.setProperty("--s", `${isNarrow() ? 38 + (i % 3) * 22 : 46 + (i % 2) * 30}px`);
      el.style.setProperty("--rad", RADII[i % RADII.length]);
      it.sail = 0.8 + ((i * 7) % 5) * 0.1;

      const btn = document.createElement("button");
      btn.className = styles.body;
      btn.type = "button";
      const nameEl = document.createElement("b");
      nameEl.textContent = it.name;
      const meta = document.createElement("i");
      btn.append(nameEl, meta);
      btn.onclick = () => {
        it.done = !it.done;
        it.tv += 90;
        style(it);
        status();
        sync();
        kick();
      };

      el.appendChild(btn);
      tagsEl.appendChild(el);
      it.el = el;
      it.btn = btn;
      it.meta = meta;
      if (it.isNew) el.classList.add(styles.pop);
      el.classList.add(styles.tag);
      style(it);
      if (it.placed) place0(it);
    });
    status();
  }

  function style(it: Item): void {
    const timeLeft = it.due - Date.now();
    it.el.classList.toggle(styles.done, it.done);
    it.el.classList.toggle(styles.urgent, !it.done && timeLeft < 2 * DAY);
    it.btn.setAttribute("aria-pressed", it.done ? "true" : "false");
    it.meta.textContent = it.done ? "done" : fmt(timeLeft);
  }

  function status(): void {
    const n = openItems().length;
    leftEl.textContent = n ? `${n} still due` : "Nothing due. Go outside.";
  }

  function place0(it: Item): void {
    it.placed = true;
    it.el.style.transform = `translate(${it.x - it.el.offsetWidth / 2}px,${it.y}px) rotate(${it.th}deg)`;
  }

  function snapAll(): void {
    const g = geom();
    items.forEach((it) => {
      const p = B(g, it.t);
      it.x = p[0];
      it.y = p[1];
      it.vx = it.vy = it.th = it.tv = 0;
      place0(it);
    });
  }

  function resetAll(): void {
    oy = 0;
    ov = 0;
    items.forEach((it) => (it.placed = false));
    setTimeout(kick, 100);
  }

  // --------------------------------------------------------------- wind

  const smooth = (x: number): number => x * x * (3 - 2 * x);

  /** 0 -> 1 -> 0 envelope of a gust over `dur` seconds. */
  function env(u: number, dur: number): number {
    if (u <= 0 || u >= dur) return 0;
    const a = 0.3 * dur;
    return u < a ? smooth(u / a) : smooth(1 - (u - a) / (dur - a));
  }

  /** Wind strength at horizontal position x and time t: a breeze plus passing gusts. */
  function windAt(x: number, t: number): number {
    let w = wb * (0.22 + 0.08 * Math.sin(t * 0.8 - x * 0.004) + 0.05 * Math.sin(t * 2.1 - x * 0.011));
    for (const g of gusts) w += g.s * env(t - g.t0 - (x + 120) / g.v, g.d);
    return w;
  }

  function sizeCanvas(): void {
    const W = wire.clientWidth;
    const H = wire.clientHeight;
    if (W === cw && H === ch) return;
    cw = W;
    ch = H;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** A wavy line that optionally ends in a spiral curl, in local coordinates. */
  function mkSwirl(length: number, amp: number, freq: number, curl: boolean): Vec[] {
    const pts: Vec[] = [];
    const n = Math.ceil(length / 7);
    let x = 0;
    let y = 0;
    for (let i = 0; i <= n; i++) {
      x = i * 7;
      y = Math.sin(x * freq) * amp * (0.35 + (0.65 * i) / n);
      pts.push([x, y]);
    }
    if (curl) {
      const r = 9 + Math.random() * 12;
      const turns = 1.1 + Math.random() * 0.5;
      const m = 34;
      for (let i = 1; i <= m; i++) {
        const u = i / m;
        const a = Math.PI / 2 - u * turns * 2 * Math.PI;
        const rad = r * (1 - 0.62 * u);
        pts.push([x + Math.cos(a) * rad, y - r + Math.sin(a) * rad]);
      }
    }
    return pts;
  }

  function windStep(dt: number): void {
    sizeCanvas();

    // Wind comes and goes: windy and calm stretches of random length.
    if (phaseEnd < 0) {
      phaseEnd = T + 1;
      windy = false;
    }
    if (T >= phaseEnd) {
      windy = !windy;
      phaseEnd = T + 4 + Math.random() * 5;
      if (windy) nextGust = T + 0.2;
    }
    wb += ((windy ? 1 : 0) - wb) * Math.min(1, dt * 1.6);

    if (windy && T >= nextGust && T < phaseEnd - 1.2) {
      gusts.push({
        t0: T,
        d: 2.2 + Math.random() * 1.4,
        s: 0.7 + Math.random() * 0.55,
        v: 360 + Math.random() * 320,
      });
      nextGust = T + 1.6 + Math.random() * 2.2;
    }
    gusts = gusts.filter((g) => T - g.t0 < g.d + (cw + 240) / g.v + 0.2);

    // Every swirl enters from off the left edge.
    const wl = windAt(-100, T);
    if (Math.random() < wl * dt * 5 * wk && streaks.length < 12) {
      const length = 110 + Math.random() * 190;
      const v = 320 + 560 * wl;
      streaks.push({
        pts: mkSwirl(length, 5 + Math.random() * 9, 0.018 + Math.random() * 0.014, Math.random() < 0.55),
        px: -(length + 70),
        y: ch * (0.02 + Math.random() * 0.7),
        ph: Math.random() * 6.28,
        o: 0.6 + Math.random() * 0.4,
        k: 0,
        d: (cw + length + 160) / v,
        lw: 2 + Math.random() * 1.5,
        v,
      });
    }

    cx.clearRect(0, 0, cw, ch);
    cx.lineCap = "round";
    cx.lineJoin = "round";
    streaks = streaks.filter((s) => {
      s.px += s.v * dt;
      s.k += dt / s.d;
      if (s.k >= 1 || s.px > cw + 40) return false;

      const k = s.k;
      const N = s.pts.length;
      const head = 1 - Math.pow(1 - Math.min(1, k / 0.6), 2); // line draws on...
      const tail = Math.pow(Math.max(0, (k - 0.3) / 0.7), 2); // ...then its tail follows
      const i0 = Math.floor(tail * (N - 1));
      const i1 = Math.floor(head * (N - 1));
      if (i1 - i0 < 2) return true;

      const ox = s.px;
      const oyy = s.y + Math.sin(T * 3 + s.ph) * 3;
      const fade = k > 0.85 ? (1 - k) / 0.15 : 1;
      for (let i = i0 + 1; i <= i1; i++) {
        const fr = (i - i0) / (i1 - i0);
        cx.strokeStyle = `rgba(238,240,255,${(s.o * fade * fr).toFixed(3)})`;
        cx.lineWidth = s.lw * (0.3 + 0.7 * fr);
        cx.beginPath();
        cx.moveTo(ox + s.pts[i - 1][0], oyy + s.pts[i - 1][1]);
        cx.lineTo(ox + s.pts[i][0], oyy + s.pts[i][1]);
        cx.stroke();
      }
      return true;
    });
  }

  // ------------------------------------------------------------ physics

  function tick(now: number): boolean {
    const dt = Math.max(0.001, Math.min(0.033, (now - last) / 1000 || 0.016));
    last = now;
    T += dt;

    const wm = windAt(wire.clientWidth * 0.5, T);
    sw = (-9 * wm + Math.sin(T * 4.3) * wm * 1.8) * wk;

    if (!isFinite(oy + ov)) {
      oy = 0;
      ov = 0;
    }
    const g = geom();

    // Wire drop-in spring.
    const a = -60 * oy - 7 * ov;
    ov += a * dt;
    oy += ov * dt;
    oa = a;
    if (Math.abs(oy) <= 0.3 && Math.abs(ov) <= 0.5) {
      oy = 0;
      ov = 0;
      oa = 0;
    }

    const d = `M${g.p0[0]} ${g.p0[1] + oy} Q${g.c[0]} ${g.c[1] + oy * 1.35 + sw} ${g.p2[0]} ${g.p2[1] + oy}`;
    line.setAttribute("d", d);
    shade.setAttribute("d", d);
    shade.setAttribute("transform", "translate(0 4)");

    for (const it of items) {
      const p = B(g, it.t);
      if (!it.placed) {
        it.x = p[0];
        it.y = p[1];
        it.vx = it.vy = it.th = 0;
        it.tv = reduce ? 0 : (it.i % 2 ? -1 : 1) * 40;
        it.placed = true;
      }
      if (!isFinite(it.x + it.y + it.th + it.vx + it.vy + it.tv)) {
        it.x = p[0];
        it.y = p[1];
        it.vx = it.vy = it.th = it.tv = 0;
      }

      const ax = -140 * (it.x - p[0]) - 14 * it.vx;
      const ay = -140 * (it.y - p[1]) - 14 * it.vy;
      it.vx += ax * dt;
      it.vy += ay * dt;
      it.x += it.vx * dt;
      it.y += it.vy * dt;

      const k = (it.i % 2 ? -1 : 1) * (0.7 + 0.1 * it.i);
      const wl = windAt(it.x, T);
      const wt =
        -wl * wk * it.sail *
        (620 + 200 * Math.sin(T * 5.2 + it.i * 1.7) + 110 * Math.sin(T * 11 + it.i * 2.9));
      const at = -32 * it.th - 1.8 * it.tv + oa * 0.006 * k - ax * 0.004 + wt;
      it.tv += at * dt;
      it.th += it.tv * dt;
      it.th = Math.max(-28, Math.min(14, it.th));

      const skew = (-4 * wl * wk * Math.sin(T * 9 + it.i * 2.3)).toFixed(2);
      it.el.style.transform =
        `translate(${it.x - it.el.offsetWidth / 2}px,${it.y}px) rotate(${it.th}deg) skewX(${skew}deg)`;
    }

    windStep(dt);

    if (bstate === "perched") {
      const f = openItems()[0];
      if (f) {
        bt = f.t;
        const q = B(g, bt);
        bx = q[0];
        by = q[1];
        setBird(0, 0);
      }
    }
    return true; // the wind never stops, so keep animating
  }

  function frame(now: number): void {
    raf = 0;
    if (disposed) return;
    let again = false;
    try {
      again = tick(now);
    } catch (e: unknown) {
      console.error(e);
      resetAll();
    }
    if (again) raf = requestAnimationFrame(frame);
  }

  function kick(): void {
    if (raf || disposed) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  // --------------------------------------------------------------- bird

  function setBird(rot: number, scaleY: number): void {
    bird.style.opacity = "1";
    bird.style.transform =
      `translate(${bx - bird.offsetWidth / 2}px,${by - bird.offsetHeight * 0.7}px) rotate(${rot}deg) scaleY(${1 + scaleY})`;
  }

  function fly(dest: () => Vec, dur: number, arc: number, done: () => void): void {
    const token = ++btoken;
    const x0 = bx;
    const y0 = by;
    const t0 = performance.now();
    bstate = "flying";
    kick();
    const step = (now: number): void => {
      if (token !== btoken || disposed) return;
      const k = Math.min(1, (now - t0) / dur);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const dd = dest();
      bx = x0 + (dd[0] - x0) * e;
      by = y0 + (dd[1] - y0) * e - Math.sin(Math.PI * k) * arc;
      const tilt = Math.max(-18, Math.min(18, (dd[1] - y0) / 18)) * Math.sin(Math.PI * k) * 0.8;
      setBird(tilt, reduce ? 0 : Math.sin(k * 38) * 0.05 * (1 - k));
      if (k < 1) requestAnimationFrame(step);
      else done();
    };
    step(t0);
  }

  const offX = (): number => wire.clientWidth + 260;
  const offY = (): number => -wire.getBoundingClientRect().top - 260;

  /** Send the bird to the first unfinished tag, or away if everything is done. */
  function sync(): void {
    const f = openItems()[0];
    if (!f) {
      if (bstate === "away") return;
      bstate = "flying";
      fly(() => [offX(), offY()], 1500, -60, () => {
        bstate = "away";
        bird.style.opacity = "0";
      });
      return;
    }
    const dest = (): Vec => B(geom(), f.t);
    if (bstate === "away") {
      bx = -260;
      by = offY();
      setBird(0, 0);
    }
    if (bstate === "perched" && Math.abs(bt - f.t) < 0.001) return;
    const prev = bstate;
    fly(dest, prev === "away" ? 1700 : 850, prev === "away" ? 140 : 70, () => {
      bstate = "perched";
      bt = f.t;
      f.tv += prev === "away" ? -110 : -60;
      kick();
    });
  }

  // ---------------------------------------------------------- add a tag

  function add(): void {
    const v = input.value.trim();
    if (!v) return;

    const cap = isNarrow() ? 3 : 7;
    while (items.length >= cap) {
      let di = items.findIndex((x) => x.done);
      if (di < 0) {
        sortItems();
        di = items.length - 1;
      }
      items.splice(di, 1);
    }

    const it = makeItem(v, Date.now() + 2.5 * DAY + Math.random() * DAY, true);
    items.push(it);
    input.value = "";
    sortItems();
    build();

    const p = B(geom(), it.t);
    it.x = p[0];
    it.y = p[1] - 260;
    it.vx = it.vy = it.th = 0;
    it.tv = -70;
    place0(it);
    if (reduce) snapAll();
    sync();
    kick();
  }

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === "Enter") add();
  };

  // --------------------------------------------------------------- boot

  addBtn.addEventListener("click", add);
  input.addEventListener("keydown", onKey);
  window.addEventListener("resize", kick);

  if (isNarrow()) items = items.slice(0, 3);
  build();
  if (reduce) {
    oy = 0;
    frame(performance.now());
  } else {
    kick();
  }
  const syncTimer = window.setTimeout(sync, reduce ? 0 : 1900);
  const clockTimer = window.setInterval(() => {
    for (const it of items) if (!it.done) style(it);
  }, 60000);

  // ------------------------------------------------------------ cleanup

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    raf = 0;
    btoken++;
    window.clearTimeout(syncTimer);
    window.clearInterval(clockTimer);
    window.removeEventListener("resize", kick);
    addBtn.removeEventListener("click", add);
    input.removeEventListener("keydown", onKey);
    tagsEl.innerHTML = "";
    bird.style.opacity = "";
    bird.style.transform = "";
    cx.clearRect(0, 0, cw, ch);
  };
}

export default function LandingClothesline() {
  const wireRef = useRef<HTMLElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const shadeRef = useRef<SVGPathElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wire = wireRef.current;
    const tags = tagsRef.current;
    const line = lineRef.current;
    const shade = shadeRef.current;
    const bird = birdRef.current;
    const left = leftRef.current;
    const input = inputRef.current;
    const addBtn = addRef.current;
    const canvas = canvasRef.current;
    const cx = canvas?.getContext("2d");
    if (!wire || !tags || !line || !shade || !bird || !left || !input || !addBtn || !canvas || !cx) {
      return;
    }
    return startClothesline({ wire, tags, line, shade, bird, left, input, addBtn, canvas, cx });
  }, []);

  return (
    <section
      ref={wireRef}
      className={styles.wire}
      aria-label="Sample class list. Tap an assignment to check it off."
    >
      <canvas ref={canvasRef} className={styles.wind} aria-hidden="true" />
      <svg className={styles.svg} aria-hidden="true">
        <path ref={shadeRef} className={styles.shade} d="M0 0" />
        <path ref={lineRef} className={styles.line} d="M0 0" />
      </svg>
      <div ref={tagsRef} />
      <div ref={birdRef} className={styles.bird} aria-hidden="true" />
      <div className={styles.meta}>
        <span ref={leftRef} className={styles.left} aria-live="polite" />
        <div className={styles.add}>
          <input
            ref={inputRef}
            type="text"
            maxLength={28}
            placeholder="Add one yourself"
            aria-label="Add an assignment to the sample list"
          />
          <button ref={addRef} type="button">
            Hang it
          </button>
        </div>
      </div>
    </section>
  );
}