'use strict';

/* ===== DATA ===== */

const DIMENSIONS = [
  {
    id: 'visibility',
    name: 'Dimension 1: Visibility',
    short: 'Visibility',
    question: 'To what extent does the organization maintain an automated, real-time inventory of all physical, virtual, and cloud assets?',
    levels: [
      { label: 'Unmanaged',   desc: 'No centralized inventory; systems discovered only upon operational failure.' },
      { label: 'Reactive',    desc: 'Static, manual spreadsheet of core computers and servers, updated occasionally.' },
      { label: 'Operational', desc: 'Basic automated network discovery tools used, but cloud-hosted environments regularly missed.' },
      { label: 'Managed',     desc: 'Automated inventory of physical, virtual, and cloud assets, updated weekly.' },
      { label: 'Optimized',   desc: 'Real-time asset inventory automatically tracking and mapping dependencies across all systems and user identities.' },
    ],
  },
  {
    id: 'toolingSpeed',
    name: 'Dimension 2: Tooling Speed',
    short: 'Tooling Speed',
    question: 'What is the average duration between the public disclosure of a vulnerability and automated scanning and remediation execution across the environment?',
    levels: [
      { label: 'Unmanaged',   desc: 'No security scans performed, or only annually to satisfy basic audit requirements.' },
      { label: 'Reactive',    desc: 'Quarterly scanning; patches applied manually following manual review.' },
      { label: 'Operational', desc: 'Weekly vulnerability scans with automatic OS-level updates applied.' },
      { label: 'Managed',     desc: 'Continuous vulnerability scanning; critical internet-facing bugs addressed within 24 hours.' },
      { label: 'Optimized',   desc: 'Real-time risk assessment and automated exposure management tools remediate vulnerabilities in minutes.' },
    ],
  },
  {
    id: 'approvalSpeed',
    name: 'Dimension 3: Approval Speed',
    short: 'Approval Speed',
    question: 'How rapidly can emergency security remediations or containment protocols be authorized and deployed during an active threat event?',
    levels: [
      { label: 'Unmanaged',   desc: 'Any security change requires manual approval from executive partners, taking weeks or months.' },
      { label: 'Reactive',    desc: 'Approvals route through multiple IT managers; critical fixes delayed by several days to a week.' },
      { label: 'Operational', desc: 'Pre-approved IT authorization to deploy critical software updates within a 48-hour window.' },
      { label: 'Managed',     desc: 'Fast-track approval process permits security remediations to execute within 24 hours.' },
      { label: 'Optimized',   desc: 'Security architecture authorized to execute real-time automated changes and block threats based on pre-defined policies.' },
    ],
  },
  {
    id: 'identityGating',
    name: 'Dimension 4: Identity Gating',
    short: 'Identity Gating',
    question: 'What mechanisms are utilized to authenticate and verify user and machine identities prior to accessing corporate data assets?',
    levels: [
      { label: 'Unmanaged',   desc: 'Simple single-factor passwords; accounts frequently shared across team members; no active MFA.' },
      { label: 'Reactive',    desc: 'MFA configured for primary corporate email; secondary SaaS applications rely solely on passwords.' },
      { label: 'Operational', desc: 'MFA enforced across core business tools, but applications allow direct login bypassing Single Sign-On.' },
      { label: 'Managed',     desc: 'Single Sign-On strictly enforced across all applications; direct credential login paths disabled.' },
      { label: 'Optimized',   desc: 'Zero Trust model continuously verifies every user, device, and connection path in real-time.' },
    ],
  },
  {
    id: 'recoveryDrills',
    name: 'Dimension 5: Recovery Drills',
    short: 'Recovery Drills',
    question: 'How frequently and comprehensively are system restoration procedures executed to validate business recovery capabilities?',
    levels: [
      { label: 'Unmanaged',   desc: 'Backups are not maintained, or the organization is unsure if existing backup jobs are running successfully.' },
      { label: 'Reactive',    desc: 'Backups are scheduled regularly, but a system restoration test has never been performed.' },
      { label: 'Operational', desc: 'Manual recovery drill performed once a year, confirming partial data restoration.' },
      { label: 'Managed',     desc: 'Comprehensive restore tests run quarterly; full system recovery validated within 24 hours.' },
      { label: 'Optimized',   desc: 'Automated monthly recovery drills prove complete business restoration achievable within hours.' },
    ],
  },
];

const ACTION_TRIGGERS = {
  visibility: {
    label: 'Visibility',
    immediate: 'Document all active physical servers, cloud databases, and SaaS tools in a central spreadsheet with assigned owners.',
    secondary: 'Audit active user license registries in M365 or Google Workspace to locate and disable orphaned accounts.',
    cis: 'CIS Control 1.1: Establish and Maintain Detailed Enterprise Asset Inventory',
  },
  toolingSpeed: {
    label: 'Tooling Speed',
    immediate: 'Enable automatic software updates across all endpoint operating systems and web browsers.',
    secondary: 'Deploy a basic external vulnerability scanner to monitor public-facing network addresses.',
    cis: 'CIS Control 7.1: Establish and Maintain a Vulnerability Management Process',
  },
  approvalSpeed: {
    label: 'Approval Speed',
    immediate: 'Adopt a written policy authorizing IT staff to deploy critical updates immediately during active threat alerts.',
    secondary: 'Set up a dedicated out-of-band communication channel (Teams/Slack) for emergency security approvals.',
    cis: 'CIS Control 17.1: Designate Personnel to Manage Incidents',
  },
  identityGating: {
    label: 'Identity Gating',
    immediate: 'Enforce multi-factor authentication (MFA) across all administrative, email, and financial systems.',
    secondary: 'Create a tenant rule within your identity provider to block all legacy authentication connections.',
    cis: 'CIS Control 6.3: Require Multi-Factor Authentication',
  },
  recoveryDrills: {
    label: 'Recovery Drills',
    immediate: 'Identify the three most critical data folders or business files required to keep the organization operational.',
    secondary: 'Establish regular, isolated copies of these files to an offline drive or secure cloud repository, updated weekly.',
    cis: 'CIS Control 11.1: Establish and Maintain a Data Recovery Process',
  },
};

const PROXY_METRICS = [
  {
    technical: 'CMDB Accuracy / Asset Coverage',
    proxy: 'Asset Knowledge',
    definition: 'The percentage of company-owned computers, mobile devices, and cloud services actively tracked.',
    impact: 'Untracked hardware and cloud databases operate as unmonitored entry points for autonomous attack agents.',
  },
  {
    technical: 'Mean Time to Recovery (MTTR)',
    proxy: 'Restoration Time',
    definition: 'The actual duration required to fully restore normal business operations following a major cyber incident.',
    impact: 'Directly impacts cash flow, business continuity, and contractual customer service level agreements.',
  },
  {
    technical: 'Mean Time to Contain (MTTC)',
    proxy: 'Containment Speed',
    definition: 'The time it takes to completely isolate a compromised user account or device to stop an attack from spreading.',
    impact: 'Determines the extent of lateral movement — separating a single device compromise from an enterprise-wide system lock.',
  },
  {
    technical: 'Patch Latency / Exploit Mitigation SLA',
    proxy: 'Fix Delay',
    definition: 'The average number of days between a security update being released and its actual installation across systems.',
    impact: 'Reflects the window of exposure; long delays invite automated tools to exploit known vulnerabilities.',
  },
  {
    technical: 'Conditional Access Policy Coverage',
    proxy: 'Identity Gating Strength',
    definition: 'The ratio of corporate applications and user accounts protected by multi-factor authentication and access controls.',
    impact: 'Measures susceptibility to credential theft; poor identity gating allows automated agents to bypass security perimeters.',
  },
];

/* Level color mapping */
const LEVEL_COLORS = [
  null,
  { bar: '#dc2626', text: '#dc2626' }, // L1
  { bar: '#d97706', text: '#d97706' }, // L2
  { bar: '#ca8a04', text: '#854d0e' }, // L3
  { bar: '#22c55e', text: '#166534' }, // L4
  { bar: '#16a34a', text: '#15803d' }, // L5
];

const LEVEL_NAMES = ['', 'Unmanaged', 'Reactive', 'Operational', 'Managed', 'Optimized'];
const BADGE_CLASSES = ['', 'lvl-1', 'lvl-2', 'lvl-3', 'lvl-4', 'lvl-5'];

let radarChart = null;

/* ===== RENDER ASSESSMENT ===== */

function renderAssessment() {
  const form = document.getElementById('assessment-form');
  form.innerHTML = DIMENSIONS.map((dim, i) => `
    <div class="dim-card" id="card-${dim.id}">
      <div class="dim-card-header">
        <div class="dim-num">${i + 1}</div>
        <div>
          <div class="dim-title">${dim.name}</div>
          <div class="dim-question">${dim.question}</div>
        </div>
      </div>
      <div class="dim-levels">
        ${dim.levels.map((lvl, li) => `
          <label class="level-row">
            <input type="radio" name="${dim.id}" value="${li + 1}">
            <div class="level-content">
              <div class="level-label-row">
                <span class="lvl-badge ${BADGE_CLASSES[li + 1]}">Level ${li + 1}</span>
                <span class="lvl-name">${lvl.label}</span>
              </div>
              <div class="lvl-desc">${lvl.desc}</div>
            </div>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  form.addEventListener('change', onFormChange);
}

function onFormChange(e) {
  if (e.target.type !== 'radio') return;
  const dimId = e.target.name;
  document.getElementById(`card-${dimId}`).classList.add('answered');
  const answered = countAnswered();
  document.getElementById('progress-count').textContent = `(${answered} / 5)`;
  document.getElementById('completion-hint').textContent =
    answered === 5 ? 'All dimensions answered. Ready to view results.' : `${5 - answered} dimension${5 - answered === 1 ? '' : 's'} remaining.`;
  document.getElementById('btn-results').disabled = answered < 5;
}

function countAnswered() {
  return DIMENSIONS.filter(d => document.querySelector(`input[name="${d.id}"]:checked`)).length;
}

function getScores() {
  const scores = {};
  DIMENSIONS.forEach(d => {
    const el = document.querySelector(`input[name="${d.id}"]:checked`);
    scores[d.id] = el ? parseInt(el.value, 10) : null;
  });
  return scores;
}

/* ===== RENDER RESULTS ===== */

function renderResults() {
  const scores = getScores();
  const vals   = DIMENSIONS.map(d => scores[d.id]);
  const avg    = vals.reduce((a, b) => a + b, 0) / vals.length;
  const avgStr = avg.toFixed(1);
  const tier   = Math.round(avg);

  /* Date */
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('result-date').textContent = `Assessment completed ${dateStr}`;
  document.getElementById('print-date').textContent  = `Generated ${dateStr}`;

  /* Overall */
  document.getElementById('oc-score').textContent = avgStr;
  document.getElementById('oc-score').style.color = LEVEL_COLORS[tier].bar;
  document.getElementById('oc-tier').textContent  = LEVEL_NAMES[tier];

  /* Dimension score bars */
  const scoreContainer = document.getElementById('dim-scores');
  scoreContainer.innerHTML = DIMENSIONS.map(dim => {
    const score = scores[dim.id];
    const pct   = (score / 5) * 100;
    const col   = LEVEL_COLORS[score];
    return `
      <div class="score-row">
        <div class="score-name">${dim.short}</div>
        <div class="score-bar-wrap">
          <div class="score-track">
            <div class="score-fill" style="width:${pct}%;background:${col.bar};"></div>
          </div>
        </div>
        <div class="score-label" style="color:${col.text};">L${score} — ${LEVEL_NAMES[score]}</div>
      </div>
    `;
  }).join('');

  /* Radar chart */
  if (radarChart) radarChart.destroy();
  const ctx = document.getElementById('radar-chart').getContext('2d');
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: DIMENSIONS.map(d => d.short),
      datasets: [{
        label: 'Maturity Level',
        data: vals,
        backgroundColor: 'rgba(37,99,235,0.10)',
        borderColor: 'rgba(37,99,235,0.80)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(37,99,235,1)',
        pointRadius: 5,
      }],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: { stepSize: 1, font: { size: 10 }, color: '#9ca3af', backdropColor: 'transparent' },
          grid:  { color: 'rgba(0,0,0,0.07)' },
          pointLabels: { font: { size: 11, weight: '600' }, color: '#1e3a5f' },
        },
      },
      plugins: { legend: { display: false } },
    },
  });

  /* Action triggers */
  const lowDims = DIMENSIONS.filter(d => scores[d.id] <= 2);
  const triggersEl = document.getElementById('action-triggers');
  if (lowDims.length > 0) {
    triggersEl.classList.remove('hidden');
    document.getElementById('trigger-cards').innerHTML = lowDims.map(dim => {
      const t = ACTION_TRIGGERS[dim.id];
      return `
        <div class="trigger-card">
          <div class="trigger-card-top">
            <span class="trigger-dim-badge">Level ${scores[dim.id]} — Action Required</span>
            <h4>${t.label}</h4>
          </div>
          <div class="trigger-steps">
            <div class="trigger-step">
              <div class="step-label">Immediate Action</div>
              <p>${t.immediate}</p>
            </div>
            <div class="trigger-step">
              <div class="step-label">Secondary Step</div>
              <p>${t.secondary}</p>
            </div>
          </div>
          <div class="trigger-cis">${t.cis}</div>
        </div>
      `;
    }).join('');
  } else {
    triggersEl.classList.add('hidden');
  }

  /* Show results section */
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

/* ===== RENDER PROXY METRICS TABLE ===== */

function renderProxyTable() {
  document.getElementById('proxy-table').innerHTML = `
    <thead>
      <tr>
        <th>Technical Metric</th>
        <th>Proxy Metric (Board Language)</th>
        <th>Plain-Language Definition</th>
        <th>Business Risk &amp; Impact</th>
      </tr>
    </thead>
    <tbody>
      ${PROXY_METRICS.map(m => `
        <tr>
          <td>${m.technical}</td>
          <td><span class="proxy-name">${m.proxy}</span></td>
          <td>${m.definition}</td>
          <td>${m.impact}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

/* ===== PRINT HANDLING ===== */
/* Convert canvas to img for reliable print rendering */

let printImg = null;

window.addEventListener('beforeprint', () => {
  if (!radarChart) return;
  printImg = document.createElement('img');
  printImg.src = radarChart.toBase64Image('image/png', 1);
  printImg.id  = 'radar-print-img';
  printImg.style.cssText = 'width:100%;display:block;';
  const canvas = document.getElementById('radar-chart');
  canvas.style.display = 'none';
  canvas.parentElement.appendChild(printImg);
});

window.addEventListener('afterprint', () => {
  if (printImg) { printImg.remove(); printImg = null; }
  const canvas = document.getElementById('radar-chart');
  if (canvas) canvas.style.display = '';
});

/* ===== RETAKE ===== */

function retakeAssessment() {
  document.getElementById('results').classList.add('hidden');
  document.querySelectorAll('#assessment-form input[type="radio"]').forEach(r => { r.checked = false; });
  document.querySelectorAll('.dim-card').forEach(c => c.classList.remove('answered'));
  document.getElementById('btn-results').disabled = true;
  document.getElementById('progress-count').textContent = '(0 / 5)';
  document.getElementById('completion-hint').textContent = 'Answer all 5 dimensions to view your results.';
  if (radarChart) { radarChart.destroy(); radarChart = null; }
  document.getElementById('assessment').scrollIntoView({ behavior: 'smooth' });
}

/* ===== INIT ===== */

function init() {
  renderAssessment();
  renderProxyTable();

  document.getElementById('btn-results').addEventListener('click', renderResults);
  document.getElementById('btn-print').addEventListener('click', () => window.print());
  document.getElementById('btn-retake').addEventListener('click', retakeAssessment);
}

document.addEventListener('DOMContentLoaded', init);
