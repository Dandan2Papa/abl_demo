import { useState, useRef, useEffect } from "react";
import { C, YAKGWAN } from "../constants.js";
import { callLLM } from "../api.js";

export function ChatbotDemo({ settings }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", text: "ABL생명 보험상품 약관 AI입니다.\n약관 내용, 보장 조건, 산출 방법 등 궁금한 사항을 질문해 주세요." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const SAMPLES = ["일반암 진단특약D 보장 한도는?", "보험료 납입면제 조건을 알려줘", "갱신형과 비갱신형 차이는?", "암 보장 개시일은 언제부터야?", "해약 시 환급금 계산 방법은?"];
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (text) => {
    const q = text ?? input;
    if (!q.trim() || loading) return;
    const next = [...msgs, { role: "user", text: q }];
    setMsgs(next); setInput(""); setLoading(true);
    try {
      const r = await callLLM({
        messages: next.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
        system: `ABL생명 보험상품 전문 AI입니다. 아래 약관 정보를 기반으로 정확하고 간결하게 답변하세요. 약관에 없는 내용은 "약관에 명시되지 않았습니다"라고 답하세요.\n\n${YAKGWAN}`,
        settings,
      });
      setMsgs([...next, { role: "assistant", text: r }]);
    } catch (e) { setMsgs([...next, { role: "assistant", text: `⚠ 오류: ${e.message}` }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 252px", gap: 16, height: "calc(100vh - 148px)" }}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "11px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>보험상품 지식 AI Agent</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted }}>약관 1종 로드됨</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
              {m.role === "assistant" && <div style={{ width: 28, height: 28, background: C.abl, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🤖</div>}
              <div style={{ maxWidth: "78%", padding: "9px 13px", borderRadius: m.role === "user" ? "10px 10px 2px 10px" : "2px 10px 10px 10px", background: m.role === "user" ? C.navy : "#EEF2F7", color: m.role === "user" ? "white" : C.text, fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
          ))}
          {loading && <div style={{ display: "flex", gap: 8 }}><div style={{ width: 28, height: 28, background: C.abl, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤖</div><div style={{ padding: "9px 13px", background: "#EEF2F7", borderRadius: "2px 10px 10px 10px", fontSize: 13, color: C.muted }}>답변 생성 중…</div></div>}
          <div ref={endRef} />
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()} placeholder="약관 내용, 보장 조건에 대해 질문하세요..." style={{ flex: 1, padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: "9px 16px", background: !loading && input.trim() ? C.navy : C.border, color: !loading && input.trim() ? "white" : C.muted, border: "none", borderRadius: 6, cursor: !loading && input.trim() ? "pointer" : "default", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>전송</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>예시 질문</div>
          {SAMPLES.map((q, i) => <button key={i} onClick={() => send(q)} style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 9px", margin: "3px 0", background: "#F8FAFC", border: `1px solid ${C.border}`, borderRadius: 5, cursor: "pointer", fontSize: 12, color: C.text, lineHeight: 1.4, fontFamily: "inherit" }}>{q}</button>)}
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>로드된 약관</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 20 }}>📄</span>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>THE 더보장종합건강보험</div><div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>ABL생명 · 2024.01</div></div>
            <span style={{ marginLeft: "auto", fontSize: 10, background: C.greenBg, color: C.green, padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>활성</span>
          </div>
          <button style={{ marginTop: 10, width: "100%", padding: "7px", border: `1px dashed ${C.border}`, borderRadius: 5, background: "none", cursor: "pointer", fontSize: 11, color: C.muted, fontFamily: "inherit" }}>+ 약관 추가</button>
        </div>
      </div>
    </div>
  );
}
