import { C } from "../constants.js";

export function TabNav({ active, setActive }) {
  const tabs = [
    { id: "rider",    label: "특약 추천 어시스턴트", badge: "과제 2", icon: "🎯" },
    { id: "chatbot",  label: "보험 약관 AI 챗봇",    badge: "과제 4", icon: "💬" },
    { id: "script",   label: "영업 스크립트 생성",   badge: "과제 5", icon: "📋" },
    { id: "platform", label: "AI Agent 플랫폼",      badge: "과제 6", icon: "🤖" },
  ];
  return (
    <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex" }}>
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            border: "none",
            borderBottom: on ? `2px solid ${C.navy}` : "2px solid transparent",
            background: "none", padding: "13px 18px",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: on ? 600 : 400,
            color: on ? C.navy : C.sub, whiteSpace: "nowrap", fontFamily: "inherit",
          }}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
              background: on ? C.navy : C.bg, color: on ? "white" : C.muted,
            }}>{t.badge}</span>
          </button>
        );
      })}
    </div>
  );
}
