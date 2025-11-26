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
  <div class="auth-container flex flex-col items-center justify-center gap-4 p-4">
    <div class="auth-tabs flex gap-2 mb-4">
      <button
        class="auth-tab"
        :class="{ 'auth-tab--active': mode === 'login' }"
        @click="setMode('login')"
      >
        <UIcon
          name="i-lucide-log-in"
          class="auth-tab__icon"
        />
        Login
      </button>
      <button
        class="auth-tab"
        :class="{ 'auth-tab--active': mode === 'register' }"
        @click="setMode('register')"
      >
        <UIcon
          name="i-lucide-user-plus"
          class="auth-tab__icon"
        />
        Register
      </button>
    </div>

    <component :is="mode === 'login' ? LoginCard : RegisterCard" />
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: var(--color-hero-grad);
}

.auth-tabs {
  background: var(--color-surface);
  border-radius: 999px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--color-navbar-border);
}

.auth-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  background: transparent;
  color: var(--color-muted);
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
}

.auth-tab__icon {
  width: 18px;
  height: 18px;
}

.auth-tab:hover:not(.auth-tab--active) {
  color: var(--color-text);
  background: var(--color-surface-muted);
}

.auth-tab--active {
  background: linear-gradient(135deg, var(--color-tertiary-1), var(--color-primary));
  color: white;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--color-tertiary-1) 35%, transparent);
}
</style>
