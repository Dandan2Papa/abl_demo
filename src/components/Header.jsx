import { C } from "../constants.js";

export function Header({ onSettings }) {
  return (
    <div style={{
      background: C.white, borderBottom: `1px solid ${C.border}`,
      height: 52, display: "flex", alignItems: "center",
      padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 14, color: C.navy }}>우리금융그룹</span>
        <span style={{ width: 1, height: 14, background: C.border }} />
        <div style={{ display: "flex", gap: 4 }}>
          {[["ABL생명", C.abl], ["동양생명", C.dong]].map(([l, c]) => (
            <span key={l} style={{ background: c, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 2 }}>{l}</span>
          ))}
        </div>
        <span style={{ fontSize: 13, color: C.sub }}>AI 영업지원 플랫폼</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 11, color: C.muted }}>Powered by 42Maru</span>
        <button onClick={onSettings} style={{
          border: `1px solid ${C.border}`, background: "none",
          padding: "5px 12px", borderRadius: 5, cursor: "pointer",
          fontSize: 12, color: C.sub, fontFamily: "inherit",
        }}>⚙ LLM 설정</button>
      </div>
    </div>
  );
}
