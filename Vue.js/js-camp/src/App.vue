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
<style>
@import url('https://fonts.googleapis.com/css?family=Fira+Sans');

* {
	margin: 0;
	padding: 0;
	font-family: 'Fira Sans', sans-serif;
	box-sizing: border-box;
	list-style: none;
}
</style>