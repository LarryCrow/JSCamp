<template>
  <div class="auth-main">
    <router-link to=/table class="returning-button" type="button">Back to table</router-link>
    <h1 class="form-title">Authorization</h1>
    <form class="auth-form" @submit.prevent="signIn">
      <label class="form-item">
        <span>Login</span>
        <input v-model="login" type="email" required>
      </label>
      <label class="form-item">
        <span>Password</span>
        <input v-model="pass" type="password" required>
      </label>
      <button class="sign-in" type="submit">Sign in</button>
    </form>


    <!-- Modal windows -->
		<error-modal :message="errorModal.message" v-if="errorModal.isShow" @close="errorModal.isShow = false"></error-modal>
    <notif-modal :message="notificationModal.message" v-if="notificationModal.isShow" @close="notificationModal.isShow = false"></notif-modal>
  </div>
</template>
<script src="./auth.js"></script>
<style computed src="./auth.css"></style>

