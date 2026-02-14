<template>
  <!-- 
    Main Search Page
    
    This is the primary search interface demonstrating Coveo Headless
    integration with Nuxt 3 and Vue 3.
    
    📚 Coveo Documentation:
    - Headless Overview: https://docs.coveo.com/en/headless/
    - Best Practices: https://docs.coveo.com/en/headless/latest/usage/best-practices/
    
    Architecture Overview:
    
    ┌─────────────────────────────────────────────────────────────┐
    │                     SearchPage.vue                          │
    │  ┌─────────────────────────────────────────────────────┐   │
    │  │                   SearchBox                          │   │
    │  │  (Query input + ML-powered suggestions)              │   │
    │  └─────────────────────────────────────────────────────┘   │
    │                                                             │
    │  ┌─────────────┐  ┌─────────────────────────────────────┐  │
    │  │   Facets    │  │          Results Area               │  │
    │  │             │  │  ┌─────────────────────────────┐    │  │
    │  │  - Source   │  │  │ QuerySummary | SortDropdown │    │  │
    │  │  - FileType │  │  └─────────────────────────────┘    │  │
    │  │  - Author   │  │                                     │  │
    │  │             │  │  ┌─────────────────────────────┐    │  │
    │  │             │  │  │      ResultList             │    │  │
    │  │             │  │  │      - ResultItem           │    │  │
    │  │             │  │  │      - ResultItem           │    │  │
    │  │             │  │  │      - ResultItem           │    │  │
    │  │             │  │  └─────────────────────────────┘    │  │
    │  │             │  │                                     │  │
    │  │             │  │  ┌─────────────────────────────┐    │  │
    │  │             │  │  │          Pager              │    │  │
    │  └─────────────┘  │  └─────────────────────────────┘    │  │
    │                   └─────────────────────────────────────┘  │
    └─────────────────────────────────────────────────────────────┘
  -->
  <div class="min-h-screen bg-coveo-background">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Logo -->
            <div class="w-10 h-10 bg-coveo-primary rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Enterprise Search</h1>
              <p class="text-xs text-gray-500">Powered by Coveo Headless</p>
            </div>
          </div>
          
          <!-- Info Badge -->
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs text-blue-700">RGA-Ready Architecture</span>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- 
        ClientOnly wrapper for Coveo components
        
        ⚠️ SSR Consideration:
        Coveo Headless requires browser APIs (localStorage, fetch with credentials).
        We wrap all Coveo-dependent components in <ClientOnly> to ensure they
        only render on the client side.
        
        For SSR-rendered search, you would:
        1. Use @coveo/headless-ssr package
        2. Implement API routes for server-side search
        3. Hydrate client with initial state
        
        📚 SSR Guide: https://docs.coveo.com/en/headless/latest/usage/ssr/
      -->
      <ClientOnly>
        <!-- Search Box Section -->
        <section class="mb-8">
          <SearchSearchBox placeholder="Search the knowledge base..." />
        </section>
        
        <!-- Results Layout -->
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar: Facets -->
          <aside class="w-full lg:w-64 space-y-4">
            <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Filter Results
            </h2>
            
            <!-- 
              Facets
              
              Common facet fields (configure these based on your index):
              - @source: Content source/repository
              - @filetype: Document type (PDF, HTML, etc.)
              - @author: Content creator
              - @language: Document language
              
              💡 Field Configuration:
              Facet fields must be set as "Facet" type in Coveo
              Administration Console under Source > Fields.
              
              📚 Field Configuration: https://docs.coveo.com/en/2036/
            -->
            <SearchFacet field="source" label="Source" />
            <SearchFacet field="filetype" label="File Type" />
            <SearchFacet field="author" label="Author" />
          </aside>
          
          <!-- Main: Results -->
          <div class="flex-1 min-w-0">
            <!-- Results Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <SearchQuerySummary />
              <SearchSortDropdown />
            </div>
            
            <!-- 
              🚀 RGA Integration Point
              
              This is where you would add the Relevance Generative Answering component.
              RGA displays AI-generated answers based on search results.
              
              Example placement:
              <RGAAnswer /> 
              
              The RGA answer would appear above regular results, showing:
              - Generated answer text
              - Source citations
              - Feedback controls
              
              📚 RGA Integration: https://docs.coveo.com/en/n9de0370/
            -->
            
            <!-- Did You Mean -->
            <SearchDidYouMean />
            
            <!-- Result List -->
            <SearchResultList />
            
            <!-- Pagination -->
            <div class="mt-8">
              <SearchPager />
            </div>
          </div>
        </div>
        
        <!-- Loading Fallback -->
        <template #fallback>
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-coveo-primary"></div>
            <span class="ml-3 text-gray-600">Initializing search engine...</span>
          </div>
        </template>
      </ClientOnly>
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            Built with 
            <a href="https://nuxt.com" target="_blank" class="text-coveo-primary hover:underline">Nuxt 3</a>
            + 
            <a href="https://docs.coveo.com/en/headless/" target="_blank" class="text-coveo-primary hover:underline">Coveo Headless</a>
          </p>
          <div class="flex items-center gap-4">
            <a 
              href="https://docs.coveo.com/en/headless/" 
              target="_blank"
              class="hover:text-coveo-primary transition-colors"
            >
              Documentation
            </a>
            <a 
              href="https://github.com/coveo/ui-kit" 
              target="_blank"
              class="hover:text-coveo-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * Main Search Page Setup
 * 
 * This page initializes the Coveo engine and executes the first search.
 * All child components share the same engine instance through composables.
 */

const { executeFirstSearch, isReady } = useCoveoEngine()

/**
 * Execute the first search when the component mounts
 * 
 * executeFirstSearch() triggers an initial API call to Coveo Cloud.
 * This populates the initial results and facet values.
 * 
 * 💡 You can customize the initial search by:
 * - Setting default query parameters in the engine config
 * - Using context parameters for personalization
 * - Applying pre-defined filters
 */
onMounted(() => {
  if (isReady.value) {
    executeFirstSearch()
  }
})
</script>
