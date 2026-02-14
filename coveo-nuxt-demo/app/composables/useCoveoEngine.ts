/**
 * Coveo Headless Engine Composable
 * 
 * This composable manages the Coveo Headless search engine instance.
 * The engine is the central state management system that:
 * - Maintains all search state (query, results, facets, pagination)
 * - Handles API communication with Coveo Cloud
 * - Provides controllers for building UI components
 * 
 * 📚 Coveo Documentation:
 * - Engine Overview: https://docs.coveo.com/en/headless/latest/usage/headless-engine/
 * - Configuration: https://docs.coveo.com/en/headless/latest/reference/search/controllers/search-box/
 * 
 * ⚠️ SSR Consideration:
 * The Headless engine requires browser APIs (localStorage, fetch with credentials).
 * We initialize it only on the client side using process.client checks.
 */

import {
  buildSearchEngine,
  type SearchEngine,
  type SearchEngineConfiguration,
} from '@coveo/headless'

// Singleton engine instance - shared across the application
let engineInstance: SearchEngine | null = null

/**
 * Configuration options for customizing the search experience
 */
interface CoveoEngineOptions {
  /** Search hub identifier for analytics segmentation */
  searchHub?: string
  /** Query pipeline to use for search requests */
  pipeline?: string
}

/**
 * Creates or returns the existing Coveo Headless engine
 * 
 * Why singleton?
 * - Single source of truth for search state
 * - Efficient - avoids recreating engine on each component
 * - Analytics continuity across user session
 */
export function useCoveoEngine(options: CoveoEngineOptions = {}) {
  const config = useRuntimeConfig()
  
  /**
   * Initialize the engine (client-side only)
   * 
   * The engine configuration includes:
   * - organizationId: Your Coveo org identifier
   * - accessToken: API key with search permissions
   * - analytics: Usage tracking for ML model training
   */
  const initEngine = (): SearchEngine | null => {
    // Only initialize on client side - Coveo requires browser APIs
    if (!import.meta.client) {
      return null
    }
    
    // Return existing instance if available
    if (engineInstance) {
      return engineInstance
    }
    
    const organizationId = config.public.coveoOrganizationId as string
    const apiKey = config.public.coveoApiKey as string
    
    // Validate configuration
    if (!organizationId || !apiKey) {
      console.warn(
        '⚠️ Coveo credentials not configured!\n' +
        'Set COVEO_ORGANIZATION_ID and COVEO_API_KEY environment variables.\n' +
        'See: https://docs.coveo.com/en/1718/manage-an-organization/manage-api-keys'
      )
      return null
    }
    
    /**
     * Engine Configuration
     * 
     * The searchHub and pipeline settings are critical for:
     * - Analytics segmentation (see data by search experience)
     * - Query pipeline selection (different rules for different contexts)
     * 
     * 📚 Query Pipelines: https://docs.coveo.com/en/1791/
     */
    const engineConfig: SearchEngineConfiguration = {
      organizationId,
      accessToken: apiKey,
      analytics: {
        enabled: true, // ⭐ Critical for ML model training
        originContext: 'Search',
        originLevel2: options.searchHub || 'NuxtDemo',
        originLevel3: typeof window !== 'undefined' ? window.location.href : 'default',
      },
      search: {
        searchHub: options.searchHub || 'NuxtDemo',
        pipeline: options.pipeline,
      }
    }
    
    try {
      engineInstance = buildSearchEngine({ configuration: engineConfig })
      
      /**
       * 💡 Engine State Subscription (Debug/Development)
       * 
       * Uncomment to log state changes during development:
       * 
       * engineInstance.subscribe(() => {
       *   console.log('Engine state:', engineInstance?.state)
       * })
       */
      
      return engineInstance
    } catch (error) {
      console.error('Failed to initialize Coveo engine:', error)
      return null
    }
  }
  
  const engine = initEngine()
  
  /**
   * Execute the initial search
   * 
   * This triggers the first API call to Coveo Cloud.
   * Results will be available through controllers after this resolves.
   */
  const executeFirstSearch = () => {
    if (engine) {
      engine.executeFirstSearch()
    }
  }
  
  /**
   * Get the current engine instance
   * Useful for controllers that need direct engine access
   */
  const getEngine = () => engine
  
  /**
   * Check if the engine is ready to use
   */
  const isReady = computed(() => !!engine)
  
  return {
    engine,
    isReady,
    getEngine,
    executeFirstSearch,
  }
}
