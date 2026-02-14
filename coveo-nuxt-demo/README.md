# Enterprise Knowledge Search with Coveo + Nuxt 3

A demonstration application showcasing Coveo Headless integration with Nuxt 3 (Vue 3 + TypeScript). This project implements a full-featured enterprise search interface with ML-powered relevance, designed with RGA (Relevance Generative Answering) readiness in mind.

## 🎯 What This Demo Shows

| Feature | Implementation | Coveo Concept |
|---------|---------------|---------------|
| Search Box | `SearchBox.vue` | Headless Controllers |
| Query Suggestions | `SearchBox.vue` | ML-powered suggestions |
| Result List | `ResultList.vue` | State subscription pattern |
| Faceted Filtering | `Facet.vue` | Index-driven filtering |
| Pagination | `Pager.vue` | Result navigation |
| Sorting | `SortDropdown.vue` | Relevance vs. field sorting |
| Analytics | `useCoveoAnalytics.ts` | Usage data for ML training |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- A Coveo organization with:
  - API key (with Search scope)
  - Indexed content to search

### Setup

1. **Clone and install:**
   ```bash
   cd coveo-nuxt-demo
   npm install
   ```

2. **Configure Coveo credentials:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   COVEO_ORGANIZATION_ID=your-org-id
   COVEO_API_KEY=your-api-key
   ```
   
   > 📚 **Getting credentials:** [Manage API Keys](https://docs.coveo.com/en/1718/manage-an-organization/manage-api-keys)

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open:** http://localhost:3000

## 📖 Learning Guide: Coveo Fundamentals

This project is designed to help you understand Coveo's core concepts. Here's a guided walkthrough:

### 1. The Headless Engine (Core)

**File:** [app/composables/useCoveoEngine.ts](app/composables/useCoveoEngine.ts)

The Coveo Headless engine is the heart of the application. Think of it as a smart Redux store specifically designed for search:

```typescript
// Create the search engine
const engineConfig = {
  organizationId: 'your-org',      // Your Coveo organization
  accessToken: 'api-key',          // API key with search permissions
  analytics: { enabled: true },    // Critical for ML!
}

const engine = buildSearchEngine(engineConfig)
```

**What the engine does:**
- Manages all search state (queries, results, facets, pagination)
- Handles API communication with Coveo Cloud
- Tracks analytics events for ML model training

> 📚 **Learn more:** [Headless Engine](https://docs.coveo.com/en/headless/latest/usage/headless-engine/)

### 2. Controllers (Building Blocks)

**File:** [app/composables/useSearchControllers.ts](app/composables/useSearchControllers.ts)

Controllers are specialized interfaces that connect UI components to the engine:

```typescript
// Create a search box controller
const searchBox = buildSearchBox(engine, {
  options: { numberOfSuggestions: 5 }
})

// Subscribe to state changes
searchBox.subscribe(() => {
  console.log(searchBox.state.suggestions) // ML-powered suggestions
})

// Trigger actions
searchBox.updateText('query')
searchBox.submit()
```

**Controller Pattern:**
```
User Input → Controller Method → Engine Action → State Update → UI Refresh
```

> 📚 **Learn more:** [Controllers Overview](https://docs.coveo.com/en/headless/latest/usage/controllers/)

### 3. Analytics & ML Training

**File:** [app/composables/useCoveoAnalytics.ts](app/composables/useCoveoAnalytics.ts)

⚠️ **This is critical!** Every search and click event feeds into Coveo's ML models:

```typescript
// When a user clicks a result
logDocumentClick(result)
```

**What ML learns from analytics:**

| Event | ML Feature | Result |
|-------|-----------|--------|
| Search queries | Query suggestions | Typeahead predictions |
| Result clicks | Automatic Relevance Tuning | Better ranking |
| Click position | Position bias | Ranking corrections |
| Session patterns | Personalization | User-specific results |

> 📚 **Learn more:** [Usage Analytics](https://docs.coveo.com/en/1318/analyze-usage-data/usage-analytics/)

### 4. Query Pipelines (Server-Side)

Query pipelines are configured in the Coveo Admin Console (not in this code), but understanding them is essential:

**What pipelines do:**
- Apply query rules (synonyms, stop words)
- Boost specific content
- Filter results by permissions
- Execute ML models

```
User Query → Pipeline → ML Ranking → Results
```

> 📚 **Learn more:** [Query Pipelines](https://docs.coveo.com/en/1791/)

### 5. RGA Integration Points

**Files:** Look for `🚀 RGA Integration Point` comments in:
- [app/pages/index.vue](app/pages/index.vue)
- [app/components/search/ResultItem.vue](app/components/search/ResultItem.vue)

This architecture is **RGA-ready**. Relevance Generative Answering would integrate by:

1. Adding the RGA controller:
   ```typescript
   import { buildGeneratedAnswer } from '@coveo/headless'
   const generatedAnswer = buildGeneratedAnswer(engine)
   ```

2. Displaying generated content above results
3. Including citation links to source documents
4. Collecting feedback for model improvement

> 📚 **Learn more:** [RGA Overview](https://docs.coveo.com/en/n9de0370/)

## 🏗️ Project Architecture

```
app/
├── composables/
│   ├── useCoveoEngine.ts      # Engine singleton management
│   ├── useSearchControllers.ts # Controller factory functions
│   └── useCoveoAnalytics.ts   # Analytics tracking utilities
│
├── components/search/
│   ├── SearchBox.vue          # Query input + suggestions
│   ├── ResultList.vue         # Results container
│   ├── ResultItem.vue         # Individual result card
│   ├── Facet.vue              # Filter component
│   ├── Pager.vue              # Pagination controls
│   ├── QuerySummary.vue       # "X results for Y" display
│   ├── SortDropdown.vue       # Sort options
│   └── DidYouMean.vue         # Spelling corrections
│
├── pages/
│   └── index.vue              # Main search page
│
└── app.vue                    # Root component
```

## 🔧 Customization Guide

### Adding a New Facet

1. Ensure the field is configured as "Facet" in Coveo Admin Console
2. Add the component in `pages/index.vue`:
   ```vue
   <SearchFacet field="yourField" label="Your Label" />
   ```

### Customizing Result Display

Edit `components/search/ResultItem.vue` to:
- Add new metadata fields
- Change layout/styling
- Add action buttons (share, save, etc.)

### Changing Search Behavior

Modify `composables/useCoveoEngine.ts`:
- Change default search hub
- Set default query parameters
- Adjust analytics configuration

## 📚 Key Coveo Documentation

| Topic | Link |
|-------|------|
| Headless Library | [docs.coveo.com/en/headless](https://docs.coveo.com/en/headless/) |
| API Key Setup | [docs.coveo.com/en/1718](https://docs.coveo.com/en/1718/manage-an-organization/manage-api-keys) |
| Query Pipelines | [docs.coveo.com/en/1791](https://docs.coveo.com/en/1791/) |
| Analytics | [docs.coveo.com/en/1318](https://docs.coveo.com/en/1318/analyze-usage-data/usage-analytics/) |
| RGA | [docs.coveo.com/en/n9de0370](https://docs.coveo.com/en/n9de0370/) |
| Field Configuration | [docs.coveo.com/en/2036](https://docs.coveo.com/en/2036/) |

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Extend with additional Coveo features
- Improve styling and UX
- Add tests
- Experiment with different configurations

## 📄 License

MIT
