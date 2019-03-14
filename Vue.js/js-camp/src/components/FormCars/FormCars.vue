<template>
  <div class="form-wrapper">
    <router-link to=/table class="returning-button" type="button">Back to table</router-link>
    <h1 class="form-title">Add new car</h1>
    <form class="form" @submit.prevent="saveCar">
      <div class="form-column">
        <label class="form-item">
          <span class="item-title">Brand</span>
          <select required v-model="form.make_id" class="input item-select">
            <option disabled value selected></option>
            <option v-for="make in makers" :key="make.id" :value="make.id">
              {{preventXSS(make.name)}}
            </option>
          </select>
        </label>
        <label class="form-item">
          <span class="item-title">Model</span>
          <select required v-model="form.car_model_id" class="input item-select">
            <option disabled value selected></option>
            <option v-for="model in make_models" :key="model.id" :value="model.id">
              {{preventXSS(model.name)}}
            </option>
          </select>
        </label>
        <label class="form-item">
          <span class="item-title">Body type</span>
          <select required v-model="form.body_type_id" class="input item-select">
            <option disabled value selected></option>
            <option v-for="body in bodies" :key="body.id" :value="body.id">
              {{preventXSS(body.name)}}
            </option>
          </select>
        </label>
      </div>
      <div class="form-column">
        <label class="form-item">
          <span class="item-title">Year</span>
          <input v-model="form.year" type="number" min="1900" class="input item-datepicker" required>
        </label>
        <label class="form-item">
          <span class="item-title">Mileage</span>
          <input v-model="form.mileage" type="number" min="0" class="input item-text" required>
        </label>
      </div>
      <div class="form-column">
        <label class="form-item">
          <span class="item-title">Description</span>
          <textarea v-model="form.description" class="input item-textfield" required></textarea>
        </label>
        <button class="save-button" type="submit">Save</button>
      </div>
    </form>
    
    <!-- Modal windows -->
    <error-modal :message="errorModal.message" v-if="errorModal.isShow" @close="errorModal.isShow = false"></error-modal>
    <notif-modal :message="notificationModal.message" v-if="notificationModal.isShow" @close="notificationModal.isShow = false"></notif-modal>
  </div>
</template>
<script src="./form-cars.js"></script>
<style computed src="./form-cars.css"></style>