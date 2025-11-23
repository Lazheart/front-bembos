<script setup lang="ts">
import { ref } from 'vue'
import LoginCard from './LoginCard.vue'
import RegisterCard from './RegisterCard.vue'

const mode = ref<'login' | 'register'>('login')
function setMode(m: 'login' | 'register') {
  mode.value = m
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <div class="flex gap-2 mb-4">
      <button
        :class="[
          'px-4 py-2 rounded font-semibold transition-colors',
          mode === 'login' ? 'switcher-active' : 'switcher-inactive'
        ]"
        @click="setMode('login')"
      >
        Login
      </button>
      <button
        :class="[
          'px-4 py-2 rounded font-semibold transition-colors',
          mode === 'register' ? 'switcher-active' : 'switcher-inactive'
        ]"
        @click="setMode('register')"
      >
        Register
      </button>
    </div>

    <component :is="mode === 'login' ? LoginCard : RegisterCard" />
  </div>
</template>

<style scoped>
.switcher-active {
  background: var(--color-btn);
  color: var(--color-btn-text);
  box-shadow: 0 2px 8px rgba(0,0,0,.12);
}
.switcher-active:hover {
  background: var(--color-tertiary-red, var(--color-accent));
  color: var(--color-bembos-white);
}
.switcher-inactive {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-navbar-border);
}
.switcher-inactive:hover {
  background: var(--color-btn);
  color: var(--color-btn-text);
}
</style>
