export const C = {
  abl: "#C8001C", ablSoft: "#FFF0F2",
  dong: "#0066B3", dongSoft: "#E8F0FE",
  navy: "#1A2E4A", bg: "#F3F5F8", white: "#FFFFFF",
  border: "#DEE2E8", text: "#1A2E4A", sub: "#546178", muted: "#8A98AB",
  green: "#16A34A", greenBg: "#DCFCE7",
  red: "#DC2626", redBg: "#FEE2E2",
  amber: "#D97706", amberBg: "#FEF3C7",
  accent: "#0EA5E9", accentSoft: "#E0F2FE",
};

export const YAKGWAN = `[ABL생명 THE 더보장종합건강보험 약관 요약]
1. 일반암 진단특약D: 최대 5,000만원, 계약일 90일 후 개시
2. 일반암요치료비보장특약D: 1회당 최대 100만원
3. 암직접치료상급종합병원통원보장특약: 1회당 30만원, 연 30회
4. 암진단특약 (THE드림종신보험II)
5. 암직접치료입원보장특약: 1일당 5만원
납입면제: 암·뇌혈관질환 진단 확정 시
해약환급금: 납입기간 중 해지 시 납입보험료 × 해약환급률
갱신형: 3~5년마다 갱신 시 인상 / 비갱신형: 보험료 고정
면책: 전쟁·내란·테러, 피보험자 고의 자해`;

export const DISEASE_LIST = [
  { id: "cancer",  label: "암진단",      icon: "🔴", status: "부족" },
  { id: "brain",   label: "뇌혈관진단",  icon: "🟡", status: "부족" },
  { id: "heart",   label: "심장혈관진단",icon: "🟡", status: "미흡" },
  { id: "liver",   label: "질환진단",    icon: "🟢", status: "충분" },
  { id: "bone",    label: "골절진단",    icon: "🔴", status: "미가입" },
  { id: "surgery", label: "수술비",      icon: "🟢", status: "충분" },
  { id: "death",   label: "사망",        icon: "🟢", status: "충분" },
  { id: "dementia",label: "치매&간병",   icon: "🔴", status: "미가입" },
  { id: "dental",  label: "치아",        icon: "🟡", status: "부족" },
  { id: "hosp",    label: "입원/통원",   icon: "🟢", status: "양호" },
];

export const RIDER_DB = {
  cancer: {
    rec: [
      { no:1, name:"일반암 진단특약D",                   prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"32,000" },
      { no:2, name:"일반암요치료비보장특약D",             prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"18,500" },
      { no:3, name:"암직접치료상급종합병원통원보장특약",  prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"8,200" },
      { no:4, name:"암진단특약",                         prod:"THE드림종신보험II",      ins:"ABL생명", mon:"24,100" },
      { no:5, name:"암직접치료입원보장특약",             prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"11,300" },
    ],
    comp: [
      { no:1, name:"암치료비 특약",     ins:"삼성생명", ok:true },
      { no:2, name:"암진단급여금 특약", ins:"한화생명", ok:false },
      { no:3, name:"항암약물치료 특약", ins:"교보생명", ok:false },
    ],
  },
  brain: {
    rec: [
      { no:1, name:"뇌졸중진단특약",     prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"21,500" },
      { no:2, name:"뇌혈관질환입원특약", prod:"THE드림종신보험II",      ins:"ABL생명", mon:"14,200" },
      { no:3, name:"뇌출혈진단특약D",    prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"9,800" },
    ],
    comp: [
      { no:1, name:"뇌혈관 진단비 특약", ins:"동양생명", ok:true },
      { no:2, name:"뇌졸중 치료비 특약", ins:"삼성화재", ok:false },
    ],
  },
  heart: {
    rec: [
      { no:1, name:"급성심근경색진단특약",   prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"18,900" },
      { no:2, name:"허혈성심장질환진단특약", prod:"THE드림종신보험II",      ins:"ABL생명", mon:"13,400" },
    ],
    comp: [{ no:1, name:"심장질환 수술비 특약", ins:"교보생명", ok:false }],
  },
  bone:    { rec: [{ no:1, name:"골절진단특약", prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"5,600" }], comp: [] },
  liver:   { rec: [], comp: [] },
  surgery: { rec: [], comp: [] },
  death:   { rec: [], comp: [] },
  dementia:{ rec: [{ no:1, name:"치매진단특약", prod:"THE드림종신보험II", ins:"ABL생명", mon:"28,000" }], comp: [] },
  dental:  { rec: [], comp: [] },
  hosp:    { rec: [], comp: [] },
};

export const EXTRA_AGENTS = [
  { id:"retention",  name:"해지방어 AI Agent",      icon:"🛡️", desc:"해지 위험 고객 예측 및 맞춤 리텐션 스크립트 생성", color:"#DC2626" },
  { id:"marketing",  name:"마케팅 문구 생성 Agent", icon:"✍️", desc:"타겟 세그먼트별 맞춤 마케팅 카피 자동 생성",      color:"#D97706" },
  { id:"compliance", name:"컴플라이언스 검토 Agent", icon:"⚖️", desc:"광고/안내문/스크립트의 보험업법 준수 여부 자동 검토", color:"#0EA5E9" },
  { id:"complaint",  name:"민원 예측/대응 Agent",   icon:"📞", desc:"민원 패턴 분석 및 선제적 대응 스크립트 생성",     color:"#16A34A" },
  { id:"newbiz",     name:"신계약 품질 분석 Agent",  icon:"📊", desc:"불완전판매 리스크 조기 탐지",                     color:"#8B5CF6" },
  { id:"design",     name:"고객 맞춤 상품 설계",     icon:"💎", desc:"고객 프로필 기반 최적 상품 포트폴리오 자동 설계", color:"#EC4899" },
];

export const SAMPLE_REPORT = {
  customer: { name:"차무솜", age:29, gender:"남", contracts:3, premium:"208,900" },
  gaps: [
    { item:"사망",       current:"0",         std:"1억",     gap:"-1억",     status:"부족" },
    { item:"암진단",     current:"3,000만",   std:"1억",     gap:"-7,000만", status:"부족" },
    { item:"뇌혈관",     current:"3,000만",   std:"1억",     gap:"-7,000만", status:"부족" },
    { item:"심장혈관",   current:"0",         std:"2,000만", gap:"-2,000만", status:"부족" },
    { item:"치매&간병",  current:"0",         std:"5,000만", gap:"-5,000만", status:"부족" },
    { item:"장해",       current:"1억5,800만",std:"1억",     gap:"양호",     status:"양호" },
    { item:"골절",       current:"80만",      std:"50만",    gap:"양호",     status:"양호" },
    { item:"입원/통원",  current:"8만",       std:"10만",    gap:"-2만",     status:"부족" },
  ],
};
