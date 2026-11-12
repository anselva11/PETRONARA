# PT Petro Mandiri Nusantara (PMN) — Corporate Website

A modern, premium, professional corporate website for **PT Petro Mandiri Nusantara (PMN)**, an Indonesian energy and petroleum company.

Designed with inspiration from premier global and national energy corporations—notably **Pertamina (pertamina.com)**, ExxonMobil, Shell, and Chevron—reflecting corporate credibility, energy industry expertise, sustainable operations, and an original PMN brand identity.

---

## 🌟 Brand Identity & Color Palette

- **Company Name**: PT Petro Mandiri Nusantara
- **Abbreviation**: PMN
- **Positioning**: A modern, reliable, innovative, and professional Indonesian energy company.
- **Color Distribution**:
  - `70% White`: Clean, spacious corporate aesthetic (`#FFFFFF`)
  - `20% Corporate Blue`: Accentuation, action points, and active states (`#0066B3`)
  - `10% Navy & Dark Accents`: Solid foundation, headers, and footer (`#003B70`, `#082B4C`)
  - `Supporting Highlights`: Cyan (`#00A3E0`), Gold (`#FE8801`), and Safety Green (`#3D9F32`)

---

## 🚀 Technology Stack

- **HTML5**: Semantic corporate structure, OpenGraph SEO metadata, accessibility ARIA attributes.
- **CSS3 & Tailwind CSS**: Utility-first styling with custom corporate theme tokens and smooth micro-interactions.
- **JavaScript (ES6+)**: Modular application architecture, state-driven UI, and event delegation.
- **Motion (Framer Motion Engine)**: Physics-based fluid reveals and smooth scrolling transitions.
- **Lucide Icons**: Crisp, modern corporate iconography.
- **Google Fonts**: *Plus Jakarta Sans* (primary typeface) paired with *Inter*.

---

## 📂 Project Structure

```
Broker Migas/
├── index.html              # Main corporate website entry point
├── server.js               # Zero-dependency local Node.js preview server
├── README.md               # Project documentation & editing guide
├── Assets/                 # Brand assets & logos
│   ├── Petro Mandiri Nusantara Logo.png   # Original source logo
│   ├── logo-pmn-transparent.png           # Antialiased transparent version for light backgrounds
│   ├── logo-pmn-white.png                 # Light-mode version for dark/transparent navbars
│   └── logo-pmn-emblem.png                # Icon badge for favicons & mobile headers
├── css/
│   └── styles.css          # Custom styling, energy grid patterns, animations, glassmorphism
└── js/
    ├── data.js             # Centralized bilingual data (business, news, stats, company profile)
    └── main.js             # Interactive controller (slider, tabs, modals, language switcher, forms)
```

---

## 🏛️ Website Architecture & Key Sections

1. **Top Utility Bar**:
   - Location indicator (SCBD Jakarta Selatan), direct phone & corporate email.
   - ISO accreditations badges (ISO 9001, 14001, 45001).
   - Instant language toggle (**Bahasa Indonesia / English**).

2. **Sticky Dual-Mode Navigation Bar**:
   - Seamlessly transitions from transparent over the cinematic hero to solid white with subtle shadow and border upon scrolling.
   - Dropdown navigation under **"Our Business"** displaying the 4 key energy divisions.
   - Mobile-responsive slide-out drawer menu with escape key and outside-click support.
   - Quick action button: **"Contact Us"**.

3. **Cinematic Hero Section**:
   - Full-screen multi-slide carousel featuring oil refineries, offshore platforms, and industrial pipelines.
   - Headline: *"Driving Energy Forward, Building a Sustainable Future."*
   - Interactive slide indicators, progress timing, previous/next controls, and dual CTAs (*"Discover Our Business"* & *"Get In Touch"*).

4. **Corporate Statistics Strip**:
   - Animated number counters:
     - **15+** Strategic Hubs Across Indonesia
     - **99.8%** On-Time Supply Reliability
     - **5M+** Safe Man-Hours Without Lost Time Injury (Zero LTI)
     - **100%** National Energy Commitment

5. **About Us ("Who We Are")**:
   - Two-column modern layout with animated image reveal and floating verification badge.
   - Interactive 3-way tab switcher for **Company Overview**, **Vision & Mission**, and **Core Values** (Professionalism, Safety First, Agility, Strategic Partnership).

6. **Our Business (Proposed & Customizable Categories)**:
   - 4 premium cards with high-res photography, icon badges, and key capability checklists:
     1. **Oil & Gas**: Upstream/downstream solutions, E&P support, industrial fuel blending.
     2. **Petroleum Trading**: Commercial High-Speed Diesel (HSD B35/B40), Marine Gas Oil (MGO), long-term supply.
     3. **Energy Solutions**: Modular fuel storage tanks, smart telemetry Fuel Management Systems (FMS), bunkering support.
     4. **Logistics & Distribution**: Marine oil barges, coastal tankers, GPS-tracked road tanker fleet.
   - Each card features a **"Learn More"** interactive modal with in-depth capabilities and a direct proposal request action.

7. **Why Choose PMN**:
   - 4 fundamental corporate value propositions:
     - **Reliability**: Dependable supply chain and stringent quality assurance.
     - **Integrity**: Transparency, ethical governance, and strict regulatory compliance.
     - **Innovation**: Modern telemetry, automated monitoring, and predictive logistics.
     - **Partnership**: Long-term strategic relationships with SOEs and private industrial leaders.

8. **Corporate Commitment**:
   - High-impact dark navy visual section (`#082B4C`) with industrial energy background and subtle animated blue glowing overlays.
   - Highlights: HSSE Excellence, TKDN (National Content), Supply Chain Resilience, and Energy Transition Readiness.

9. **Sustainability & Responsibility**:
   - Editorial 4-pillar layout emphasizing Environmental Responsibility, Operational Safety (HSSE), Sustainable Energy Development (Biofuels B35/B40), and Corporate Governance (GCG & ISO 37001 Anti-Bribery).

10. **News & Updates**:
    - 3 corporate announcement cards with category badges and estimated read times.
    - Interactive modal reader with full article view, article tags, and one-click sharing.

11. **Call to Action (CTA)**:
    - Full-width corporate banner: *"Let's Build the Future of Energy Together."*

12. **Contact & Commercial Inquiry Form**:
    - Headquarters office details (Menara Energi Nusantara SCBD Jakarta) and direct department desks.
    - Functional interactive form with client validation, animated loading spinner, and toast notifications.

13. **Corporate Footer**:
    - Comprehensive site navigation, business unit directories, accreditation badges, social media links, and copyright notices.

---

## 🛠️ How to Preview & Run the Website

### Option 1: Direct File Opening
Double-click `index.html` or open it in any modern browser (Google Chrome, Microsoft Edge, Safari, Firefox). All dependencies (Tailwind CDN, Lucide, Fonts, Motion) load automatically via CDN.

### Option 2: Using the Built-In Local Server
Run with Node.js:
```powershell
node server.js
```
Then navigate to:
```
http://localhost:3000/
```

---

## ✏️ How to Edit Content & Business Categories

All corporate content is decoupled and organized in `js/data.js`:

- **To update company contact info or address**: Edit `PMN_DATA.company` in `js/data.js`.
- **To update hero slides**: Modify `PMN_DATA.heroSlides` in `js/data.js`.
- **To customize business activities**: Edit or add entries in `PMN_DATA.businessCategories` in `js/data.js`.
- **To publish new press releases**: Append new articles to `PMN_DATA.news` in `js/data.js`.
- **To modify statistics**: Update numbers in `PMN_DATA.statistics` in `js/data.js`.

Both English (`*En`) and Bahasa Indonesia (`*Id`) fields are provided for seamless bilingual synchronization.

