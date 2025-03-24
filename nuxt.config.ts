export default defineNuxtConfig({
  // Disable SSR if not needed
  ssr: false,

  css: [
    'vuetify/styles', // Include Vuetify styles
    '@mdi/font/css/materialdesignicons.min.css', // Include MDI CSS
    '~/assets/css/main.css', // Add global CSS
    '~/assets/css/global.css' // Add global CSS
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
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap'
        }
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
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN, // Store in .env
      TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME, // Store in .env
      TELEGRAM_BOT_ID: process.env.TELEGRAM_BOT_ID, // Store in .env
      TELEGRAM_BOT_RETURN_URL: process.env.TELEGRAM_BOT_RETURN_URL, // Store in .env
    },
  },

  compatibilityDate: '2025-02-12',
});