import { useState, useRef, useEffect } from "react";
import { C } from "../constants.js";
import { callLLM } from "../api.js";

export function PlatformDemo({ settings }) {
  const agents = [
    { icon: "🎯", title: "특약 추천 어시스턴트",  desc: "보장분석 기반 특약·상품 자동 추천",  tag: "추천",      brand: "ABL",  c: C.abl  },
    { icon: "💬", title: "보험 약관 챗봇",         desc: "약관 내용 즉시 질의응답",            tag: "지식베이스", brand: "ABL",  c: C.abl  },
    { icon: "📋", title: "영업 스크립트 생성",     desc: "고객 분석 기반 스크립트 자동 작성",  tag: "생성형 AI",  brand: "ABL",  c: C.abl  },
    { icon: "📊", title: "보장 분석 리포트",       desc: "고객 보장 현황 자동 분석",           tag: "분석",      brand: "동양", c: C.dong },
    { icon: "🔔", title: "영업 활동 알림",         desc: "FC 영업 일정 자동 최적화 및 알림",   tag: "자동화",    brand: "동양", c: C.dong },
    { icon: "🔍", title: "타겟 고객 추출",         desc: "데이터 기반 고가치 고객 자동 발굴",  tag: "분석",      brand: "동양", c: C.dong },
  ];

  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const run = async () => {
    if (!inp.trim() || !active || loading) return;
    const next = [...msgs, { role: "user", text: inp }];
    setMsgs(next); setInp(""); setLoading(true);
    try {
      const r = await callLLM({ messages: next.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })), system: `${active.title} AI 에이전트입니다. ABL생명/동양생명 FC(보험 설계사)의 업무를 지원합니다.`, settings });
      setMsgs([...next, { role: "assistant", text: r }]);
    } catch (e) { setMsgs([...next, { role: "assistant", text: `오류: ${e.message}` }]); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div><div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>AI Agent 플랫폼</div><div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Agent를 선택하여 즉시 업무에 활용하세요</div></div>
        <div style={{ marginLeft: "auto" }}><span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>● {agents.length}개 운영 중</span></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: active ? "1fr 340px" : "1fr", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10, alignContent: "start" }}>
          {agents.map((a, i) => {
            const on = active?.title === a.title;
            return (
              <div key={i} onClick={() => { setActive(a); setMsgs([]); }} style={{ background: C.white, border: `1px solid ${on ? a.c : C.border}`, borderRadius: 8, padding: "14px 15px", cursor: "pointer", boxShadow: on ? `0 0 0 2px ${a.c}25` : "none", transition: "border-color 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <span style={{ fontSize: 10, background: a.c, color: "white", padding: "1px 6px", borderRadius: 2, fontWeight: 700 }}>{a.brand}생명</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5, marginBottom: 10 }}>{a.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, background: C.bg, color: C.muted, padding: "2px 7px", borderRadius: 10 }}>{a.tag}</span>
                  <span style={{ fontSize: 11, color: a.c, fontWeight: 600 }}>실행 →</span>
                </div>
              </div>
            );
          })}
        </div>
        {active && (
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, display: "flex", flexDirection: "column", height: 480 }}>
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 18 }}>{active.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{active.title}</span>
              <span style={{ fontSize: 10, background: active.c, color: "white", padding: "1px 6px", borderRadius: 2, fontWeight: 700 }}>{active.brand}생명</span>
              <button onClick={() => setActive(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18, lineHeight: 1, fontFamily: "inherit" }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {msgs.length === 0 && <div style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 40, lineHeight: 1.8 }}>{active.title} Agent가 준비되었습니다.<br />질문을 입력하세요.</div>}
              {msgs.map((m, i) => <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}><div style={{ maxWidth: "85%", padding: "8px 11px", borderRadius: 8, background: m.role === "user" ? C.navy : "#EEF2F7", color: m.role === "user" ? "white" : C.text, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.text}</div></div>)}
              {loading && <div style={{ fontSize: 12, color: C.muted }}>처리 중…</div>}
              <div ref={endRef} />
            </div>
            <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 7 }}>
              <input value={inp} onChange={(e) => setInp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="Agent에게 질문하세요..." style={{ flex: 1, padding: "7px 10px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 12, fontFamily: "inherit", outline: "none" }} />
              <button onClick={run} disabled={loading} style={{ padding: "7px 13px", background: active.c, color: "white", border: "none", borderRadius: 5, cursor: loading ? "default" : "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>실행</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
