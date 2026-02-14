<template>
  <!-- 
    DidYouMean Component
    
    Displays spelling corrections and alternative query suggestions.
    
    📚 Coveo Documentation:
    - DidYouMean Controller: https://docs.coveo.com/en/headless/latest/reference/search/controllers/did-you-mean/
    
    How It Works:
    - Coveo detects potential spelling errors
    - Suggests corrections based on index vocabulary
    - Can auto-correct or prompt user to confirm
  -->
  <div v-if="hasCorrection" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
    <!-- Query was auto-corrected -->
    <p v-if="wasAutomaticallyCorrected" class="text-sm text-amber-800">
      Showing results for 
      <span class="font-semibold">"{{ correctedQuery }}"</span>
      instead. 
      <button 
        class="text-coveo-primary hover:underline"
        @click="searchOriginal"
      >
        Search for "{{ originalQuery }}" instead
      </button>
    </p>
    
    <!-- Suggested correction -->
    <p v-else class="text-sm text-amber-800">
      Did you mean 
      <button 
        class="font-semibold text-coveo-primary hover:underline"
        @click="applyCorrection"
      >
        "{{ correctedQuery }}"
      </button>?
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * DidYouMean Component Logic
 * 
 * This component demonstrates the DidYouMean controller
 * for handling spelling corrections.
 */

const { createDidYouMean } = useSearchControllers()

// Local reactive state
const hasCorrection = ref(false)
const wasAutomaticallyCorrected = ref(false)
const correctedQuery = ref('')
const originalQuery = ref('')

// Create the DidYouMean controller
const didYouMean = createDidYouMean()

/**
 * Subscribe to state changes
 */
let unsubscribe: (() => void) | null = null

onMounted(() => {
  if (didYouMean) {
    unsubscribe = didYouMean.subscribe(() => {
      hasCorrection.value = didYouMean.state.hasQueryCorrection
      wasAutomaticallyCorrected.value = didYouMean.state.wasAutomaticallyCorrected
      correctedQuery.value = didYouMean.state.queryCorrection?.correctedQuery || ''
      originalQuery.value = didYouMean.state.originalQuery
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

/**
 * Apply the suggested correction
 */
const applyCorrection = () => {
  if (didYouMean) {
    didYouMean.applyCorrection()
  }
}

/**
 * Search with the original (uncorrected) query
 */
const searchOriginal = () => {
  if (didYouMean) {
    // For auto-corrections, this would undo the correction
    // Implementation depends on Coveo Headless version
  }
}
</script>
