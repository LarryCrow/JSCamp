<template>
  <div id="table-page" class="result-table">
    <div class="table-wrapper">
      <div class="table-options">
        <div class="toolbar">
          <button class="icons add" @click="passToAddCar" type="button" title="Create new car">
            <i class="fas fa-plus"></i>
          </button>
          <button
            class="icons edit"
            @click="passToEditCar"
            :class="{ disabled: !selectedCar.row }"
            type="button"
            title="Edit selected car"
          >
            <i class="fas fa-pen"></i>
          </button>
          <button
            class="icons delete"
            @click="deleteRow"
            :class="{ disabled: !selectedCar.row }"
            type="button"
            title="Delete selected car"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="searching-field">
          <input class="searching-input" v-model="tempKeyword" type="text">
          <button
            @click="searchCars({keyword:tempKeyword})"
            class="searching-button"
            type="button"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
        <nav class="paginator">
          <ul class="paginator-list">
            <li class="paginator-item" @click="switchPage" name="to-first">
              <i class="fas fa-angle-double-left"></i>
            </li>
            <li
              class="paginator-item"
              v-for="(page, index) in pageState.pages"
              :key="page"
              @click="switchPage"
              :class="{'selected-paginator-item': index === 1, 'paginator-item-not-page': page === '...'}"
            >{{page}}</li>
            <li class="paginator-item" @click="switchPage" name="to-last">
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
              :style="col.style"
              :key="col.prop"
            >
              <span>{{col.title}}</span>
              <span class="sort-icons">
                <button class="btn-sort" @click="sortCars($event, col.prop, 'asc')">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-sort" @click="sortCars($event, col.prop, 'desc')">
                  <i class="fas fa-arrow-down"></i>
                </button>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="tb-row"
            v-for="car in cars"
            :key="car.id"
            @click="selectRow($event, car)"
          >
            <td class="td-truncated" :title="car.car_make.name">{{preventXSS(car.car_make.name)}}</td>
            <td class="td-truncated" :title="car.car_model.name">{{preventXSS(car.car_model.name)}}</td>
            <td class="td-truncated" :title="car.body_type.name">{{preventXSS(car.body_type.name)}}</td>
            <td>{{preventXSS(car.year)}}</td>
            <td>{{preventXSS(car.mileage)}}</td>
            <td class="td-truncated" :title="car.description">{{preventXSS(car.description)}}</td>
            <td>{{preventXSS(car.created_at)}}</td>
            <td>{{preventXSS(car.updated_at)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script src="./table-cars.js"></script>
<style src="./table-cars.css"></style>
