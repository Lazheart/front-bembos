<script setup lang="ts">
import { ref, computed } from 'vue'
import LoginCard from './LoginCard.vue'
import RegisterCard from './RegisterCard.vue'

const mode = ref<'login' | 'register'>('login')
function setMode(m: 'login' | 'register') {
  mode.value = m
}

const isLogin = computed(() => mode.value === 'login')
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <!-- Sliding toggle -->
    <div class="relative mb-4">
      <div
        class="auth-toggle px-1 py-1 rounded-full bg-(--color-surface-muted)"
        role="tablist"
        aria-label="Auth switch"
      >
        <button
          class="relative z-10 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-180 ease-out"
          :aria-pressed="isLogin"
          :class="isLogin ? 'text-(--color-cta-text)' : 'text-(--color-muted)'"
          @click="setMode('login')"
        >
          Login
        </button>
        <button
          class="relative z-10 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-180 ease-out"
          :aria-pressed="!isLogin"
          :class="!isLogin ? 'text-(--color-cta-text)' : 'text-(--color-muted)'"
          @click="setMode('register')"
        >
          Register
        </button>

        <!-- thumb -->
        <div
          class="auth-toggle-thumb absolute top-1/2 -translate-y-1/2 left-1 w-1/2 h-[calc(100%-0.5rem)] rounded-full bg-(--color-primary) shadow-md"
          :style="{ transform: isLogin ? 'translateX(0%)' : 'translateX(100%)' }"
          aria-hidden="true"
        />
      </div>
    </div>

    <component :is="mode === 'login' ? LoginCard : RegisterCard" />
  </div>
</template>
