import { useState } from "react";
import { C } from "../constants.js";
import { callLLM } from "../api.js";

export function SalesScriptDemo({ settings }) {
  const [form, setForm] = useState({ name: "홍길동", age: "43", gender: "남성", cp: "233,500", rp: "1,600,000", g1: "골절진단", g2: "심혈관진단", cr: "50% 미만" });
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true); setSections(null);
    try {
      const prompt = `고객 정보:\n- 이름: ${form.name} (${form.age}세, ${form.gender})\n- 현재 월 보험료: ${form.cp}원\n- 권장 월 보험료: ${form.rp}원\n- 보장 충족률: ${form.cr}\n- 주요 보장 부족 항목: ${form.g1}, ${form.g2}\n\n위 고객에게 적합한 ABL생명 영업 스크립트를 아래 섹션 형식에 맞춰 작성해주세요.\n\n[도입인사]\n[보장분석 결과 요약]\n[고객 접근 화법]\n[니즈환기]\n[추천상품]`;
      const reply = await callLLM({ messages: [{ role: "user", content: prompt }], system: "ABL생명 보험 영업 전문 AI. FC가 사용할 영업 스크립트를 작성합니다. 각 섹션은 [섹션명] 헤더로 시작하세요.", settings });
      const parsed = {};
      const rx = /\[([^\]]+)\]([\s\S]*?)(?=\[[^\]]+\]|$)/g;
      let m;
      while ((m = rx.exec(reply)) !== null) if (m[2].trim()) parsed[m[1].trim()] = m[2].trim();
      setSections(Object.keys(parsed).length > 0 ? parsed : { 스크립트: reply });
    } catch (e) { setSections({ 오류: e.message }); }
    setLoading(false);
  };

  const SM = { "도입인사": { icon: "👋", c: "#2563EB" }, "보장분석 결과 요약": { icon: "📊", c: C.amber }, "고객 접근 화법": { icon: "💬", c: "#7C3AED" }, "니즈환기": { icon: "⚡", c: C.green }, "추천상품": { icon: "🎯", c: C.abl } };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, height: "calc(100vh - 148px)" }}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 18, overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 14 }}>고객 정보 입력</div>
        {[{ key: "name", label: "고객명" }, { key: "age", label: "나이" }, { key: "gender", label: "성별" }, { key: "cp", label: "현재 월 보험료(원)" }, { key: "rp", label: "권장 월 보험료(원)" }, { key: "g1", label: "보장 부족 항목 1" }, { key: "g2", label: "보장 부족 항목 2" }, { key: "cr", label: "보장 충족률" }].map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: C.sub, display: "block", marginBottom: 3 }}>{label}</label>
            <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={{ width: "100%", padding: "7px 10px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
          </div>
        ))}
        <button onClick={generate} disabled={loading} style={{ width: "100%", marginTop: 8, padding: "11px", background: loading ? C.border : C.abl, color: loading ? C.muted : "white", border: "none", borderRadius: 6, cursor: loading ? "default" : "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>{loading ? "AI 생성 중…" : "📋 Sales Script 생성"}</button>
        <div style={{ marginTop: 14, padding: 12, background: C.ablSoft, border: `1px solid ${C.abl}30`, borderRadius: 6 }}>
          <div style={{ fontSize: 11, color: C.abl, fontWeight: 700, marginBottom: 6 }}>보장분석 요약</div>
          <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.7 }}>현재: {form.cp}원/월<br />권장: {form.rp}원/월<br />충족률: <span style={{ color: C.abl, fontWeight: 700 }}>{form.cr}</span></div>
        </div>
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, overflowY: "auto" }}>
        {!sections && !loading && <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: C.muted }}><span style={{ fontSize: 36 }}>📋</span><span style={{ fontSize: 13 }}>고객 정보 입력 후 스크립트를 생성하세요</span></div>}
        {loading && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: C.muted, fontSize: 13 }}>AI 스크립트 생성 중…</div>}
        {sections && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{form.name} 고객님 맞춤 영업 스크립트</span>
              <span style={{ fontSize: 10, background: C.abl, color: "white", padding: "2px 7px", borderRadius: 3, fontWeight: 700 }}>ABL생명</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted }}>{new Date().toLocaleDateString("ko-KR")} 생성</span>
            </div>
            {Object.entries(sections).map(([sec, content]) => {
              const meta = SM[sec] || { icon: "▪", c: C.navy };
              return (
                <div key={sec} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                    <span style={{ width: 3, height: 14, background: meta.c, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: meta.c }}>{meta.icon} {sec}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.75, padding: "12px 14px", background: "#F8FAFC", borderRadius: 6, border: `1px solid ${C.border}`, whiteSpace: "pre-wrap" }}>{content}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
