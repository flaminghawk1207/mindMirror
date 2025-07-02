# MindMirror – AI-Powered Mental Status Journal App

## Product Requirements Document (PRD)

### Overview
**MindMirror** is a minimal and private journal logging app that allows users to record short daily logs with a self-assessed mental status rating. It visualizes trends over time to help users gain insight into their mental well-being. It includes an optional AI-powered support assistant, which provides empathetic conversation but does not access user logs to preserve privacy.

### Goals
- Help users reflect on and track their mental health through simple, consistent logging.
- Provide users with a private space to express thoughts or moods.
- Enable users to observe mental patterns over time with clear, interactive visualizations.
- Offer a stateless AI chat assistant for empathetic, non-clinical conversation support.

### User Stories
#### Core
- As a user, I want to log my current mental status with a quick note so I can track how I'm feeling.
- As a user, I want to view a graph of my mental state over time to see trends.
- As a user, I want to talk to an AI assistant for support, knowing it doesn’t access my private logs.

#### Extended
- As a user, I want to tag entries with emotions or events (e.g., “stress”, “work”) for better pattern recognition.
- As a user, I want reminders to log my mental status daily so I stay consistent.
- As a user, I want to export my journal entries and data for personal use or sharing with a therapist.

### Features
#### 1. Short Journal Logs
- Free-text input for brief notes
- Select a mental status score (e.g., scale of 1–10, or emoji-based)
- Optional tags: Emotion (anxiety, joy, anger), Context (work, relationship)
- Time-stamped automatically

#### 2. Mental Status Line Graph
- Line graph showing score over days/weeks/months
- Hover/click to see journal snippets for a given day
- Filter by tag (e.g., see mental status trend during “work” stress)

#### 3. AI Support Assistant (Stateless)
- Natural language chat interface
- Stateless: Does not store or access journal logs
- Conversational, empathetic, and helpful – not a therapist or diagnostic tool
- Prompts for reflective thinking or mood-boosting ideas

#### 4. Privacy & Data Control
- Journal entries encrypted on device/cloud
- AI assistant runs in isolation (e.g., via separate backend)
- Option to export/delete all data

#### 5. Reminders & Notifications
- Configurable daily reminders
- Optional motivational quote or journaling prompt

### Nice-to-Have / Future Features
- Mood Detection via Text: NLP to detect sentiment and auto-suggest mood score
- Voice Entry Logging
- Offline Mode: Log without internet; sync later
- Themes / Customization: Choose colors or visual themes
- Biometric Lock: Extra layer of security for app access
- Streak Tracker: Motivates consistent logging
- Mental Weather: Daily emoji summary like “🌤️ Calm”, “🌧️ Anxious”

### Non-Goals
- Not meant for clinical diagnosis or therapy.
- Not a replacement for professional mental health care.
- AI will not proactively message or nudge based on journal content.

### Tech Stack Suggestions
| Component     | Recommendation                        |
|--------------|----------------------------------------|
| Frontend     | React Native (for cross-platform)      |
| Backend      | Node.js + Express or Firebase          |
| Database     | Firestore (with local persistence)     |
| AI Chat      | OpenAI API (stateless calls)           |
| Graphs       | D3.js or Recharts                      |
| Authentication | Google Sign-In / Email + Password    |
| Security     | End-to-end encryption for journal entries |

### KPIs
- Daily active users (DAU)
- Log consistency (days logged per week)
- Average session time
- Engagement with AI assistant
- Retention rate after 30 days

### Monetization Ideas (Optional)
- Freemium model: Core features free, premium unlocks themes, insights, export
- Mental health resources & book recommendations
- Journaling prompt packs (e.g., “Anxiety toolkit”, “Self-discovery”)

---

