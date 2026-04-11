import React, { useState, useRef, useEffect } from "react";
import { C } from "../../constants.js";
import { callLLM } from "../../api.js";

const DongyangHub = ({ settings, onBack }) => {
  const [activeTab, setActiveTab] = useState("playground");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentSearch, setAgentSearch] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [showPrompt, setShowPrompt] = useState(false);
  const [claimCustomer, setClaimCustomer] = useState({ name: "", certificate: "", type: "사망" });
  const [claimReason, setClaimReason] = useState("");
  const [underwriisingData, setUnderwritingData] = useState({ diseaseCode: "", amount: "", age: "", gender: "", contracts: "" });
  const [customerMode, setCustomerMode] = useState("대면");
  const [maskPI, setMaskPI] = useState(true);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const agents = [
    { id: "rfp", icon: "📋", name: "RFP 분석기", desc: "RFP 문서 핵심 요구사항 추출" },
    { id: "report", icon: "📊", name: "보고서 초안", desc: "주제와 데이터로 자동 작성" },
    { id: "regulation", icon: "🔍", name: "규정 검색", desc: "내부 규정 즉시 답변" },
    { id: "meeting", icon: "📝", name: "회의록 정리", desc: "녹취 텍스트 → 개조식" },
    { id: "memo", icon: "📨", name: "공문 초안", desc: "공문 형식 자동 완성" },
    { id: "summary", icon: "🗂️", name: "문서 요약", desc: "긴 문서 핵심 요약" },
    { id: "translate", icon: "🌐", name: "다국어 번역", desc: "전문 용어 보존 번역" },
    { id: "analysis", icon: "💡", name: "데이터 분석", desc: "데이터 시각화 및 인사이트" },
  ];

  const products = {
    "종신보험": ["정기종신보험 S", "종신보험 E", "변액종신보험"],
    "건강보험": ["건강보험 플러스", "무배당 건강보험", "실손의료보험", "질병보험", "상해보험"],
    "연금보험": ["연금저축보험", "변액연금보험"],
    "변액보험": ["변액보험 프리미엄", "변액보험 골드"],
  };

  const claimTypes = ["사망", "입원", "수술", "진단", "후유장해"];

  const customerModes = ["대면", "비대면 상담", "콜센터"];

  const tabs = [
    { id: "playground", label: "AI Playground", icon: "🧪" },
    { id: "yakgwan", label: "상품약관 Q&A", icon: "📖" },
    { id: "claim", label: "보험금청구 Q&A", icon: "💰" },
    { id: "underwriting", label: "언더라이팅 Q&A", icon: "🔍" },
    { id: "customer", label: "고객대응 Q&A", icon: "📞" },
    { id: "coverage", label: "보장분석 스크립트", icon: "📊" },
  ];

  const recentChats = [
    "RFP 요구사항 추출",
    "보고서 작성 가이드",
    "규정 확인",
    "회의록 정리",
    "공문 작성",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: "user", content: userInput };
    setChatMessages([...chatMessages, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await callLLM({
        messages: [...chatMessages, { role: "user", content: userInput }],
        system: "동양생명 AI 어시스턴트입니다. 보험 약관, 청구, 언더라이팅, 고객 대응에 전문적으로 답변합니다.",
        settings: { ...settings, model: selectedModel },
      });
      const assistantMessage = { role: "assistant", content: response };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("LLM Error:", error);
      setChatMessages((prev) => [...prev, { role: "assistant", content: "오류가 발생했습니다." }]);
    }

    setIsLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const message = { role: "user", content: `파일 업로드: ${file.name}` };
      setChatMessages([...chatMessages, message]);
    }
  };

  const exportChat = (format) => {
    let content = chatMessages.map((m) => `${m.role}: ${m.content}`).join("\n\n");
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `dongyang_chat.${format}`);
    element.click();
  };

  // Playground Tab
  const PlaygroundTab = () => {
    const filteredAgents = agents.filter((a) => a.name.includes(agentSearch) || a.desc.includes(agentSearch));

    return (
      <div style={{ display: "flex", height: "calc(100vh - 240px)" }}>
        {/* Left Sidebar */}
        <div style={{ width: 240, borderRight: "1px solid #E0E0E0", overflowY: "auto", padding: "12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: 12, color: "#333" }}>AI 서비스 빌더</div>
          <input
            type="text"
            placeholder="에이전트 검색..."
            value={agentSearch}
            onChange={(e) => setAgentSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 12,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              style={{
                padding: "12px",
                marginBottom: 8,
                border: selectedAgent?.id === agent.id ? "2px solid #0066B3" : "1px solid #E0E0E0",
                borderRadius: "6px",
                cursor: "pointer",
                backgroundColor: selectedAgent?.id === agent.id ? "#E8F0FE" : "white",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "16px", marginBottom: 4 }}>{agent.icon}</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#333" }}>{agent.name}</div>
              <div style={{ fontSize: "11px", color: "#666", marginTop: 4 }}>{agent.desc}</div>
              <div style={{ marginTop: 8, fontSize: "14px", cursor: "pointer" }}>★</div>
            </div>
          ))}
          <button
            style={{
              width: "100%",
              padding: "10px",
              marginTop: 16,
              backgroundColor: "#0066B3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            AI Agent 생성
          </button>
        </div>

        {/* Main Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px" }}>
          {selectedAgent ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#0066B3" }}>{selectedAgent.name}</div>
                <div style={{ fontSize: "13px", color: "#666", marginTop: 4 }}>{selectedAgent.desc}</div>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  marginBottom: 16,
                  paddingRight: "12px",
                }}
              >
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: "center", color: "#999", marginTop: "20%" }}>
                    <div style={{ fontSize: "14px" }}>샘플 질문을 선택하거나 메시지를 입력하세요</div>
                    <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        onClick={() => setUserInput("이 도구를 어떻게 사용하나요?")}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#F0F0F0",
                          border: "1px solid #D0D0D0",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        사용법 알아보기
                      </button>
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: 12,
                      padding: "12px",
                      backgroundColor: msg.role === "user" ? "#EEF4FF" : "#FAFBFC",
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: "#333",
                    }}
                  >
                    <strong>{msg.role === "user" ? "나:" : "AI:"}</strong> {msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div style={{ padding: "12px", color: "#999", fontSize: "13px" }}>생각 중...</div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#F0F0F0",
                    border: "1px solid #D0D0D0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  파일 업로드
                </button>
                <button
                  onClick={() => exportChat("pdf")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#F0F0F0",
                    border: "1px solid #D0D0D0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  대화 내보내기
                </button>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="메시지 입력..."
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "1px solid #D0D0D0",
                    borderRadius: "4px",
                    fontSize: "13px",
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#0066B3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isLoading ? "default" : "pointer",
                    fontSize: "13px",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  전송
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#999", marginTop: "20%" }}>
              왼쪽 메뉴에서 에이전트를 선택하세요
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div
          style={{
            width: 180,
            borderLeft: "1px solid #E0E0E0",
            padding: "12px",
            overflowY: "auto",
            fontSize: "12px",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 12, color: "#333" }}>최근 대화</div>
          {recentChats.map((chat, idx) => (
            <div
              key={idx}
              onClick={() => setChatMessages([])}
              style={{
                padding: "8px",
                marginBottom: 8,
                backgroundColor: "#FAFBFC",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "11px",
                color: "#666",
              }}
            >
              {chat}
            </div>
          ))}

          <div style={{ marginTop: 20, fontWeight: 600, marginBottom: 12, color: "#333" }}>모델 선택</div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #D0D0D0",
              fontSize: "11px",
            }}
          >
            <option>GPT-4o</option>
            <option>Claude</option>
            <option>HyperCLOVA X</option>
          </select>

          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={showPrompt}
              onChange={(e) => setShowPrompt(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <label style={{ cursor: "pointer", fontSize: "11px" }}>프롬프트 보기</label>
          </div>

          <div style={{ marginTop: 20, fontSize: "11px", color: "#666" }}>
            <div>오늘 사용량: 24</div>
            <div style={{ marginTop: 4 }}>남은 토큰: 45,230</div>
          </div>
        </div>
      </div>
    );
  };

  // Yakgwan Tab
  const YakgwanTab = () => {
    return (
      <div style={{ display: "flex", height: "calc(100vh - 240px)" }}>
        <div style={{ width: 200, borderRight: "1px solid #E0E0E0", padding: "12px", overflowY: "auto" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: 12, color: "#333" }}>상품 목록</div>
          {Object.entries(products).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#0066B3", marginBottom: 6, cursor: "pointer" }}>
                📂 {category}
              </div>
              {items.map((item) => (
                <div
                  key={item}
                  onClick={() => setSelectedProduct(item)}
                  style={{
                    padding: "6px 8px",
                    marginLeft: 12,
                    marginBottom: 4,
                    backgroundColor: selectedProduct === item ? "#E8F0FE" : "transparent",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    color: selectedProduct === item ? "#0066B3" : "#666",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#0066B3" }}>
              {selectedProduct || "상품을 선택하세요"}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", marginBottom: 16 }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 12,
                  padding: "12px",
                  backgroundColor: msg.role === "user" ? "#EEF4FF" : "#FAFBFC",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                <strong>{msg.role === "user" ? "Q:" : "A:"}</strong> {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: "11px", color: "#999", marginBottom: 8 }}>샘플 질문:</div>
            {["무배당 건강보험 면책사유는?", "인수한도란 무엇인가요?", "사고심도 기준 설명해줘"].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserInput(q);
                  setChatMessages([...chatMessages, { role: "user", content: q }]);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  marginBottom: 6,
                  backgroundColor: "#F0F0F0",
                  border: "1px solid #D0D0D0",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  textAlign: "left",
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="약관 질문 입력..."
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #D0D0D0",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "10px 16px",
                backgroundColor: "#0066B3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              검색
            </button>
          </div>
        </div>

        <div style={{ width: 150, borderLeft: "1px solid #E0E0E0", padding: "12px", fontSize: "11px" }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: "#333" }}>관련 약관</div>
          <div style={{ padding: "8px", backgroundColor: "#FAFBFC", borderRadius: "4px", marginBottom: 8 }}>
            <div style={{ fontSize: "10px", color: "#666" }}>제3조 보험료</div>
          </div>
          <div style={{ padding: "8px", backgroundColor: "#FAFBFC", borderRadius: "4px" }}>
            <div style={{ fontSize: "10px", color: "#666" }}>제5조 보장 범위</div>
          </div>
        </div>
      </div>
    );
  };

  // Claim Tab
  const ClaimTab = () => {
    return (
      <div style={{ display: "flex", height: "calc(100vh - 240px)" }}>
        <div style={{ width: 220, borderRight: "1px solid #E0E0E0", padding: "12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: 12, color: "#333" }}>고객 정보</div>
          <input
            type="text"
            placeholder="고객명"
            value={claimCustomer.name}
            onChange={(e) => setClaimCustomer({ ...claimCustomer, name: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 8,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
          <input
            type="text"
            placeholder="증권번호"
            value={claimCustomer.certificate}
            onChange={(e) => setClaimCustomer({ ...claimCustomer, certificate: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 8,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
          <select
            value={claimCustomer.type}
            onChange={(e) => setClaimCustomer({ ...claimCustomer, type: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 12,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {claimTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <textarea
            placeholder="청구사유"
            value={claimReason}
            onChange={(e) => setClaimReason(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              minHeight: 80,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 12, fontSize: "12px", color: "#999" }}>
            샘플 질문: {["암진단 보험금 청구 시 필요서류는?", "후유장해 심사 기준 알려줘", "입원일당 지급사유 확인"].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserInput(q);
                  setChatMessages([...chatMessages, { role: "user", content: q }]);
                }}
                style={{
                  marginRight: 6,
                  padding: "4px 8px",
                  backgroundColor: "#F0F0F0",
                  border: "1px solid #D0D0D0",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                {q.slice(0, 15)}...
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 12,
                  padding: "12px",
                  backgroundColor: msg.role === "user" ? "#EEF4FF" : "#FAFBFC",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                <strong>{msg.role === "user" ? "Q:" : "A:"}</strong> {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="청구 관련 질문..."
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #D0D0D0",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "10px 16px",
                backgroundColor: "#0066B3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              질문
            </button>
          </div>
        </div>

        <div style={{ width: 160, borderLeft: "1px solid #E0E0E0", padding: "12px", fontSize: "11px" }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>구비서류</div>
          <div style={{ color: "#666", fontSize: "10px", lineHeight: "1.5" }}>
            <div>• 청구서</div>
            <div>• 진단서</div>
            <div>• 통장 사본</div>
            <div style={{ marginTop: 12, fontWeight: 600 }}>면부 사유</div>
            <div style={{ marginTop: 4, color: "#999" }}>자동차 사고로 인한 입원</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <input
              type="checkbox"
              checked={maskPI}
              onChange={(e) => setMaskPI(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            <label style={{ fontSize: "10px" }}>민감정보 마스킹</label>
          </div>
        </div>
      </div>
    );
  };

  // Underwriting Tab
  const UnderwritingTab = () => {
    return (
      <div style={{ display: "flex", height: "calc(100vh - 240px)" }}>
        <div style={{ width: 220, borderRight: "1px solid #E0E0E0", padding: "12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: 12, color: "#333" }}>심사 조건</div>
          <input
            type="text"
            placeholder="질병코드"
            value={underwriisingData.diseaseCode}
            onChange={(e) => setUnderwritingData({ ...underwriisingData, diseaseCode: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 8,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
          <input
            type="number"
            placeholder="가입금액"
            value={underwriisingData.amount}
            onChange={(e) => setUnderwritingData({ ...underwriisingData, amount: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 8,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
          <input
            type="number"
            placeholder="피보험자 연령"
            value={underwriisingData.age}
            onChange={(e) => setUnderwritingData({ ...underwriisingData, age: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 8,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
          <select
            value={underwriisingData.gender}
            onChange={(e) => setUnderwritingData({ ...underwriisingData, gender: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 8,
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            <option value="">성별 선택</option>
            <option>남</option>
            <option>여</option>
          </select>
          <input
            type="text"
            placeholder="기존 계약 건수"
            value={underwriisingData.contracts}
            onChange={(e) => setUnderwritingData({ ...underwriisingData, contracts: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #D0D0D0",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
        </div>

        <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 12, fontSize: "12px", color: "#999" }}>
            샘플 질문:{" "}
            {["당뇨병 기왕력 고객 가입 가능한가?", "일반암 진단특약 가입한도는?", "고혈압 고지의무 범위는?"].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserInput(q);
                  setChatMessages([...chatMessages, { role: "user", content: q }]);
                }}
                style={{
                  marginRight: 6,
                  padding: "4px 8px",
                  backgroundColor: "#F0F0F0",
                  border: "1px solid #D0D0D0",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                {q.slice(0, 15)}...
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 12,
                  padding: "12px",
                  backgroundColor: msg.role === "user" ? "#EEF4FF" : "#FAFBFC",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                <strong>{msg.role === "user" ? "Q:" : "A:"}</strong> {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="언더라이팅 질문..."
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #D0D0D0",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "10px 16px",
                backgroundColor: "#0066B3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              조회
            </button>
          </div>
        </div>

        <div style={{ width: 160, borderLeft: "1px solid #E0E0E0", padding: "12px", fontSize: "11px" }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>인수기준</div>
          <div style={{ padding: "8px", backgroundColor: "#FAFBFC", borderRadius: "4px", color: "#666" }}>
            <div style={{ fontSize: "10px", marginBottom: 6 }}>일반암: 5000만원</div>
            <div style={{ fontSize: "10px", marginBottom: 6 }}>신장질환: 3000만원</div>
            <div style={{ fontSize: "10px" }}>당뇨: 2000만원</div>
          </div>
          <div style={{ marginTop: 12, fontSize: "10px", color: "#0066B3", fontWeight: 600 }}>
            남은 한도: 2,500만원
          </div>
        </div>
      </div>
    );
  };

  // Customer Tab
  const CustomerTab = () => {
    const customerSamples = {
      "대면": ["보험료 납입 변경 절차는?", "만기보험금 수령 방법은?"],
      "비대면 상담": ["모바일 청구 접수 방법은?", "보험증권 재발급 절차는?"],
      "콜센터": ["해약환급금 조회 방법은?", "보험계약대출 한도 확인"],
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 240px)" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #E0E0E0", display: "flex", gap: 12 }}>
          {customerModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setCustomerMode(mode)}
              style={{
                padding: "8px 16px",
                backgroundColor: customerMode === mode ? "#0066B3" : "#F0F0F0",
                color: customerMode === mode ? "white" : "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {mode}
            </button>
          ))}
          <div style={{ flex: 1, textAlign: "right", fontSize: "11px", color: "#666", alignSelf: "center" }}>
            응답 속도: ~1.2초
          </div>
        </div>

        <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 12, fontSize: "12px", color: "#999" }}>
            샘플 질문:{" "}
            {customerSamples[customerMode].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserInput(q);
                  setChatMessages([...chatMessages, { role: "user", content: q }]);
                }}
                style={{
                  marginRight: 6,
                  padding: "4px 8px",
                  backgroundColor: "#F0F0F0",
                  border: "1px solid #D0D0D0",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                {q.slice(0, 15)}...
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 12,
                  padding: "12px",
                  backgroundColor: msg.role === "user" ? "#EEF4FF" : "#FAFBFC",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                <strong>{msg.role === "user" ? "Q:" : "A:"}</strong> {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="고객 질문..."
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #D0D0D0",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "10px 16px",
                backgroundColor: "#0066B3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              답변
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Coverage Tab
  const CoverageTab = () => {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ maxWidth: "100%", marginBottom: 20 }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0066B3", marginBottom: 12 }}>보장분석 스크립트</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 12, backgroundColor: "#FAFBFC", borderRadius: "6px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: 8, color: "#333" }}>고객 정보</div>
              <input
                type="text"
                placeholder="고객명"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: 8,
                  border: "1px solid #D0D0D0",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <input
                type="number"
                placeholder="연령"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: 8,
                  border: "1px solid #D0D0D0",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <select
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: 8,
                  border: "1px solid #D0D0D0",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <option>성별 선택</option>
                <option>남</option>
                <option>여</option>
              </select>
              <textarea
                placeholder="보장분석 결과 (PDF/이미지 업로드 또는 텍스트 입력)"
                style={{
                  width: "100%",
                  minHeight: 120,
                  padding: "8px",
                  border: "1px solid #D0D0D0",
                  borderRadius: "4px",
                  fontSize: "12px",
                  resize: "vertical",
                }}
              />
              <button
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#0066B3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                스크립트 생성
              </button>
            </div>

            <div style={{ padding: 12, backgroundColor: "#EEF4FF", borderRadius: "6px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: 8, color: "#0066B3" }}>AI 생성 스크립트</div>
              <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.6" }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>[도입인사]</div>
                <div style={{ marginBottom: 12 }}>안녕하세요. 저는 동양생명의 컨설턴트입니다...</div>

                <div style={{ fontWeight: 600, marginBottom: 4 }}>[보장분석 결과]</div>
                <div style={{ marginBottom: 12 }}>현재 고객님의 보장 현황은...</div>

                <div style={{ fontWeight: 600, marginBottom: 4 }}>[니즈환기]</div>
                <div style={{ marginBottom: 12 }}>이러한 보장의 공백을 해소하기 위해...</div>

                <div style={{ fontWeight: 600, marginBottom: 4 }}>[추천상품]</div>
                <div style={{ marginBottom: 12 }}>종신보험 E 상품을 추천드립니다...</div>

                <div style={{ fontWeight: 600, marginBottom: 4 }}>[마무리]</div>
                <div>더 자세한 설명이 필요하시면...</div>
              </div>
            </div>
          </div>

          <div style={{ padding: 12, backgroundColor: "#FAFBFC", borderRadius: "6px", marginTop: 12 }}>
            <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: 8, color: "#333" }}>품질 점수</div>
            <div style={{ display: "flex", gap: 20 }}>
              <div>
                <div style={{ fontSize: "11px", color: "#666" }}>기존 수동 작성</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#999" }}>65/100</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#666" }}>AI 자동 생성</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0066B3" }}>92/100</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <div
        style={{
          padding: "12px 20px",
          backgroundColor: "white",
          borderBottom: "1px solid #E0E0E0",
          display: "flex",
          alignItems: "center",
          gap: 16,
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "6px 12px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ← 포털
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#0066B3" }}>동양생명</div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: 2 }}>생성형 AI 서비스 포털</div>
        </div>
        <div style={{ width: 80 }} />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", borderBottom: "1px solid #E0E0E0", backgroundColor: "white" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setChatMessages([]);
            }}
            style={{
              padding: "12px 20px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              borderBottom: activeTab === tab.id ? "2px solid #0066B3" : "2px solid transparent",
              color: activeTab === tab.id ? "#0066B3" : "#666",
              transition: "all 0.2s",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, backgroundColor: "#FFFFFF", overflowY: "auto" }}>
        {activeTab === "playground" && <PlaygroundTab />}
        {activeTab === "yakgwan" && <YakgwanTab />}
        {activeTab === "claim" && <ClaimTab />}
        {activeTab === "underwriting" && <UnderwritingTab />}
        {activeTab === "customer" && <CustomerTab />}
        {activeTab === "coverage" && <CoverageTab />}
      </div>
    </div>
  );
};

export default DongyangHub;
