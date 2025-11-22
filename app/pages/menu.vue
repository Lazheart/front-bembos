<template>
  <div>
    <nav class="navbar">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <AppLogo />
        </div>
        <div class="text-sm text-navbar">
          <span class="highlight">Menú</span>
        </div>
      </div>
    </nav>

    <main class="p-6">
      <MenuList />
    </main>
  </div>
</template>

<script setup lang="ts">
import MenuList from '../components/MenuList.vue'
import AppLogo from '../components/AppLogo.vue'
</script>
