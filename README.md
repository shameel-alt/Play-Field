# Play Field ⚽
### Smart Sports Tournament Scheduling & Live Match Management System

Play Field is a responsive, production-grade tournament operating system designed for multi-court sports facilities, pitchside directors, referees, and competing clubs.

---

## 🌟 Key Capabilities

1. **Integrated Venue & Court Allocation**:
   - Multi-court support (Court 1 through Court 5, including FIFA Pro Turf Arenas, Taraflex Synthetic, and Hardcourts).
   - Hourly and full-day tournament package rates.
2. **Algorithmic Round-Robin & Knockout Generator**:
   - Berger algorithm for group stage draws with fair home/away rotation.
   - Automated Single Elimination knockout brackets (Quarter-Finals $\rightarrow$ Semi-Finals $\rightarrow$ Grand Final).
3. **Two-Tier Court Conflict Mutex Protection**:
   - **Tier 1 (Intra-Tournament)**: Real-time prevention of fixture overlaps on the same court.
   - **Tier 2 (Inter-Tournament / Venue-Wide)**: Real-time validation against external locks & maintenance slots with automated suggestion of alternate free courts.
4. **Sideline Scoring & Player Telemetry**:
   - Monospaced high-contrast score steppers (`- / +`).
   - Granular event logging: Goal Scorer, Primary Assist, and Kickoff Minute tied directly to registered team rosters.
5. **Disciplinary & Automated Group Progression**:
   - Official Walkover (`WALKOVER`) command: Awards automatic 3-0 forfeit win to opponent, logs immutable audit telemetry, and updates standings.
   - Disqualification (`DISQUALIFIED`) directive: Immediately freezes roster eligibility and removes team from knockout ladder.
   - FIFA/AMF futsal standings calculation with cascading tiebreakers (Points, Head-to-Head, Goal Difference, Goals Scored).
6. **Instant Public Broadcast Desk**:
   - Shareable public URL with zero login required for fans and players.
   - Real-time reactive scoreboard, active clock, possession breakdown, and official venue relocation notice banners.
7. **High-Resolution `.PNG` Export Engine**:
   - Dedicated 1200×1200px `#tournament-export-canvas` component rendered via `html-to-image`.
   - Exports complete tournament summaries featuring golden trophy accolades, top scorer (Golden Boot), best goalkeeper (Golden Glove), chronological match ledger, and SLFA authenticated certification.
   - CSV export of all matches and audit telemetry.
8. **Co-Organizer Delegation with Security Guard**:
   - Primary organizers can delegate scoring and timekeeping duties via email or invite tokens.
   - Strict authentication guard: Invited members are required to Sign In or Sign Up before receiving live console permissions.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite 6, TypeScript
- **Styling**: Tailwind CSS, Google Fonts (`Plus Jakarta Sans`, `Barlow Condensed`, `Instrument Sans`, `JetBrains Mono`), Lucide Icons
- **Database & Persistence**: Supabase PostgreSQL 17 (11 relational tables + RLS + Realtime channels) with LocalStorage offline caching
- **Canvas Export**: `html-to-image` for high-resolution 1200x1200px summary graphics
- **Hosting / Deployment**: Compatible with Vercel, Netlify, Cloudflare Pages, Supabase Hosting

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📋 Evaluation Seed Data

The platform comes pre-seeded with realistic tournament data for immediate evaluation:
1. **Colombo Premier Futsal Cup 2026** (`PUBLISHED_ONGOING`):
   - Colombo Futsal Hub (Courts 1–5), 8 teams across Group A & Group B.
   - 4 completed matches, 1 live match on Court 1 ready to test moving to Court 5, and 1 match with a City Lions Walkover.
2. **Western Province Inter-Club Championship 2026** (`ENDED`):
   - Concluded archive with Champion Apex Warriors (6-0-0), Runner-Up Colombo Thunder FC.
   - Golden Boot (Tariq Al-Hassan, 9 goals), Golden Glove (Roshan Senanayake, 84% saves).
   - Ready-to-test `.PNG` export button.

---

© 2026 Play Field System. SLFA Certified Sanctioned Operations.
