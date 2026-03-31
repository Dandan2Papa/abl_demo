import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════ */
const C = {
  abl:       "#C8001C",
  ablSoft:   "#FFF0F2",
  dong:      "#E35200",
  dongSoft:  "#FFF4EE",
  navy:      "#1A2E4A",
  bg:        "#F3F5F8",
  white:     "#FFFFFF",
  border:    "#DEE2E8",
  text:      "#1A2E4A",
  sub:       "#546178",
  muted:     "#8A98AB",
  green:     "#16A34A",
  greenBg:   "#DCFCE7",
  red:       "#DC2626",
  redBg:     "#FEE2E2",
  amber:     "#D97706",
  amberBg:   "#FEF3C7",
};

/* ═══════════════════════════════════════════
   YAKGWAN DATA
═══════════════════════════════════════════ */
const YAKGWAN = `[ABL생명 THE 더보장종합건강보험 약관 요약 v2024.01]

【암 관련 주요 특약】
1. 일반암 진단특약D
   · 보장: 일반암 최초 진단 확정 시 진단금 지급 (최대 5,000만원, 1회 한정)
   · 개시: 계약일로부터 90일 경과 후

2. 일반암요치료비보장특약D
   · 보장: 암 직접 치료 목적 입원/통원 시 1회당 최대 100만원

3. 암직접치료상급종합병원통원보장특약
   · 보장: 상급종합병원 암 직접 치료 통원 1회당 30만원, 연간 최대 30회

4. 암진단특약 (THE드림종신보험II 내 특약)

5. 암직접치료입원보장특약
   · 보장: 암 직접 치료 입원 1일당 5만원

【보험료 납입】 전기납/10년납/20년납, 암·뇌혈관질환 진단 시 납입면제

【해약환급금】 납입기간 중 해지: 납입보험료 × 해약환급률 (기간 차등)

【갱신형 vs 비갱신형】 비갱신형: 보험료 고정 / 갱신형: 3~5년마다 갱신 시 인상

【면책사항】 전쟁·내란·테러, 피보험자 고의 자해`;

/* ═══════════════════════════════════════════
   RIDER DATA — 과제 1
═══════════════════════════════════════════ */
const DISEASE_LIST = [
  { id: "cancer",  label: "암진단",      color: C.red,   icon: "🔴", status: "부족" },
  { id: "brain",   label: "뇌혈관진단",  color: C.amber, icon: "🟡", status: "부족" },
  { id: "heart",   label: "심장혈관진단",color: C.amber, icon: "🟡", status: "미흡" },
  { id: "liver",   label: "실화손단",    color: C.green, icon: "🟢", status: "충분" },
  { id: "bone",    label: "골절진단",    color: C.red,   icon: "🔴", status: "미가입" },
  { id: "surgery", label: "수술비",      color: C.green, icon: "🟢", status: "충분" },
  { id: "death",   label: "사망",        color: C.green, icon: "🟢", status: "충분" },
];

const RIDER_DB = {
  cancer: {
    recommend: [
      { no:1, name:"일반암 진단특약D",                    product:"THE 더보장종합건강보험", insurer:"ABL생명", monthly:"32,000" },
      { no:2, name:"일반암요치료비보장특약D",              product:"THE 더보장종합건강보험", insurer:"ABL생명", monthly:"18,500" },
      { no:3, name:"암직접치료상급종합병원통원보장특약",   product:"THE 더보장종합건강보험", insurer:"ABL생명", monthly:"8,200"  },
      { no:4, name:"암진단특약",                          product:"THE드림종신보험II",       insurer:"ABL생명", monthly:"24,100" },
      { no:5, name:"암직접치료입원보장특약",              product:"THE 더보장종합건강보험", insurer:"ABL생명", monthly:"11,300" },
    ],
    competitor: [
      { no:1, name:"암치료비 특약",         insurer:"삼성생명", enrolled: true  },
      { no:2, name:"암진단급여금 특약",     insurer:"한화생명", enrolled: false },
      { no:3, name:"항암약물치료 특약",     insurer:"교보생명", enrolled: false },
    ],
  },
  brain: {
    recommend: [
      { no:1, name:"뇌졸중진단특약",          product:"THE 더보장종합건강보험", insurer:"ABL생명", monthly:"21,500" },
      { no:2, name:"뇌혈관질환입원특약",      product:"THE드림종신보험II",       insurer:"ABL생명", monthly:"14,200" },
      { no:3, name:"뇌출혈진단특약D",         product:"THE 더보장종합건강보험", insurer:"ABL생명", monthly:"9,800"  },
    ],
    competitor: [
      { no:1, name:"뇌혈관 진단비 특약",   insurer:"동양생명",  enrolled: true  },
      { no:2, name:"뇌졸중 치료비 특약",   insurer:"삼성화재", enrolled: false  },
    ],
  },
  heart: {
    recommend: [
      { no:1, name:"급성심근경색진단특약",     product:"THE 더보장종합건강보험", insurer:"ABL생명", monthly:"18,900" },
      { no:2, name:"허혈성심장질환진단특약",   product:"THE드림종신보험II",       insurer:"ABL생명", monthly:"13,400" },
    ],
    competitor: [
      { no:1, name:"심장질환 수술비 특약",   insurer:"교보생명", enrolled: false },
    ],
  },
  bone: {
    recommend: [
      { no:1, name:"골절진단특약",     product:"THE 더보장종합건강보험", insurer:"ABL생명", monthly:"5,600"  },
      { no:2, name:"깁스치료비특약",   product:"THE드림종신보험II",       insurer:"ABL생명", monthly:"3,200"  },
    ],
    competitor: [],
  },
  liver: { recommend: [], competitor: [] },
  surgery: { recommend: [], competitor: [] },
  death: { recommend: [], competitor: [] },
};

/* ═══════════════════════════════════════════
   LLM HELPER
═══════════════════════════════════════════ */
async function callLLM({ messages, system, settings }) {
  const headers = { "Content-Type": "application/json", "anthropic-version": "2023-06-01" };
  if (settings.apiKey) headers["x-api-key"] = settings.apiKey;
  const res = await fetch(settings.apiUrl, {
    method: "POST", headers,
    body: JSON.stringify({
      model: settings.model || "claude-sonnet-4-20250514",
      max_tokens: 1000, system, messages,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.content.find(b => b.type === "text")?.text || "";
}

/* ═══════════════════════════════════════════
   HEADER
═══════════════════════════════════════════ */
function Header({ onSettings }) {
  return (
    <div style={{
      background: C.white, borderBottom: `1px solid ${C.border}`,
      height: 52, display: "flex", alignItems: "center",
      padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 14, color: C.navy, letterSpacing: -0.3 }}>
          우리금융그룹
        </span>
        <span style={{ width: 1, height: 14, background: C.border }} />
        <div style={{ display: "flex", gap: 4 }}>
          {[["ABL생명", C.abl], ["동양생명", C.dong]].map(([l, c]) => (
            <span key={l} style={{
              background: c, color: "#fff", fontSize: 10, fontWeight: 700,
              padding: "2px 8px", borderRadius: 2, letterSpacing: 0.3,
            }}>{l}</span>
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
          display: "flex", alignItems: "center", gap: 5,
        }}>⚙ LLM 설정</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TAB NAV
═══════════════════════════════════════════ */
function TabNav({ active, setActive }) {
  const tabs = [
    { id: "rider",    label: "특약 추천 어시스턴트",  badge: "과제 2", icon: "🎯" },
    { id: "chatbot",  label: "보험 약관 AI 챗봇",     badge: "과제 4", icon: "💬" },
    { id: "script",   label: "영업 스크립트 생성",    badge: "과제 5", icon: "📋" },
    { id: "platform", label: "AI Agent 플랫폼",       badge: "과제 6", icon: "🤖" },
  ];
  return (
    <div style={{
      background: C.white, borderBottom: `1px solid ${C.border}`,
      padding: "0 24px", display: "flex",
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            border: "none",
            borderBottom: on ? `2px solid ${C.navy}` : "2px solid transparent",
            background: "none", padding: "13px 18px",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: on ? 600 : 400,
            color: on ? C.navy : C.sub, whiteSpace: "nowrap",
            fontFamily: "inherit", transition: "color 0.15s",
          }}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "1px 6px",
              borderRadius: 10, background: on ? C.navy : C.bg,
              color: on ? "white" : C.muted,
            }}>{t.badge}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   RIDER RECOMMENDATION — 과제 2 (이미지1 기반)
═══════════════════════════════════════════ */
function RiderDemo({ settings }) {
  const [selectedDisease, setSelectedDisease] = useState("cancer");
  const [riderTab, setRiderTab] = useState("recommend"); // recommend | competitor
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTip, setAiTip] = useState("");

  const customer = {
    name: "홍길동", age: 43, gender: "남", contracts: 6,
    missing: 2, notyet: 3,
    monthly: "233,500", recommended: "1,600,000",
  };

  const dis = DISEASE_LIST.find(d => d.id === selectedDisease);
  const riders = RIDER_DB[selectedDisease] || { recommend: [], competitor: [] };

  const statusChip = (s) => {
    const map = {
      "부족":   { bg: C.redBg,   color: C.red   },
      "미가입": { bg: C.redBg,   color: C.red   },
      "미흡":   { bg: C.amberBg, color: C.amber },
      "충분":   { bg: C.greenBg, color: C.green },
    };
    const m = map[s] || { bg: C.bg, color: C.muted };
    return (
      <span style={{
        fontSize: 10, fontWeight: 700, padding: "2px 7px",
        borderRadius: 10, background: m.bg, color: m.color,
      }}>{s}</span>
    );
  };

  const getAiAdvice = async () => {
    setAiLoading(true);
    setAiTip("");
    try {
      const reply = await callLLM({
        messages: [{ role: "user", content:
          `고객: ${customer.name} (${customer.age}세, ${customer.gender})\n보장 부족 항목: ${dis.label}\n추천 특약 목록: ${riders.recommend.map(r=>r.name).join(", ")}\n\nFC가 고객에게 ${dis.label} 보장 부족을 설명할 때 사용할 핵심 멘트를 2~3문장으로 간결하게 작성해주세요.`
        }],
        system: "ABL생명 보험 영업 전문가입니다. FC(설계사)가 고객에게 보장 부족을 설명하는 짧고 설득력 있는 멘트를 작성합니다.",
        settings,
      });
      setAiTip(reply);
    } catch(e) {
      setAiTip(`오류: ${e.message}`);
    }
    setAiLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, height: "calc(100vh - 148px)" }}>

      {/* 좌측: 고객 정보 + 보장분석 현황 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* 고객 카드 */}
        <div style={{
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.navy}, #2952A3)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 16, fontWeight: 700,
            }}>홍</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>
                {customer.name} 고객
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                {customer.age}세 · {customer.gender}성 · 종합 보장분석
              </div>
            </div>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8, marginBottom: 12,
          }}>
            {[
              { label: "가입 계약", value: `${customer.contracts}건`, color: C.navy },
              { label: "미흡 항목", value: `${customer.missing}건`, color: C.amber },
              { label: "미가입",   value: `${customer.notyet}건`,  color: C.red   },
            ].map(s => (
              <div key={s.label} style={{
                background: C.bg, borderRadius: 6, padding: "8px 6px", textAlign: "center",
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{
            background: C.ablSoft, borderRadius: 6, padding: "8px 10px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 10, color: C.muted }}>현재 월 보험료</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>
                {customer.monthly}원
              </div>
            </div>
            <div style={{ color: C.border, fontSize: 16 }}>→</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: C.muted }}>권장 보험료</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.abl }}>
                {customer.recommended}원
              </div>
            </div>
          </div>
        </div>

        {/* 보장분석 질병 목록 */}
        <div style={{
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: 14, flex: 1, overflowY: "auto",
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: C.muted,
            letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10,
          }}>보장분석 상세</div>
          {DISEASE_LIST.map(d => {
            const on = selectedDisease === d.id;
            return (
              <div key={d.id} onClick={() => { setSelectedDisease(d.id); setAiTip(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 10px", borderRadius: 7,
                  background: on ? C.navy : "transparent",
                  cursor: "pointer", marginBottom: 2,
                  transition: "background 0.15s",
                  border: on ? "none" : `1px solid transparent`,
                }}>
                <span style={{ fontSize: 14 }}>{d.icon}</span>
                <span style={{
                  fontSize: 13, fontWeight: on ? 600 : 400,
                  color: on ? "white" : C.text, flex: 1,
                }}>{d.label}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "1px 7px",
                  borderRadius: 10,
                  background: on ? "rgba(255,255,255,0.2)" : (
                    d.status === "부족" || d.status === "미가입" ? C.redBg :
                    d.status === "미흡" ? C.amberBg : C.greenBg
                  ),
                  color: on ? "white" : (
                    d.status === "부족" || d.status === "미가입" ? C.red :
                    d.status === "미흡" ? C.amber : C.green
                  ),
                }}>{d.status}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 우측: 특약 추천 패널 */}
      <div style={{
        background: C.white, border: `1px solid ${C.border}`,
        borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* 패널 헤더 */}
        <div style={{
          padding: "14px 18px", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>{dis?.icon}</span>
          <div>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>
              {dis?.label} 관련 특약
            </span>
            <span style={{ marginLeft: 8 }}>{statusChip(dis?.status)}</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            fontSize: 11, color: C.muted, padding: "4px 10px",
            background: C.bg, borderRadius: 5,
          }}>
            급부그룹 매핑 → 특약코드 조회 → 전송
          </div>
        </div>

        {/* 서브 탭 */}
        <div style={{
          display: "flex", gap: 0,
          borderBottom: `1px solid ${C.border}`,
          padding: "0 18px",
        }}>
          {[["recommend", "특약 추천"], ["competitor", "타사 가입특약"]].map(([id, label]) => {
            const on = riderTab === id;
            return (
              <button key={id} onClick={() => setRiderTab(id)} style={{
                border: "none",
                borderBottom: on ? `2px solid ${C.abl}` : "2px solid transparent",
                background: "none", padding: "10px 16px",
                cursor: "pointer", fontSize: 13,
                fontWeight: on ? 700 : 400,
                color: on ? C.abl : C.sub,
                fontFamily: "inherit",
              }}>{label}</button>
            );
          })}
        </div>

        {/* 특약 테이블 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 0 16px 0" }}>
          {riderTab === "recommend" && (
            <>
              {riders.recommend.length === 0 ? (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: 120, color: C.muted, fontSize: 13,
                }}>
                  이 항목은 현재 충분히 보장되어 있습니다
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: C.bg }}>
                      {["순번", "특약명", "상품명", "보험사", "월 보험료(예시)"].map(h => (
                        <th key={h} style={{
                          padding: "9px 14px", fontSize: 11, fontWeight: 700,
                          color: C.muted, textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                          whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {riders.recommend.map((r, i) => (
                      <tr key={i} style={{
                        borderBottom: `1px solid ${C.border}`,
                        background: i % 2 === 0 ? C.white : "#FAFBFC",
                      }}>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: C.muted, width: 40 }}>
                          {r.no}
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500, color: C.text }}>
                          {r.name}
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: C.sub }}>
                          {r.product}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "2px 7px",
                            borderRadius: 3, background: C.ablSoft, color: C.abl,
                          }}>{r.insurer}</span>
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: C.text, fontWeight: 600 }}>
                          {r.monthly}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* AI 접근 멘트 */}
              {riders.recommend.length > 0 && (
                <div style={{ padding: "14px 18px" }}>
                  <div style={{
                    border: `1px solid ${C.border}`, borderRadius: 8,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      background: C.bg, padding: "9px 14px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>
                        💡 AI 고객 접근 멘트
                      </span>
                      <button onClick={getAiAdvice} disabled={aiLoading} style={{
                        background: aiLoading ? C.border : C.navy,
                        color: aiLoading ? C.muted : "white",
                        border: "none", borderRadius: 4,
                        padding: "4px 12px", fontSize: 11, fontWeight: 600,
                        cursor: aiLoading ? "default" : "pointer",
                        fontFamily: "inherit",
                      }}>
                        {aiLoading ? "생성 중…" : "AI 생성"}
                      </button>
                    </div>
                    <div style={{
                      padding: "12px 14px", minHeight: 60,
                      fontSize: 13, color: C.text, lineHeight: 1.7,
                    }}>
                      {aiTip
                        ? aiTip
                        : <span style={{ color: C.muted }}>
                            'AI 생성' 버튼을 누르면 이 고객에게 맞는 접근 멘트를 생성합니다
                          </span>
                      }
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {riderTab === "competitor" && (
            <>
              {riders.competitor.length === 0 ? (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: 120, color: C.muted, fontSize: 13,
                }}>타사 가입 특약 정보가 없습니다</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: C.bg }}>
                      {["순번", "특약명", "가입 보험사", "가입 여부"].map(h => (
                        <th key={h} style={{
                          padding: "9px 14px", fontSize: 11, fontWeight: 700,
                          color: C.muted, textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {riders.competitor.map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: C.muted }}>{r.no}</td>
                        <td style={{ padding: "10px 14px", fontSize: 13, color: C.text }}>{r.name}</td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: C.sub }}>{r.insurer}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "2px 8px",
                            borderRadius: 10,
                            background: r.enrolled ? C.greenBg : C.bg,
                            color: r.enrolled ? C.green : C.muted,
                          }}>
                            {r.enrolled ? "가입" : "미가입"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>

        {/* 하단 안내 */}
        <div style={{
          padding: "9px 18px", borderTop: `1px solid ${C.border}`,
          background: C.bg, fontSize: 11, color: C.muted,
        }}>
          요청 보장급부에 해당되는 ABL생명 판매 중인 보험상품의 특약코드·상품코드·상품명을 전송합니다 &nbsp;·&nbsp; ※ 내용은 변경될 수 있음
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CHATBOT DEMO — 과제 4
═══════════════════════════════════════════ */
function ChatbotDemo({ settings }) {
  const [msgs, setMsgs] = useState([{
    role: "assistant",
    text: "ABL생명 보험상품 약관 AI입니다.\n약관 내용, 보장 조건, 산출 방법 등 궁금한 사항을 질문해 주세요.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const SAMPLES = [
    "일반암 진단특약D 보장 한도는?",
    "보험료 납입면제 조건을 알려줘",
    "갱신형과 비갱신형 차이는?",
    "암 보장 개시일은 언제부터야?",
    "해약 시 환급금 계산 방법은?",
  ];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (text) => {
    const q = text ?? input;
    if (!q.trim() || loading) return;
    const next = [...msgs, { role: "user", text: q }];
    setMsgs(next); setInput(""); setLoading(true);
    try {
      const reply = await callLLM({
        messages: next.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
        system: `당신은 ABL생명 보험상품 전문 AI입니다. 아래 약관 정보를 기반으로 FC(보험 설계사)의 질문에 정확하고 간결하게 답변하세요. 약관에 없는 내용은 "약관에 명시되지 않았습니다"라고 답하세요.\n\n${YAKGWAN}`,
        settings,
      });
      setMsgs([...next, { role: "assistant", text: reply }]);
    } catch(e) {
      setMsgs([...next, { role: "assistant", text: `⚠ 오류: ${e.message}` }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 252px", gap: 16, height: "calc(100vh - 148px)" }}>
      <div style={{
        background: C.white, border: `1px solid ${C.border}`,
        borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{
          padding: "11px 16px", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>보험상품 지식 AI Agent</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted }}>약관 1종 로드됨</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
              {m.role === "assistant" && (
                <div style={{ width: 28, height: 28, background: C.abl, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🤖</div>
              )}
              <div style={{
                maxWidth: "78%", padding: "9px 13px",
                borderRadius: m.role === "user" ? "10px 10px 2px 10px" : "2px 10px 10px 10px",
                background: m.role === "user" ? C.navy : "#EEF2F7",
                color: m.role === "user" ? "white" : C.text,
                fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap",
              }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 28, height: 28, background: C.abl, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤖</div>
              <div style={{ padding: "9px 13px", background: "#EEF2F7", borderRadius: "2px 10px 10px 10px", fontSize: 13, color: C.muted }}>답변 생성 중…</div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="약관 내용, 보장 조건, 산출 방법에 대해 질문하세요..."
            style={{ flex: 1, padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none" }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{
            padding: "9px 16px",
            background: !loading && input.trim() ? C.navy : C.border,
            color: !loading && input.trim() ? "white" : C.muted,
            border: "none", borderRadius: 6,
            cursor: !loading && input.trim() ? "pointer" : "default",
            fontSize: 13, fontWeight: 600, fontFamily: "inherit",
          }}>전송</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>예시 질문</div>
          {SAMPLES.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "7px 9px", margin: "3px 0",
              background: "#F8FAFC", border: `1px solid ${C.border}`,
              borderRadius: 5, cursor: "pointer", fontSize: 12,
              color: C.text, lineHeight: 1.4, fontFamily: "inherit",
            }}>{q}</button>
          ))}
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>로드된 약관</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 20 }}>📄</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>THE 더보장종합건강보험</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>ABL생명 · 2024.01</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 10, background: C.greenBg, color: C.green, padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>활성</span>
          </div>
          <button style={{ marginTop: 10, width: "100%", padding: "7px", border: `1px dashed ${C.border}`, borderRadius: 5, background: "none", cursor: "pointer", fontSize: 11, color: C.muted, fontFamily: "inherit" }}>+ 약관 추가</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SALES SCRIPT — 과제 5
═══════════════════════════════════════════ */
function SalesScriptDemo({ settings }) {
  const [form, setForm] = useState({
    name: "홍길동", age: "43", gender: "남성",
    current_premium: "233,500", recommended_premium: "1,600,000",
    gap1: "골절진단", gap2: "심혈관진단", coverage_rate: "50% 미만",
  });
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true); setSections(null);
    try {
      const prompt = `고객 정보:\n- 이름: ${form.name} (${form.age}세, ${form.gender})\n- 현재 월 보험료: ${form.current_premium}원\n- 권장 월 보험료: ${form.recommended_premium}원\n- 보장 충족률: ${form.coverage_rate}\n- 주요 보장 부족 항목: ${form.gap1}, ${form.gap2}\n\n위 고객에게 적합한 ABL생명 영업 스크립트를 아래 섹션 형식에 맞춰 작성해주세요.\n\n[도입인사]\n[보장분석 결과 요약]\n[고객 접근 화법]\n[니즈환기]\n[추천상품]`;
      const reply = await callLLM({
        messages: [{ role: "user", content: prompt }],
        system: "당신은 ABL생명 보험 영업 전문 AI입니다. FC(설계사)가 실제로 사용할 수 있는 자연스러운 영업 스크립트를 작성합니다. 각 섹션은 반드시 [섹션명] 형식의 헤더로 시작하세요.",
        settings,
      });
      const parsed = {};
      const regex = /\[([^\]]+)\]([\s\S]*?)(?=\[[^\]]+\]|$)/g;
      let m;
      while ((m = regex.exec(reply)) !== null) {
        if (m[2].trim()) parsed[m[1].trim()] = m[2].trim();
      }
      setSections(Object.keys(parsed).length > 0 ? parsed : { "스크립트": reply });
    } catch(e) { setSections({ "오류": e.message }); }
    setLoading(false);
  };

  const SECTION_META = {
    "도입인사":           { icon: "👋", color: "#2563EB" },
    "보장분석 결과 요약": { icon: "📊", color: C.amber   },
    "고객 접근 화법":     { icon: "💬", color: "#7C3AED" },
    "니즈환기":           { icon: "⚡", color: C.green   },
    "추천상품":           { icon: "🎯", color: C.abl     },
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, height: "calc(100vh - 148px)" }}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 18, overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 14 }}>고객 정보 입력</div>
        {[
          { key: "name", label: "고객명" }, { key: "age", label: "나이" }, { key: "gender", label: "성별" },
          { key: "current_premium", label: "현재 월 보험료 (원)" }, { key: "recommended_premium", label: "권장 월 보험료 (원)" },
          { key: "gap1", label: "보장 부족 항목 1" }, { key: "gap2", label: "보장 부족 항목 2" }, { key: "coverage_rate", label: "보장 충족률" },
        ].map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: C.sub, display: "block", marginBottom: 3 }}>{label}</label>
            <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{
              width: "100%", padding: "7px 10px", border: `1px solid ${C.border}`,
              borderRadius: 5, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none",
            }} />
          </div>
        ))}
        <button onClick={generate} disabled={loading} style={{
          width: "100%", marginTop: 8, padding: "11px",
          background: loading ? C.border : C.abl, color: loading ? C.muted : "white",
          border: "none", borderRadius: 6, cursor: loading ? "default" : "pointer",
          fontSize: 13, fontWeight: 700, fontFamily: "inherit",
        }}>{loading ? "AI 생성 중…" : "📋  Sales Script 생성"}</button>
        <div style={{ marginTop: 14, padding: 12, background: C.ablSoft, border: `1px solid ${C.abl}30`, borderRadius: 6 }}>
          <div style={{ fontSize: 11, color: C.abl, fontWeight: 700, marginBottom: 6 }}>보장분석 요약</div>
          <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.7 }}>
            현재: {form.current_premium}원/월<br />
            권장: {form.recommended_premium}원/월<br />
            충족률: <span style={{ color: C.abl, fontWeight: 700 }}>{form.coverage_rate}</span>
          </div>
        </div>
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, overflowY: "auto" }}>
        {!sections && !loading && (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: C.muted }}>
            <span style={{ fontSize: 36 }}>📋</span>
            <span style={{ fontSize: 13 }}>고객 정보 입력 후 스크립트를 생성하세요</span>
          </div>
        )}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: C.muted, fontSize: 13 }}>AI 스크립트 생성 중…</div>
        )}
        {sections && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{form.name} 고객님 맞춤 영업 스크립트</span>
              <span style={{ fontSize: 10, background: C.abl, color: "white", padding: "2px 7px", borderRadius: 3, fontWeight: 700 }}>ABL생명</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: C.muted }}>{new Date().toLocaleDateString("ko-KR")} 생성</span>
            </div>
            {Object.entries(sections).map(([sec, content]) => {
              const meta = SECTION_META[sec] || { icon: "▪", color: C.navy };
              return (
                <div key={sec} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                    <span style={{ width: 3, height: 14, background: meta.color, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: meta.color, letterSpacing: 0.4 }}>{meta.icon} {sec}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.75, padding: "12px 14px", background: "#F8FAFC", borderRadius: 6, border: `1px solid ${C.border}`, whiteSpace: "pre-wrap" }}>
                    {content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AI AGENT PLATFORM — 과제 6
═══════════════════════════════════════════ */
function PlatformDemo({ settings }) {
  const agents = [
    { icon: "🎯", title: "특약 추천 어시스턴트",  desc: "보장분석 기반 특약·상품 자동 추천",   tag: "추천",      brand: "ABL",  color: C.abl  },
    { icon: "💬", title: "보험 약관 챗봇",         desc: "약관 내용 즉시 질의응답",             tag: "지식베이스", brand: "ABL",  color: C.abl  },
    { icon: "📋", title: "영업 스크립트 생성",     desc: "고객 분석 기반 스크립트 자동 작성",   tag: "생성형 AI",  brand: "ABL",  color: C.abl  },
    { icon: "📊", title: "보장 분석 리포트",       desc: "고객 보장 현황 자동 분석",            tag: "분석",      brand: "동양", color: C.dong },
    { icon: "🔔", title: "영업 활동 알림",         desc: "FC 영업 일정 자동 최적화 및 알림",    tag: "자동화",    brand: "동양", color: C.dong },
    { icon: "🔍", title: "타겟 고객 추출",         desc: "데이터 기반 고가치 고객 자동 발굴",   tag: "분석",      brand: "동양", color: C.dong },
  ];
  const [active, setActive] = useState(null);
  const [agentMsgs, setAgentMsgs] = useState([]);
  const [agentInput, setAgentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [agentMsgs]);

  const runAgent = async () => {
    if (!agentInput.trim() || !active || loading) return;
    const next = [...agentMsgs, { role: "user", text: agentInput }];
    setAgentMsgs(next); setAgentInput(""); setLoading(true);
    try {
      const reply = await callLLM({
        messages: next.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
        system: `당신은 ${active.title} AI 에이전트입니다. ABL생명/동양생명 FC(보험 설계사)의 업무를 지원합니다. 전문적이고 정확하게 답변하세요.`,
        settings,
      });
      setAgentMsgs([...next, { role: "assistant", text: reply }]);
    } catch(e) {
      setAgentMsgs([...next, { role: "assistant", text: `오류: ${e.message}` }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>AI Agent 플랫폼</div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Agent를 선택하여 즉시 업무에 활용하세요</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>● {agents.length}개 운영 중</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: active ? "1fr 340px" : "1fr", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, alignContent: "start" }}>
          {agents.map((a, i) => {
            const isActive = active?.title === a.title;
            return (
              <div key={i} onClick={() => { setActive(a); setAgentMsgs([]); }} style={{
                background: C.white, border: `1px solid ${isActive ? a.color : C.border}`,
                borderRadius: 8, padding: "14px 15px", cursor: "pointer",
                boxShadow: isActive ? `0 0 0 2px ${a.color}25` : "none",
                transition: "border-color 0.15s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <span style={{ fontSize: 10, background: a.color, color: "white", padding: "1px 6px", borderRadius: 2, fontWeight: 700 }}>{a.brand}생명</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5, marginBottom: 10 }}>{a.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, background: C.bg, color: C.muted, padding: "2px 7px", borderRadius: 10 }}>{a.tag}</span>
                  <span style={{ fontSize: 11, color: a.color, fontWeight: 600 }}>실행 →</span>
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
              <span style={{ fontSize: 10, background: active.color, color: "white", padding: "1px 6px", borderRadius: 2, fontWeight: 700 }}>{active.brand}생명</span>
              <button onClick={() => setActive(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18, lineHeight: 1, fontFamily: "inherit" }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {agentMsgs.length === 0 && (
                <div style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 40, lineHeight: 1.8 }}>
                  {active.title} Agent가 준비되었습니다.<br />질문을 입력하세요.
                </div>
              )}
              {agentMsgs.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "85%", padding: "8px 11px", borderRadius: 8, background: m.role === "user" ? C.navy : "#EEF2F7", color: m.role === "user" ? "white" : C.text, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.text}</div>
                </div>
              ))}
              {loading && <div style={{ fontSize: 12, color: C.muted }}>처리 중…</div>}
              <div ref={endRef} />
            </div>
            <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 7 }}>
              <input value={agentInput} onChange={e => setAgentInput(e.target.value)} onKeyDown={e => e.key === "Enter" && runAgent()}
                placeholder="Agent에게 질문하세요..." style={{ flex: 1, padding: "7px 10px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 12, fontFamily: "inherit", outline: "none" }} />
              <button onClick={runAgent} disabled={loading} style={{ padding: "7px 13px", background: active.color, color: "white", border: "none", borderRadius: 5, cursor: loading ? "default" : "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>실행</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SETTINGS MODAL
═══════════════════════════════════════════ */
function SettingsModal({ settings, setSettings, onClose }) {
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
            <input type={type || "text"} value={local[key]} onChange={e => setLocal({ ...local, [key]: e.target.value })} placeholder={ph} style={{ width: "100%", padding: "9px 11px", border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 12, fontFamily: "monospace", boxSizing: "border-box", outline: "none" }} />
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

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab]       = useState("rider");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings]         = useState({
    apiUrl: "https://api.anthropic.com/v1/messages",
    apiKey: "", model: "claude-sonnet-4-20250514",
  });

  return (
    <div style={{ fontFamily: "'Pretendard','Apple SD Gothic Neo','Noto Sans KR',-apple-system,sans-serif", background: C.bg, minHeight: "100vh" }}>
      <Header onSettings={() => setShowSettings(true)} />
      <TabNav active={activeTab} setActive={setActiveTab} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 20px" }}>
        {activeTab === "rider"    && <RiderDemo       settings={settings} />}
        {activeTab === "chatbot"  && <ChatbotDemo      settings={settings} />}
        {activeTab === "script"   && <SalesScriptDemo  settings={settings} />}
        {activeTab === "platform" && <PlatformDemo     settings={settings} />}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 24px", textAlign: "center", fontSize: 11, color: C.muted }}>
        AI Powered by 42Maru &nbsp;·&nbsp; 우리금융그룹 AI 영업지원 플랫폼 Demo v2.0
      </div>
      {showSettings && (
        <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
