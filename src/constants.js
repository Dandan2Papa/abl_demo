export const C = {
  abl: "#C8001C", ablSoft: "#FFF0F2",
  dong: "#E35200", dongSoft: "#FFF4EE",
  navy: "#1A2E4A", bg: "#F3F5F8", white: "#FFFFFF",
  border: "#DEE2E8", text: "#1A2E4A", sub: "#546178", muted: "#8A98AB",
  green: "#16A34A", greenBg: "#DCFCE7",
  red: "#DC2626", redBg: "#FEE2E2",
  amber: "#D97706", amberBg: "#FEF3C7",
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
  { id: "cancer",  label: "암진단",      icon: "🔴", status: "부족"   },
  { id: "brain",   label: "뇌혈관진단",  icon: "🟡", status: "부족"   },
  { id: "heart",   label: "심장혈관진단",icon: "🟡", status: "미흡"   },
  { id: "liver",   label: "실화손단",    icon: "🟢", status: "충분"   },
  { id: "bone",    label: "골절진단",    icon: "🔴", status: "미가입" },
  { id: "surgery", label: "수술비",      icon: "🟢", status: "충분"   },
  { id: "death",   label: "사망",        icon: "🟢", status: "충분"   },
];

export const RIDER_DB = {
  cancer: {
    rec: [
      { no:1, name:"일반암 진단특약D",                   prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"32,000" },
      { no:2, name:"일반암요치료비보장특약D",             prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"18,500" },
      { no:3, name:"암직접치료상급종합병원통원보장특약",  prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"8,200"  },
      { no:4, name:"암진단특약",                         prod:"THE드림종신보험II",      ins:"ABL생명", mon:"24,100" },
      { no:5, name:"암직접치료입원보장특약",             prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"11,300" },
    ],
    comp: [
      { no:1, name:"암치료비 특약",     ins:"삼성생명", ok:true  },
      { no:2, name:"암진단급여금 특약", ins:"한화생명", ok:false },
      { no:3, name:"항암약물치료 특약", ins:"교보생명", ok:false },
    ],
  },
  brain: {
    rec: [
      { no:1, name:"뇌졸중진단특약",     prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"21,500" },
      { no:2, name:"뇌혈관질환입원특약", prod:"THE드림종신보험II",      ins:"ABL생명", mon:"14,200" },
      { no:3, name:"뇌출혈진단특약D",    prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"9,800"  },
    ],
    comp: [
      { no:1, name:"뇌혈관 진단비 특약", ins:"동양생명", ok:true  },
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
  bone: {
    rec: [
      { no:1, name:"골절진단특약",   prod:"THE 더보장종합건강보험", ins:"ABL생명", mon:"5,600" },
      { no:2, name:"깁스치료비특약", prod:"THE드림종신보험II",      ins:"ABL생명", mon:"3,200" },
    ],
    comp: [],
  },
  liver:   { rec: [], comp: [] },
  surgery: { rec: [], comp: [] },
  death:   { rec: [], comp: [] },
};
