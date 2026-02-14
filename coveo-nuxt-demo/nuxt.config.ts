// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss'],
  
  // Runtime config for Coveo credentials (use environment variables)
  runtimeConfig: {
    public: {
      coveoOrganizationId: process.env.COVEO_ORGANIZATION_ID || '',
      coveoApiKey: process.env.COVEO_API_KEY || '',
    }
  },
  
  // App metadata
  app: {
    head: {
      title: 'Enterprise Search Demo - Coveo + Nuxt',
      meta: [
        { name: 'description', content: 'Enterprise knowledge search powered by Coveo Headless and Nuxt 3' }
      ]
    }
  }
})
