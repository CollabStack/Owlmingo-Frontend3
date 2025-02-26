export default defineNuxtConfig({
  modules: ["@vueuse/motion/nuxt"],

  // Disable SSR if not needed
  ssr: false,

  css: [
    'vuetify/styles', // Include Vuetify styles
  ],

  build: {
    transpile: ['vuetify'], // Transpile Vuetify
  },

  app: {
    head: {
      title: 'Owlmingo', // App title
      meta: [
        {
          name: 'description',
          content:
            'Owlmingo is your AI-powered learning companion. Summarize lessons, generate quizzes, and create flashcards to make studying smarter and more efficient.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo/icon-no-bg.svg' }, // Favicon
      ],
    },
  },

  devServer: {
    port: 5000, // Change the port if needed
  },

  runtimeConfig: {
    public: {
      USER_PRIVATE_API: process.env.USER_PRIVATE_API, // Environment variables
      USER_PUBLIC_API: process.env.USER_PUBLIC_API,
      ADMIN_PUBLIC_API: process.env.ADMIN_PUBLIC_API,
      ADMIN_PRIVATE_API: process.env.ADMIN_PRIVATE_API,
      BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN, // Store in .env
      BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME, // Store in .env
      BOT_ID: process.env.TELEGRAM_BOT_ID, // Store in .env
      BOT_RETURN_URL: process.env.TELEGRAM_BOT_RETURN_URL, // Store in .env
    },
  },

  devtools: {
    enabled: true,
  },

  compatibilityDate: '2025-02-25',
});