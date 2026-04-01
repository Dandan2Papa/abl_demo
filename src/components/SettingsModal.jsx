import { useState } from "react";
import { C } from "../constants.js";

export function SettingsModal({ settings, setSettings, onClose }) {
  const [local, setLocal] = useState({ ...settings });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: C.white, borderRadius: 8, padding: 24, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 18 }}>LLM 모델 설정</div>

        {/* Demo mode toggle */}
        <div style={{ marginBottom: 16, padding: "12px 14px", background: local.demoMode ? "#F0FDF4" : C.bg, border: `1px solid ${local.demoMode ? C.green : C.border}`, borderRadius: 7 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: local.demoMode ? C.green : C.text }}>
                {local.demoMode ? "● 데모 모드 활성" : "○ 데모 모드 비활성"}
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                {local.demoMode ? "로컬 AI 응답 사용 중 — 외부 API 불필요" : "실제 LLM API로 연결합니다"}
              </div>
            </div>
            <button
              onClick={() => setLocal({ ...local, demoMode: !local.demoMode })}
              style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                background: local.demoMode ? C.green : C.border,
                position: "relative", transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 2, left: local.demoMode ? 22 : 2,
                width: 20, height: 20, borderRadius: "50%", background: "white",
                transition: "left 0.2s", display: "block",
              }} />
            </button>
          </div>
        </div>

        {/* API settings — shown only when not in demo mode */}
        {!local.demoMode && (
          <>
            {[
              { key: "apiUrl", label: "API Endpoint URL", ph: "https://api.anthropic.com/v1/messages" },
              { key: "apiKey", label: "API Key",          ph: "빈칸 = 기본 인증 사용", type: "password" },
              { key: "model",  label: "Model ID",         ph: "claude-sonnet-4-20250514" },
            ].map(({ key, label, ph, type }) => (
              <div key={key} style={{ marginBottom: 13 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.sub, display: "block", marginBottom: 5 }}>{label}</label>
                <input
                  type={type || "text"} value={local[key] || ""}
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
          </>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 18px", background: "none", border: `1px solid ${C.border}`, borderRadius: 5, cursor: "pointer", fontSize: 13, color: C.sub, fontFamily: "inherit" }}>취소</button>
          <button onClick={() => { setSettings(local); onClose(); }} style={{ padding: "9px 18px", background: C.navy, color: "white", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>저장</button>
        </div>
      </div>
    </div>
  );
}
