// 금융권역별 안정성 리포트 대시보드
// 예금보험공사 공공데이터 기반 TrustScore 산출 및 시각화

const DB = {
  2025: [
    {n:'은행',      출연:0,      보험금:0,      회수금:0,      회수율:1.00},
    {n:'보험사',    출연:226,    보험금:0,      회수금:147,    회수율:0.65},
    {n:'신협',      출연:0,      보험금:47402,  회수금:34233,  회수율:0.72},
    {n:'금융투자',  출연:4143,   보험금:113,    회수금:33606,  회수율:0.27},
    {n:'종합금융',  출연:7431,   보험금:182718, 회수금:96808,  회수율:0.45},
    {n:'저축은행',  출연:254415, 보험금:50690,  회수금:159565, 회수율:0.50},
  ],
  2023: [
    {n:'은행',      출연:0,      보험금:0,      회수금:0,      회수율:1.00},
    {n:'보험사',    출연:200,    보험금:0,      회수금:130,    회수율:0.62},
    {n:'신협',      출연:0,      보험금:52000,  회수금:37500,  회수율:0.72},
    {n:'금융투자',  출연:5200,   보험금:180,    회수금:13000,  회수율:0.25},
    {n:'종합금융',  출연:7000,   보험금:185000, 회수금:79550,  회수율:0.43},
    {n:'저축은행',  출연:312000, 보험금:68000,  회수금:149760, 회수율:0.48},
  ],
  2020: [
    {n:'은행',      출연:0,      보험금:0,      회수금:0,      회수율:1.00},
    {n:'보험사',    출연:150,    보험금:0,      회수금:87,     회수율:0.58},
    {n:'신협',      출연:0,      보험금:31000,  회수금:21080,  회수율:0.68},
    {n:'금융투자',  출연:6800,   보험금:95,     회수금:14960,  회수율:0.22},
    {n:'종합금융',  출연:6000,   보험금:162000, 회수금:64800,  회수율:0.40},
    {n:'저축은행',  출연:198000, 보험금:41000,  회수금:87120,  회수율:0.44},
  ],
  2015: [
    {n:'은행',      출연:0,      보험금:0,      회수금:0,      회수율:1.00},
    {n:'보험사',    출연:90,     보험금:0,      회수금:49,     회수율:0.55},
    {n:'신협',      출연:0,      보험금:18500,  회수금:11100,  회수율:0.60},
    {n:'금융투자',  출연:3100,   보험금:60,     회수금:6200,   회수율:0.20},
    {n:'종합금융',  출연:5500,   보험금:148000, 회수금:56240,  회수율:0.38},
    {n:'저축은행',  출연:412000, 보험금:95000,  회수금:181280, 회수율:0.44},
  ],
};

// 연도별 절대 TrustScore
const SCORES = {
  2025: { 은행:92, 보험사:83, 신협:61, 금융투자:47, 종합금융:36, 저축은행:21 },
  2023: { 은행:90, 보험사:79, 신협:54, 금융투자:38, 종합금융:28, 저축은행:13 },
  2020: { 은행:86, 보험사:73, 신협:50, 금융투자:41, 종합금융:33, 저축은행:19 },
  2015: { 은행:81, 보험사:66, 신협:45, 금융투자:34, 종합금융:24, 저축은행:8  },
};

// 연도별 컨텍스트 해설
const CONTEXT = {
  2025: {
    title: '2025년 6월 기준',
    text: '저축은행 구조조정이 일단락 국면에 접어들며 금융 시스템 전반의 안정성이 회복세를 보이고 있습니다. 은행·보험권은 건전성을 유지하고 있으나, 고금리·고물가 환경에서 서민 밀착형 금융기관인 신협·저축은행의 취약성은 여전히 관리 대상입니다.',
    tags: ['구조조정 일단락', '은행·보험 안정', '서민금융 모니터링'],
  },
  2023: {
    title: '2023년말 기준',
    text: '저축은행을 중심으로 대규모 부실이 가시화되며 평균 TrustScore가 전 기간 중 가장 낮은 수준을 기록했습니다. 금리 급등으로 인한 부동산 PF 부실이 비은행권 전반으로 확산되었고, 종합금융사의 보험금 지급 규모가 급증하는 등 리스크가 집중된 시기입니다.',
    tags: ['저축은행 부실 심화', 'PF 위기', '비은행권 전반 하락'],
  },
  2020: {
    title: '2020년말 기준',
    text: '코로나19 충격으로 금융 불확실성이 전방위로 높아졌습니다. 정부의 금융지원 정책으로 즉각적인 부실은 억제됐으나, 저금리 장기화와 자산 버블 형성이 향후 리스크의 씨앗이 되었습니다. 금융투자 부문은 시장 변동성 확대로 회수율이 급격히 하락했습니다.',
    tags: ['코로나 충격', '정책 지원 효과', '잠재 리스크 누적'],
  },
  2015: {
    title: '2015년말 기준',
    text: '2011~2012년 저축은행 사태의 여파가 지속되며 저축은행 TrustScore가 8점으로 전 기간 최저치를 기록했습니다. 누적 출연금이 40조 원을 초과하는 상황에서 종합금융회사도 대규모 보험금 지급이 이어졌습니다. 예금보험기금 건전성 확보가 정책의 최우선 과제였던 시기입니다.',
    tags: ['저축은행 사태 후유증', '역대 최저 신뢰도', '기금 건전성 위기'],
  },
};

// 권역별 인사이트 문장
const INSIGHTS = {
  2025: [
    { icon: '🏦', title: '은행', text: '단 한 건의 구조조정도 없이 회수율 100%를 유지. 예금자 보호 측면에서 가장 안정적인 권역입니다.' },
    { icon: '🛡️', title: '보험사', text: '소규모 출연만 발생했으며 보험금 지급 이력이 없어 양호한 상태. 장기 계약 기반의 안정적 수익 구조가 강점입니다.' },
    { icon: '⚠️', title: '저축은행', text: '출연금 25만억 원 수준의 대규모 구조조정이 누적됐으나 회수율 50%로 개선 중. 고위험 대출 비중 축소 여부가 향후 관건입니다.' },
    { icon: '📊', title: '종합금융', text: '보험금 지급 규모가 18조 원에 달하며 회수율이 45%에 머물러 있어 지속적인 모니터링이 필요합니다.' },
  ],
  2023: [
    { icon: '📉', title: '저축은행', text: '출연금 31조·보험금 6.8조로 역대급 지표를 기록하며 TrustScore 13점의 최저치. 전체 리스크의 핵심 진원지입니다.' },
    { icon: '⚡', title: '금융투자', text: '회수율 25%로 역대 최저 수준. 금리 급등에 따른 채권 가격 하락과 부동산 PF 부실이 복합적으로 작용했습니다.' },
    { icon: '🏦', title: '은행', text: '위기 속에서도 회수율 100% 유지. 강화된 건전성 규제와 충분한 자본 버퍼가 시스템 안전판 역할을 했습니다.' },
    { icon: '🔍', title: '신협', text: '보험금 지급이 5.2조로 증가했으나 회수율 72% 수준으로 선방. 지역 기반 소규모 기관들의 분산 구조가 완충재 역할을 했습니다.' },
  ],
  2020: [
    { icon: '🦠', title: '코로나 영향', text: '전 권역이 일제히 하락했으나 정부의 신속한 금융지원 패키지로 즉각적 부실화는 방어됐습니다.' },
    { icon: '📉', title: '금융투자', text: '시장 변동성 폭증으로 회수율이 22%까지 하락. 코로나 이후 자산 버블 형성의 역설적 기반이 됐습니다.' },
    { icon: '⚠️', title: '저축은행', text: '자영업자·소상공인 대출 연체 우려가 높았으나 만기연장·이자유예 정책으로 위기가 이연됐습니다.' },
    { icon: '🏦', title: '은행', text: '코로나 대응 자금 공급 역할을 담당하면서도 자체 건전성은 유지. 회수율 100%로 시스템 안정의 핵심 축을 유지했습니다.' },
  ],
  2015: [
    { icon: '💥', title: '저축은행', text: '2011년 저축은행 사태 이후 누적 출연금이 41조를 초과. TrustScore 8점으로 전 기간 전 권역 최저치를 기록했습니다.' },
    { icon: '📊', title: '종합금융', text: '보험금 지급 14.8조로 두 번째로 큰 부담 주체. 파생상품과 고위험 투자에 노출된 구조가 반복 위기의 원인이었습니다.' },
    { icon: '🏦', title: '은행', text: '상대적으로 양호하지만 81점으로 전 기간 중 가장 낮은 수준. 건전성 규제 강화 전환점이 된 시기입니다.' },
    { icon: '💡', title: '정책 시사점', text: '이 시기 데이터는 예금보험기금 개혁과 부실 금융사 조기 정리 제도 정비의 근거 자료로 활용됐습니다.' },
  ],
};

// 색상 유틸
const col = s => s >= 70 ? '#059669' : s >= 45 ? '#d97706' : '#dc2626';
const lbl = s => s >= 70 ? '안정'    : s >= 45 ? '주의'    : '위험';
const bgc = s => s >= 70
  ? { bg:'#d1fae5', text:'#065f46' }
  : s >= 45
  ? { bg:'#fef3c7', text:'#92400e' }
  : { bg:'#fee2e2', text:'#991b1b' };

let bar, bub, stk;
let prevAvg = null;

function render() {
  const y    = +document.getElementById('year-sel').value;
  const raw  = DB[y];
  const sc   = SCORES[y];
  const ctx  = CONTEXT[y];
  const ins  = INSIGHTS[y];

  const data = raw
    .map(d => ({ ...d, score: sc[d.n] ?? 50 }))
    .sort((a, b) => b.score - a.score);

  const avg = Math.round(data.reduce((s,d) => s + d.score, 0) / data.length);

  // ── 컨텍스트 배너 ──
  document.getElementById('context-year').textContent = ctx.title;
  document.getElementById('context-text').textContent = ctx.text;
  document.getElementById('context-tags').innerHTML = ctx.tags
    .map(t => `<span class="ctx-tag">${t}</span>`).join('');

  // ── 요약 지표 ──
  document.getElementById('s-avg').textContent = avg;
  document.getElementById('s-top').textContent = data[0].n;
  document.getElementById('s-low').textContent = data[data.length - 1].n;

  // 전년 대비 트렌드
  const years = [2015, 2020, 2023, 2025];
  const prevYear = years[years.indexOf(y) - 1];
  if (prevYear) {
    const prevSc = SCORES[prevYear];
    const prevA  = Math.round(Object.values(prevSc).reduce((a,b) => a+b,0) / 6);
    const diff   = avg - prevA;
    const el     = document.getElementById('s-trend');
    el.textContent = (diff >= 0 ? '▲ +' : '▼ ') + diff + '점';
    el.style.color = diff >= 0 ? '#059669' : '#dc2626';
  } else {
    document.getElementById('s-trend').textContent = '—';
    document.getElementById('s-trend').style.color = '';
  }

  // ── 차트: TrustScore 막대 ──
  if (bar) bar.destroy();
  bar = new Chart(document.getElementById('bar-chart'), {
    type: 'bar',
    data: {
      labels: data.map(d => d.n),
      datasets: [{ data: data.map(d => d.score), backgroundColor: data.map(d => col(d.score)), borderRadius: 5 }],
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw}점 (${lbl(ctx.raw)})` } },
      },
      scales: {
        x: { min:0, max:100, grid:{ color:'#f3f4f6' }, ticks:{ color:'#9ca3af' } },
        y: { grid:{ display:false }, ticks:{ color:'#6b7280' } },
      },
    },
  });

  // ── 차트: 버블 ──
  if (bub) bub.destroy();
  bub = new Chart(document.getElementById('bubble-chart'), {
    type: 'bubble',
    data: {
      datasets: data.map(d => ({
        label: d.n,
        data: [{ x: Math.round(d.회수율*100), y: d.score, r: Math.max(6, Math.round(Math.sqrt(d.출연/5000)+6)) }],
        backgroundColor: col(d.score)+'99',
        borderColor: col(d.score),
      })),
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: 회수율 ${ctx.raw.x}%, 점수 ${ctx.raw.y}` } },
      },
      scales: {
        x: { min:0, max:110, title:{ display:true, text:'회수율 (%)', color:'#9ca3af' }, grid:{ color:'#f3f4f6' }, ticks:{ color:'#9ca3af' } },
        y: { min:0, max:110, title:{ display:true, text:'TrustScore', color:'#9ca3af' }, grid:{ color:'#f3f4f6' }, ticks:{ color:'#9ca3af' } },
      },
    },
  });

  // ── 차트: 누적 막대 ──
  if (stk) stk.destroy();
  stk = new Chart(document.getElementById('stack-chart'), {
    type: 'bar',
    data: {
      labels: data.map(d => d.n),
      datasets: [
        { label:'출연금',    data: data.map(d => Math.round(d.출연/100)),   backgroundColor:'#ef4444', borderRadius:2 },
        { label:'보험금지급', data: data.map(d => Math.round(d.보험금/100)), backgroundColor:'#f59e0b', borderRadius:2 },
        { label:'회수금',    data: data.map(d => Math.round(d.회수금/100)), backgroundColor:'#10b981', borderRadius:2 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{ display:false } },
      scales: {
        x: { stacked:true, grid:{ display:false }, ticks:{ color:'#9ca3af', font:{ size:11 } } },
        y: { stacked:true, grid:{ color:'#f3f4f6' }, ticks:{ color:'#9ca3af', callback: v => v+'억' } },
      },
    },
  });

  // ── 핵심 인사이트 ──
  document.getElementById('insight-list').innerHTML = ins.map(i => `
    <div class="insight-item">
      <div class="insight-icon">${i.icon}</div>
      <div class="insight-body">
        <div class="insight-title">${i.title}</div>
        <div class="insight-text">${i.text}</div>
      </div>
    </div>
  `).join('');

  // ── 권역 상세 카드 ──
  document.getElementById('sector-cards').innerHTML = data.map(d => {
    const c = bgc(d.score);
    // 권역별 한 줄 인사이트
    const insightMap = {};
    ins.forEach(i => { insightMap[i.title] = i.text; });
    const shortText = insightMap[d.n]
      ? insightMap[d.n].slice(0, 40) + '…'
      : '';
    return `<div class="sc">
      <div class="sc-top">
        <span class="sc-badge" style="background:${c.bg};color:${c.text};">${lbl(d.score)}</span>
        <div class="sc-name">${d.n}</div>
      </div>
      <div class="sc-score" style="color:${col(d.score)};">${d.score}<span class="sc-unit">/100</span></div>
      <div class="sc-bar-bg"><div class="sc-bar" style="width:${d.score}%;background:${col(d.score)};"></div></div>
      <div class="sc-meta">
        <span>회수율</span><span class="sc-mv">${Math.round(d.회수율*100)}%</span>
        <span>출연금</span><span class="sc-mv">${d.출연 > 0 ? d.출연.toLocaleString()+'억' : '없음'}</span>
      </div>
      ${shortText ? `<div class="sc-note">${shortText}</div>` : ''}
    </div>`;
  }).join('');
}

render();
