# Architecture — Trading Exchange POC

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Trading Exchange                          │
│         (AI-Powered Crypto Analysis System)                 │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐        ┌─────────┐       ┌────────────┐
   │ Frontend│        │ Backend │       │  Ollama    │
   │ (React) │        │(FastAPI)│       │ (Mistral)  │
   │ Vite    │        │ Python  │       │ Local LLM  │
   └─────────┘        └─────────┘       └────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │Public API│      │  News    │      │ Database │
   │(Binance, │      │  Feed    │      │ (SQLite/ │
   │ CoinGecko)      │  (RSS)   │      │ PostgreSQL)
   └──────────┘      └──────────┘      └──────────┘
```

## Architecture Components

### 1. **Frontend (React + Vite + Tailwind)**

**Purpose:** Real-time dashboard for viewing trading signals and analysis

**Key Directories:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── SignalCard.tsx      # Individual signal display
│   │   ├── NewsPanel.tsx       # News aggregation
│   │   ├── Settings.tsx        # Config (assets, Ollama endpoint)
│   │   └── ...
│   ├── pages/
│   │   ├── index.tsx           # Home
│   │   └── analysis/[id].tsx   # Detailed signal view
│   ├── services/
│   │   └── api.ts             # Calls backend endpoints
│   ├── hooks/
│   │   └── useSignals.ts      # Real-time signal fetching
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── vite.config.ts
├── tailwind.config.js
└── package.json (Node ≥18)
```

**Key Features:**
- Live signal feed (real-time updates via polling/WebSocket)
- Asset selector (BTC, ETH, etc.)
- Confidence visualization (gauge or trend chart)
- Reasoning/analysis display (LLM output)
- Settings: Ollama endpoint, tracked assets, data sources
- News feed aggregated by relevance to signals

**External APIs Called:**
- Backend FastAPI endpoints (`GET /signals`, `POST /assets`, etc.)

---

### 2. **Backend (Python FastAPI)**

**Purpose:** Orchestrate data ingestion, RAG, LLM calls; serve API to frontend

**Key Directories:**
```
backend/
├── app/
│   ├── main.py                # FastAPI app + routes
│   ├── models/
│   │   ├── signal.py          # Signal schema (BUY/SELL/HOLD)
│   │   ├── trade.py           # Trade history schema
│   │   └── analysis.py        # Analysis result schema
│   ├── services/
│   │   ├── data_ingestion.py  # Fetch trades + news
│   │   ├── rag_service.py     # RAG orchestration
│   │   ├── ollama_service.py  # Mistral LLM calls
│   │   ├── analysis_engine.py # Signal generation logic
│   │   └── storage_service.py # DB operations
│   ├── tasks/
│   │   └── background.py      # Continuous data fetching
│   ├── config.py              # Env vars (API keys, Ollama URL)
│   └── requirements.txt        # Dependencies
├── Dockerfile
├── pyproject.toml
└── .python-version
```

**Key Dependencies:**
- **FastAPI** — Web framework
- **Pydantic** — Data validation
- **SQLAlchemy** — ORM for database
- **Requests** — HTTP client (fetch trades, news)
- **LangChain** (or custom) — RAG orchestration
- **Ollama Python client** — Mistral inference
- **APScheduler** (or Celery) — Background tasks

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/signals` | List recent signals |
| `GET` | `/signals/{id}` | Get signal detail + reasoning |
| `POST` | `/analyze` | Trigger on-demand analysis for asset |
| `GET` | `/assets` | List tracked assets |
| `POST` | `/assets` | Add new asset to track |
| `GET` | `/news` | News feed (latest ingested articles) |
| `GET` | `/health` | System health (Ollama, DB, API status) |

**Background Tasks:**
- Poll Binance/CoinGecko every 5 minutes for new trades
- Fetch crypto news every 15 minutes from RSS feeds
- Generate signals for all tracked assets after data update
- Rotate/clean old data from database

---

### 3. **Ollama Integration (Mistral LLM)**

**Purpose:** Local inference engine; generates market analysis and signals

**Setup:**
- Ollama runs locally (docker container or native installation)
- Model: `mistral` (7B or 13B variant, depending on hardware)
- Endpoint: `http://localhost:11434/api/generate` (or custom port)

**Workflow:**
1. Backend retrieves relevant trades + news from database (RAG step)
2. Constructs prompt: "Given these trades and news articles, should we BUY/SELL/HOLD?"
3. Calls Ollama `/api/generate` with prompt
4. Parses response: extracts signal (BUY/SELL/HOLD), confidence, reasoning
5. Stores signal + metadata in database
6. Returns to frontend

**Prompt Structure (Example):**
```
You are a crypto trading analyst. Analyze the following data and provide a BUY/SELL/HOLD signal.

Recent trades (last 24h):
- BTC: 42,500 USD (volume: 150K), 42,300 USD (volume: 120K), ...

Market sentiment (from news):
- "Bitcoin surges on Fed announcement" (2026-06-25)
- "Crypto regulation fears ease" (2026-06-25)

Your analysis should be structured as JSON:
{
  "signal": "BUY" | "SELL" | "HOLD",
  "confidence": 0.0-1.0,
  "reasoning": "...",
  "timeframe": "short-term" | "medium-term" | "long-term"
}
```

---

### 4. **Data Sources**

#### Public APIs
- **Binance API** — Real-time OHLCV data, trade history
- **CoinGecko API** — Market data, price index
- **Alternative.me** — Crypto fear/greed index (sentiment)

#### News Feed
- **Crypto news RSS feeds** (CoinDesk, Cointelegraph, etc.)
- **Twitter/X API** (future) — Sentiment tracking
- **On-chain events** (future) — Large transactions, whale activity

#### Local Storage (SQLite/PostgreSQL)
```
Tables:
  - trades (id, asset, price, volume, timestamp, source)
  - news_articles (id, title, content, source, url, timestamp, asset_tags)
  - signals (id, asset, signal, confidence, reasoning, created_at, expires_at)
  - analysis_logs (id, signal_id, prompt, response, ollama_latency, timestamp)
```

---

## Data Flow

### Flow 1: Continuous Data Ingestion

```
Every 5 minutes (Scheduler)
                │
                ▼
┌──────────────────────────────┐
│ Background Task             │
│ - Fetch new trades via API  │
│ - Fetch news articles       │
└──────────────────────────────┘
                │
                ▼
┌──────────────────────────────┐
│ Store in Database           │
│ (trades, news tables)       │
└──────────────────────────────┘
                │
                ▼
        Trigger Analysis
```

### Flow 2: Signal Generation (RAG + LLM)

```
User opens dashboard
                │
                ▼
┌──────────────────────────────┐
│ Frontend requests /signals   │
└──────────────────────────────┘
                │
                ▼
┌──────────────────────────────┐
│ Backend: Retrieve context    │
│ - Last N trades (SQL query)  │
│ - Relevant news (search)     │
└──────────────────────────────┘
                │
                ▼
┌──────────────────────────────┐
│ Construct RAG prompt         │
│ + historical context         │
└──────────────────────────────┘
                │
                ▼
┌──────────────────────────────┐
│ Call Ollama (Mistral)        │
│ Generate analysis + signal   │
└──────────────────────────────┘
                │
                ▼
┌──────────────────────────────┐
│ Store signal in DB           │
│ (signals table)              │
└──────────────────────────────┘
                │
                ▼
        Return to Frontend
     Display signal + reasoning
```

### Flow 3: Multi-Asset Analysis

```
Asset tracking list: [BTC, ETH, SOL]
                │
                ├─→ Analyze BTC (parallel)
                ├─→ Analyze ETH (parallel)
                └─→ Analyze SOL (parallel)
                │
                ▼
        Aggregate signals
        Display on dashboard
```

---

## Technology Decisions

### 1. **Local LLM (Ollama + Mistral)**
**Decision:** Run LLM locally, not via API
**Why:**
- No external API dependencies (privacy, latency, cost)
- Faster iteration (can experiment with prompts locally)
- Full control over model and inference parameters
- POC-friendly (low ops overhead)

### 2. **FastAPI for Backend**
**Decision:** Use FastAPI over Flask or Django
**Why:**
- Async support (efficient polling + multiple concurrent tasks)
- Built-in OpenAPI docs
- Pydantic validation (type safety)
- Good performance for lightweight APIs
- Low overhead for POC

### 3. **React + Vite for Frontend**
**Decision:** Modern React + Vite (not Next.js)
**Why:**
- Fast dev server (Vite)
- Lightweight (no SSR needed for POC)
- TailwindCSS for rapid UI prototyping
- TypeScript for safety
- Can be deployed as static site if needed

### 4. **SQLite for Phase 1**
**Decision:** SQLite for data persistence
**Why:**
- Zero external dependencies
- Good for single-user POC
- Upgrade to PostgreSQL in Phase 2 if needed
- Files are easy to backup/version

### 5. **Docker for Containerization**
**Decision:** Separate containers for frontend, backend, Ollama
**Why:**
- Isolation (Ollama doesn't interfere with backend)
- Easy local development (docker-compose)
- Scales to full deployment later
- Reproducibility across machines

---

## Deployment Model (Phase 1 - Local)

```
docker-compose.yml
  ├─ frontend (React, port 5173)
  ├─ backend (FastAPI, port 8000)
  ├─ ollama (Mistral, port 11434)
  └─ postgres (optional; SQLite default)

User runs: docker-compose up
           → All services start locally
           → Access UI at http://localhost:5173
```

**Future:** Add cloud deployment (AWS/GCP) and multi-user auth.

---

## Security Considerations

### Phase 1 (POC)
- No authentication (single-user, local)
- Ollama endpoint not exposed (localhost only)
- Trade/news data not sensitive (public market data)
- No secrets management (hardcoded defaults ok for POC)

### Phase 2+ (Future)
- Add API key authentication (user → backend)
- Isolate Ollama (not accessible from network)
- Encrypt database (if adding multi-user)
- Secrets management (env vars, vault)
- Input validation/sanitization on all APIs

---

## Observability & Monitoring

### Logging
- Backend: FastAPI request logs + analysis logs (prompt, response, latency)
- Ollama: Inference latency, errors
- Frontend: Console logs for debugging

### Metrics (Phase 1)
- Signal generation latency (target: <10 seconds)
- Data ingestion success rate
- Ollama availability/uptime
- Database query latency

### Debugging
- `/health` endpoint returns status of Ollama, DB, API sources
- Analysis logs stored (prompt + response) for audit trail

---

## Open Technical Questions

- [ASSUMPTION] Mistral 7B is sufficient; may need 13B for complex reasoning
- [QUESTION] Should signals be ephemeral (expire after 30 minutes) or persistent?
- [QUESTION] How to handle Ollama model loading time? (warm up on startup?)
- [QUESTION] Deterministic vs. stochastic signal generation? (set temperature=0 or allow randomness?)

---

**Last Updated:** 2026-06-25
**Version:** 1.0 (POC Architecture)
**Status:** Baseline Design
**Next Review:** Post-Phase 1 Validation
