<template>
  <!-- 
    ResultItem Component
    
    Displays an individual search result with metadata.
    
    📚 Coveo Documentation:
    - Result Object: https://docs.coveo.com/en/headless/latest/reference/search/controllers/result-list/#result
    - Interactive Result: https://docs.coveo.com/en/headless/latest/reference/search/controllers/result-list/#buildinteractiveresult
    
    Available Result Properties:
    - title: Document title
    - excerpt: Highlighted snippet matching query
    - clickUri: Link to the document
    - raw: All indexed fields (source, date, author, etc.)
    - uniqueId: Unique identifier for analytics
  -->
  <article 
    class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
    @click="handleClick"
  >
    <!-- Result Header -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <!-- Title with Link -->
        <h3 class="text-lg font-semibold text-coveo-primary hover:underline mb-1 line-clamp-2">
          <a 
            :href="result.clickUri" 
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            {{ result.title }}
          </a>
        </h3>
        
        <!-- Source URL -->
        <p class="text-sm text-green-700 truncate mb-2">
          {{ displayUri }}
        </p>
      </div>
      
      <!-- File Type Badge -->
      <span 
        v-if="fileType"
        class="flex-shrink-0 px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600 uppercase"
      >
        {{ fileType }}
      </span>
    </div>
    
    <!-- 
      Excerpt / Snippet
      
      The excerpt contains highlighted text matching the query.
      Coveo automatically generates this from the document content.
      
      💡 Highlighting is done server-side by Coveo, using 
      the query terms to identify relevant passages.
    -->
    <p 
      v-if="result.excerpt"
      class="text-gray-600 text-sm mt-2 line-clamp-3"
      v-html="result.excerpt"
    ></p>
    
    <!-- Metadata Row -->
    <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
      <!-- Date -->
      <span v-if="formattedDate" class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formattedDate }}
      </span>
      
      <!-- Source -->
      <span v-if="source" class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {{ source }}
      </span>
      
      <!-- Author -->
      <span v-if="author" class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {{ author }}
      </span>
    </div>
    
    <!-- 
      🚀 RGA Integration Point
      
      This is where a "Generated Answer" component would integrate.
      For RGA-featured results, you would:
      1. Check if result has RGA data
      2. Display the generated answer above/below excerpt
      3. Include citation links to source content
      
      📚 RGA: https://docs.coveo.com/en/n9de0370/
    -->
  </article>
</template>

<script setup lang="ts">
/**
 * ResultItem Component Logic
 * 
 * Handles:
 * - Result data extraction and formatting
 * - Click tracking for analytics
 * - Display formatting (dates, URIs, etc.)
 */

import type { Result } from '@coveo/headless'

const props = defineProps<{
  result: Result
}>()

const emit = defineEmits<{
  click: [result: Result]
}>()

/**
 * Extract display-friendly URI
 */
const displayUri = computed(() => {
  try {
    const url = new URL(props.result.clickUri)
    return url.hostname + url.pathname
  } catch {
    return props.result.clickUri
  }
})

/**
 * Get file type from raw fields
 */
const fileType = computed(() => {
  return props.result.raw.filetype as string | undefined
})

/**
 * Get source from raw fields
 */
const source = computed(() => {
  return props.result.raw.source as string | undefined
})

/**
 * Get author from raw fields
 */
const author = computed(() => {
  return props.result.raw.author as string | undefined
})

/**
 * Format date for display
 */
const formattedDate = computed(() => {
  const dateValue = props.result.raw.date as number | undefined
  if (!dateValue) return null
  
  try {
    // Coveo dates are in Unix timestamp (seconds or milliseconds)
    const date = new Date(dateValue > 1e12 ? dateValue : dateValue * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return null
  }
})

/**
 * Handle result click
 * Emits event for analytics tracking
 */
const handleClick = () => {
  emit('click', props.result)
}
</script>

<style scoped>
/* Truncate multi-line text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
