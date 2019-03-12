<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import TableCars from './components/TableCars/TableCars.vue';
// import FormCars from './components/FormCars/FormCars.vue';

export default {
  name: "app",
  components: {
  },
  created: function() {
    this.$router.push('table');
  }
};
</script>

<style src="@fortawesome/fontawesome-free/css/all.css"></style>
