<template>
  <div class="mode-selector-panel">
    <div 
      v-for="(mode, index) in modes" 
      :key="index"
      @click="$emit('update:selected-index', index)"
      :class="[
        'mode-card-rect', 
        selectedIndex === index ? 'mode-card-rect-active' : '',
      ]"
      v-motion
      :initial="{ opacity: 0, x: -20 }"
      :enter="{ opacity: 1, x: 0, transition: { duration: 400, delay: index * 100 } }"
    >
      <div class="mode-card-content-rect">
        <v-icon 
          :color="selectedIndex === index ? 'white' : 'grey'"
          size="medium"
          class="mode-icon-rect me-3"
        >
          {{ mode.icon }}
        </v-icon>
        <span class="mode-title-rect outfit outfit-medium">{{ mode.title }}</span>
      </div>
      <div :class="['mode-indicator-rect', selectedIndex === index ? 'mode-indicator-rect-active' : '']"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modes: {
    type: Array,
    required: true
  },
  selectedIndex: {
    type: Number,
    default: 0
  }
});

defineEmits(['update:selected-index']);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.outfit-medium {
  font-weight: 500;
}

/* Vertical Mode Selector Panel Styling */
.mode-selector-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.mode-card-rect {
  position: relative;
  display: flex;
  align-items: center;
  padding: 22px 18px;  /* Increased padding for better visibility */
  min-height: 95px;    /* Increased height for better visibility */
  border-radius: 14px;
  background-color: rgba(250, 250, 255, 0.92); /* Very light purple tint */
  box-shadow: 0 4px 12px rgba(123, 131, 224, 0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  border-left: 4px solid transparent;
}

.mode-card-rect:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 15px rgba(123, 131, 224, 0.15);
  background-color: rgba(248, 248, 255, 0.96);
}

.mode-card-rect-active {
  background: linear-gradient(135deg, #8b90e8, #9D7BFC); /* Updated to match brand gradient */
  box-shadow: 0 8px 18px rgba(157, 123, 252, 0.3); /* Updated shadow color to match */
  border-left: 4px solid #a59aff;
}

.mode-card-content-rect {
  display: flex;
  align-items: center;
  z-index: 2;
  width: 100%;
}

.mode-icon-rect {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-right: 16px;
  font-size: 28px; /* Larger icon for better visibility */
}

.mode-card-rect-active .mode-icon-rect {
  transform: scale(1.2);
  color: white !important; /* Force white icon color when active */
}

.mode-title-rect {
  font-size: 1.25rem; /* Increased font size */
  transition: color 0.3s ease, font-weight 0.3s ease;
  color: rgba(123, 131, 224, 0.9); /* Deeper purple for better readability */
}

.mode-card-rect-active .mode-title-rect {
  color: white;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Enhanced text shadow for better readability */
}

.mode-indicator-rect {
  position: absolute;
  right: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background-color: transparent;
  transition: background-color 0.3s ease, transform 0.3s ease;
  transform: scaleY(0);
  transform-origin: center;
}

.mode-indicator-rect-active {
  background-color: #a59aff;
  transform: scaleY(1);
}

/* Media query for horizontal layout on smaller screens */
@media (max-width: 960px) {
  .mode-selector-panel {
    flex-direction: row;
    gap: 8px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
    justify-content: center;
  }
  
  .mode-card-rect {
    min-height: 70px; /* Adjusted for horizontal layout */
    min-width: 160px; /* Ensure buttons have enough width */
  }
  
  .mode-card-rect-active {
    border-left: none;
    border-bottom: 4px solid #a59aff;
  }
  
  .mode-card-rect:hover {
    transform: translateY(-5px);
  }
  
  .mode-card-content-rect {
    justify-content: center;
  }
  
  .mode-title-rect {
    font-size: 1.1rem;
  }
  
  .mode-indicator-rect {
    top: auto;
    bottom: 0;
    right: 0;
    left: 0;
    height: 4px;
    width: 100%;
  }
}

@media (max-width: 600px) {
  .mode-card-rect {
    width: 100%;
    padding: 16px;
    min-height: 60px; /* Slightly smaller on mobile */
  }
  
  .mode-card-content-rect {
    justify-content: flex-start;
  }
  
  .mode-icon-rect {
    margin-right: 10px;
  }
}
</style>
