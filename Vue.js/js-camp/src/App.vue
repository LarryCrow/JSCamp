<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "app",
  components: {
  },
  created: function() {
    const token = window.localStorage.getItem('token');
    if (!token) {
      this.$router.push('auth');
    }
    this.$store.dispatch('setToken', {'token': token});
    if (document.URL === 'http://localhost:8080/#/') {
      this.$router.push('table');
    }
  }
};
</script>

<style src="@fortawesome/fontawesome-free/css/all.css"></style>
