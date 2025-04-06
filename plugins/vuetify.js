import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { watch } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
              // #7BCBFC
            primary     : '#4635B1',
            secondary   : '#9D7BFC',
            maya_blue   : '#7BCBFC',
            accent      : '#82B1FF',
            white       : '#FFFFFF',
            black       : '#000000',
            error       : '#DF3131',
            info        : '#2196F3',
            success     : '#4CAF50',
            warning     : '#FFC107',
            royal_blue  : '#4667E5',
            sonic_silver: '#757575',   //continue text
            mercury     : '#EBEBEB',
            hex         : '#b6b2b2',
            onyx        : '#373737',
            water       : '#EFF2FE',
            purple      : '#69247C',
            pink        : '#DA498D',
            gold        : '#FAC67A',
            cream       : '#F9E6CF',
          },
        },
        dark: {
          colors: {
            primary  : '#90CAF9',
            secondary: '#424242',
            accent   : '#82B1FF',
            error    : '#FF5252',
            info     : '#2196F3',
            success  : '#4CAF50',
            warning  : '#FFC107',
            purple   : '#69247C',
            pink     : '#DA498D',
            gold     : '#FAC67A',
            cream    : '#F9E6CF',
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




// Great setup! 🎨 You're dynamically applying Vuetify theme colors as **CSS variables**, which is awesome because now you can use them **in both `<template>` and `<style>`** easily!

// ---

// ## ✅ 1. How to Use Theme Colors in `<template>`

// Anywhere in your template, you can use Vuetify’s class utilities **or** directly reference the CSS variables.

// ### ✅ Option A: Vuetify utility classes (recommended for buttons, text, etc.)
// ```html
// <v-btn color="primary">Primary Button</v-btn>
// <v-alert type="error">This is an error alert</v-alert>
// ```

// Vuetify maps these to the theme colors like `primary`, `secondary`, `error`, etc.

// ---

// ### ✅ Option B: Use inline styles with your custom variables

// ```html
// <div style="background-color: var(--v-primary); color: var(--v-white);">
//   Custom Styled Box
// </div>
// ```

// ---

// ## ✅ 2. How to Use Theme Colors in `<style>`

// Now that you've added:

// ```ts
// document.documentElement.style.setProperty(`--v-${key}`, value);
// ```

// You can access any theme color like:

// ```css
// /* inside your component or global CSS */
// .box {
//   background-color: var(--v-cream);
//   color: var(--v-onyx);
//   border: 1px solid var(--v-maya_blue);
// }
// ```

// ---

// ### 🔥 Example Component Using Theme Colors

// ```vue
// <template>
//   <v-card class="custom-card">
//     <v-card-title>Welcome</v-card-title>
//     <v-card-text>This card uses your Vuetify theme colors!</v-card-text>
//   </v-card>
// </template>

// <style scoped>
// .custom-card {
//   background-color: var(--v-water);
//   color: var(--v-onyx);
//   border: 2px solid var(--v-primary);
//   border-radius: 12px;
//   padding: 16px;
// }
// </style>
// ```

// ---

// ## 💡 Tip: Use Fallbacks in `var()`

// To prevent errors when a variable isn't defined:
// ```css
// color: var(--v-royal_blue, #4667E5);
// ```

// ---

// ## ✅ Summary

// | Use Case        | How to Do It                        |
// |----------------|-------------------------------------|
// | Template        | `color="primary"` or `style="color: var(--v-primary)"` |
// | Scoped Styles   | `color: var(--v-yourcolor)`         |
// | Dynamic Themes  | Already handled via `watch()` logic in your plugin |

// ---

// Let me know if you want to create a dark/light mode toggle switch using this setup!