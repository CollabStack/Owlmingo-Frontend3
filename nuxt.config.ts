export default defineNuxtConfig({
  pages: true,
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2025-01-22',
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/axios.js',
    '~/plugins/pinia.js',
    
  ],
  devServer: {
    port: 5000, // Change to your desired port
  },
  app: {
    head: {
      title: 'Owlmingo', // Set your app name here
      meta: [
        {
          name: 'description',
          content:
            'Owlmingo is your AI-powered learning companion. Summarize lessons, generate quizzes, and create flashcards to make studying smarter and more efficient.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo/icon-no-bg.svg' }, // Correct path
      ],
    },
  },

  runtimeConfig: {
    public: {
      USER_PRIVATE_API: process.env.USER_PRIVATE_API,
      USER_PUBLIC_API: process.env.USER_PUBLIC_API,
      ADMIN_PUBLIC_API: process.env.ADMIN_PUBLIC_API,
      ADMIN_PRIVATE_API: process.env.ADMIN_PRIVATE_API,
    },
  },
});