<template>
  <!-- 
    QuerySummary Component
    
    Displays summary information about the current search.
    
    📚 Coveo Documentation:
    - QuerySummary Controller: https://docs.coveo.com/en/headless/latest/reference/search/controllers/query-summary/
    
    Shows:
    - Total number of results
    - Current range (1-10 of 500)
    - Query duration
    - Query terms
  -->
  <div 
    v-if="hasResults"
    class="text-sm text-gray-600"
  >
    <p>
      <!-- Results count -->
      Showing 
      <span class="font-medium text-gray-900">
        {{ firstResult }}-{{ lastResult }}
      </span>
      of 
      <span class="font-medium text-gray-900">
        {{ totalResults.toLocaleString() }}
      </span>
      results
      
      <!-- Query terms -->
      <template v-if="query">
        for 
        <span class="font-medium text-coveo-primary">"{{ query }}"</span>
      </template>
      
      <!-- Duration -->
      <span class="text-gray-400">
        ({{ durationInSeconds }}s)
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * QuerySummary Component Logic
 * 
 * This component demonstrates:
 * 1. QuerySummary controller usage
 * 2. Displaying search statistics
 */

const { createQuerySummary } = useSearchControllers()

// Local reactive state
const totalResults = ref(0)
const firstResult = ref(0)
const lastResult = ref(0)
const query = ref('')
const durationInMilliseconds = ref(0)
const hasResults = ref(false)

// Create the QuerySummary controller
const querySummary = createQuerySummary()

/**
 * Subscribe to query summary state changes
 */
let unsubscribe: (() => void) | null = null

onMounted(() => {
  if (querySummary) {
    unsubscribe = querySummary.subscribe(() => {
      totalResults.value = querySummary.state.total
      firstResult.value = querySummary.state.firstResult
      lastResult.value = querySummary.state.lastResult
      query.value = querySummary.state.query
      durationInMilliseconds.value = querySummary.state.durationInMilliseconds
      hasResults.value = querySummary.state.hasResults
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

/**
 * Computed: Duration in seconds (rounded)
 */
const durationInSeconds = computed(() => 
  (durationInMilliseconds.value / 1000).toFixed(2)
)
</script>
