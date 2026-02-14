<template>
  <!-- 
    SearchBox Component
    
    Implements Coveo's SearchBox controller for query input with suggestions.
    
    📚 Coveo Documentation:
    - SearchBox Controller: https://docs.coveo.com/en/headless/latest/reference/search/controllers/search-box/
    - Query Suggestions: https://docs.coveo.com/en/headless/latest/usage/query-suggestions/
    
    Key Features:
    - Real-time query suggestions powered by ML
    - Keyboard navigation for suggestions
    - Search analytics tracking (search origin, terms)
  -->
  <div class="relative">
    <div class="flex items-center">
      <div class="relative flex-1">
        <input
          v-model="query"
          type="text"
          :placeholder="placeholder"
          class="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-coveo-primary focus:border-transparent transition-all"
          @input="onInput"
          @keydown.enter="onSubmit"
          @keydown.down.prevent="navigateSuggestion(1)"
          @keydown.up.prevent="navigateSuggestion(-1)"
          @focus="showSuggestions = true"
          @blur="onBlur"
        />
        <!-- Search Icon -->
        <svg 
          class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <!-- Search Button -->
      <button
        @click="onSubmit"
        class="ml-3 px-6 py-3 bg-coveo-primary text-white font-semibold rounded-lg hover:bg-coveo-secondary transition-colors shadow-sm"
      >
        Search
      </button>
    </div>
    
    <!-- 
      Query Suggestions Dropdown
      
      💡 How Suggestions Work:
      Suggestions are powered by Coveo's ML models trained on:
      - Popular queries in your organization
      - User click behavior
      - Query success patterns
      
      📚 ML Features: https://docs.coveo.com/en/1791/
    -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
    >
      <ul class="py-2">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.rawValue"
          :class="[
            'px-4 py-2 cursor-pointer transition-colors',
            index === selectedIndex 
              ? 'bg-coveo-primary/10 text-coveo-primary' 
              : 'hover:bg-gray-50'
          ]"
          @mousedown.prevent="selectSuggestion(suggestion)"
        >
          <!-- 
            Highlighted suggestion with matching text emphasized
            Uses rawValue for selection, highlighted for display
          -->
          <span v-html="suggestion.highlightedValue || suggestion.rawValue"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * SearchBox Component Logic
 * 
 * This component demonstrates:
 * 1. Controller state subscription pattern
 * 2. Reactive binding to Coveo state
 * 3. User interaction handling (input, submit, suggestion selection)
 * 
 * The controller.state contains:
 * - value: Current query text
 * - suggestions: Array of ML-powered suggestions
 * - isLoading: Whether suggestions are loading
 */

import type { SearchBox, Suggestion } from '@coveo/headless'

const props = defineProps<{
  placeholder?: string
}>()

const { createSearchBox } = useSearchControllers()

// Local reactive state
const query = ref('')
const suggestions = ref<Suggestion[]>([])
const showSuggestions = ref(false)
const selectedIndex = ref(-1)

// Create the SearchBox controller
const searchBox = createSearchBox({
  numberOfSuggestions: 5,
})

/**
 * Subscribe to controller state changes
 * 
 * This is the core pattern for Coveo Headless:
 * 1. Controller maintains internal state
 * 2. We subscribe to state changes
 * 3. Update Vue refs when state changes
 * 
 * The subscription returns an unsubscribe function
 * which we call on component unmount.
 */
let unsubscribe: (() => void) | null = null

onMounted(() => {
  if (searchBox) {
    unsubscribe = searchBox.subscribe(() => {
      suggestions.value = searchBox.state.suggestions
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

/**
 * Handle input changes
 * 
 * updateText() updates the query and triggers suggestion fetching.
 * Analytics events are automatically tracked for query changes.
 */
const onInput = () => {
  if (searchBox) {
    searchBox.updateText(query.value)
    searchBox.showSuggestions()
    selectedIndex.value = -1
  }
}

/**
 * Submit the search
 * 
 * submit() triggers:
 * 1. Search API request
 * 2. Analytics 'search' event
 * 3. State update with results
 */
const onSubmit = () => {
  if (searchBox) {
    // If a suggestion is selected, use it
    const selectedSuggestion = suggestions.value[selectedIndex.value]
    if (selectedIndex.value >= 0 && selectedSuggestion) {
      selectSuggestion(selectedSuggestion)
      return
    }
    
    searchBox.submit()
    showSuggestions.value = false
  }
}

/**
 * Select a suggestion
 * 
 * selectSuggestion() does multiple things:
 * 1. Updates query to selected suggestion
 * 2. Submits the search
 * 3. Tracks 'suggestion click' analytics event
 */
const selectSuggestion = (suggestion: Suggestion) => {
  if (searchBox) {
    searchBox.selectSuggestion(suggestion.rawValue)
    query.value = suggestion.rawValue
    showSuggestions.value = false
  }
}

/**
 * Keyboard navigation for suggestions
 */
const navigateSuggestion = (direction: number) => {
  const max = suggestions.value.length - 1
  const newIndex = selectedIndex.value + direction
  
  if (newIndex < 0) {
    selectedIndex.value = max
  } else if (newIndex > max) {
    selectedIndex.value = 0
  } else {
    selectedIndex.value = newIndex
  }
}

/**
 * Handle blur with delay to allow suggestion clicks
 */
const onBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
    selectedIndex.value = -1
  }, 200)
}
</script>
