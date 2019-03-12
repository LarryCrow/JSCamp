<template>
  <div class="form-wrapper">
    <router-link to=/table class="returning-button" type="button">Back to table</router-link>
    <h1 class="form-title">Add new car</h1>
    <form class="form">
      <div class="form-column">
        <label class="form-item">
          <span class="item-title">Brand</span>
          <select required name="make_id" class="input item-select">
            <option disabled value selected></option>
          </select>
        </label>
        <label class="form-item">
          <span class="item-title">Model</span>
          <select required name="car_model_id" class="input item-select">
            <option disabled value selected></option>
          </select>
        </label>
        <label class="form-item">
          <span class="item-title">Body type</span>
          <select required name="body_type_id" class="input item-select">
            <option disabled value selected></option>
          </select>
        </label>
      </div>
      <div class="form-column">
        <label class="form-item">
          <span class="item-title">Year</span>
          <input name="year" type="number" min="1900" class="input item-datepicker" required>
        </label>
        <label class="form-item">
          <span class="item-title">Mileage</span>
          <input name="mileage" type="number" min="0" class="input item-text" required>
        </label>
      </div>
      <div class="form-column">
        <label class="form-item">
          <span class="item-title">Description</span>
          <textarea name="description" class="input item-textfield" required></textarea>
        </label>
        <button class="save-button" type="submit">Save</button>
      </div>
    </form>
  </div>
</template>
<script src="./form-cars.js"></script>
<style src="./form-cars.css"></style>