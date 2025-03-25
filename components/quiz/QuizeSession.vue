<template>
  <div class="container mx-auto px-6 py-10">
    <!-- Back Navigation -->
    <div class="back-nav mb-8">
      <v-btn size="large" class="back-btn outfit outfit-medium" variant="outlined" color="primary" elevation="0"
        rounded="lg">
        <v-icon left class="mr-2">mdi-arrow-left</v-icon>
        Back to Quizzes
      </v-btn>
    </div>

    <!-- Quiz Session Card -->
    <v-card class="session-card" elevation="3">
      <v-card-title class="session-header text-center text-white pa-8">
        <h2 class="text-h4 font-weight-bold outfit">Quiz Session</h2>
        <!-- <p class="text-subtitle-1 mt-2 text-grey-lighten-4 outfit">Let's test your knowledge!</p> -->
      </v-card-title>

      <v-card-text class="session-content px-8 py-6">
        <!-- User Info Section -->
        <div class="info-section d-flex justify-space-between align-center mb-8">
          <div class="d-flex align-center profile-container px-6 py-4 rounded-xl">
            <v-avatar size="64" class="profile-avatar mr-4" :color="avatarColor">
              <span class="text-h5 font-weight-bold white--text">SS</span>
            </v-avatar>
            <div class="profile-info">
              <span class="text-h6 font-weight-bold outfit profile-name">Sok Sothy</span>
              <div class="d-flex align-center mt-2">
                <v-icon color="success" size="18" class="mr-2">mdi-check-circle</v-icon>
                <p class="text-subtitle-2 text-success outfit status-text">Ready to start</p>
              </div>
            </div>
          </div>

          <v-chip class="pa-4 source-chip outfit" color="primary" variant="elevated" elevation="2">
            <v-icon start size="20" class="mr-2">mdi-file-pdf-box</v-icon>
            thy.pdf
          </v-chip>
        </div>
        <v-divider class="mb-8"></v-divider>

        <!-- Quiz Details Section -->
        <div class="quiz-details">
          <h3 class="text-h5 font-weight-bold mb-6 outfit">Quiz Details</h3>
          <v-row>
            <v-col v-for="(info, index) in quizDetails" :key="index" cols="12" md="4">
              <v-card class="quiz-info-item pa-6 d-flex flex-column align-center text-center" elevation="0">
                <v-icon :color="info.color" size="48" class="mb-3">{{ info.icon }}</v-icon>
                <div class="text-subtitle-1 font-weight-bold mb-2 outfit">{{ info.label }}</div>
                <div class="text-h5 outfit">{{ info.value }}</div>
              </v-card>
            </v-col>
          </v-row>
        </div>

      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
const quizDetails = [
  { icon: 'mdi-help-circle', label: 'Total Questions', value: '10', color: '#4CAF50' },
  { icon: 'mdi-star', label: 'Total Marks', value: '100', color: '#FFC107' },
  { icon: 'mdi-clock-outline', label: 'Time Limit', value: '30 min', color: '#2196F3' },
  { icon: 'mdi-calendar-clock', label: 'Start Time', value: '10:00 AM', color: '#9C27B0' },
  { icon: 'mdi-calendar-end', label: 'End Time', value: '10:30 AM', color: '#E91E63' },
  { icon: 'mdi-check-circle', label: 'Passing Marks', value: '50', color: '#009688' },
];
</script>

<style scoped>


.profile-container {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid rgba(123, 131, 224, 0.1);
  transition: all 0.3s ease;
}

.profile-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-color: rgba(123, 131, 224, 0.2);
}

.profile-avatar {
  border: 3px solid #ffffff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.profile-name {
  background: linear-gradient(135deg, #7b83e0, #9D7BFC);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.25rem;
}

.status-text {
  font-weight: 500;
  letter-spacing: 0.3px;
}
.session-card {
  border-radius: 20px;
  background: #ffffff;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.session-header {
  background: linear-gradient(135deg, #7b83e0, #9D7BFC);
  position: relative;
  overflow: hidden;
}

.session-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}

.back-btn {
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.back-btn:hover {
  transform: translateX(-5px);
}

.source-chip {
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.source-chip:hover {
  transform: translateY(-2px);
}

.quiz-info-item {
  border-radius: 16px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.quiz-info-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: rgba(123, 131, 224, 0.3);
}

.start-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.start-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  transition: 0.5s;
}

.start-btn:hover {
  transform: translateY(-2px);
}

.start-btn:hover::before {
  left: 100%;
}

@media (max-width: 960px) {
  .info-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .source-chip {
    margin-top: 1rem;
  }
}
</style>