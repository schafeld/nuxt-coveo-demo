# Architecture Overview - Coveo Nuxt Demo

## Project Structure

```
coveo-nuxt-demo/
├── app/
│   ├── app.vue                    # Root Vue component
│   ├── pages/
│   │   └── index.vue              # Main search page
│   ├── components/
│   │   ├── search/
│   │   │   ├── SearchBox.vue      # Search input with suggestions
│   │   │   ├── ResultList.vue     # Search results display
│   │   │   ├── ResultItem.vue     # Individual result card
│   │   │   ├── Facet.vue          # Faceted filtering
│   │   │   ├── Pager.vue          # Pagination controls
│   │   │   └── SortDropdown.vue   # Sort options
│   │   └── layout/
│   │       └── SearchLayout.vue   # Page layout wrapper
│   └── composables/
│       └── useCoveoEngine.ts      # Coveo Headless engine management
├── nuxt.config.ts                 # Nuxt configuration
└── tailwind.config.js             # Tailwind CSS configuration
```

## Coveo Architecture Concepts

### 1. Headless Engine (Core)
**File:** `composables/useCoveoEngine.ts`

The Coveo Headless engine is the central state management system built on Redux. It:
- Manages all search state (queries, results, facets, pagination)
- Handles API communication with Coveo Cloud
- Dispatches actions and updates state reactively

**📚 Coveo Docs:** [Headless Engine](https://docs.coveo.com/en/headless/latest/usage/headless-engine/)

### 2. Controllers (Building Blocks)
Controllers are specialized interfaces to interact with specific features:

| Controller | Purpose | Coveo Docs |
|------------|---------|------------|
| `buildSearchBox` | Query input, suggestions | [SearchBox](https://docs.coveo.com/en/headless/latest/reference/search/controllers/search-box/) |
| `buildResultList` | Display search results | [ResultList](https://docs.coveo.com/en/headless/latest/reference/search/controllers/result-list/) |
| `buildFacet` | Filtering by field values | [Facet](https://docs.coveo.com/en/headless/latest/reference/search/controllers/facet/) |
| `buildPager` | Pagination navigation | [Pager](https://docs.coveo.com/en/headless/latest/reference/search/controllers/pager/) |
| `buildSort` | Result sorting | [Sort](https://docs.coveo.com/en/headless/latest/reference/search/controllers/sort/) |

### 3. State Management Pattern
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Actions   │ -> │ Redux Store  │ -> │ Controllers │
│ (User input)│    │   (State)    │    │   (State)   │
└─────────────┘    └──────────────┘    └─────────────┘
                          ↓
                   ┌──────────────┐
                   │  Vue Refs    │
                   │ (Reactivity) │
                   └──────────────┘
```

### 4. SSR Considerations
Coveo Headless requires browser APIs, so we use `<ClientOnly>` wrappers and client-side initialization.

## Analytics & ML Integration

### Usage Analytics
**📚 Coveo Docs:** [Usage Analytics](https://docs.coveo.com/en/1318/analyze-usage-data/usage-analytics/)

Every search and click event is tracked automatically by the engine. This data powers:
- Query suggestions
- Automatic relevance tuning
- ML-powered ranking

### RGA (Relevance Generative Answering) Integration Points
**📚 Coveo Docs:** [RGA Overview](https://docs.coveo.com/en/n9de0370/)

The current architecture is RGA-ready:
- `ResultList` component can be extended to show generated answers
- Analytics ensures proper ML model training
- Query pipeline can be configured for RGA in Coveo Admin Console

## Key Value Propositions Demonstrated

1. **Unified Search** - Single API for all content sources
2. **ML-Powered Relevance** - Analytics feed machine learning models
3. **Headless Flexibility** - Full UI control with powerful backend
4. **Enterprise Scale** - Built for large document sets
5. **Query Pipelines** - Server-side query manipulation and tuning
