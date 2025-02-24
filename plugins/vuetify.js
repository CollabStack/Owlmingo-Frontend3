import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

import { watch } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  
  const vuetify = createVuetify({
    icons: {
      iconfont: 'mdi', // Use mdi icon font
    },
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            // #7BCBFC
            primary: '#3E53A1',
            secondary: '#9D7BFC',
            maya_blue: '#7BCBFC',
            accent: '#82B1FF',
            white: '#FFFFFF',
            black: '#000000',
            error: '#DF3131',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',

            background: '#F3F3F3',
            //background Card home page
            pattens_blue: '#e3f2fd',
            aero_blue: '#CAFFD6',
            iceberg: '#D7F0FF',
            lavender_mist: '#EAE4FF'

            royal_blue: '#4667E5',  
            sonic_silver: '#757575', //continue text
            mercury: '#EBEBEB',
            hex: '#b6b2b2',
            onyx: '#373737',

          },
        },
        dark: {
          colors: {
            primary: '#90CAF9',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);

   // Automatically apply theme colors as CSS variables
   const theme = vuetify.theme.global;
   function applyThemeColors() {
     const colors = theme.current.value.colors;
     for (const [key, value] of Object.entries(colors)) {
       document.documentElement.style.setProperty(`--v-${key}`, value);
     }
   }
 
   applyThemeColors(); // Apply on load
 
   // Watch for theme changes and update CSS variables dynamically
   watch(() => theme.current.value, () => {
     applyThemeColors();
   });
});