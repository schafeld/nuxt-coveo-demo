<template>
  <!-- 
    Result Skeleton Component
    
    Loading placeholder for results while fetching data.
    Provides visual feedback during search operations.
  -->
  <div class="bg-white border border-gray-200 rounded-lg p-5 animate-pulse">
    <!-- Title skeleton -->
    <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
    
    <!-- URL skeleton -->
    <div class="h-3 bg-gray-100 rounded w-1/2 mb-3"></div>
    
    <!-- Excerpt skeleton -->
    <div class="space-y-2">
      <div class="h-3 bg-gray-100 rounded w-full"></div>
      <div class="h-3 bg-gray-100 rounded w-5/6"></div>
      <div class="h-3 bg-gray-100 rounded w-4/6"></div>
    </div>
    
    <!-- Metadata skeleton -->
    <div class="flex gap-4 mt-4">
      <div class="h-3 bg-gray-100 rounded w-20"></div>
      <div class="h-3 bg-gray-100 rounded w-16"></div>
    </div>
  </div>
</template>
