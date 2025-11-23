import { ref, watch } from 'vue'

// Simple theme system independent of external modules.
// Supported values: 'light' | 'dark'. Persisted in localStorage.
// It applies a data-theme attribute on <html> and a class on <body> for legacy CSS hooks.

const THEME_KEY = 'bembos-theme'

function getInitialTheme(): 'light' | 'dark' {
  if (import.meta.client) {
    const stored = window.localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null
    if (stored === 'light' || stored === 'dark') return stored
    // Fallback: use prefers-color-scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }
  return 'light'
}

const theme = ref<'light' | 'dark'>(getInitialTheme())

export function useTheme() {
  function applyTheme() {
    if (!import.meta.client) return
    const html = document.documentElement
    const body = document.body
    html.setAttribute('data-theme', theme.value)
    body.classList.remove('theme-light', 'theme-dark')
    body.classList.add(`theme-${theme.value}`)
  }

  function setTheme(value: 'light' | 'dark') {
    theme.value = value
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  if (import.meta.client) {
    watch(theme, (val) => {
      window.localStorage.setItem(THEME_KEY, val)
      applyTheme()
    }, { immediate: true })
  }

  return { theme, setTheme, toggleTheme, applyTheme }
}
