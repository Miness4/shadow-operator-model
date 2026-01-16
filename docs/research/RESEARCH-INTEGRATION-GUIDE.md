# Research Integration Guide: Workbooks + Transcripts → App Architecture
**Date:** 2026-01-16
**Status:** Complete Research Phase
**Files:** workbook-analysis.md + transcript-insights.md

---

## Overview

This guide maps the research documents to the three-pillar app architecture (Synthesio / Ghostwrite / Flowy) with specific implementation requirements for:
- AI prompts and logic
- Database schemas
- UI/UX patterns
- Feature priorities

---

## PILLAR 1: SYNTHESIO (AI Synthesis & Product Architect)

### Purpose
Transform creator profiles into monetization blueprints and product curricula.

### Core Features (Priority Order)

#### Feature 1: Creator DNA Scanner [HIGHEST PRIORITY]
**Research Source:** Workbook-Analysis § Creator Profiles
**Transcript Source:** Transcript-Insights § Creator Desperation Index

**Input:** Instagram handle or URL
**Output:** Creator DNA JSON
```json
{
  "niche": "fitness coaching",
  "audience_pain_points": ["time management", "workout consistency", "nutrition"],
  "engagement_rate": 5.2,
  "follower_count": 42000,
  "creator_archetype": "authority",
  "monetization_gaps": {
    "current_income": 250,
    "potential_income": 5000,
    "gap": 1900
  },
  "desperation_score": 9,
  "recommended_product_type": "community"
}
```

**Implementation Notes:**
- Use Apify API for Instagram scraping
- Claude Opus for DNA extraction (prompt in prompts/synthesio/creator-dna-extractor.md)
- Calculate desperation from: follower count, growth rate, content frequency, bio language
- Store in `dna` table for reuse

**UI Component:**
```
Input field: "Paste Instagram handle"
Button: "Scan DNA"
Loader animation (2-5 seconds)
Output card showing:
- Archetype badge (with color)
- Pain points (top 3)
- Desperation meter (1-10)
- Monetization potential ($X-$Y)
- Recommended next step button
```

**Database Schema:**
```sql
CREATE TABLE dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) UNIQUE,
  niche TEXT NOT NULL,
  audience_pain_points JSONB, -- array of top 3
  engagement_rate DECIMAL(5,2),
  follower_count INTEGER,
  follower_growth_pct DECIMAL(5,2),
  creator_archetype TEXT CHECK (creator_archetype IN ('authority', 'lifestyle', 'educator', 'personality')),
  content_frequency TEXT,
  tone_of_voice TEXT,
  current_monetization DECIMAL(10,2),
  desperation_score INT CHECK (desperation_score >= 1 AND desperation_score <= 10),
  scan_timestamp TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### Feature 2: Niche Database & Matching [HIGH PRIORITY]
**Research Source:** Workbook-Analysis § 200+ Industry Database
**Transcript Source:** Transcript-Insights § Focused Audiences Out-Earn Celebrities

**Data Structure:**
```sql
CREATE TABLE niche_database (
  id UUID PRIMARY KEY,
  niche_name TEXT UNIQUE,
  archetype_ideal TEXT,
  product_type_recommended TEXT,
  avg_price_point DECIMAL(10,2),
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  saturation_score INT (0-100),
  monetization_difficulty INT (1-10),
  total_creators_estimate INT,
  creator_desperation_index INT (1-10),
  profitability_score INT (1-10),
  growth_trajectory TEXT
);
```

**Implementation:**
- Pre-populate with 200+ niches from workbook
- Include profitability metrics per niche
- Auto-recommend niches based on user's own background/interests
- Show competition landscape

**UI Component:**
```
Feature: "Niche Explorer"
- Dropdown with 200+ niches (searchable, filterable)
- Filters:
  □ Profitability (high/medium/low)
  □ Competition (low/medium/high)
  □ Your experience match (yes/no)
  □ Growth trajectory (rising/stable/declining)
- Click niche → Shows:
  - Average creator count in niche
  - Average desperation score
  - Typical price points
  - Success story from niche
  - "Find creators in this niche" button
```

---

#### Feature 3: Creator Matcher & Scout [HIGH PRIORITY]
**Research Source:** Workbook-Analysis § Creator Audit Framework
**Transcript Source:** Transcript-Insights § Targeting Wrong Creators Mistake

**Logic:** Filter Instagram creators matching ideal profile
```
Filtering Criteria (from transcript):
✓ Follower count: 10K-100K (MUST HAVE)
✓ Engagement rate: 3-8%
✓ Existing products: 0 (CRITICAL)
✓ Existing partnerships: 0-2 (sponsorships only)
✓ Team size: 0-1
✓ Estimated monthly income: $200-$1,000 (desperation indicator)
✗ Mega-creator (1M+): AUTO-DISQUALIFY
✗ Already has course/community: AUTO-DISQUALIFY
```

**Implementation:**
- Use Apify to pull Instagram data for creators in chosen niche
- Apply filtering algorithm
- Rank by "fit score" (0-100)
- Show top 20 matches with "reason" for each

**UI Component:**
```
Feature: "Creator Scout"
Input: Niche selection
Output: Ranked list of 20 creators
For each creator shown:
- Profile pic + handle + follower count
- Engagement rate (green/yellow/red indicator)
- Fit score (0-100) with breakdown:
  ✓ Followers in range: +50 pts
  ✓ Engagement 3-8%: +40 pts
  ✓ No existing products: +60 pts
  ○ Recent posts sentiment: +/- 20 pts
- "Deep dive" button → Shows full profile analysis
- "Outreach" button → Goes to Flowy outreach module
```

---

#### Feature 4: UVZ (Unique Value Zone) Calculator [MEDIUM PRIORITY]
**Research Source:** Workbook-Analysis § UVZ Calculator
**Transcript Source:** Transcript-Insights § Packaging/Positioning Strategy

**Logic:** Find intersection of:
1. What creator is good at
2. What market desperately needs
3. What has low competition

**Inputs:**
- Creator's expertise/skills (multi-select)
- Creator's audience pain points
- Market gap analysis

**Output:**
```json
{
  "uvz_definition": "High-ticket business coaching for micro-influencers",
  "market_size": "1.2M micro-creators looking to monetize",
  "competition_level": "Low (mostly generic business coaching)",
  "price_ceiling": 497,
  "uniqueness_score": 8.5,
  "positioning_angle": "The system that helped you build audience now helps you profit from it"
}
```

**UI Component:**
```
Feature: "UVZ Calculator"
Step 1: Multi-select creator's expertise areas
Step 2: Review audience pain points (pre-filled from DNA)
Step 3: AI generates 3-5 UVZ options
Step 4: User selects preferred UVZ
Output shows:
- Market size estimate
- Addressable audience
- Potential revenue projection
- Recommended price point
- Competitive positioning
```

---

#### Feature 5: Monetization Gameplan Generator [HIGH PRIORITY]
**Research Source:** Workbook-Analysis § Monetization Gameplan Generator
**Transcript Source:** Transcript-Insights § $9.8M Launch Case Study

**Output Structure:**
```json
{
  "product_type": "community",
  "positioning": "For micro-influencers ready to monetize",
  "pricing": {
    "tier_1": 47,
    "tier_2": 147,
    "tier_3": 497,
    "recommended": "tier_1"
  },
  "revenue_projections": {
    "conservative": 1200,
    "realistic": 3500,
    "aggressive": 7200
  },
  "launch_timeline": "14 days",
  "required_assets": ["14 story sequences", "sales page", "community setup"],
  "next_steps": ["Approve gameplan", "Generate story copy", "Set up payment processor"]
}
```

**AI Prompt:** (See prompts/synthesio/gameplan-generator.md)

**UI Component:**
```
Feature: "Gameplan Generator"
Inputs:
- Creator DNA (auto-filled from earlier)
- UVZ (auto-filled from earlier)
- Creator goals (text input)

Output: Interactive gameplan card
Sections:
1. "Your Product" - Summarized offer
2. "Pricing Strategy" - Tiered options with rationale
3. "Revenue Potential" - Conservative/Realistic/Aggressive
4. "Timeline" - 14-day launch path
5. "Required Assets" - Checklist
6. "Risk Removal" - Built-in safeguards (money-back, etc.)

Actions:
- "Edit gameplan" button
- "Approve & proceed" button → Goes to Ghostwrite
- "Save for later" button
```

---

#### Feature 6: Curriculum Architect [MEDIUM PRIORITY]
**Research Source:** Workbook-Analysis § Curriculum Architect
**Transcript Source:** Transcript-Insights § Transformation Mapping

**Input:**
- Product type (course, community, mastermind)
- Creator expertise domain
- Audience transformation (start state → end state)

**Output:**
```json
{
  "modules": [
    {
      "title": "Module 1: The Foundation",
      "lessons": ["Lesson 1.1", "Lesson 1.2", "Lesson 1.3"],
      "outcomes": ["Student can identify their unique angle", "Student knows 3 ways to position"]
    },
    {
      "title": "Module 2: The Blueprint",
      "lessons": ["Lesson 2.1", "Lesson 2.2"],
      "outcomes": ["Student has concrete monetization plan"]
    }
  ],
  "total_modules": 3,
  "total_lessons": 8,
  "estimated_completion": "14 days"
}
```

**UI Component:**
```
Feature: "Curriculum Builder"
Visual: Transformation map (Before → After)
Shows: Module breakdown with expandable lessons
Each lesson has:
- Learning objective
- Key concept
- Mini-case study or example
- Worksheet/resource link

Generates:
- Module templates
- Lesson outline
- Worksheet ideas
- Community post hooks

User can:
- Edit curriculum
- Add custom modules
- Reorder lessons
- Export as PDF
```

---

#### Feature 7: Pitch Deck Generator [MEDIUM PRIORITY]
**Research Source:** Workbook-Analysis § Pitch Deck Generator
**Transcript Source:** Transcript-Insights § Packaging/Positioning

**Output:** Beautiful PDF deck (React-PDF, no Gamma dependency)

**Sections:**
1. Title slide (Creator name + offer)
2. Problem statement (Audience pain)
3. Solution overview (Product + how it works)
4. Pricing & tiers
5. What's included (modules, access, bonuses)
6. Success metrics (expected outcomes)
7. Timeline (14 days to results)
8. Call to action

**UI Component:**
```
Feature: "Pitch Deck Generator"
One-click generation from gameplan
Preview in browser (PDF)
Actions:
- Download PDF
- Share PDF link
- Email to creator
- Embed in sales page

Template options:
- Minimalist (dark theme)
- Colorful (creator's brand colors, if provided)
- Professional (consulting style)
```

---

## PILLAR 2: GHOSTWRITE (Copywriting OS & Content Gen)

### Purpose
Generate all campaign content: story copy, emails, sales pages, graphics.

### Core Features (Priority Order)

#### Feature 1: Story Copy Generator (14-Day Sequence) [HIGHEST PRIORITY]
**Research Source:** Workbook-Analysis § The 14-Day Instagram Story Sequence
**Transcript Source:** Transcript-Insights § The 11 Psychological Buy Buttons

**Architecture:**
- Phase 1 (Days 1-3): Warm-up (Buttons 1-3: Curiosity, Scarcity, Social Proof)
- Phase 2 (Days 4-9): Value delivery (Buttons 4-8: Urgency, Authority, Reciprocity, Likeability, Personalization)
- Phase 3 (Days 10-14): Money days (Buttons 9-11: FOMO, Risk Reversal, Pain Removal)

**AI Prompt Template:**
```
Input:
- Phase number (1, 2, or 3)
- Day number (1-14)
- Creator name + voice/tone
- Audience pain point
- Product/solution
- Price point

Output:
- Story copy (60-80 words)
- Primary psychological button activated
- Secondary button layered
- Image direction/template
- Expected engagement metrics

Example:
Day 7 (Phase 2) → Buttons 7+6 (Likeability + Reciprocity)
Output: Personal vulnerability story + free insight
```

**Database Schema:**
```sql
CREATE TABLE story_templates (
  id UUID PRIMARY KEY,
  day_number INT (1-14) NOT NULL,
  phase_number INT (1-3) NOT NULL,
  template_name TEXT,
  template_category TEXT, -- problem_agitate_solve, question_based, vulnerability, social_proof
  copy_framework TEXT, -- Template with [PLACEHOLDERS]
  placeholder_variables JSONB, -- Array of variable names
  psychological_trigger TEXT,
  primary_button INT (1-11),
  secondary_button INT (1-11),
  word_count_recommended INT DEFAULT 70,
  avg_engagement_rate DECIMAL(4,2),
  image_style_guide JSONB,
  created_at TIMESTAMPTZ
);

CREATE TABLE story_generations (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  day_number INT,
  phase_number INT,
  template_id UUID REFERENCES story_templates(id),
  copy_generated TEXT,
  copy_approved BOOLEAN,
  image_url TEXT,
  engagement_metrics JSONB, -- Filled post-launch
  created_at TIMESTAMPTZ
);
```

**UI Component:**
```
Feature: "Story Sequence Generator"

Step 1: Review gameplan (auto-filled)
Step 2: Customize creator voice
  - Tone selector: professional/casual/friendly/edgy
  - Example past posts: [Link to creator's best posts]
  - Key phrases/words creator uses
Step 3: Auto-generate all 14 stories
  - View one-by-one or in grid
  - Each shows: Copy + Psychology buttons + Image direction
Step 4: Review & approve each story
  - Edit copy if needed
  - AI regenerates on edit
  - "Approve" → Locked for launch
Step 5: Download/export
  - PDF with all copy
  - Image templates (Canva or stock photos)
  - Scheduling guide

Visual timeline showing:
- Phase 1 (Days 1-3) colored differently
- Phase 2 (Days 4-9) colored differently
- Phase 3 (Days 10-14) colored differently
- Each day shows psychological buttons activated
```

**Key Prompts (See prompts/ghostwrite/):**
- `story-copy-generator.md` (Main prompt)
- `psychology-button-selector.md` (Chooses which buttons to activate)
- `creator-voice-analyzer.md` (Learns creator's tone from posts)

---

#### Feature 2: Story Image Templates Generator [HIGH PRIORITY]
**Research Source:** Workbook-Analysis § Story Copy Templates
**Transcript Source:** Transcript-Insights § Visual Consistency

**Output:** Design templates with copy overlaid

**Implementation:**
- Canva API integration OR
- React-PDF for custom design generation OR
- Pre-designed templates + copy injector

**For Each Story:**
- Color scheme (aligned with creator's brand)
- Text overlay positioning
- Typography (readability optimized)
- CTA positioning
- Optional: Stock photo or shape-based design

**UI Component:**
```
Feature: "Story Design Generator"
For each of 14 stories:
- Show design preview with copy overlaid
- Color picker (auto-detects from creator's Instagram)
- Text position adjustable
- Font style selector
- Image/background selector (Unsplash, brand colors, etc.)

Actions:
- Download as image (1080x1920 for Stories)
- Send to Canva (edit further)
- Add to campaign asset folder
- Preview on phone mockup

Bulk options:
- Generate all 14 with consistent template
- Apply brand colors across all
- Download as ZIP
```

---

#### Feature 3: Sales Page Copy Generator [HIGH PRIORITY]
**Research Source:** Workbook-Analysis § Copy Templates
**Transcript Source:** Transcript-Insights § Risk Removal Framework

**Structure:**
```
1. Headline (addresses main pain point)
2. Subheadline (positioning + benefit)
3. Problem statement (creator's audience pain)
4. Agitation (consequences of not solving)
5. Solution overview (what the product is)
6. What's included (modules, access, bonuses)
7. Pricing options (tiered)
8. Risk reversal (money-back guarantee)
9. Social proof (testimonials, numbers)
10. FAQ section
11. Final CTA
```

**AI Prompt:**
```
Generate sales page copy for:
- Creator: [NAME]
- Audience: [DESCRIPTION]
- Problem: [PAIN_POINT]
- Solution: [PRODUCT_TYPE]
- Price: [PRICING_TIERS]

Requirements:
- Benefit-focused (not feature-focused)
- Risk removal emphasized
- Emotional hooks (not logical only)
- Scannable formatting
- Multiple CTAs

Output: Full sales page copy ready to paste
```

**UI Component:**
```
Feature: "Sales Page Builder"
Input: Gameplan details (auto-filled)
Output: Generated copy sections (can edit each)

Display:
- Full page preview (HTML rendered)
- Edit each section separately
- Prompt bar: "Rewrite this section to be more..." (select tone)
- Add/remove sections
- Insert testimonial section template
- Insert FAQ template

Export:
- Copy to clipboard (all sections)
- Download as DOCX
- Send to Webflow/Tolt/Leadpages
- Embed in custom site

Optimization tips:
- "This copy activates buttons: X, Y, Z"
- "Consider adding risk reversal here"
- "Social proof section is weak"
```

---

#### Feature 4: Email Sequence Generator [MEDIUM PRIORITY]
**Research Source:** Workbook-Analysis § Campaign Execution
**Transcript Source:** Transcript-Insights § Multi-touch Framework

**Sequence Structure:**
```
Email 1 (Day 0): Story announcement + link
Email 2 (Day 3): Midway reminder + testimonial
Email 3 (Day 6): Last chance + scarcity frame
Email 4 (Day 8): Final push + FAQ
Email 5 (Day 14): Post-deadline (often has late buyers)
```

**UI Component:**
```
Feature: "Email Sequence Generator"
Auto-generates 3-5 emails from campaign details
For each email:
- Subject line (optimized for open rate)
- Preview text
- Body copy
- CTA button text + link

User can:
- Edit each email
- Regenerate individual emails
- Preview on mobile
- Add personalization variables ([FIRST_NAME], etc.)
- Export to email provider (Mailchimp, Convertkit, etc.)

Templates:
- News/announcement email
- Social proof email
- Urgency email
- FAQ email
- Post-deadline email
```

---

#### Feature 5: Positioning Statement Generator [MEDIUM PRIORITY]
**Research Source:** Workbook-Analysis § Positioning Angle
**Transcript Source:** Transcript-Insights § Packaging/Positioning/Leverage

**Output Example:**
```
"For [AUDIENCE],
This [PRODUCT] helps you [BENEFIT]
Unlike [COMPETITOR/STATUS_QUO],
Our approach [UNIQUE_MECHANISM]
Because [REASON_WORKS]."
```

**UI Component:**
```
Feature: "Positioning Generator"
Inputs (mostly auto-filled):
- Target audience
- Problem they face
- Solution type (community, course, coaching)
- Why this is unique
- Primary outcome

Output: 3 positioning options
- "The Transformation" angle
- "The Expert Method" angle
- "The System" angle

User selects one, which then influences:
- Sales page copy tone
- Story copy emphasis
- Email subject lines
- Pitch deck messaging
```

---

## PILLAR 3: FLOWY (CRM & Workflow Builder)

### Purpose
Track all campaigns, creator interactions, payments, and workflows with real-time metrics.

### Core Features (Priority Order)

#### Feature 1: Campaign Dashboard [HIGHEST PRIORITY]
**Research Source:** Workbook-Analysis § Campaign Tracking
**Transcript Source:** Transcript-Insights § Deal Pipeline Visualization

**Real-Time Display:**
```
Campaign: [Creator Name] - [Product]

PHASE: Live (Days 3/14)
├─ Story reach: 10,234
├─ Engagement rate: 6.2%
├─ Conversions: 42 (1.2% conversion rate)
├─ Revenue generated: $1,974
├─ Creator earnings: $1,380 (70%)
├─ Your earnings: $594 (30%)

TIMELINE:
  Days 1-3: [WARMUP] ✓ Complete
  Days 4-9: [VALUE] ⊚ In progress (Day 6/6)
  Days 10-14: [MONEY] ○ Not started

NEXT ACTIONS:
- [ ] Monitor Day 7 engagement
- [ ] Prepare money phase copy
- [ ] Respond to creator question
```

**Database Schema:**
```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  gameplan_id UUID REFERENCES gameplans(id),
  phase TEXT CHECK (phase IN ('planning', 'outreach', 'content_creation', 'live', 'post_launch')),
  status TEXT,
  launch_date DATE,
  end_date DATE,
  expected_revenue DECIMAL(10,2),
  actual_revenue DECIMAL(10,2),
  conversion_rate DECIMAL(5,4),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE campaign_metrics (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  day INT,
  reach INT,
  impressions INT,
  engagement_count INT,
  conversion_count INT,
  revenue_total DECIMAL(10,2),
  engagement_rate DECIMAL(5,2),
  conversion_rate DECIMAL(5,4),
  recorded_at TIMESTAMPTZ
);
```

**UI Component:**
```
Feature: "Campaign Dashboard"

Left sidebar (navigation):
- Active campaigns (sorted by phase)
- Past campaigns (completed)
- Future campaigns (planned)
- New campaign button

Main panel:
- Large campaign card showing:
  - Creator avatar + name
  - Phase progress bar (Days X/14)
  - Key metrics (reach, engagement, conversions)
  - Real-time revenue counter (animates)

Below metrics:
- 14-day timeline with phase indicators
- Each day clickable to see:
  - Story copy (what was posted)
  - Story image
  - Metrics for that day
  - Creator feedback/questions

Actions panel:
- Message creator button
- Export metrics button
- Post-launch analysis button (after campaign ends)
```

---

#### Feature 2: Creator Interaction Tracker [HIGH PRIORITY]
**Research Source:** Workbook-Analysis § Interaction Management
**Transcript Source:** Transcript-Insights § The Doctor Approach Framework

**Interaction Types:**
```
- initial_outreach (first message)
- followup_1 (first follow-up, 48h after)
- followup_2 (second follow-up, 5 days after)
- call_scheduled
- call_completed
- agreement_sent
- deal_closed
- post_launch_feedback
```

**Database Schema:**
```sql
CREATE TABLE interactions (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id),
  interaction_type TEXT,
  message_template_id UUID REFERENCES story_templates(id),
  message_sent TEXT,
  message_response TEXT,
  response_received BOOLEAN,
  response_time_minutes INT,
  response_sentiment TEXT CHECK (response_sentiment IN ('positive', 'neutral', 'negative')),
  next_action TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**UI Component:**
```
Feature: "Interaction Timeline" (per creator)

Shows chronological list:
[Initial Outreach] Day 1
- Message sent: [Preview]
- Response received: ✓ Yes, 4 hours later
- Sentiment: Positive ✓
- Next action: Schedule call

[Call Scheduled] Day 3
- Call date/time: Jan 20, 2PM
- Status: Confirmed
- Next action: Send agreement

[Agreement Sent] Day 5
- Document sent: [Download link]
- Signed: Pending
- Reminder set: Jan 15
- Next action: Launch campaign

Timeline view can toggle:
- Timeline (current)
- Message list (all messages)
- Chat view (conversation-style)

Actions:
- Send follow-up
- Schedule reminder
- Add note
- Attach file
- Mark as complete
```

---

#### Feature 3: Outreach Workflow Automation [HIGH PRIORITY]
**Research Source:** Workbook-Analysis § 90-Day Action Plan
**Transcript Source:** Transcript-Insights § Rejection Frame Psychology

**Workflow:**
```
Step 1: Creator selection (filtered list of 10 ideal matches)
Step 2: Auto-send personalized outreach (Day 1)
Step 3: Log response (auto-tracked)
Step 4: If no response:
  - Auto-schedule followup (Day 3)
  - Auto-send followup message
  - Log response
Step 5: If still no response:
  - Auto-schedule second followup (Day 5)
  - Auto-send second followup
  - Mark as "declined" if no response
Step 6: If yes at any point:
  - Schedule kickoff call (Day 2 after yes)
  - Send call prep guide
  - Log as "partnership started"
```

**UI Component:**
```
Feature: "Outreach Automator"

Input:
- Number of creators to target: [Slider 5-20]
- Niche filter: [Dropdown]
- Outreach template: [Selection]

The system:
1. Scouts top 20 creators matching criteria
2. Shows them with fit scores
3. User approves top 10
4. Auto-sends personalized outreach each day
5. Tracks responses in real-time

Dashboard shows:
- Total sent: 10
- Responses: 3 (30%)
- Pending: 7
- Declined: 0
- Deals progressing: 2

Breakdown by response status:
[Positive responses] 3
- Creator A: Call scheduled (Jan 18)
- Creator B: Call scheduled (Jan 19)
- Creator C: Awaiting response to call request

[No response yet] 4
- Creator D: Follow-up sent (Day 3)
- Creator E: Follow-up pending (send Jan 17)
- ...

[Negative responses] 0

Gamification:
- "You're 30% to your first deal!"
- "Each rejection brings you closer to yes"
- Rejection counter badge
- "On track for 2 deals this month"
```

**Smart Automation Rules:**
```
IF response_received == false AND days_since_outreach == 3:
  THEN: Auto-send_followup_1

IF response_received == false AND days_since_followup_1 == 3:
  THEN: Auto-send_followup_2

IF response_sentiment == "positive":
  THEN: Mark_interaction_type = "call_scheduled"
  AND: Create_calendar_event
  AND: Send_call_prep_guide

IF interaction_type == "deal_closed":
  THEN: Route_to_Synthesio_for_content_generation
```

---

#### Feature 4: Payment & Revenue Tracking [HIGH PRIORITY]
**Research Source:** Workbook-Analysis § Payment Splits
**Transcript Source:** Transcript-Insights § Infrastructure Shift (Auto-Splits)

**Real-Time Payment Dashboard:**
```
Total Campaign Revenue: $4,700
├─ Creator Earnings: $3,290 (70%)
├─ Your Earnings: $1,410 (30%)

Payment Status:
- Payment method: Stripe
- Creator connected: ✓ Yes
- Auto-split enabled: ✓ Yes
- Last payment: Jan 15, 2:45 PM
  Amount: $1,410 → Your account
  Amount: $3,290 → Creator account (real-time)
- Next payment: Real-time (continuous)

Creator visibility (what they see):
- Real-time sales counter: 42 sales
- Real-time earnings counter: $1,974 earned
- Expected payout: $1,974 (70%)
- Payment history (last 5 transactions)
```

**Database Schema:**
```sql
CREATE TABLE payment_splits (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  operator_percentage DECIMAL(5,2), -- 30-50
  creator_percentage DECIMAL(5,2), -- 50-70
  total_revenue DECIMAL(10,2),
  operator_earnings DECIMAL(10,2),
  creator_earnings DECIMAL(10,2),
  payment_processor TEXT, -- stripe, gumroad, paypal
  operator_paid BOOLEAN DEFAULT false,
  creator_paid BOOLEAN DEFAULT false,
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);

CREATE TABLE payment_processors (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  processor_type TEXT, -- stripe, gumroad, paypal
  processor_account_id TEXT,
  split_config JSONB, -- { operator_pct, creator_pct, timing }
  webhook_url TEXT,
  created_at TIMESTAMPTZ
);
```

**UI Component:**
```
Feature: "Revenue Dashboard"

Summary cards (top):
- Total revenue from all campaigns: $[X]
- Your lifetime earnings: $[X]
- Creator payments made: $[X]
- Pending payments: $[X]

Campaign revenue breakdown (table):
| Creator | Campaign | Phase | Revenue | Your % | Creator % | Status |
| Alice | Fitness | Complete | $4,700 | $1,410 | $3,290 | Paid ✓ |
| Bob | Marketing | Live | $1,200 | $360 | $840 | Real-time |
| Carol | SEO | Planned | - | - | - | Not live |

Real-time metrics (live campaign):
- Sales counter (animating up)
- Engagement rate gauge
- Revenue generated (live)
- Your real-time earnings
- Creator's real-time earnings

Payment configuration:
- Processor: Stripe (connected ✓)
- Split percentage: 30% operator / 70% creator
- Payment timing: Real-time
- Auto-payment enabled: ✓ Yes

Actions:
- View payment history
- Download invoice
- Adjust split % (if needed)
- Contact creator (payment issue)
```

---

#### Feature 5: Reminder & Task Management [HIGH PRIORITY]
**Research Source:** Workbook-Analysis § 90-Day Action Plan
**Transcript Source:** Transcript-Insights § The 30-Day Roadmap

**Reminder Types:**
```
- outreach_followup (Days 3, 5 after initial)
- content_review (Creator approval of copy)
- launch_day (Campaign goes live)
- daily_monitoring (During live campaign)
- post_launch_analysis (Campaign ends)
- payment_due (Track when creator paid)
```

**Database Schema:**
```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  creator_id UUID REFERENCES creators(id),
  campaign_id UUID REFERENCES campaigns(id),
  reminder_type TEXT,
  reminder_time TIMESTAMPTZ,
  reminder_title TEXT,
  reminder_description TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'snoozed', 'dismissed')),
  notification_sent BOOLEAN DEFAULT false,
  notification_channel TEXT, -- email, in_app, both
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**UI Component:**
```
Feature: "Smart Reminders & Tasks"

Sidebar panel showing:
[TODAY]
- 2 tasks due today

[Upcoming]
- 1 task due tomorrow
- 5 tasks this week

Click each task shows:
- Task name + description
- Due date/time
- Creator involved
- Action button (Send message, Schedule call, Review copy, etc.)
- Mark complete button

Daily checklist (for manual tracking):
□ Send outreach to 5 new creators (by 5 PM)
□ Review story copy from Alice (by 3 PM)
□ Monitor Bob's campaign metrics (during launch)
□ Follow up with Carol on call feedback

Notifications:
- Desktop notification 1 hour before reminder
- Email reminder if over 1 day past due
- In-app badge with count

Automation:
- System auto-creates reminders based on campaign phase
- Followup reminders auto-created after outreach
- Daily monitoring reminders during live campaigns
```

---

#### Feature 6: Analytics & Reporting [MEDIUM PRIORITY]
**Research Source:** Workbook-Analysis § Progress Tracking & Metrics
**Transcript Source:** Transcript-Insights § Performance Metrics

**Key Metrics Tracked:**
```
Activity Metrics:
- Outreach messages sent (weekly)
- Creator audits completed (weekly)
- Campaigns launched (monthly)
- Content pieces created (per campaign)

Performance Metrics:
- Partnership close rate (%)
- Story engagement rate (%)
- Conversion rate (%)
- Revenue per partnership ($)
- Repeat rate (% of creators launching again)

Health Metrics:
- Creator satisfaction score (1-10, post-campaign survey)
- Content approval rate (%)
- Payment processing time (hours)
- Response time to creator questions (hours)

Financial Metrics:
- Total revenue generated ($)
- Your earnings ($)
- Creator payments made ($)
- Average deal size ($)
- Revenue per campaign ($)
```

**UI Component:**
```
Feature: "Analytics Dashboard"

Tabs:
1. Overview (summary of all metrics)
2. Campaigns (performance by campaign)
3. Creators (performance by creator)
4. Financial (revenue breakdown)
5. Growth (trends over time)

Overview tab shows:
- Key metrics cards: Total revenue, Your earnings, Deal count, Engagement rate
- Performance chart (revenue trend over time)
- Top campaigns (by revenue)
- Activity heatmap (outreach attempts)

Campaigns tab shows:
- Table with all campaigns + key metrics
- Sortable: Revenue, Engagement, Conversion, Date
- Expandable row: Shows daily breakdown

Creators tab shows:
- Creator roster + their campaign results
- Total revenue per creator
- Repeat rate (how many launched 2+ times)

Financial tab shows:
- Revenue vs creator payment over time (stacked chart)
- Payment processing analytics
- Split percentage breakdown

Growth tab shows:
- Revenue trend (chart)
- Campaign velocity (campaigns/month)
- Average deal size (trend)
- Creator acquisition rate (new creators/month)

Export:
- Download as CSV/PDF
- Email report (weekly/monthly)
```

---

## Database Complete Schema

```sql
-- 1. SYNTHESIO TABLES
CREATE TABLE creators (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  instagram_handle TEXT UNIQUE,
  youtube_url TEXT,
  profile_data JSONB,
  creator_archetype TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE dna (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id) UNIQUE,
  niche TEXT,
  audience_pain_points JSONB,
  engagement_rate DECIMAL(5,2),
  follower_count INTEGER,
  creator_archetype TEXT,
  content_frequency TEXT,
  tone_of_voice TEXT,
  current_monetization DECIMAL(10,2),
  desperation_score INT,
  scan_timestamp TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE gameplans (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id),
  uvz_data JSONB,
  revenue_projections JSONB,
  product_recommendation JSONB,
  curriculum JSONB,
  pitch_deck_url TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE niche_database (
  id UUID PRIMARY KEY,
  niche_name TEXT UNIQUE,
  archetype_ideal TEXT,
  product_type_recommended TEXT,
  avg_price_point DECIMAL(10,2),
  competition_level TEXT,
  saturation_score INT,
  monetization_difficulty INT,
  profitability_score INT,
  created_at TIMESTAMPTZ
);

-- 2. GHOSTWRITE TABLES
CREATE TABLE story_templates (
  id UUID PRIMARY KEY,
  day_number INT,
  phase_number INT,
  template_name TEXT,
  copy_framework TEXT,
  placeholder_variables JSONB,
  psychological_trigger TEXT,
  primary_button INT,
  secondary_button INT,
  avg_engagement_rate DECIMAL(4,2),
  created_at TIMESTAMPTZ
);

CREATE TABLE generations (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  generation_type TEXT, -- story_copy, story_image, email_sequence, sales_page
  prompt_used TEXT,
  ai_model TEXT,
  output_content TEXT,
  approval_status TEXT,
  version INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE story_generations (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  day_number INT,
  phase_number INT,
  copy_generated TEXT,
  copy_approved BOOLEAN,
  image_url TEXT,
  engagement_metrics JSONB,
  created_at TIMESTAMPTZ
);

-- 3. FLOWY TABLES
CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  gameplan_id UUID REFERENCES gameplans(id),
  phase TEXT,
  status TEXT,
  launch_date DATE,
  end_date DATE,
  expected_revenue DECIMAL(10,2),
  actual_revenue DECIMAL(10,2),
  conversion_rate DECIMAL(5,4),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE campaign_metrics (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  day INT,
  reach INT,
  impressions INT,
  engagement_count INT,
  conversion_count INT,
  revenue_total DECIMAL(10,2),
  engagement_rate DECIMAL(5,2),
  conversion_rate DECIMAL(5,4),
  recorded_at TIMESTAMPTZ
);

CREATE TABLE interactions (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id),
  interaction_type TEXT,
  message_template_id UUID,
  message_sent TEXT,
  message_response TEXT,
  response_received BOOLEAN,
  response_time_minutes INT,
  response_sentiment TEXT,
  next_action TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE payment_splits (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  operator_percentage DECIMAL(5,2),
  creator_percentage DECIMAL(5,2),
  total_revenue DECIMAL(10,2),
  operator_earnings DECIMAL(10,2),
  creator_earnings DECIMAL(10,2),
  payment_processor TEXT,
  operator_paid BOOLEAN,
  creator_paid BOOLEAN,
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);

CREATE TABLE reminders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  creator_id UUID REFERENCES creators(id),
  campaign_id UUID REFERENCES campaigns(id),
  reminder_type TEXT,
  reminder_time TIMESTAMPTZ,
  reminder_title TEXT,
  status TEXT,
  notification_sent BOOLEAN,
  notification_channel TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

---

## Critical AI Prompts to Create

**Location:** `/prompts/` directory

### Synthesio Prompts
- `creator-dna-extractor.md` - Extract creator DNA from profile
- `gameplan-generator.md` - Generate monetization gameplan
- `desperation-scorer.md` - Score creator desperation level
- `curriculum-architect.md` - Generate curriculum structure
- `positioning-generator.md` - Generate positioning statement

### Ghostwrite Prompts
- `story-copy-generator.md` - Generate 14-day story sequence
- `psychology-button-selector.md` - Select which buttons to activate
- `sales-page-generator.md` - Generate sales page copy
- `email-sequence-generator.md` - Generate email sequences
- `image-direction-generator.md` - Generate image design briefs

### Flowy Prompts
- `outreach-personalizer.md` - Personalize outreach messages
- `rejection-frame-converter.md` - Convert rejection to learning
- `next-action-recommender.md` - Recommend next steps
- `campaign-analyzer.md` - Analyze post-launch performance

---

## Implementation Priority (Phased Rollout)

### Phase 1 (MVP - Weeks 1-4)
**HIGHEST PRIORITY - Core Loop:**
1. Creator DNA Scanner (Synthesio)
2. Story Copy Generator (Ghostwrite)
3. Campaign Dashboard (Flowy)
4. Basic payment tracking (Flowy)
5. Outreach interaction tracker (Flowy)

### Phase 2 (Weeks 5-8)
**HIGH PRIORITY - Automation:**
6. Outreach workflow automation (Flowy)
7. Story image templates (Ghostwrite)
8. Sales page generator (Ghostwrite)
9. Creator scout/matcher (Synthesio)

### Phase 3 (Weeks 9-12)
**MEDIUM PRIORITY - Intelligence:**
10. UVZ calculator (Synthesio)
11. Gameplan generator (Synthesio)
12. Email sequence generator (Ghostwrite)
13. Analytics dashboard (Flowy)
14. Niche database + matching (Synthesio)

### Phase 4 (Weeks 13+)
**NICE-TO-HAVE - Scaling:**
15. Curriculum architect (Synthesio)
16. Pitch deck generator (Synthesio)
17. Positioning generator (Ghostwrite)
18. Advanced reminders & gamification (Flowy)
19. Team collaboration features

---

## UI/UX Design System

### Color Scheme
- **Primary:** Dark theme (shadow operator aesthetic)
- **Accent 1 - Synthesio:** Cyan/blue (creation)
- **Accent 2 - Ghostwrite:** Purple/violet (words/copy)
- **Accent 3 - Flowy:** Green/emerald (flow/money)
- **Success:** Green
- **Warning:** Orange
- **Error:** Red

### Typography
- **Headings:** Sans-serif, bold, large (leadership)
- **Body:** Sans-serif, regular, readable (clarity)
- **Monospace:** For code/templates/prompts

### Component Library
- Use shadcn/ui as baseline
- Extend with custom components:
  - Creator card (avatar, handle, metrics)
  - Campaign timeline (14-day visualization)
  - Metric gauge (conversions, engagement)
  - Revenue counter (animating numbers)
  - Story preview (Instagram-style frame)

### Patterns
- Tab-based navigation (Synthesio / Ghostwrite / Flowy)
- Sidebar for secondary navigation
- Modal for detail views
- Drag-and-drop for workflow building
- Real-time updates (WebSocket for metrics)

---

## Next Steps for Implementation

1. **Create prompt files** in `/prompts/synthesio/`, `/prompts/ghostwrite/`, `/prompts/flowy/`
2. **Set up database** with Supabase (schemas above)
3. **Build UI components** starting with Phase 1 features
4. **Integrate AI** with Claude Opus via puter.js
5. **Connect payment processors** (Stripe setup)
6. **Create story templates** (50+ variations)
7. **Build niche database** (200+ niches)
8. **Test end-to-end flow** (Creator → Gameplan → Campaign → Revenue)

---

**Last Updated:** 2026-01-16
**Status:** RESEARCH COMPLETE - READY FOR IMPLEMENTATION
**Total Features Mapped:** 19
**Database Tables:** 12
**Prompt Files Needed:** 14
