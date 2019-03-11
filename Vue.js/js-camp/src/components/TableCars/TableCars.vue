<template>
  <div id="table-page" class="result-table">
    <div class="table-wrapper">
      <div class="table-options">
        <div class="toolbar">
          <button class="icons add" type="button" title="Create new car">
            <i class="fas fa-plus"></i>
          </button>
          <button class="icons edit disabled-button" type="button" title="Edit selected car">
            <i class="fas fa-pen"></i>
          </button>
          <button class="icons delete disabled-button" type="button" title="Delete selected car">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="searching-field">
          <input class="searching-input" type="text">
          <button v-on:click="searchCars()" class="searching-button" type="button">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <nav class="paginator">
          <ul class="paginator-list">
            <li class="paginator-item" name="to-first">
              <i class="fas fa-angle-double-left"></i>
            </li>
            <li class="paginator-item hidden"></li>
            <li class="paginator-item hidden"></li>
            <li class="paginator-item hidden"></li>
            <li class="paginator-item" name="to-last">
              <i class="fas fa-angle-double-right"></i>
            </li>
          </ul>
        </nav>
      </div>
      <table class="cars">
        <thead>
          <tr>
            <th
              class="table-head"
              v-for="col in columns"
              v-bind:data-name="col.prop"
              v-bind:style="col.style"
              v-bind:key="col.prop"
            >
              <span>{{col.title}}</span>
              <span class="sort-icons">
                <button class="btn-sort">
                  <i data-order="asc" class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-sort">
                  <i data-order="desc" class="fas fa-arrow-down"></i>
                </button>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="tb-row" v-for="car in cars" v-bind:data-id="car.id" v-bind:key="car.id">
            <td>{{car.car_make.name}}</td>
            <td>{{car.car_model.name}}</td>
            <td>{{car.body_type.name}}</td>
            <td>{{car.year}}</td>
            <td>{{car.mileage}}</td>
            <td>{{car.description}}</td>
            <td>{{car.created_at}}</td>
            <td>{{car.updated_at}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script src="./table-cars.js"></script>
<style src="./table-cars.css"></style>
