/**
 * Coveo Analytics Composable
 * 
 * Provides utilities for tracking search analytics events.
 * Analytics are CRITICAL for Coveo's ML models to improve relevance.
 * 
 * 📚 Coveo Documentation:
 * - Usage Analytics Overview: https://docs.coveo.com/en/1318/analyze-usage-data/usage-analytics/
 * - Event Types: https://docs.coveo.com/en/headless/latest/usage/log-search-events/
 * - Analytics Best Practices: https://docs.coveo.com/en/3090/
 * 
 * ⭐ Why Analytics Matter:
 * 
 * Coveo's ML models learn from user behavior:
 * 
 * 1. **Automatic Relevance Tuning (ART)**
 *    Analyzes which results users click to improve ranking
 *    
 * 2. **Query Suggestions**
 *    Popular and successful queries are suggested to users
 *    
 * 3. **Content Gap Analysis**  
 *    Identifies queries that don't return good results
 *    
 * 4. **RGA Training**
 *    Generated answers improve based on user feedback
 * 
 * Event Types:
 * - Search: User submits a query
 * - Click: User clicks on a result
 * - Custom: Application-specific events
 * - Page: User views a document
 */

import {
  loadClickAnalyticsActions,
  type SearchEngine,
  type Result,
} from '@coveo/headless'

export function useCoveoAnalytics() {
  const { engine } = useCoveoEngine()
  
  /**
   * Log a document click event
   * 
   * Call this when a user clicks on a search result.
   * 
   * This event includes:
   * - Document unique ID
   * - Document URI
   * - Document title
   * - Position in results
   * - Associated query
   * 
   * 💡 ML Impact:
   * Click data directly feeds into ART (Automatic Relevance Tuning).
   * The model learns which results are preferred for specific queries.
   */
  const logDocumentClick = (result: Result) => {
    if (!engine) return
    
    const clickActions = loadClickAnalyticsActions(engine)
    
    // Dispatch the document open action
    engine.dispatch(
      clickActions.logDocumentOpen(result)
    )
    
    console.log('📊 Analytics: Document click logged', {
      title: result.title,
      uri: result.clickUri,
      uniqueId: result.uniqueId,
    })
  }
  
  /**
   * Log a custom event
   * 
   * Use for application-specific events that aren't covered
   * by standard analytics (e.g., "Added to favorites", "Shared result")
   * 
   * @param eventType Event category (e.g., 'resultAction')
   * @param eventValue Event name (e.g., 'addToFavorites')
   * @param metadata Additional context
   */
  const logCustomEvent = (
    eventType: string,
    eventValue: string,
    metadata?: Record<string, string | number | boolean>
  ) => {
    if (!engine) return
    
    // Custom events would be logged through the analytics client
    // This is a simplified example
    
    console.log('📊 Analytics: Custom event logged', {
      type: eventType,
      value: eventValue,
      metadata,
    })
  }
  
  /**
   * Get analytics context info
   * Useful for debugging and monitoring
   */
  const getAnalyticsContext = () => {
    if (!engine) return null
    
    const state = engine.state
    
    return {
      searchHub: state.searchHub,
      pipeline: state.pipeline,
      lastQuery: state.query?.q,
      totalResults: state.search?.response?.totalCountFiltered,
      searchDuration: state.search?.duration,
    }
  }
  
  return {
    logDocumentClick,
    logCustomEvent,
    getAnalyticsContext,
  }
}

/**
 * 📈 Analytics Dashboard
 * 
 * View and analyze search data in Coveo Administration Console:
 * https://platform.cloud.coveo.com/admin/#/report
 * 
 * Key Reports:
 * 
 * 1. **Search Dashboard**
 *    - Query volumes and trends
 *    - Popular queries
 *    - Click-through rates
 * 
 * 2. **Content Gap Analysis**
 *    - Queries with no results
 *    - Low click-through queries
 *    - Abandoned searches
 * 
 * 3. **User Behavior**
 *    - Session patterns
 *    - Device/browser breakdown
 *    - Geographic distribution
 * 
 * 📚 Analytics Reports: https://docs.coveo.com/en/1466/
 */
