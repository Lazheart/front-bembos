<template>
  <div class="menu-wrapper">
    <MenuList :onlyOffers="true" title="Ofertas" subtitle="Aprovecha nuestras promociones exclusivas." />
  </div>
</template>

<script setup lang="ts">
import MenuList from '../components/MenuList.vue'
</script>
