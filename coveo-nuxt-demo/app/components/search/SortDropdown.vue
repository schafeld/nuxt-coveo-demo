<template>
  <!-- 
    SortDropdown Component
    
    Allows users to change result sorting order.
    
    📚 Coveo Documentation:
    - Sort Controller: https://docs.coveo.com/en/headless/latest/reference/search/controllers/sort/
    
    Common Sort Options:
    - Relevance (Coveo's ML-powered ranking)
    - Date (newest/oldest)
    - Alphabetical
    - Custom field values
    
    💡 Why Relevance Matters:
    Coveo's relevance sorting uses ML models trained on:
    - Click behavior (which results users prefer)
    - Query-document matching
    - Freshness signals
    - Custom ranking expressions
    
    📚 Relevance Tuning: https://docs.coveo.com/en/1791/
  -->
  <div class="relative">
    <label class="text-sm text-gray-600 mr-2">Sort by:</label>
    <select
      v-model="selectedSort"
      class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coveo-primary focus:border-transparent bg-white"
      @change="onSortChange"
    >
      <option value="relevance">Relevance</option>
      <option value="date-desc">Date (Newest)</option>
      <option value="date-asc">Date (Oldest)</option>
    </select>
  </div>
</template>

<script setup lang="ts">
/**
 * SortDropdown Component Logic
 * 
 * This component demonstrates:
 * 1. Sort controller usage
 * 2. Sort criteria selection
 * 3. State synchronization
 */

import {
  buildRelevanceSortCriterion,
  buildDateSortCriterion,
  SortOrder,
  type SortCriterion,
} from '@coveo/headless'

const { createSort, engine } = useSearchControllers()

// Local reactive state
const selectedSort = ref('relevance')

// Create the Sort controller
const sort = createSort()

// Define sort criteria
const sortCriteria: Record<string, SortCriterion> = {
  'relevance': buildRelevanceSortCriterion(),
  'date-desc': buildDateSortCriterion(SortOrder.Descending),
  'date-asc': buildDateSortCriterion(SortOrder.Ascending),
}

/**
 * Handle sort selection change
 */
const onSortChange = () => {
  const criterion = sortCriteria[selectedSort.value]
  if (sort && criterion) {
    sort.sortBy(criterion)
  }
}
</script>
