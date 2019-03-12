<template>
  <div id="app">
    <TableCars/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import TableCars from './components/TableCars/TableCars.vue';

export default {
  name: 'app',
  components: {
    HelloWorld,
    TableCars
  }
}
</script>

<style src="@fortawesome/fontawesome-free/css/all.css"></style>
