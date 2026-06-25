# Product Requirements Document (PRD)

## Project Overview

**Trading Exchange** is a proof-of-concept AI-powered cryptocurrency analysis and trading intelligence system. It uses local LLM (Mistral via Ollama) with Retrieval-Augmented Generation (RAG) to analyze historical trade data and news, generating real-time buy/sell signals for crypto assets.

---

## Vision & Problem

**Vision:** Build an intelligent trading assistant that leverages AI to analyze crypto markets by combining historical trade patterns, market sentiment, and news signals into actionable trading decisions.

**Problem:**
- Manual crypto trading analysis is time-consuming and emotion-driven
- Existing trading bots lack context awareness (no understanding of news, market sentiment)
- Centralized API-based solutions create privacy concerns and dependency risks
- No unified system that combines technical analysis with AI reasoning

**Solution:** A local-first, LLM-powered system that ingests trade history + news, reasons about market conditions, and outputs structured trading signals (BUY/SELL/HOLD).

---

## Scope

### Phase 1: Real-Time Analysis (Current POC)
**Objective:** Validate that Ollama + RAG can generate meaningful trading insights

**In Scope:**
- Fetch real-time crypto market data (trades, prices)
- Scrape/ingest news related to crypto assets
- Load historical trade data into RAG knowledge base
- Use Mistral (via Ollama) to analyze market conditions
- Generate trading signals (BUY/SELL/HOLD) with reasoning
- Display analysis and signals via React UI

**Out of Scope:**
- Automated trade execution
- Portfolio management
- Risk modeling / stop-loss logic
- Advanced backtesting

### Phase 2: RAG Enhancement (Future)
- Implement persistent vector DB for trade history
- Add semantic search over news + trade patterns
- Improve signal quality with historical accuracy tracking
- Add multi-timeframe analysis

### Phase 3: Automated Trading (Future)
- Implement paper trading first
- Add risk management (position sizing, stop-loss)
- Automated order execution with analysis-based signal gates
- Portfolio tracking and P&L reporting

---

## Core Features (Phase 1)

### 1. Real-Time Data Ingestion
- **Trade History:** Fetch historical trade data from public APIs (CoinGecko, Binance, etc.)
- **News Feed:** Scrape/subscribe to crypto news sources (RSS feeds, APIs)
- **Market Data:** Live price quotes, volume, volatility indicators

### 2. RAG-Powered Analysis
- Store historical trades + news in a searchable knowledge base
- Mistral (via Ollama) retrieves relevant context
- LLM reasons about market conditions and generates analysis
- Output: Structured JSON with signal, confidence, reasoning

### 3. Trading Signal Generation
- **Buy Signal:** LLM determines positive conditions (technical + sentiment)
- **Sell Signal:** LLM identifies weakness or risk
- **Hold Signal:** Neutral/unclear market conditions
- Each signal includes: timestamp, asset, confidence score (0-1), reasoning

### 4. Web UI (React)
- Dashboard showing live signals for tracked assets
- Trade history with analysis context
- News feed aggregated by relevance to signals
- Signal confidence trends over time
- Settings: asset selection, Ollama endpoint config, data sources

### 5. Python Backend (FastAPI)
- API endpoints for data ingestion, analysis, signal retrieval
- Ollama integration (local LLM calls)
- RAG orchestration (retrieval + generation)
- Background tasks for continuous data fetching
- Data persistence (SQLite or PostgreSQL)

---

## Use Cases

### Use Case 1: Crypto Trader Seeks Buy/Sell Signals
**Actor:** Trader monitoring Bitcoin  
**Flow:**
1. Open dashboard, select asset (BTC)
2. System fetches latest trades + relevant news
3. Mistral analyzes market context via RAG
4. Signal generated: "BUY (confidence: 0.78) — positive sentiment in news + rising volume"
5. Trader reviews analysis and decides to act

### Use Case 2: Understand Trade Recommendation Logic
**Actor:** Same trader  
**Flow:**
1. Click on signal to expand details
2. See reasoning: which news articles + trade patterns influenced the signal
3. Audit trail: "Retrieved: 5 recent trades, 3 relevant articles, 2026-06-25 18:45 UTC"
4. Trader gains confidence in the recommendation or dismisses it

### Use Case 3: Monitor Multiple Assets
**Actor:** Same trader  
**Flow:**
1. Add multiple assets to dashboard (BTC, ETH, SOL)
2. See signals for all assets in real-time
3. Prioritize trades based on signal confidence + market conditions

---

## Technical Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS | Interactive UI, real-time updates |
| **Backend** | Python 3.11+, FastAPI | API, data orchestration, RAG logic |
| **LLM** | Mistral (via Ollama) | Local inference, no API dependencies |
| **Data Sources** | Public APIs (Binance, CoinGecko, newsfeeds) | Real-time trades, prices, news |
| **Storage** | SQLite / PostgreSQL | Trade history, signals, analysis logs |
| **Containerization** | Docker | Isolated backend + frontend services |
| **RAG Framework** | LangChain or custom | Retrieval + generation pipeline |

---

## Success Metrics (Phase 1)

### Functional
- ✅ System successfully generates signals in <10 seconds per request
- ✅ Signal quality: >70% of generated signals match manual trader intuition (subjective validation)
- ✅ UI displays signals and analysis without lag
- ✅ Data ingestion runs continuously without errors

### User Experience
- Dashboard loads in <2 seconds
- Signal reasoning is human-readable
- Trader can configure assets and data sources via UI

### Engineering
- All major components containerized and runnable locally
- Ollama integration is stable (no connection drops)
- Logs capture decision traces for debugging

---

## Constraints & Assumptions

### Constraints
- **Local-only:** No cloud dependencies; Ollama runs on trader's machine
- **Single-user:** POC is internal; no multi-user auth
- **Limited computational:** Mistral model must run on modest hardware
- **Real-time data:** Public APIs with rate limits; graceful degradation expected
- **No live trading:** Phase 1 is analysis-only; no actual order execution

### Assumptions
1. Mistral (via Ollama) can reason meaningfully about crypto market conditions
2. Combining trade history + news improves signal quality over either alone
3. Public APIs (Binance, CoinGecko) provide sufficient real-time data
4. Trader will find RAG-generated reasoning more useful than black-box predictions
5. Local LLM is more reliable than API-based services for this use case

---

## Out of Scope

- Multi-user authentication / authorization
- Cloud deployment (AWS, GCP, etc.)
- Advanced portfolio optimization
- Risk analytics (Sharpe ratio, VAR, etc.)
- Backtesting engine
- Automated trade execution (Phase 3 future work)
- Model fine-tuning (using Mistral as-is)

---

## Roadmap

| Phase | Goal | Timeline |
|-------|------|----------|
| **Phase 1: Validation** | Real-time signals via Ollama + RAG | Current (POC) |
| **Phase 2: Refinement** | Improve signal quality, add vector DB, multi-timeframe | TBD |
| **Phase 3: Automation** | Paper trading, risk gates, live execution | TBD |
| **Future: Monetization** | Multi-user SaaS, API access, premium models | TBD |

---

## Open Questions & Assumptions

- [ASSUMPTION] Mistral is sufficient for market reasoning; no need for larger model (Llama 70B)
- [ASSUMPTION] SQLite is adequate for Phase 1 data persistence
- [QUESTION] How to measure signal quality objectively? (need backtest framework or trader feedback loop)
- [QUESTION] Should signals be deterministic (same input → same output) or allow LLM randomness?

---

**Last Updated:** 2026-06-25  
**Version:** 1.0 (POC)  
**Author:** RToledo  
**Status:** Active Development
