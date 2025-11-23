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
          'px-4 py-2 rounded',
          mode === 'login' ? 'bg-primary text-white' : 'bg-gray-100'
        ]"
        @click="setMode('login')"
      >
        Login
      </button>
      <button
        :class="[
          'px-4 py-2 rounded',
          mode === 'register' ? 'bg-primary text-white' : 'bg-gray-100'
        ]"
        @click="setMode('register')"
      >
        Register
      </button>
    </div>

    <component :is="mode === 'login' ? LoginCard : RegisterCard" />
  </div>
</template>
