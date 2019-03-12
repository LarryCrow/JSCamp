<template>
  <div id="table-page" class="result-table">
    <div class="table-wrapper">
      <div class="table-options">
        <div class="toolbar">
          <button class="icons add" type="button" title="Create new car">
            <i class="fas fa-plus"></i>
          </button>
          <button class="icons edit" v-on:click="passToEditCar" v-bind:class="{ disabled: !selectedCar.row }" type="button" title="Edit selected car">
            <i class="fas fa-pen"></i>
          </button>
          <button class="icons delete" v-on:click="deleteRow" v-bind:class="{ disabled: !selectedCar.row }" type="button" title="Delete selected car">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="searching-field">
          <input class="searching-input" v-model="tempKeyword" type="text">
          <button v-on:click="searchCars({keyword:tempKeyword})" class="searching-button" type="button">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <nav class="paginator">
          <ul class="paginator-list">
            <li class="paginator-item" v-on:click="switchPage" name="to-first">
              <i class="fas fa-angle-double-left"></i>
            </li>
            <li class="paginator-item"
                v-for="(page, index) in pageState.pages" v-bind:key="page"
                v-on:click="switchPage"
                v-bind:class="{'selected-paginator-item': index === 1, 'paginator-item-not-page': page === '...'}">
              {{page}}
            </li>
            <li class="paginator-item" v-on:click="switchPage" name="to-last">
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
              v-bind:style="col.style"
              v-bind:key="col.prop"
            >
              <span>{{col.title}}</span>
              <span class="sort-icons">
                <button class="btn-sort" v-on:click="sortCars($event, col.prop, 'asc')">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-sort" v-on:click="sortCars($event, col.prop, 'desc')">
                  <i class="fas fa-arrow-down"></i>
                </button>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="tb-row" v-for="car in cars" v-bind:key="car.id" v-on:click="selectRow($event, car)">
            <td class="td-truncated" :title="car.car_make.name">
              {{car.car_make.name}}
            </td>
            <td class="td-truncated" :title="car.car_model.name">
              {{car.car_model.name}}
            </td>
            <td class="td-truncated" :title="car.body_type.name">
              {{car.body_type.name}}
            </td>
            <td>{{car.year}}</td>
            <td>{{car.mileage}}</td>
            <td class="td-truncated" :title="car.description">
              {{car.description}}
            </td>
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
