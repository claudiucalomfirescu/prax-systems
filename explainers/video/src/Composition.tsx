// Prax Systems explainer: ~61 s, 1920x1080, 30 fps, silent.
// Every file name, rule and number comes from this repo: the blueprint files of K-prax-repo@0.2,
// the six layers of METHOD.md, and the checker results recorded in demo/data/check_ecosystem.txt
// (13 Nov 2026). Nothing is a mock-up of a result that did not happen.
import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = {
  bg: "#0f172a",
  panel: "#1e293b",
  line: "#334155",
  text: "#e2e8f0",
  dim: "#94a3b8",
  blueprint: "#fbbf24", // durable: goal, spec, decisions
  prompts: "#a78bfa", // the recipe
  proof: "#34d399", // tests + demo data, PASS
  model: "#60a5fa", // today's model, rendering 1
  render: "#f08a4b", // the disposable code
  bad: "#f87171",
};
const FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, "Segoe UI", sans-serif';
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", Menlo, monospace';
const FPS = 30;
const S = (s: number) => Math.round(s * FPS);

const SCENES = [
  { id: "title", d: 4.5 },
  { id: "problem", d: 8 },
  { id: "blueprint", d: 10 },
  { id: "layers", d: 8 },
  { id: "rebuild", d: 10.5 },
  { id: "checker", d: 9 },
  { id: "ecosystem", d: 6.5 },
  { id: "outro", d: 5 },
] as const;
const TOTAL = SCENES.reduce((a, s) => a + S(s.d), 0);

const ease = (f: number, from: number, dur: number) =>
  interpolate(f - from, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const Appear: React.FC<{ at?: number; y?: number; x?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at = 0,
  y = 26,
  x = 0,
  children,
  style,
}) => {
  const o = ease(useCurrentFrame(), at, 14);
  return <div style={{ opacity: o, transform: `translate(${(1 - o) * x}px, ${(1 - o) * y}px)`, ...style }}>{children}</div>;
};

const Frame: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o, padding: "80px 120px", fontFamily: FONT, color: C.text }}>{children}</AbsoluteFill>
  );
};

const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.blueprint }) => (
  <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color, fontWeight: 700, marginBottom: 14 }}>
    {children}
  </div>
);
const H: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 62 }) => (
  <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.12 }}>{children}</div>
);
const Caption: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Appear at={at} style={{ position: "absolute", left: 120, right: 120, bottom: 70 }}>
    <div style={{ fontSize: 38, color: C.text, textAlign: "center", lineHeight: 1.35 }}>{children}</div>
  </Appear>
);
const FileBox: React.FC<{ name: string; note: string; color: string; style?: React.CSSProperties }> = ({ name, note, color, style }) => (
  <div style={{ background: C.panel, border: `3px solid ${color}`, borderRadius: 16, padding: "14px 24px", ...style }}>
    <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 700, color }}>{name}</div>
    <div style={{ fontSize: 23, color: C.dim, marginTop: 4 }}>{note}</div>
  </div>
);
const Check: React.FC<{ color?: string }> = ({ color = C.proof }) => <span style={{ color, fontWeight: 800 }}>✓</span>;

// The mark: a blueprint sheet with a code page in front of it, the code page dashed (replaceable).
const Mark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="10" y="8" width="62" height="76" rx="8" fill={C.blueprint + "22"} stroke={C.blueprint} strokeWidth={5} />
    {[24, 36, 48].map((y) => (
      <line key={y} x1="21" x2="58" y1={y} y2={y} stroke={C.blueprint} strokeWidth={4} strokeLinecap="round" />
    ))}
    <rect x="40" y="40" width="50" height="52" rx="8" fill={C.bg} stroke={C.render} strokeWidth={5} strokeDasharray="9 6" />
    <text x="65" y="74" textAnchor="middle" fontFamily={MONO} fontSize="22" fontWeight={800} fill={C.render}>
      {"</>"}
    </text>
  </svg>
);

/* 1 · Title */
const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const s = spring({ frame: useCurrentFrame(), fps: useVideoConfig().fps, config: { damping: 14 } });
  return (
    <Frame dur={dur}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
        <div style={{ transform: `scale(${s})` }}>
          <Mark size={200} />
        </div>
        <Appear at={8}>
          <div style={{ fontSize: 104, fontWeight: 800 }}>Prax Systems</div>
        </Appear>
        <Appear at={16}>
          <div style={{ fontSize: 46, color: C.dim, textAlign: "center" }}>Ship code with the specs and prompts to rebuild it</div>
        </Appear>
      </AbsoluteFill>
    </Frame>
  );
};

/* 2 · The problem: the code ages, the why lives in a chat that scrolls away */
const Problem: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const age = ease(f, S(2.2), S(3));
  const chats = [
    "why does the firewall block this?",
    "use X-Agent-User, not the key",
    "keep @1 columns, add the new table",
    "retry on the free model first",
  ];
  return (
    <Frame dur={dur}>
      <Kicker color={C.bad}>The problem</Kicker>
      <H>Code ages with the model that wrote it. The reasons live in a chat.</H>
      <div style={{ display: "flex", gap: 90, marginTop: 60, alignItems: "flex-start" }}>
        <Appear at={10} style={{ flex: 1 }}>
          <div
            style={{
              background: C.panel,
              border: `3px solid ${C.render}`,
              borderRadius: 18,
              padding: "26px 32px",
              filter: `grayscale(${age}) blur(${age * 1.6}px)`,
              opacity: 1 - age * 0.45,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim, marginBottom: 12 }}>proxy.py · written 2026</div>
            {["def forward(request):", "    user = headers.get(...)", "    log.write(call)", "    return upstream(...)"].map((l) => (
              <div key={l} style={{ fontFamily: MONO, fontSize: 30, color: C.text, lineHeight: 1.5, whiteSpace: "pre" }}>
                {l}
              </div>
            ))}
          </div>
          <Appear at={S(3.2)}>
            <div style={{ fontSize: 30, color: C.render, marginTop: 18 }}>months later: a better model, a new language</div>
          </Appear>
        </Appear>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {chats.map((c, i) => {
            const fade = ease(f, S(5.2) + i * 5, 20);
            return (
              <Appear key={c} at={14 + i * 6} x={30} y={0}>
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: "#263449",
                    borderRadius: 22,
                    padding: "14px 24px",
                    fontSize: 30,
                    color: C.text,
                    opacity: 1 - fade * 0.7,
                    transform: `translateY(${-fade * 30}px)`,
                  }}
                >
                  {c}
                </div>
              </Appear>
            );
          })}
        </div>
      </div>
      <Caption at={S(5)}>Nobody can say exactly what it must do, so nobody can safely rebuild it.</Caption>
    </Frame>
  );
};

/* 3 · The blueprint folder */
const BLUEPRINT = [
  { n: "GOAL.md", t: "why it exists, who for, success criteria", c: C.blueprint },
  { n: "SPEC.md", t: "requirements R-001…, versioned contracts K-…@1", c: C.blueprint },
  { n: "ARCHITECTURE.md", t: "the parts, and where each R-id lives", c: C.blueprint },
  { n: "DECISIONS.md", t: "every choice, with the alternatives", c: C.blueprint },
  { n: "ROADMAP.md", t: "done, and what comes next", c: C.blueprint },
  { n: "PROMPTS.md", t: "P-01… as actually used, P-REBUILD, P-VERIFY", c: C.prompts },
];
const Blueprint: React.FC<{ dur: number }> = () => (
  <Frame dur={S(10)}>
    <Kicker>The fix</Kicker>
    <H>Every repo publishes its blueprint, not just its code.</H>
    <div style={{ display: "flex", gap: 60, marginTop: 44 }}>
      <div style={{ flex: 1.35, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {BLUEPRINT.map((b, i) => (
          <Appear key={b.n} at={12 + i * 9}>
            <FileBox name={"blueprint/" + b.n} note={b.t} color={b.c} />
          </Appear>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
        <Appear at={70}>
          <FileBox name="tests/ + demo/data/" note="tests cite the R-ids they prove; recorded traffic, no key" color={C.proof} />
        </Appear>
        <Appear at={84}>
          <FileBox name="explainers/" note="offline animated explainer, README diagram" color={C.model} />
        </Appear>
        <Appear at={98}>
          <FileBox
            name="proxy/ dashboard/ …"
            note="the code: one rendering of the spec"
            color={C.render}
            style={{ borderStyle: "dashed" }}
          />
        </Appear>
      </div>
    </div>
    <Caption at={S(6.5)}>
      <span style={{ color: C.blueprint, fontWeight: 700 }}>The specification is the system.</span>{" "}
      <span style={{ color: C.render, fontWeight: 700 }}>Code is one rendering of it.</span>
    </Caption>
  </Frame>
);

/* 4 · Six layers by durability */
const LAYERS = [
  { n: "1 Intent", f: "GOAL.md", s: "survives always", c: C.blueprint },
  { n: "2 Contract", f: "SPEC.md · R-ids · K-…@v", s: "survives always", c: C.blueprint },
  { n: "3 Proof", f: "tests/ · demo/data", s: "survives", c: C.proof },
  { n: "4 Recipe", f: "PROMPTS.md", s: "re-run by a new model", c: C.prompts },
  { n: "5 Shape", f: "ARCHITECTURE.md", s: "partly", c: C.model },
  { n: "6 Rendering", f: "the code", s: "replaced", c: C.render },
];
const Layers: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const swap = ease(f, S(5), 18);
  return (
    <Frame dur={dur}>
      <Kicker color={C.model}>Six layers</Kicker>
      <H>Ordered by how long they stay true.</H>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 40, width: 1300 }}>
        {LAYERS.map((l, i) => {
          const last = i === LAYERS.length - 1;
          return (
            <Appear key={l.n} at={10 + i * 8} x={-40} y={0}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: C.panel,
                  border: `3px ${last ? "dashed" : "solid"} ${l.c}`,
                  borderRadius: 14,
                  padding: "14px 28px",
                  opacity: last ? 1 - swap * 0.6 : 1,
                }}
              >
                <div style={{ width: 280, fontSize: 36, fontWeight: 800, color: l.c }}>{l.n}</div>
                <div style={{ flex: 1, fontFamily: MONO, fontSize: 28, color: C.text }}>{l.f}</div>
                <div style={{ fontFamily: MONO, fontSize: 26, color: last ? C.render : C.dim }}>{l.s}</div>
              </div>
            </Appear>
          );
        })}
      </div>
      <Caption at={S(5)}>A rebuild may throw away the bottom layer, as long as everything above it still holds.</Caption>
    </Frame>
  );
};

/* 5 · Rebuild with a future model */
const Rebuild: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const flow = ease(f, 40, 40);
  const checks = ["R-001 forwards unchanged", "R-004 one log row per call", "R-005 user from headers", "R-040 demo runs with no key"]; // llm-proxy-log SPEC
  return (
    <Frame dur={dur}>
      <Kicker color={C.prompts}>Rebuild · Gold, next on the roadmap</Kicker>
      <H>Hand the blueprint to a better model. Prove the result.</H>
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 120 }}>
        <Appear at={8}>
          <FileBox name="blueprint/" note="of llm-proxy-log, + tests/ + demo/data" color={C.blueprint} style={{ width: 320 }} />
        </Appear>
        <div style={{ width: 80, height: 6, background: C.line, position: "relative" }}>
          <div style={{ width: `${flow * 100}%`, height: 6, background: C.prompts }} />
        </div>
        <Appear at={24}>
          <div
            style={{
              width: 250,
              height: 250,
              borderRadius: "50%",
              border: `4px solid ${C.prompts}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: C.panel,
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 800 }}>future model</div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: C.prompts, marginTop: 8 }}>P-REBUILD</div>
          </div>
        </Appear>
        <div style={{ width: 80, height: 6, background: C.line }}>
          <div style={{ width: `${ease(f, 80, 30) * 100}%`, height: 6, background: C.render }} />
        </div>
        <Appear at={95}>
          <FileBox name="rendering 2" note="any language, e.g. Go" color={C.render} style={{ width: 280 }} />
        </Appear>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 450, whiteSpace: "nowrap" }}>
          <Appear at={120}>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.prompts, fontWeight: 700 }}>P-VERIFY</div>
          </Appear>
          {checks.map((c, i) => (
            <Appear key={c} at={130 + i * 9} x={20} y={0}>
              <div style={{ fontFamily: MONO, fontSize: 24, color: C.text }}>
                <Check /> {c}
              </div>
            </Appear>
          ))}
        </div>
      </div>
      <Caption at={S(6.8)}>It counts only when the same tests pass on the same recorded demo data.</Caption>
    </Frame>
  );
};

/* 6 · The checker, with the real recorded results */
const RESULTS = [
  { r: "llm-proxy-log", n: 34 },
  { r: "llm-proxy-firewall", n: 58 },
  { r: "vxc-motors-sim", n: 31 },
  { r: "llm-session-console", n: 33 },
];
const Checker: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const cmd = "./demo/check_ecosystem.sh";
  const typed = cmd.slice(0, Math.floor(interpolate(f, [12, 40], [0, cmd.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return (
    <Frame dur={dur}>
      <Kicker color={C.proof}>Keep it honest</Kicker>
      <H>A 140-line checker, copied into every repo.</H>
      <div
        style={{
          marginTop: 44,
          background: "#0b1222",
          border: `2px solid ${C.line}`,
          borderRadius: 18,
          padding: "30px 40px",
          fontFamily: MONO,
          fontSize: 32,
          lineHeight: 1.55,
          width: 1300,
        }}
      >
        <div>
          <span style={{ color: C.proof }}>$</span> {typed}
          {typed.length < cmd.length ? <span style={{ color: C.dim }}>▌</span> : null}
        </div>
        {RESULTS.map((x, i) => (
          <Appear key={x.r} at={50 + i * 14} y={10}>
            <div>
              {x.r}: <span style={{ color: C.proof, fontWeight: 800 }}>PASS (silver)</span>
              <span style={{ color: C.dim }}>
                {"  "}· {x.n}/{x.n} requirements covered
              </span>
            </div>
          </Appear>
        ))}
      </div>
      <Caption at={S(4.6)}>
        Every requirement cited by a test, recorded demo data, an offline explainer.
        <br />
        <span style={{ color: C.dim, fontSize: 30 }}>Recorded 13 Nov 2026 · demo/data/check_ecosystem.txt</span>
      </Caption>
    </Frame>
  );
};

/* 7 · Four systems, joined only by contracts */
const Ecosystem: React.FC<{ dur: number }> = ({ dur }) => {
  const box = (name: string, note: string, x: number, y: number, at: number) => (
    <Appear at={at} style={{ position: "absolute", left: x, top: y }}>
      <div style={{ background: C.panel, border: `3px solid ${C.text}`, borderRadius: 16, padding: "16px 22px", width: 440, textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: 24, color: C.dim }}>{note}</div>
      </div>
    </Appear>
  );
  const f = useCurrentFrame();
  const l = ease(f, 30, 25);
  return (
    <Frame dur={dur}>
      <Kicker color={C.model}>Four systems built with it</Kicker>
      <H>Joined only by versioned contracts.</H>
      <div style={{ position: "relative", height: 560, marginTop: 30 }}>
        <svg width={1680} height={560} style={{ position: "absolute", left: 0, top: 0 }}>
          <g fill="none" strokeWidth={5} opacity={l}>
            <path d="M440 280 C530 260 540 110 620 100" stroke={C.model} />
            <path d="M440 300 C530 320 540 450 620 460" stroke={C.model} />
            <path d="M1060 100 C1140 110 1150 260 1230 280" stroke={C.render} />
            <path d="M1060 460 C1140 450 1150 320 1230 300" stroke={C.render} />
          </g>
          <g fontFamily={MONO} fontSize={26} opacity={l}>
            <text x={20} y={225} fill={C.model}>
              K-agent-headers@1
            </text>
            <text x={1100} y={70} fill={C.render}>
              K-log-schema@1
            </text>
            <text x={1100} y={530} fill={C.render}>
              K-log-schema@2
            </text>
          </g>
        </svg>
        {box("vxc-motors-sim", "12 employee agents", 0, 240, 6)}
        {box("llm-proxy-log", "proxy + log + dashboard", 620, 50, 12)}
        {box("llm-proxy-firewall", "+ session firewall", 620, 410, 18)}
        {box("llm-session-console", "drill-down + replay", 1230, 240, 24)}
      </div>
      <Caption at={S(3.4)}>Each contract has one owner. Consumers test against the owner&apos;s recorded data.</Caption>
    </Frame>
  );
};

/* 8 · Outro */
const Outro: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame dur={dur}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
      <Appear>
        <Mark size={130} />
      </Appear>
      <Appear at={6}>
        <div style={{ fontSize: 60, fontWeight: 800, textAlign: "center" }}>Copy the templates. Let the checker list the gaps.</div>
      </Appear>
      <Appear at={18}>
        <div style={{ fontFamily: MONO, fontSize: 34, color: C.dim, background: C.panel, padding: "18px 30px", borderRadius: 14 }}>
          python3 tools/prax_check.py . --level silver
        </div>
      </Appear>
      <Appear at={30}>
        <div style={{ fontFamily: MONO, fontSize: 34, color: C.blueprint, marginTop: 12 }}>github.com/claudiucalomfirescu/prax-systems</div>
      </Appear>
    </AbsoluteFill>
  </Frame>
);

const COMPONENTS: Record<string, React.FC<{ dur: number }>> = {
  title: Title,
  problem: Problem,
  blueprint: Blueprint,
  layers: Layers,
  rebuild: Rebuild,
  checker: Checker,
  ecosystem: Ecosystem,
  outro: Outro,
};

export const PraxExplainer: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 20%, #1c2a4a 0%, ${C.bg} 62%)` }}>
      {SCENES.map((s) => {
        const d = S(s.d);
        const Comp = COMPONENTS[s.id];
        const el = (
          <Sequence key={s.id} from={from} durationInFrames={d} name={s.id}>
            <Comp dur={d} />
          </Sequence>
        );
        from += d;
        return el;
      })}
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition id="PraxExplainer" component={PraxExplainer} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
