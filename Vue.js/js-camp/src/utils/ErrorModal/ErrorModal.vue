<template>
  <div class="error-backdrop">
    <div class="error-message-block">
      <p class="error-message-text">{{message}}</p>
      <button @click="closeModal" class="error-button-close">Ok</button>
    </div>
  </div>
</template>
<script src="./error-modal.js"></script>
<style src="./error-modal.css"></style>
