import { useState } from "react";
import { C } from "../constants.js";

export function SettingsModal({ settings, setSettings, onClose }) {
  const [local, setLocal] = useState({ ...settings });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: C.white, borderRadius: 8, padding: 24, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 18 }}>LLM 모델 설정</div>
        {[
          { key: "apiUrl", label: "API Endpoint URL", ph: "https://api.anthropic.com/v1/messages" },
          { key: "apiKey", label: "API Key",          ph: "빈칸 = 기본 인증 사용", type: "password" },
          { key: "model",  label: "Model ID",         ph: "claude-sonnet-4-20250514" },
        ].map(({ key, label, ph, type }) => (
          <div key={key} style={{ marginBottom: 13 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.sub, display: "block", marginBottom: 5 }}>{label}</label>
            <input
              type={type || "text"} value={local[key]}
              onChange={(e) => setLocal({ ...local, [key]: e.target.value })}
              placeholder={ph}
              style={{ width: "100%", padding: "9px 11px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 12, fontFamily: "monospace", boxSizing: "border-box", outline: "none" }}
            />
          </div>
        ))}
        <div style={{ padding: "10px 12px", background: "#F0F4F8", borderRadius: 6, fontSize: 11, color: C.sub, lineHeight: 1.7, marginBottom: 16 }}>
          <strong>기본값:</strong> Anthropic API (claude-sonnet-4-20250514)<br />
          42Maru 자체 엔드포인트 또는 OpenAI 호환 URL로 교체 가능합니다.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 18px", background: "none", border: `1px solid ${C.border}`, borderRadius: 5, cursor: "pointer", fontSize: 13, color: C.sub, fontFamily: "inherit" }}>취소</button>
          <button onClick={() => { setSettings(local); onClose(); }} style={{ padding: "9px 18px", background: C.navy, color: "white", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>저장</button>
        </div>
      </div>
    </div>
  );
}
