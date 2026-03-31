import { useState } from "react";
import { C, DISEASE_LIST, RIDER_DB } from "../constants.js";
import { callLLM } from "../api.js";

function Chip({ s }) {
  const map = { 부족: { bg: C.redBg, c: C.red }, 미가입: { bg: C.redBg, c: C.red }, 미흡: { bg: C.amberBg, c: C.amber }, 충분: { bg: C.greenBg, c: C.green } };
  const t = map[s] || { bg: C.bg, c: C.muted };
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: t.bg, color: t.c }}>{s}</span>;
}

export function RiderDemo({ settings }) {
  const [sel, setSel] = useState("cancer");
  const [tab, setTab] = useState("rec");
  const [aiLoading, setAiLoading] = useState(false);
  const [tip, setTip] = useState("");

  const dis = DISEASE_LIST.find((d) => d.id === sel);
  const riders = RIDER_DB[sel] || { rec: [], comp: [] };

  const getAi = async () => {
    setAiLoading(true); setTip("");
    try {
      const r = await callLLM({
        messages: [{ role: "user", content: `고객: 홍길동(43세, 남)\n보장 부족 항목: ${dis.label}\n추천 특약: ${riders.rec.map((r) => r.name).join(", ")}\n\nFC가 고객에게 ${dis.label} 보장 부족을 설명할 핵심 멘트를 2~3문장으로 작성해주세요.` }],
        system: "ABL생명 보험 영업 전문가. FC가 고객에게 보장 부족을 설명하는 짧고 설득력 있는 멘트를 작성합니다.",
        settings,
      });
      setTip(r);
    } catch (e) { setTip(`오류: ${e.message}`); }
    setAiLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, height: "calc(100vh - 148px)" }}>
      {/* Left panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.navy},#2952A3)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16, fontWeight: 700 }}>홍</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>홍길동 고객</div>
              <div style={{ fontSize: 11, color: C.muted }}>43세 · 남성 · 종합 보장분석</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[{ label: "가입 계약", v: "6건", c: C.navy }, { label: "미흡 항목", v: "2건", c: C.amber }, { label: "미가입", v: "3건", c: C.red }].map((s) => (
              <div key={s.label} style={{ background: C.bg, borderRadius: 6, padding: "8px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.ablSoft, borderRadius: 6, padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 10, color: C.muted }}>현재 월 보험료</div><div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>233,500원</div></div>
            <div style={{ color: C.border, fontSize: 16 }}>→</div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: C.muted }}>권장 보험료</div><div style={{ fontWeight: 700, fontSize: 13, color: C.abl }}>1,600,000원</div></div>
          </div>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>보장분석 상세</div>
          {DISEASE_LIST.map((d) => {
            const on = sel === d.id;
            return (
              <div key={d.id} onClick={() => { setSel(d.id); setTip(""); }} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 7, background: on ? C.navy : "transparent", cursor: "pointer", marginBottom: 2, transition: "background 0.15s" }}>
                <span style={{ fontSize: 14 }}>{d.icon}</span>
                <span style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: on ? "white" : C.text, flex: 1 }}>{d.label}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, background: on ? "rgba(255,255,255,0.2)" : (d.status === "부족" || d.status === "미가입" ? C.redBg : d.status === "미흡" ? C.amberBg : C.greenBg), color: on ? "white" : (d.status === "부족" || d.status === "미가입" ? C.red : d.status === "미흡" ? C.amber : C.green) }}>{d.status}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Right panel */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{dis?.icon}</span>
          <div><span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{dis?.label} 관련 특약</span><span style={{ marginLeft: 8 }}><Chip s={dis?.status} /></span></div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 11, color: C.muted, padding: "4px 10px", background: C.bg, borderRadius: 5 }}>급부그룹 매핑 → 특약코드 조회 → 전송</div>
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 18px" }}>
          {[["rec", "특약 추천"], ["comp", "타사 가입특약"]].map(([id, label]) => {
            const on = tab === id;
            return <button key={id} onClick={() => setTab(id)} style={{ border: "none", borderBottom: on ? `2px solid ${C.abl}` : "2px solid transparent", background: "none", padding: "10px 16px", cursor: "pointer", fontSize: 13, fontWeight: on ? 700 : 400, color: on ? C.abl : C.sub, fontFamily: "inherit" }}>{label}</button>;
          })}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 0 16px 0" }}>
          {tab === "rec" && (
            <>
              {riders.rec.length === 0
                ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, color: C.muted, fontSize: 13 }}>이 항목은 현재 충분히 보장되어 있습니다</div>
                : <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ background: C.bg }}>{["순번", "특약명", "상품명", "보험사", "월 보험료(예시)"].map((h) => <th key={h} style={{ padding: "9px 14px", fontSize: 11, fontWeight: 700, color: C.muted, textAlign: "left", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
                    <tbody>{riders.rec.map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : "#FAFBFC" }}>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: C.muted, width: 40 }}>{r.no}</td>
                        <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500, color: C.text }}>{r.name}</td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: C.sub }}>{r.prod}</td>
                        <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: C.ablSoft, color: C.abl }}>{r.ins}</span></td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: C.text, fontWeight: 600 }}>{r.mon}원</td>
                      </tr>
                    ))}</tbody>
                  </table>
              }
              {riders.rec.length > 0 && (
                <div style={{ padding: "14px 18px" }}>
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ background: C.bg, padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>💡 AI 고객 접근 멘트</span>
                      <button onClick={getAi} disabled={aiLoading} style={{ background: aiLoading ? C.border : C.navy, color: aiLoading ? C.muted : "white", border: "none", borderRadius: 4, padding: "4px 12px", fontSize: 11, fontWeight: 600, cursor: aiLoading ? "default" : "pointer", fontFamily: "inherit" }}>{aiLoading ? "생성 중…" : "AI 생성"}</button>
                    </div>
                    <div style={{ padding: "12px 14px", minHeight: 60, fontSize: 13, color: C.text, lineHeight: 1.7 }}>
                      {tip ? tip : <span style={{ color: C.muted }}>AI 생성 버튼을 누르면 이 고객에게 맞는 접근 멘트를 생성합니다</span>}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {tab === "comp" && (
            riders.comp.length === 0
              ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, color: C.muted, fontSize: 13 }}>타사 가입 특약 정보가 없습니다</div>
              : <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr style={{ background: C.bg }}>{["순번", "특약명", "가입 보험사", "가입 여부"].map((h) => <th key={h} style={{ padding: "9px 14px", fontSize: 11, fontWeight: 700, color: C.muted, textAlign: "left", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
                  <tbody>{riders.comp.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: C.muted }}>{r.no}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: C.text }}>{r.name}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: C.sub }}>{r.ins}</td>
                      <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: r.ok ? C.greenBg : C.bg, color: r.ok ? C.green : C.muted }}>{r.ok ? "가입" : "미가입"}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
          )}
        </div>
        <div style={{ padding: "9px 18px", borderTop: `1px solid ${C.border}`, background: C.bg, fontSize: 11, color: C.muted }}>
          요청 보장급부에 해당되는 ABL생명 판매 중인 보험상품의 특약코드·상품코드·상품명을 전송합니다 ※ 내용은 변경될 수 있음
        </div>
      </div>
    </div>
  );
}
