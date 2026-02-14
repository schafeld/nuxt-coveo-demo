<template>
  <!-- 
    ResultList Component
    
    Displays search results from Coveo with loading states.
    
    📚 Coveo Documentation:
    - ResultList Controller: https://docs.coveo.com/en/headless/latest/reference/search/controllers/result-list/
    - Result Templates: https://docs.coveo.com/en/headless/latest/usage/result-templates/
    
    Key Features:
    - Reactive result display
    - Loading skeleton states
    - Click analytics tracking
    - Support for custom result templates
  -->
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <ResultSkeleton v-for="i in 5" :key="i" />
    </div>
    
    <!-- No Results State -->
    <div 
      v-else-if="results.length === 0 && hasSearched"
      class="text-center py-12"
    >
      <svg 
        class="mx-auto w-16 h-16 text-gray-300 mb-4"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No results found</h3>
      <p class="text-gray-500">Try adjusting your search terms or filters</p>
    </div>
    
    <!-- Results List -->
    <TransitionGroup
      v-else
      name="result"
      tag="div"
      class="space-y-4"
    >
      <ResultItem
        v-for="result in results"
        :key="result.uniqueId"
        :result="result"
        @click="trackClick(result)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
/**
 * ResultList Component Logic
 * 
 * This component demonstrates:
 * 1. Result list controller subscription
 * 2. Loading state management
 * 3. Click analytics tracking (critical for ML)
 * 
 * 💡 Why Click Tracking Matters:
 * Coveo's ML models learn from user behavior:
 * - Which results get clicked?
 * - How long do users spend on results?
 * - Do users return to search after clicking?
 * 
 * This data powers:
 * - Automatic Relevance Tuning (ART)
 * - Query Suggestions
 * - RGA answer quality
 * 
 * 📚 Analytics: https://docs.coveo.com/en/1318/analyze-usage-data/usage-analytics/
 */

import type { Result } from '@coveo/headless'

const { createResultList, engine } = useSearchControllers()
const { logDocumentClick } = useCoveoAnalytics()

// Local reactive state
const results = ref<Result[]>([])
const isLoading = ref(false)
const hasSearched = ref(false)

// Create the ResultList controller
const resultList = createResultList()

/**
 * Subscribe to result list state changes
 */
let unsubscribe: (() => void) | null = null

onMounted(() => {
  if (resultList) {
    unsubscribe = resultList.subscribe(() => {
      results.value = resultList.state.results
      isLoading.value = resultList.state.isLoading
      hasSearched.value = resultList.state.hasResults || resultList.state.searchResponseId !== ''
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

/**
 * Track result clicks for analytics
 * 
 * This is CRITICAL for ML model training!
 * 
 * The logDocumentOpen/logClick action:
 * 1. Records which result was clicked
 * 2. Includes rank position in results
 * 3. Associates with the current query
 * 4. Feeds into relevance models
 * 
 * 📚 Click Analytics: https://docs.coveo.com/en/headless/latest/usage/log-search-events/
 */
const trackClick = (result: Result) => {
  // Log the click event for analytics and ML training
  logDocumentClick(result)
}
</script>

<style scoped>
/* Result transition animations */
.result-enter-active,
.result-leave-active {
  transition: all 0.3s ease;
}
.result-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.result-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
