<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '~/composables/useTheme'

const { isDark, theme, toggleTheme } = useTheme()

const label = computed(() => (isDark.value ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'))
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-pressed="isDark"
    :aria-label="label"
    @click="toggleTheme"
  >
    <span class="theme-toggle__icon">
      <UIcon
        name="i-lucide-sun"
        class="sun"
        aria-hidden="true"
      />
      <UIcon
        name="i-lucide-moon"
        class="moon"
        aria-hidden="true"
      />
    </span>
    <span
      class="theme-toggle__thumb"
      :class="{ 'theme-toggle__thumb--dark': theme === 'dark' }"
    />
  </button>
</template>

<style scoped>
.theme-toggle {
  position: relative;
  width: 64px;
  height: 32px;
  border-radius: 999px;
  border: 2px solid var(--color-navbar-border);
  background: linear-gradient(90deg, var(--color-primary), var(--color-tertiary-2));
  display: inline-flex;
  align-items: center;
  padding: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.theme-toggle:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--color-primary) 60%, transparent);
  outline-offset: 2px;
}

.theme-toggle__icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  color: var(--color-secondary);
}

.theme-toggle__icon .sun {
  color: var(--color-tertiary-1);
}

.theme-toggle__icon .moon {
  color: var(--color-tertiary-2);
}

.theme-toggle__thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-secondary);
  transform: translateX(4px);
  transition: transform 0.25s ease, background 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.theme-toggle__thumb--dark {
  transform: translateX(34px);
  background: var(--color-tertiary-2);
}
</style>
