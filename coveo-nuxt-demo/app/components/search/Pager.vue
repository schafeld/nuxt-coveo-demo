<template>
  <!-- 
    Pager Component
    
    Pagination controls for navigating through search results.
    
    📚 Coveo Documentation:
    - Pager Controller: https://docs.coveo.com/en/headless/latest/reference/search/controllers/pager/
    
    Key Features:
    - Page number navigation
    - Previous/Next buttons
    - Current page indicator
    - Total results awareness
  -->
  <nav 
    v-if="hasPagination"
    class="flex items-center justify-center gap-2"
    aria-label="Search results pagination"
  >
    <!-- Previous Button -->
    <button
      :disabled="!hasPreviousPage"
      :class="[
        'p-2 rounded-lg transition-colors',
        hasPreviousPage 
          ? 'hover:bg-gray-100 text-gray-700' 
          : 'text-gray-300 cursor-not-allowed'
      ]"
      @click="goToPrevious"
      aria-label="Previous page"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <!-- Page Numbers -->
    <div class="flex items-center gap-1">
      <button
        v-for="page in pages"
        :key="page"
        :class="[
          'w-10 h-10 rounded-lg font-medium transition-colors',
          page === currentPage
            ? 'bg-coveo-primary text-white'
            : 'hover:bg-gray-100 text-gray-700'
        ]"
        :aria-current="page === currentPage ? 'page' : undefined"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </div>
    
    <!-- Next Button -->
    <button
      :disabled="!hasNextPage"
      :class="[
        'p-2 rounded-lg transition-colors',
        hasNextPage 
          ? 'hover:bg-gray-100 text-gray-700' 
          : 'text-gray-300 cursor-not-allowed'
      ]"
      @click="goToNext"
      aria-label="Next page"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
/**
 * Pager Component Logic
 * 
 * This component demonstrates:
 * 1. Pager controller usage
 * 2. Page navigation
 * 3. State-driven UI (disabled states, current page)
 * 
 * 💡 Pagination in Coveo:
 * - Default page size is 10 results
 * - Maximum is typically 1000 results (configurable)
 * - Deep pagination uses scroll-based fetching
 */

const { createPager } = useSearchControllers()

// Local reactive state
const currentPage = ref(1)
const pages = ref<number[]>([])
const hasNextPage = ref(false)
const hasPreviousPage = ref(false)
const maxPage = ref(1)

// Create the Pager controller
const pager = createPager(5)

/**
 * Subscribe to pager state changes
 */
let unsubscribe: (() => void) | null = null

onMounted(() => {
  if (pager) {
    unsubscribe = pager.subscribe(() => {
      currentPage.value = pager.state.currentPage
      pages.value = pager.state.currentPages
      hasNextPage.value = pager.state.hasNextPage
      hasPreviousPage.value = pager.state.hasPreviousPage
      maxPage.value = pager.state.maxPage
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

/**
 * Computed: Check if pagination should be shown
 */
const hasPagination = computed(() => maxPage.value > 1)

/**
 * Navigate to a specific page
 */
const goToPage = (page: number) => {
  if (pager) {
    pager.selectPage(page)
  }
}

/**
 * Navigate to the next page
 */
const goToNext = () => {
  if (pager && hasNextPage.value) {
    pager.nextPage()
  }
}

/**
 * Navigate to the previous page
 */
const goToPrevious = () => {
  if (pager && hasPreviousPage.value) {
    pager.previousPage()
  }
}
</script>
