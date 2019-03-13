<template>
  <div class="notif-block" :class="{'notif-block-closed': isClosing}">
    <p class="notif-message">{{message}}</p>
    <button @click="closeModal" class="notif-btn-close">Ok</button>
  </div>
</template>
<script src="./notification-modal.js"></script>
<style src="./notification-modal.css"></style>