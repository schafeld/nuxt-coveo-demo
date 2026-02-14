/**
 * Search Controllers Composable
 * 
 * This composable provides factory functions for Coveo Headless controllers.
 * Controllers are the bridge between the Headless engine state and Vue components.
 * 
 * Each controller:
 * - Subscribes to relevant state changes
 * - Provides methods to trigger actions
 * - Exposes reactive state via Vue refs
 * 
 * 📚 Coveo Documentation:
 * - Controllers Overview: https://docs.coveo.com/en/headless/latest/usage/controllers/
 * - State Management: https://docs.coveo.com/en/headless/latest/usage/headless-engine/#subscribe-to-state-changes
 */

import {
  buildSearchBox,
  buildResultList,
  buildFacet,
  buildPager,
  buildSort,
  buildQuerySummary,
  buildDidYouMean,
  type SearchBox,
  type ResultList,
  type Facet,
  type Pager,
  type Sort,
  type QuerySummary,
  type DidYouMean,
  type SearchEngine,
  type SortCriterion,
  buildRelevanceSortCriterion,
  buildDateSortCriterion,
  SortOrder,
} from '@coveo/headless'

export function useSearchControllers() {
  const { engine } = useCoveoEngine()
  
  /**
   * Creates a SearchBox controller
   * 
   * The SearchBox handles:
   * - Query text input
   * - Query suggestions (typeahead)
   * - Search submission
   * 
   * 📚 Docs: https://docs.coveo.com/en/headless/latest/reference/search/controllers/search-box/
   * 
   * @param options Configuration options for suggestions
   */
  const createSearchBox = (options?: {
    numberOfSuggestions?: number
    highlightOptions?: { exactMatchDelimiters?: { open: string; close: string } }
  }): SearchBox | null => {
    if (!engine) return null
    
    return buildSearchBox(engine, {
      options: {
        numberOfSuggestions: options?.numberOfSuggestions ?? 5,
        highlightOptions: options?.highlightOptions,
      }
    })
  }
  
  /**
   * Creates a ResultList controller
   * 
   * The ResultList provides:
   * - Array of search results
   * - Loading state
   * - Result templates support
   * 
   * 📚 Docs: https://docs.coveo.com/en/headless/latest/reference/search/controllers/result-list/
   */
  const createResultList = (): ResultList | null => {
    if (!engine) return null
    
    return buildResultList(engine, {
      options: {
        fieldsToInclude: [
          'title',
          'description',
          'source',
          'date',
          'author',
          'filetype',
          'permanentid',
        ]
      }
    })
  }
  
  /**
   * Creates a Facet controller
   * 
   * Facets enable filtering by field values.
   * They display available values with counts and allow selection.
   * 
   * 📚 Docs: https://docs.coveo.com/en/headless/latest/reference/search/controllers/facet/
   * 
   * @param field The field to facet on (must be configured in Coveo index)
   * @param label Display label for the facet
   */
  const createFacet = (field: string, label?: string): Facet | null => {
    if (!engine) return null
    
    return buildFacet(engine, {
      options: {
        field,
        facetId: field,
        numberOfValues: 8,
        sortCriteria: 'occurrences', // or 'score', 'alphanumeric'
      }
    })
  }
  
  /**
   * Creates a Pager controller
   * 
   * Handles pagination through search results.
   * 
   * 📚 Docs: https://docs.coveo.com/en/headless/latest/reference/search/controllers/pager/
   * 
   * @param numberOfPages Number of page buttons to display
   */
  const createPager = (numberOfPages: number = 5): Pager | null => {
    if (!engine) return null
    
    return buildPager(engine, {
      options: {
        numberOfPages
      }
    })
  }
  
  /**
   * Creates a Sort controller
   * 
   * Enables sorting results by different criteria.
   * 
   * 📚 Docs: https://docs.coveo.com/en/headless/latest/reference/search/controllers/sort/
   */
  const createSort = (): Sort | null => {
    if (!engine) return null
    
    // Define sort criteria options
    const criteria: SortCriterion[] = [
      buildRelevanceSortCriterion(),
      buildDateSortCriterion(SortOrder.Descending),
      buildDateSortCriterion(SortOrder.Ascending),
    ]
    
    return buildSort(engine, {
      initialState: {
        criterion: criteria[0], // Default to relevance
      }
    })
  }
  
  /**
   * Creates a QuerySummary controller
   * 
   * Provides summary information about the search:
   * - Number of results
   * - Query duration
   * - Current query text
   * 
   * 📚 Docs: https://docs.coveo.com/en/headless/latest/reference/search/controllers/query-summary/
   */
  const createQuerySummary = (): QuerySummary | null => {
    if (!engine) return null
    
    return buildQuerySummary(engine)
  }
  
  /**
   * Creates a DidYouMean controller
   * 
   * Provides spelling corrections and alternative queries.
   * Shows "Did you mean: X?" suggestions.
   * 
   * 📚 Docs: https://docs.coveo.com/en/headless/latest/reference/search/controllers/did-you-mean/
   */
  const createDidYouMean = (): DidYouMean | null => {
    if (!engine) return null
    
    return buildDidYouMean(engine)
  }
  
  return {
    engine,
    createSearchBox,
    createResultList,
    createFacet,
    createPager,
    createSort,
    createQuerySummary,
    createDidYouMean,
  }
}
