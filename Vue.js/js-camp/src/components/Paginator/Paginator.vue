<template>
  <nav class="paginator">
    <ul class="paginator-list">
      <li class="paginator-item" @click="switchPage(1)" name="to-first">
        <i class="fas fa-angle-double-left"></i>
      </li>
      <li
        class="paginator-item"
        v-for="(page, index) in paginatorPages"
        :key="page"
        @click="switchPage(page)"
        :class="{'selected-paginator-item': index === 1, 'paginator-item-not-page': page === '...'}"
      >{{page}}</li>
      <li class="paginator-item" @click="switchPage(totalPages)" name="to-last">
        <i class="fas fa-angle-double-right"></i>
      </li>
    </ul>
  </nav>
</template>

<script src="./paginator.js" />
<style src="./paginator.css" />
