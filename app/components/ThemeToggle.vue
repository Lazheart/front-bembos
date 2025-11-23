<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { theme, toggleTheme } = useTheme()

const label = computed(() => theme.value === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro')
</script>

<template>
  <button
    class="theme-toggle inline-flex items-center justify-center rounded-md p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--color-btn)"
    :aria-label="label"
    @click="toggleTheme"
  >
    <UIcon
      :name="theme === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
      class="h-5 w-5"
    />
  </button>
</template>

<style scoped>
.theme-toggle {
  background: var(--color-navbar);
  color: var(--color-navbar-text);
  border: 1px solid var(--color-navbar-border);
}
.theme-toggle:hover {
  background: var(--color-btn);
  color: var(--color-btn-text);
}
.theme-toggle:active {
  transform: translateY(1px);
}
</style>
