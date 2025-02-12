import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; // Import MDI icons
import 'vuetify/styles'; // Import Vuetify styles

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#6200ea',
            secondary: '#03dac6',
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
