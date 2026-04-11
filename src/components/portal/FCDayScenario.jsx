import { useState, useEffect, useRef } from "react";
import { C } from "../../constants.js";
import { DEMO_SCENES, DEMO_CONFIG } from "../../demo/sampleData.js";

// ─── 마크다운 테이블/볼드 간단 렌더러 ───────────────────────
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 테이블 감지
    if (line.startsWith("|") && lines[i + 1]?.includes("---")) {
      const headers = line.split("|").filter(Boolean).map(h => h.trim());
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i].split("|").filter(Boolean).map(c => c.trim()));
        i++;
      }
      elements.push(
        <div key={i} style={{ overflowX: "auto", margin: "10px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>{headers.map((h, j) => (
                <th key={j} style={{ background: "#1A2E4A", color: "white", padding: "6px 10px", textAlign: "left", fontWeight: 700 }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#F8FAFC" : "white" }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: "6px 10px", borderBottom: "1px solid #E2E8F0", fontSize: 12 }}>
                      {cell.replace(/\*\*(.*?)\*\*/g, "$1")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 구분선
    if (line.startsWith("---")) {
      elements.push(<hr key={i} style={{ border: "none", borderTop: "1px solid #E2E8F0", margin: "10px 0" }} />);
      i++;
      continue;
    }

    // 빈줄
    if (!line.trim()) {
      elements.push(<div key={i} style={{ height: 6 }} />);
      i++;
      continue;
    }

    // 볼드 + 기타 인라인 처리
    const inlineRender = (txt) => {
      const parts = txt.split(/(\*\*.*?\*\*)/g);
      return parts.map((p, pi) =>
        p.startsWith("**") ? <strong key={pi}>{p.slice(2, -2)}</strong> : p
      );
    };

    const isH2 = line.startsWith("## ");
    const isH3 = line.startsWith("**[");
    const isBullet = line.startsWith("- ") || line.startsWith("* ");
    const isNote = line.startsWith("📄");
    const clean = line.replace(/^#{1,3}\s/, "").replace(/^[-*]\s/, "");

    if (isH2 || isH3) {
      elements.push(
        <div key={i} style={{ fontWeight: 700, fontSize: isH2 ? 14 : 13, color: "#1A2E4A", margin: "12px 0 6px" }}>
          {inlineRender(clean)}
        </div>
      );
    } else if (isBullet) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 6, margin: "2px 0", paddingLeft: 8, fontSize: 13, color: "#334155" }}>
          <span style={{ color: "#94A3B8", flexShrink: 0 }}>•</span>
          <span>{inlineRender(clean)}</span>
        </div>
      );
    } else if (isNote) {
      elements.push(
        <div key={i} style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 6, padding: "8px 12px", margin: "10px 0", fontSize: 12, color: "#0369A1" }}>
          {inlineRender(line)}
        </div>
      );
    } else {
      elements.push(
        <div key={i} style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, margin: "2px 0" }}>
          {inlineRender(line)}
        </div>
      );
    }
    i++;
  }
  return elements;
}

// ─── 타이핑 애니메이션 훅 ─────────────────────────────────────
function useTypingEffect(text, isActive, onDone) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isActive) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let idx = 0;
    const { typingSpeed, chunkSize } = DEMO_CONFIG;
    const timer = setInterval(() => {
      idx += chunkSize;
      setDisplayed(text.slice(0, idx));
      if (idx >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(timer);
        onDone?.();
      }
    }, typingSpeed);
    return () => clearInterval(timer);
  }, [isActive, text]);

  return { displayed, done };
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────
export default function FCDayScenario({ onBack }) {
  const [activeScene, setActiveScene] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | thinking | typing | done
  const [showSource, setShowSource] = useState(false);
  const chatEndRef = useRef(null);

  const scene = DEMO_SCENES[activeScene];

  // 장면 바뀌면 리셋
  useEffect(() => {
    setPhase("idle");
    setShowSource(false);
  }, [activeScene]);

  // 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [phase, showSource]);

  const startDemo = () => {
    setPhase("thinking");
    setTimeout(() => setPhase("typing"), DEMO_CONFIG.thinkingMs);
  };

  const handleTypingDone = () => {
    setPhase("done");
    setTimeout(() => setShowSource(true), 400);
  };

  const { displayed, done } = useTypingEffect(
    scene.demo.response,
    phase === "typing",
    handleTypingDone
  );

  // ─── 색상 ─────────────────────────────────────────────────
  const accentColor = scene.demo.agentBrand === "ABL" ? C.abl : C.dong;

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", fontFamily: "'Pretendard','Apple SD Gothic Neo',sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── 헤더 ─────────────────────────────────────────── */}
      <div style={{ background: "#1E293B", borderBottom: "1px solid #334155", padding: "14px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #475569", color: "#94A3B8", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
          ← 포털
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9" }}>FC의 하루, AI로 바뀐다</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>현장에서 실제로 벌어지는 3가지 장면 · 42Maru AI 솔루션</div>
        </div>
        <div style={{ fontSize: 11, background: "#0EA5E9", color: "white", padding: "4px 10px", borderRadius: 10, fontWeight: 700 }}>
          DEMO MODE
        </div>
      </div>

      {/* ── 장면 탭 ──────────────────────────────────────── */}
      <div style={{ background: "#1E293B", padding: "0 28px", display: "flex", gap: 0, borderBottom: "1px solid #334155" }}>
        {DEMO_SCENES.map((s, idx) => {
          const isOn = idx === activeScene;
          return (
            <button
              key={s.id}
              onClick={() => setActiveScene(idx)}
              style={{
                background: "none", border: "none",
                borderBottom: isOn ? `2px solid ${idx === 0 ? "#F59E0B" : idx === 1 ? "#EF4444" : "#10B981"}` : "2px solid transparent",
                color: isOn ? "#F1F5F9" : "#64748B",
                padding: "12px 20px", cursor: "pointer", fontSize: 13,
                fontWeight: isOn ? 700 : 400, fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 11, color: "#64748B" }}>장면 {idx + 1}</div>
                <div>{s.time}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 메인 2분할 ───────────────────────────────────── */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, overflow: "hidden" }}>

        {/* LEFT: Before (고통) */}
        <div style={{ borderRight: "1px solid #1E293B", padding: "28px", overflow: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, background: "#7F1D1D", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              {scene.painPoint.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Before AI</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>{scene.painPoint.title}</div>
            </div>
          </div>

          {/* 스토리 카드 */}
          <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: 20, marginBottom: 16 }}>
            {scene.painPoint.story.map((line, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < scene.painPoint.story.length - 1 ? 14 : 0 }}>
                <div style={{ width: 20, height: 20, background: "#374151", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 6, height: 6, background: "#6B7280", borderRadius: "50%" }} />
                </div>
                <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.65 }}>{line}</div>
              </div>
            ))}
          </div>

          {/* 비용 배지 */}
          <div style={{ background: "#450A0A", border: "1px solid #7F1D1D", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>⏱️</span>
            <div>
              <div style={{ fontSize: 11, color: "#FCA5A5", fontWeight: 600 }}>업무 비용</div>
              <div style={{ fontSize: 13, color: "#FEE2E2", fontWeight: 700 }}>{scene.painPoint.cost}</div>
            </div>
          </div>

          {/* 구분 화살표 */}
          <div style={{ margin: "24px 0", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>이 문제를 해결하려면?</div>
            <div style={{ fontSize: 28, color: "#334155" }}>↓</div>
          </div>

          {/* After 힌트 */}
          <div style={{ background: "linear-gradient(135deg, #0C1A2E, #162032)", border: "1px solid #1D4ED8", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontSize: 11, color: "#93C5FD", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>42Maru AI 적용 시</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#DBEAFE" }}>{scene.demo.agentName}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {scene.demo.tags.map(t => (
                <span key={t} style={{ fontSize: 10, background: "#1D4ED8", color: "#BFDBFE", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>{t}</span>
              ))}
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#1E3A5F", borderRadius: 8 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <div>
                <div style={{ fontSize: 11, color: "#93C5FD" }}>예상 효과</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#22D3EE" }}>{scene.demo.timeSaved}</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: After (AI 데모) */}
        <div style={{ background: "#111827", padding: "28px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* 에이전트 헤더 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>{scene.demo.agentName}</div>
            <div style={{ marginLeft: "auto", fontSize: 10, background: accentColor, color: "white", padding: "2px 8px", borderRadius: 3, fontWeight: 700 }}>{scene.demo.agentBrand}생명</div>
          </div>

          {/* 채팅 영역 */}
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 4 }}>

            {/* 사용자 메시지 */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ maxWidth: "80%", background: "#1D4ED8", color: "white", borderRadius: "10px 10px 2px 10px", padding: "10px 14px", fontSize: 13, lineHeight: 1.6 }}>
                {scene.demo.userMessage}
              </div>
            </div>

            {/* AI 응답 */}
            {phase !== "idle" && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 30, height: 30, background: accentColor, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                  🤖
                </div>
                <div style={{ flex: 1 }}>
                  {phase === "thinking" && (
                    <div style={{ background: "#1E293B", borderRadius: "2px 10px 10px 10px", padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        {[0, 0.2, 0.4].map((d, i) => (
                          <div key={i} style={{
                            width: 6, height: 6, borderRadius: "50%", background: "#475569",
                            animation: "pulse 1s ease-in-out infinite",
                            animationDelay: `${d}s`,
                          }} />
                        ))}
                        <span style={{ fontSize: 11, color: "#64748B", marginLeft: 6 }}>분석 중…</span>
                      </div>
                    </div>
                  )}
                  {(phase === "typing" || phase === "done") && (
                    <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "2px 10px 10px 10px", padding: "14px 16px" }}>
                      {renderMarkdown(displayed)}
                      {!done && <span style={{ display: "inline-block", width: 2, height: 14, background: "#60A5FA", marginLeft: 2, animation: "blink 0.7s step-end infinite" }} />}
                    </div>
                  )}

                  {/* 출처 카드 */}
                  {showSource && (
                    <div style={{
                      marginTop: 8, background: "#0C1A2E", border: "1px solid #1E3A5F", borderRadius: 8,
                      padding: "10px 14px", display: "flex", gap: 12, alignItems: "flex-start",
                      animation: "fadeIn 0.4s ease",
                    }}>
                      <div style={{ fontSize: 20, flexShrink: 0 }}>📄</div>
                      <div>
                        <div style={{ fontSize: 11, color: "#60A5FA", fontWeight: 700, marginBottom: 4 }}>
                          출처: {scene.demo.sourceDoc} · {scene.demo.sourcePage}
                        </div>
                        <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>
                          <span style={{ background: "#FEF08A", color: "#713F12", padding: "1px 4px", borderRadius: 3, fontWeight: 600 }}>
                            "{scene.demo.sourceHighlight}"
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* 입력창 & 버튼 */}
          <div style={{ marginTop: 16, borderTop: "1px solid #1E293B", paddingTop: 16 }}>
            {phase === "idle" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 12 }}>
                  아래 버튼으로 AI가 실시간으로 답변하는 과정을 확인하세요
                </div>
                <button
                  onClick={startDemo}
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, #1D4ED8)`,
                    color: "white", border: "none", borderRadius: 8,
                    padding: "12px 28px", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: `0 4px 20px ${accentColor}50`,
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  ▶ 데모 실행하기
                </button>
              </div>
            )}

            {phase === "done" && (
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {activeScene < DEMO_SCENES.length - 1 ? (
                  <button
                    onClick={() => setActiveScene(activeScene + 1)}
                    style={{
                      background: "#1E3A5F", color: "#60A5FA", border: "1px solid #1D4ED8",
                      borderRadius: 7, padding: "10px 22px", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    다음 장면 → {DEMO_SCENES[activeScene + 1].emoji}
                  </button>
                ) : (
                  <button
                    onClick={onBack}
                    style={{
                      background: "#1A3A6B", color: "white", border: "none",
                      borderRadius: 7, padding: "10px 22px", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    🏠 플랫폼 전체 보기
                  </button>
                )}
                <button
                  onClick={() => { setPhase("idle"); setShowSource(false); }}
                  style={{
                    background: "none", color: "#64748B", border: "1px solid #334155",
                    borderRadius: 7, padding: "10px 18px", fontSize: 12,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  ↺ 다시 보기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 하단 요약 배너 ─────────────────────────────────── */}
      <div style={{ background: "#1E293B", borderTop: "1px solid #334155", padding: "14px 28px", display: "flex", gap: 32, justifyContent: "center" }}>
        {[
          { icon: "🌙", label: "경쟁사 비교", before: "2.5시간", after: "8초" },
          { icon: "☕", label: "현장 약관 질의", before: "다음날 연락", after: "즉답" },
          { icon: "📞", label: "해지방어 대응", before: "전화 끊김", after: "3분 내 해결" },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{item.icon} {item.label}</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>
              <span style={{ color: "#EF4444", textDecoration: "line-through" }}>{item.before}</span>
              {" → "}
              <span style={{ color: "#22D3EE", fontWeight: 700 }}>{item.after}</span>
            </div>
          </div>
        ))}
        <div style={{ borderLeft: "1px solid #334155", paddingLeft: 32, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>AI Powered by</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>42Maru</div>
        </div>
      </div>

      {/* 애니메이션 CSS */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
