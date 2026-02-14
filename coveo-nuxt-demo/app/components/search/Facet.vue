<template>
  <!-- 
    Facet Component
    
    Displays filterable facet values for a specific field.
    
    📚 Coveo Documentation:
    - Facet Controller: https://docs.coveo.com/en/headless/latest/reference/search/controllers/facet/
    - Facet Configuration: https://docs.coveo.com/en/1580/
    
    Key Features:
    - Dynamic value counts from search results
    - Multi-select filtering
    - Show more/less functionality
    - Clear selection option
    
    💡 Why Facets Matter:
    Facets help users narrow down results by specific criteria.
    They're powered by Coveo's inverted index, making them
    extremely fast even with millions of documents.
  -->
  <div 
    v-if="hasValues"
    class="bg-white border border-gray-200 rounded-lg overflow-hidden"
  >
    <!-- Facet Header -->
    <button
      class="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      @click="isExpanded = !isExpanded"
    >
      <h3 class="font-semibold text-gray-900">{{ label }}</h3>
      <svg 
        :class="['w-5 h-5 text-gray-500 transition-transform', { 'rotate-180': isExpanded }]"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <!-- Facet Values -->
    <Transition name="expand">
      <div v-if="isExpanded" class="p-4">
        <!-- Active Filters Clear Button -->
        <button
          v-if="hasActiveValues"
          class="text-sm text-coveo-primary hover:underline mb-3 flex items-center gap-1"
          @click="clearSelections"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </button>
        
        <!-- Facet Value List -->
        <ul class="space-y-2">
          <li
            v-for="value in displayedValues"
            :key="value.value"
          >
            <label 
              class="flex items-center gap-3 cursor-pointer group"
            >
              <!-- Checkbox -->
              <input
                type="checkbox"
                :checked="value.state === 'selected'"
                class="w-4 h-4 text-coveo-primary border-gray-300 rounded focus:ring-coveo-primary"
                @change="toggleValue(value)"
              />
              
              <!-- Value Label -->
              <span 
                :class="[
                  'flex-1 text-sm',
                  value.state === 'selected' ? 'font-medium text-coveo-primary' : 'text-gray-700'
                ]"
              >
                {{ value.value }}
              </span>
              
              <!-- Count Badge -->
              <span 
                class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
              >
                {{ value.numberOfResults.toLocaleString() }}
              </span>
            </label>
          </li>
        </ul>
        
        <!-- Show More/Less Button -->
        <button
          v-if="canShowMore || canShowLess"
          class="mt-3 text-sm text-coveo-primary hover:underline flex items-center gap-1"
          @click="toggleShowMore"
        >
          <template v-if="canShowMore">
            Show more
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </template>
          <template v-else>
            Show less
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </template>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * Facet Component Logic
 * 
 * This component demonstrates:
 * 1. Facet controller usage
 * 2. Value selection/deselection
 * 3. Show more/less functionality
 * 4. Clear all selections
 * 
 * 💡 Facet State Values:
 * - 'idle': Not selected
 * - 'selected': Actively filtering results
 * - 'excluded': Excluding this value (advanced)
 */

import type { FacetValue } from '@coveo/headless'

const props = defineProps<{
  field: string
  label: string
}>()

const { createFacet } = useSearchControllers()

// Local reactive state
const values = ref<FacetValue[]>([])
const isExpanded = ref(true)
const canShowMore = ref(false)
const canShowLess = ref(false)

// Create the Facet controller
const facet = createFacet(props.field, props.label)

/**
 * Subscribe to facet state changes
 */
let unsubscribe: (() => void) | null = null

onMounted(() => {
  if (facet) {
    unsubscribe = facet.subscribe(() => {
      values.value = facet.state.values
      canShowMore.value = facet.state.canShowMoreValues
      canShowLess.value = facet.state.canShowLessValues
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

/**
 * Computed: Check if facet has values to display
 */
const hasValues = computed(() => values.value.length > 0)

/**
 * Computed: Check if any values are selected
 */
const hasActiveValues = computed(() => 
  values.value.some(v => v.state === 'selected')
)

/**
 * Computed: Values to display (respects show more/less)
 */
const displayedValues = computed(() => values.value)

/**
 * Toggle a facet value selection
 * 
 * This triggers:
 * 1. State update
 * 2. New search with filter
 * 3. Analytics event
 */
const toggleValue = (value: FacetValue) => {
  if (facet) {
    facet.toggleSelect(value)
  }
}

/**
 * Clear all selections for this facet
 */
const clearSelections = () => {
  if (facet) {
    facet.deselectAll()
  }
}

/**
 * Toggle show more/less values
 */
const toggleShowMore = () => {
  if (facet) {
    if (canShowMore.value) {
      facet.showMoreValues()
    } else if (canShowLess.value) {
      facet.showLessValues()
    }
  }
}
</script>

<style scoped>
/* Expand/collapse animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
