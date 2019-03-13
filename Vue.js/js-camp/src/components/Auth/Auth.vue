<template>
  <div class="auth-main">
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
		<error-modal :message="errorModal.message" v-if="errorModal.isShow" @close="errorModal.isShow = false"></error-modal>
  </div>
</template>
<script src="./auth.js"></script>
<style src="./auth.css"></style>

