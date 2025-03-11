<template>
  <div>
    <h2>Profile Photo Upload</h2>
    <FileUploader
      icon="mdi-account"
      placeholder="Upload your profile photo"
      acceptedFileTypes="image/jpeg,image/png"
      buttonText="Select Photo"
      buttonIcon="mdi-camera"
      :maxFileSize="2"
      fileTypeErrorMessage="Please select a JPEG or PNG image"
      @file-selected="handleProfilePhotoUpload"
      @error="handleError"
    />
    
    <h2>Document Upload</h2>
    <FileUploader
      icon="mdi-file-document"
      placeholder="Upload your resume"
      acceptedFileTypes=".pdf,.docx"
      buttonText="Select Resume"
      buttonIcon="mdi-file-document-outline"
      :maxFileSize="5"
      @file-selected="handleResumeUpload"
      @error="handleError"
    />
    
    <h2>Audio Upload</h2>
    <FileUploader
      icon="mdi-music"
      iconColor="deep-purple"
      placeholder="Upload an audio file"
      acceptedFileTypes="audio/*"
      buttonText="Select Audio"
      buttonIcon="mdi-music-note"
      buttonColor="deep-purple"
      :maxFileSize="20"
      @file-selected="handleAudioUpload"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import FileUploader from '../components/common/FileUploader.vue';

const handleProfilePhotoUpload = (file) => {
  console.log('Profile photo selected:', file);
  // Process the profile photo
};

const handleResumeUpload = (file) => {
  console.log('Resume selected:', file);
  // Process the resume file
};

const handleAudioUpload = (file) => {
  console.log('Audio file selected:', file);
  // Process the audio file
};

const handleError = (errorMessage) => {
  console.error(errorMessage);
  // Show error notification
};
</script>
