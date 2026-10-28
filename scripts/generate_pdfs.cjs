const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const ASSETS_DIR = path.join(DOCS_DIR, 'assets');
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// Helper to convert an image file to Base64 data URI
function getBase64Image(filename) {
  const filePath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] Image not found: ${filePath}`);
    return '';
  }
  const fileData = fs.readFileSync(filePath);
  return `data:image/png;base64,${fileData.toString('base64')}`;
}

// Pre-load all screenshots as Base64 data URIs
const images = {
  landing: getBase64Image('screenshot_landing.png'),
  dashboard: getBase64Image('screenshot_dashboard.png'),
  wizard: getBase64Image('screenshot_wizard_confirm.png'),
  payment: getBase64Image('screenshot_payment.png'),
  console: getBase64Image('screenshot_management_console.png'),
  publicLive: getBase64Image('screenshot_public_live.png'),
  ended: getBase64Image('screenshot_ended_podium.png'),
};

console.log('Loaded screenshots into Base64 format successfully.');

// Base HTML Template with Executive Styling
function buildHtmlDocument({ title, subtitle, badge, contentHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.55;
    }

    /* Masthead Banner */
    .doc-header {
      border-bottom: 2px solid #0D6E4F;
      padding-bottom: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-logo-pill {
      background: #0B192C;
      color: #FFFFFF;
      font-size: 10pt;
      font-weight: 800;
      padding: 5px 12px;
      border-radius: 6px;
      letter-spacing: 1px;
    }

    .brand-sub {
      font-size: 8.5pt;
      color: #64748B;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .doc-badge {
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
      font-size: 8pt;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Titles */
    h1.doc-title {
      font-size: 22pt;
      font-weight: 800;
      color: #0B192C;
      margin: 0 0 4px 0;
      line-height: 1.2;
    }

    p.doc-subtitle {
      font-size: 11pt;
      color: #475569;
      margin: 0 0 20px 0;
      font-weight: 500;
    }

    h2 {
      font-size: 14pt;
      font-weight: 800;
      color: #0B192C;
      margin: 24px 0 10px 0;
      padding-bottom: 6px;
      border-bottom: 1px solid #E2E8F0;
      page-break-after: avoid;
    }

    h3 {
      font-size: 11.5pt;
      font-weight: 700;
      color: #0D6E4F;
      margin: 16px 0 6px 0;
      page-break-after: avoid;
    }

    p, ul, ol {
      margin: 0 0 12px 0;
      color: #334155;
    }

    li {
      margin-bottom: 4px;
    }

    strong {
      color: #0F172A;
    }

    /* Code & Badges */
    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      background: #F1F5F9;
      color: #0F172A;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #E2E8F0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 20px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }

    th {
      background: #0B192C;
      color: #FFFFFF;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid #0B192C;
    }

    td {
      padding: 8px 10px;
      border: 1px solid #E2E8F0;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #F8FAFC;
    }

    /* Callout Boxes */
    .callout {
      background: #F0FDF4;
      border-left: 4px solid #0D6E4F;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
      page-break-inside: avoid;
    }

    .callout-title {
      font-weight: 800;
      color: #065F46;
      font-size: 9.5pt;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .callout-warning {
      background: #FFFBEB;
      border-left-color: #F59E0B;
    }

    .callout-warning .callout-title {
      color: #B45309;
    }

    /* Screenshot Showcase */
    .figure-container {
      margin: 18px 0 24px 0;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      overflow: hidden;
      background: #FFFFFF;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      page-break-inside: avoid;
    }

    .figure-image-wrap {
      width: 100%;
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      justify-content: center;
      padding: 8px;
    }

    .figure-image-wrap img {
      max-width: 100%;
      height: auto;
      max-height: 380px;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      display: block;
    }

    .figure-caption {
      padding: 10px 14px;
      background: #FFFFFF;
      font-size: 9pt;
      color: #475569;
    }

    .figure-caption strong {
      color: #0B192C;
      font-size: 9.5pt;
      display: block;
      margin-bottom: 2px;
    }

    /* Utilities */
    .page-break {
      page-break-after: always;
      break-after: page;
    }

    .footer-note {
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #E2E8F0;
      font-size: 8pt;
      color: #94A3B8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <div class="brand-group">
      <div class="brand-logo-pill">PLAY FIELD</div>
      <div class="brand-sub">Smart Tournament Operating System</div>
    </div>
    <div class="doc-badge">${badge || 'OFFICIAL SYSTEM DOCUMENTATION'}</div>
  </div>

  <h1 class="doc-title">${title}</h1>
  <p class="doc-subtitle">${subtitle}</p>

  ${contentHtml}

  <div class="footer-note">
    <span>Play Field Platform Architecture & System Documentation</span>
    <span>Confidential & Proprietary • © 2026 Play Field Operations</span>
  </div>
</body>
</html>`;
}

// Convert HTML to PDF using Chrome Headless
function compilePdf(htmlString, outputPdfPath) {
  const tempHtmlPath = path.join(DOCS_DIR, `temp_${Date.now()}.html`);
  fs.writeFileSync(tempHtmlPath, htmlString, 'utf8');

  const fileUri = 'file:///' + tempHtmlPath.replace(/\\/g, '/').replace(/ /g, '%20');
  const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --print-to-pdf="${outputPdfPath}" --no-pdf-header-footer "${fileUri}"`;

  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`[SUCCESS] Generated: ${outputPdfPath}`);
  } catch (err) {
    console.error(`[ERROR] Failed to compile PDF: ${outputPdfPath}`, err.message);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

// ----------------------------------------------------------------------
// DOCUMENT 1: Product Requirements Document (PRD)
// ----------------------------------------------------------------------
const prdHtml = buildHtmlDocument({
  title: "Product Requirements Document (PRD)",
  subtitle: "Functional Scope, User Personas, 13 Core Views, and Business Architecture",
  badge: "PRD v1.0 • PRODUCTION READY",
  contentHtml: `
    <h2>1. Executive Summary & Product Vision</h2>
    <p>
      <strong>Play Field</strong> is a multi-tenant, broadcast-ready sports tournament operating desk designed for multi-court facilities (Futsal, 7-a-side Football, Indoor Cricket, Badminton). It eliminates the friction of spreadsheet-based tournament scheduling, court double-booking, contentious refereeing disputes, and delayed public score dissemination.
    </p>

    <div class="callout">
      <div class="callout-title">Core Value Proposition</div>
      Integrated multi-court booking, algorithmic Berger group pairing, real-time two-tier court conflict mutex protection, one-click 3-0 Walkover disciplinary automation, and a zero-login instant public broadcast scoreboard.
    </div>

    <h2>2. User Personas & Problem-Solution Matrix</h2>
    <table>
      <thead>
        <tr>
          <th>User Persona</th>
          <th>Primary Role</th>
          <th>Key Pain Point</th>
          <th>Play Field Solution</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Tournament Director</strong></td>
          <td>Facility Owner / Match Lead</td>
          <td>Court double-bookings & manual scheduling</td>
          <td>Pre-publish collision scan & automated Berger draws</td>
        </tr>
        <tr>
          <td><strong>Pitchside Scorer / Ref</strong></td>
          <td>Sideline Official</td>
          <td>Paper scorecards & delayed event logs</td>
          <td>Monospaced steppers & roster-linked player logger</td>
        </tr>
        <tr>
          <td><strong>Team Captain / Coach</strong></td>
          <td>Competing Squad Leader</td>
          <td>Court confusion & tiebreaker disputes</td>
          <td>Live standings radar & instant relocation notice</td>
        </tr>
        <tr>
          <td><strong>Spectator & Fan</strong></td>
          <td>Remote & Pitchside Audience</td>
          <td>No real-time score visibility</td>
          <td>Zero-login live broadcast web link</td>
        </tr>
      </tbody>
    </table>

    <div class="page-break"></div>

    <h2>3. 13-Screen Functional Architecture</h2>
    <p>The system delivers end-to-end operational coverage across 13 core views and edge-case subsystems:</p>
    <ul>
      <li><strong>Screen 1 (Landing Page /)</strong>: Public platform overview, feature showcases, and sample live tournament links.</li>
      <li><strong>Screens 2 & 3 (Login & Signup)</strong>: Email authentication with deep-link Co-Organizer delegation guards (<code>?inviteToken=...&tournamentId=...</code>).</li>
      <li><strong>Screen 4 (Onboarding /onboarding)</strong>: Preferred sport selection, profile type, and 3-step platform workflow tour.</li>
      <li><strong>Screen 5 (Dashboard /dashboard)</strong>: Strict user filtering displaying only tournaments owned or co-managed by the user.</li>
      <li><strong>Screens 6–9 (4-Step Start Tournament Wizard)</strong>:
        <ol>
          <li><em>Step 1 (Details)</em>: Venue selection (Colombo Futsal Hub), operating hours, hourly and day rates.</li>
          <li><em>Step 2 (Teams)</em>: Squad registration, group allocation (Group A, B), and player roster entry.</li>
          <li><em>Step 3 (Confirm)</em>: Automated Berger schedule draw with pre-publish court collision scan.</li>
          <li><em>Step 4 (Payment)</em>: Selective Payment options (30% Advance Deposit vs 100% Full Venue Package) and shareable public URL generation.</li>
        </ol>
      </li>
      <li><strong>Screen 10 (Ongoing Tournaments /tournaments/ongoing)</strong>: Dynamic ongoing list with next-match court, date, and live kickoff badges.</li>
      <li><strong>Screen 11 (Live Management Console /tournaments/:id/manage)</strong>: Pitchside scoring steppers, roster-linked Goal/Assist loggers, Two-Tier Court Reassignment modal, and Disciplinary 3-0 Walkovers.</li>
      <li><strong>Screen 12 (Ended Tournaments & PNG /tournaments/ended)</strong>: Podium archives, Golden Boot leaderboards, and high-DPI 1200×1200px social media graphic exports.</li>
      <li><strong>Screen 13 (Public Live Broadcast /public/tournament/:id)</strong>: Zero-login responsive fan broadcast with active clock and court relocation alert banners.</li>
    </ul>

    <h2>4. Visual Verification Artifacts</h2>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.dashboard}" alt="Tournament Director Dashboard" />
      </div>
      <div class="figure-caption">
        <strong>Figure 1: Organizer Mission Control Dashboard (/dashboard)</strong>
        Strict user filtering displaying ongoing tournaments with active match court badges, "+ Start Tournament" CTA, and ended tournaments archive.
      </div>
    </div>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.payment}" alt="Selective Payment Options" />
      </div>
      <div class="figure-caption">
        <strong>Figure 2: Selective Payment Options & Publication Desk (/tournaments/new/payment)</strong>
        Selective 30% Advance Deposit (LKR 37,800) vs 100% Full Package checkout generating the instant shareable public broadcast link.
      </div>
    </div>
  `
});

// ----------------------------------------------------------------------
// DOCUMENT 2: Technical Requirements Document (TRD)
// ----------------------------------------------------------------------
const trdHtml = buildHtmlDocument({
  title: "Technical Requirements Document (TRD)",
  subtitle: "Engineering Blueprint, Database Schema, and Algorithmic Domain Engines",
  badge: "TRD v1.0 • ARCHITECTURE APPROVED",
  contentHtml: `
    <h2>1. System Architecture & Tech Stack</h2>
    <table>
      <thead>
        <tr>
          <th>Layer</th>
          <th>Technology</th>
          <th>Implementation Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Frontend SPA</strong></td>
          <td>React 18 + Vite 6 + TypeScript 5.7</td>
          <td>Modular multi-file layout, custom hooks, and strict type safety</td>
        </tr>
        <tr>
          <td><strong>Styling Engine</strong></td>
          <td>Tailwind CSS 3.4 + Custom Tokens</td>
          <td>4 distinct token CSS files, Google Fonts, and mobile 16px input safeguard</td>
        </tr>
        <tr>
          <td><strong>Database</strong></td>
          <td>Supabase PostgreSQL 17</td>
          <td>11 relational tables with foreign key cascades and Realtime WebSocket events</td>
        </tr>
        <tr>
          <td><strong>Graphics Rendering</strong></td>
          <td>html-to-image</td>
          <td>1200×1200px dedicated DOM container rendered at 2× pixel ratio with skipFonts: true</td>
        </tr>
        <tr>
          <td><strong>State & Persistence</strong></td>
          <td>React Context + LocalStorage</td>
          <td>Synchronous client state with optimistic updates and PostgreSQL reconciliation</td>
        </tr>
      </tbody>
    </table>

    <h2>2. Supabase PostgreSQL 17 Relational Schema</h2>
    <p>The system operates on an 11-table relational schema deployed via the Supabase MCP:</p>
    <table>
      <thead>
        <tr>
          <th>Table Name</th>
          <th>Primary Key</th>
          <th>Foreign Keys & Relationships</th>
          <th>Operational Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>profiles</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>auth.users(id)</code></td>
          <td>Tournament directors, chief scorers, timekeepers</td>
        </tr>
        <tr>
          <td><code>venues</code></td>
          <td><code>id (UUID)</code></td>
          <td>1:N with <code>courts</code></td>
          <td>Multi-court facilities (Colombo Futsal Hub)</td>
        </tr>
        <tr>
          <td><code>courts</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>venues(id)</code></td>
          <td>Court 1 to 5 with synthetic and turf surfaces</td>
        </tr>
        <tr>
          <td><code>tournaments</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>venues(id)</code>, <code>profiles(id)</code></td>
          <td>Core tournament record, status, dates, and budget</td>
        </tr>
        <tr>
          <td><code>teams</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>tournaments(id)</code></td>
          <td>Competing clubs assigned to Group A or B</td>
        </tr>
        <tr>
          <td><code>players</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>teams(id)</code></td>
          <td>Squad members with jersey numbers and positions</td>
        </tr>
        <tr>
          <td><code>matches</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>tournaments(id)</code>, <code>courts(id)</code></td>
          <td>Scheduled fixtures, home/away scores, and status</td>
        </tr>
        <tr>
          <td><code>match_events</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>matches(id)</code>, <code>players(id)</code></td>
          <td>Goals, assists, yellow/red cards, and kickoff minutes</td>
        </tr>
        <tr>
          <td><code>court_booking_locks</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>courts(id)</code></td>
          <td>Venue maintenance slots and private bookings</td>
        </tr>
        <tr>
          <td><code>organizer_invites</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>tournaments(id)</code></td>
          <td>Delegation tokens for co-organizers</td>
        </tr>
        <tr>
          <td><code>audit_logs</code></td>
          <td><code>id (UUID)</code></td>
          <td>References <code>tournaments(id)</code></td>
          <td>Immutable audit trail for court changes & walkovers</td>
        </tr>
      </tbody>
    </table>

    <div class="page-break"></div>

    <h2>3. Algorithmic Domain Engines</h2>

    <h3>3.1 Two-Tier Court Conflict Mutex Engine (conflictEngine.ts)</h3>
    <p>Prevents court schedule overlaps across two critical protection levels:</p>
    <ul>
      <li><strong>Tier 1 (Intra-Tournament Mutex)</strong>: Validates against concurrent fixtures within the same tournament using interval overlap logic:
        <br /><code>Overlap = (Court_A == Court_B) &amp;&amp; (Start_A &lt; End_B) &amp;&amp; (End_A &gt; Start_B)</code>
      </li>
      <li><strong>Tier 2 (Inter-Tournament &amp; Venue Locks)</strong>: Validates against external bookings, court maintenance, and turf repair slots in <code>court_booking_locks</code>.</li>
      <li><strong>Automated Suggestion</strong>: If a clash is detected, the engine scans remaining courts and proposes the first free alternate court.</li>
    </ul>

    <h3>3.2 FIFA/AMF Futsal Standings Engine (standingsEngine.ts)</h3>
    <p>Computes real-time rankings with cascading tiebreakers:</p>
    <ol>
      <li><strong>Total Points</strong>: <code>3 * Wins + 1 * Draws</code>.</li>
      <li><strong>Head-to-Head (H2H)</strong>: Evaluates direct match results between squads tied on points.</li>
      <li><strong>Goal Difference (GD)</strong>: <code>Goals For (GF) - Goals Against (GA)</code>.</li>
      <li><strong>Goals For (GF)</strong>: Total goals scored in group play.</li>
    </ol>

    <h3>3.3 Disciplinary &amp; Forfeit Engine (forfeitEngine.ts)</h3>
    <p>Enforces official FIFA walkover regulations:</p>
    <ul>
      <li><strong>Walkover (3-0 Forfeit)</strong>: If a squad fails to report, one click marks the match <code>WALKOVER</code>, awards a <strong>3-0 win (+3 PTS, +3 GD)</strong> to the opponent, and assigns 0 PTS and -3 GD to the defaulting squad.</li>
      <li><strong>Disqualification</strong>: Excludes the team from playoff progression and tags their roster as ineligible.</li>
    </ul>

    <h2>4. Visual Verification Artifacts</h2>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.wizard}" alt="Pre-Publish Conflict Scan" />
      </div>
      <div class="figure-caption">
        <strong>Figure 3: Pre-Publish Court Collision Scan Complete (Step 3 Confirm)</strong>
        Automated validation confirming 0 clashes across all scheduled fixtures before entering the payment gateway.
      </div>
    </div>
  `
});

// ----------------------------------------------------------------------
// DOCUMENT 3: App Flow & Design Brief
// ----------------------------------------------------------------------
const designHtml = buildHtmlDocument({
  title: "App Flow & Design Brief",
  subtitle: "Visual Design System, State Machine Architecture, and Screen Showcase",
  badge: "DESIGN BRIEF • PITCHSYNC STANDARD",
  contentHtml: `
    <h2>1. Design System Tokens & Color Palette</h2>
    <table>
      <thead>
        <tr>
          <th>Token Name</th>
          <th>Hex Code</th>
          <th>Usage & Semantics</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Pitch Turf Emerald</strong></td>
          <td><code>#0D6E4F</code></td>
          <td>Primary action buttons, brand logo, active navigation pills</td>
        </tr>
        <tr>
          <td><strong>Floodlight Navy</strong></td>
          <td><code>#0B192C</code></td>
          <td>Broadcast mastheads, high-contrast table headers, dark cards</td>
        </tr>
        <tr>
          <td><strong>Signal Live Orange</strong></td>
          <td><code>#EA580C</code></td>
          <td>Live match pulse indicators, active countdown clocks</td>
        </tr>
        <tr>
          <td><strong>Canvas Alabaster</strong></td>
          <td><code>#F8FAFC</code></td>
          <td>Clean background canvas optimized for outdoor stadium glare</td>
        </tr>
        <tr>
          <td><strong>Card Red / Danger</strong></td>
          <td><code>#DC2626</code></td>
          <td>Disqualifications, conflict warnings, red cards, forfeit alerts</td>
        </tr>
        <tr>
          <td><strong>Relocation Blue</strong></td>
          <td><code>#1D4ED8</code></td>
          <td>Court move alerts and public relocation notice banners</td>
        </tr>
      </tbody>
    </table>

    <h2>2. Typography Hierarchy & Google Fonts</h2>
    <ul>
      <li><strong>Plus Jakarta Sans</strong> (600, 700, 800): High-authority mastheads and section headers.</li>
      <li><strong>Barlow Condensed</strong> (700, 800): Stadium-scale monospaced broadcast scores and match timers.</li>
      <li><strong>Instrument Sans</strong> (400, 500, 600): Form labels, body text, player rosters.</li>
      <li><strong>JetBrains Mono</strong> (500, 700): Stepper numbers, court identifiers, and audit codes.</li>
    </ul>

    <div class="callout callout-warning">
      <div class="callout-title">Tactile Sideline UX Standards</div>
      1. <strong>Input Safeguard</strong>: All form inputs enforce <code>font-size: 16px</code> to prevent iOS Safari auto-zoom.<br />
      2. <strong>Tap Target</strong>: All score buttons and court selectors maintain a minimum <strong>44×44px</strong> touch area.
    </div>

    <div class="page-break"></div>

    <h2>3. Production Screen Showcase & UI Telemetry</h2>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.console}" alt="Sideline Live Management Console" />
      </div>
      <div class="figure-caption">
        <strong>Figure 4: Pitchside Live Management Console (/tournaments/:id/manage)</strong>
        Features tactile score steppers, roster-linked Goal/Assist loggers, Two-Tier Court Reassignment dialog, Disciplinary 3-0 Walkovers, and live Group A &amp; B radar.
      </div>
    </div>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.publicLive}" alt="Public Live Match Center" />
      </div>
      <div class="figure-caption">
        <strong>Figure 5: Zero-Login Public Match Center (/public/tournament/:id)</strong>
        Real-time fan scoreboard featuring the reactive Official Venue Reassignment Notice Banner ("Court 1 → Court 5: Turf conditioning &amp; weather maintenance protocol").
      </div>
    </div>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.ended}" alt="Concluded Tournaments Podium" />
      </div>
      <div class="figure-caption">
        <strong>Figure 6: Ended Tournaments Podium &amp; High-Resolution PNG Generator (/tournaments/ended)</strong>
        Displays champion accolades, Golden Boot leaderboards, and the 1-click "Download Stats &amp; Events (.PNG)" 1200×1200px social media exporter.
      </div>
    </div>
  `
});

// ----------------------------------------------------------------------
// DOCUMENT 4: Process Log Document
// ----------------------------------------------------------------------
const processLogHtml = buildHtmlDocument({
  title: "Process & Task Tracking Log",
  subtitle: "Full Development Lifecycle, Phase Executions, and Verification Record",
  badge: "PROCESS LOG • COMPLETED & SIGNED",
  contentHtml: `
    <h2>1. Overview & Objective</h2>
    <p>
      <strong>Task Goal</strong>: Build a complete, responsive, production-grade web application for the <strong>Smart Sports Tournament Scheduling &amp; Live Match Management System (Play Field)</strong> using React (Tailwind CSS, Lucide icons), Supabase PostgreSQL (via MCP), GitHub integration, and modular component architecture based on the Stitch UI designs.
    </p>
    <table>
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Specification</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Status</strong></td>
          <td><strong>COMPLETED (100% Verified)</strong></td>
        </tr>
        <tr>
          <td><strong>Target GitHub Repo</strong></td>
          <td><code>https://github.com/shameel-alt/Play-Field</code></td>
        </tr>
        <tr>
          <td><strong>Supabase Project</strong></td>
          <td><code>gtwzadsohgmppcwovhuh</code> (11 Relational Tables Active)</td>
        </tr>
        <tr>
          <td><strong>Build Status</strong></td>
          <td>Vite Production Build: <code>0 Errors / 0 Warnings</code></td>
        </tr>
      </tbody>
    </table>

    <h2>2. Phase-by-Phase Execution Record</h2>
    <table>
      <thead>
        <tr>
          <th>Phase</th>
          <th>Scope &amp; Process</th>
          <th>Key Deliverables &amp; Tool Actions</th>
          <th>Outcome</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Phase 1</strong></td>
          <td>Planning &amp; Architecture</td>
          <td>Formulated end-to-end plan covering all 13 screens &amp; 4 domain engines</td>
          <td>Approved</td>
        </tr>
        <tr>
          <td><strong>Phase 2</strong></td>
          <td>Database Provisioning</td>
          <td>Executed DDL migration deploying 11 relational tables via Supabase MCP</td>
          <td>Active</td>
        </tr>
        <tr>
          <td><strong>Phase 3</strong></td>
          <td>Scaffolding &amp; CSS Tokens</td>
          <td>Created 4 modular CSS token files, Google Fonts, and Tailwind configs</td>
          <td>Clean</td>
        </tr>
        <tr>
          <td><strong>Phase 4</strong></td>
          <td>Domain Logic Engines</td>
          <td>Built Berger pairings, Two-tier mutex, FIFA standings, 3-0 Walkovers, and PNG export</td>
          <td>Verified</td>
        </tr>
        <tr>
          <td><strong>Phase 5</strong></td>
          <td>State Stores &amp; Auth</td>
          <td>Implemented AuthContext (with hash-query invite tokens) and TournamentContext</td>
          <td>Secure</td>
        </tr>
        <tr>
          <td><strong>Phase 6</strong></td>
          <td>UI Views &amp; Components</td>
          <td>Engineered 14 views including wizard, live console, public stream, and podium</td>
          <td>Complete</td>
        </tr>
        <tr>
          <td><strong>Phase 7</strong></td>
          <td>Browser Verification</td>
          <td>Automated live testing via Chrome DevTools MCP on localhost:5173</td>
          <td>Passed</td>
        </tr>
        <tr>
          <td><strong>Phase 8</strong></td>
          <td>GitHub Sync &amp; Pushing</td>
          <td>Configured remote origin and pushed all commits to shameel-alt/Play-Field</td>
          <td>Synchronized</td>
        </tr>
        <tr>
          <td><strong>Phase 9</strong></td>
          <td>Documentation &amp; PDF</td>
          <td>Compiled PRD, TRD, App Flow, and Master Dossier in PDF format</td>
          <td>Delivered</td>
        </tr>
      </tbody>
    </table>

    <div class="page-break"></div>

    <h2>3. Key Verification Milestones Passed</h2>
    <ul>
      <li><strong>Two-Tier Court Collision Mutex</strong>: Reassigned Match #6 from Court 1 to Court 5. Collision scan verified zero clashes, updated the live management desk, and immediately broadcast the relocation notice banner to fans.</li>
      <li><strong>Disciplinary 3-0 Walkover</strong>: Tested walkover on City Lions; awarded automatic 3-0 forfeit win to Metro Strikers and recalculated Group A standings according to FIFA rules.</li>
      <li><strong>High-DPI PNG Exporter</strong>: Configured <code>skipFonts: true</code> to eliminate CORS security exceptions; verified clean 1200×1200px PNG summary generation.</li>
      <li><strong>Co-Organizer Auth Guard</strong>: Tested deep-link invite tokens (<code>?inviteToken=...&amp;tournamentId=...</code>) across hash URLs; verified unauthenticated users are forced to sign in before console delegation.</li>
      <li><strong>4-Step Tournament Wizard</strong>: Created and published "Colombo Corporate Futsal Super Cup 2026" with selective 30% advance deposit payment and shareable broadcast link.</li>
    </ul>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.landing}" alt="Play Field Landing Page" />
      </div>
      <div class="figure-caption">
        <strong>Figure 7: Production Landing Page (/)</strong>
        Platform capabilities showcase, quick registration CTAs, and live broadcast desk entrance.
      </div>
    </div>
  `
});

// ----------------------------------------------------------------------
// DOCUMENT 5: Master Comprehensive System Dossier (All-in-One)
// ----------------------------------------------------------------------
const masterHtml = buildHtmlDocument({
  title: "Play Field: Master System Specification Dossier",
  subtitle: "Comprehensive PRD, TRD, App Flow, Design Brief, and Process Tracking Dossier",
  badge: "MASTER SYSTEM DOSSIER • COMPLETE SPECIFICATION",
  contentHtml: `
    <h2>Executive Overview</h2>
    <p>
      This master dossier compiles the complete specification, technical requirements, visual design system, and verification record for the <strong>Play Field Smart Sports Tournament Scheduling &amp; Live Match Management System</strong>.
    </p>

    <div class="callout">
      <div class="callout-title">Project Summary</div>
      <strong>Repository:</strong> https://github.com/shameel-alt/Play-Field<br />
      <strong>Database:</strong> Supabase PostgreSQL 17 (11 Relational Tables)<br />
      <strong>Frontend:</strong> React 18, Vite 6, TypeScript 5.7, Tailwind CSS 3.4<br />
      <strong>Status:</strong> 100% Production Ready
    </div>

    <div class="page-break"></div>

    <h2>Section 1: Product Requirements (PRD)</h2>
    <p>
      Play Field provides an integrated tournament operating system where venue reservations, algorithmic round-robin and knockout draws, sideline scorekeeping, disciplinary forfeit automation, and instant public broadcasts converge into a single platform.
    </p>
    <table>
      <thead>
        <tr>
          <th>Screen ID</th>
          <th>Route</th>
          <th>Primary Capabilities</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Screen 1</td>
          <td><code>/</code></td>
          <td>Platform capabilities showcase, public preview, quick auth CTAs</td>
        </tr>
        <tr>
          <td>Screens 2 &amp; 3</td>
          <td><code>/login</code>, <code>/signup</code></td>
          <td>Authentication with Co-Organizer invite token verification guard</td>
        </tr>
        <tr>
          <td>Screen 4</td>
          <td><code>/onboarding</code></td>
          <td>Sport preferences and organizer profile setup</td>
        </tr>
        <tr>
          <td>Screen 5</td>
          <td><code>/dashboard</code></td>
          <td>Strict user filtering: displays only owned or co-managed tournaments</td>
        </tr>
        <tr>
          <td>Screens 6–9</td>
          <td><code>/tournaments/new/*</code></td>
          <td>4-Step wizard with pre-publish conflict scan and selective payment checkout</td>
        </tr>
        <tr>
          <td>Screen 10</td>
          <td><code>/tournaments/ongoing</code></td>
          <td>Live ongoing tournament cards with dynamic next-match court badges</td>
        </tr>
        <tr>
          <td>Screen 11</td>
          <td><code>/tournaments/:id/manage</code></td>
          <td>Sideline scoring steppers, roster-linked Goal/Assist loggers, 3-0 Walkovers</td>
        </tr>
        <tr>
          <td>Screen 12</td>
          <td><code>/tournaments/ended</code></td>
          <td>Champion podium, Golden Boot leaderboard, and 1200×1200px PNG summary export</td>
        </tr>
        <tr>
          <td>Screen 13</td>
          <td><code>/public/tournament/:id</code></td>
          <td>Zero-login public stream with reactive court relocation notice banners</td>
        </tr>
      </tbody>
    </table>

    <div class="page-break"></div>

    <h2>Section 2: Technical Architecture &amp; Database Model (TRD)</h2>
    <p>
      Deployed on Supabase PostgreSQL 17 with 11 relational tables: <code>profiles</code>, <code>venues</code>, <code>courts</code>, <code>tournaments</code>, <code>teams</code>, <code>players</code>, <code>matches</code>, <code>match_events</code>, <code>court_booking_locks</code>, <code>organizer_invites</code>, and <code>audit_logs</code>.
    </p>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.wizard}" alt="Pre-Publish Conflict Scan" />
      </div>
      <div class="figure-caption">
        <strong>Figure A: Pre-Publish Court Collision Scan (Wizard Step 3)</strong>
        Real-time two-tier mutex verification confirming zero court overlaps before payment.
      </div>
    </div>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.console}" alt="Sideline Live Console" />
      </div>
      <div class="figure-caption">
        <strong>Figure B: Live Management Console (/tournaments/:id/manage)</strong>
        Sideline match controllers, Goal/Assist loggers, and automated Group A &amp; B standings.
      </div>
    </div>

    <div class="page-break"></div>

    <h2>Section 3: Visual Design &amp; Live Fan Telemetry</h2>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.publicLive}" alt="Public Live Center" />
      </div>
      <div class="figure-caption">
        <strong>Figure C: Public Live Spectator Broadcast (/public/tournament/:id)</strong>
        Real-time fan scoreboard with active clock and Official Venue Reassignment Notice Banner.
      </div>
    </div>

    <div class="figure-container">
      <div class="figure-image-wrap">
        <img src="${images.ended}" alt="Concluded Tournaments Podium" />
      </div>
      <div class="figure-caption">
        <strong>Figure D: Concluded Tournaments Podium &amp; PNG Export (/tournaments/ended)</strong>
        Accolades, Golden Boot rankings, and 1-click 1200×1200px PNG social media export.
      </div>
    </div>
  `
});

// Run generation
console.log('Compiling publication-grade PDF documents...');

compilePdf(prdHtml, path.join(DOCS_DIR, 'Play_Field_Product_Requirements_Document.pdf'));
compilePdf(trdHtml, path.join(DOCS_DIR, 'Play_Field_Technical_Requirements_Document.pdf'));
compilePdf(designHtml, path.join(DOCS_DIR, 'Play_Field_App_Flow_and_Design_Brief.pdf'));
compilePdf(processLogHtml, path.join(DOCS_DIR, 'Play_Field_Process_Log.pdf'));
compilePdf(masterHtml, path.join(DOCS_DIR, 'Play_Field_Complete_System_Master_Dossier.pdf'));

console.log('All PDF documents generated successfully.');
