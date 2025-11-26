import { computed, onMounted } from 'vue'

type ThemeName = 'light' | 'dark'

interface ThemePalette {
  primary: string
  secondary: string
  tertiaryOne: string
  tertiaryTwo: string
  background: string
  surface: string
  text: string
  muted: string
}

const STORAGE_KEY = 'bembos-theme-preference'
const DEFAULT_THEME: ThemeName = 'light'

const palettes: Record<ThemeName, ThemePalette> = {
  light: {
    primary: '#EEB72B',
    secondary: '#ffffff',
    tertiaryOne: '#e31837',
    tertiaryTwo: '#0f4cff',
    background: '#fff9ed',
    surface: '#ffffff',
    text: '#14110f',
    muted: '#6b6b6b'
  },
  dark: {
    primary: '#0000FF',
    secondary: '#ffffff',
    tertiaryOne: '#EEB72B',
    tertiaryTwo: '#0000FF',
    background: '#05091f',
    surface: '#0f1a3d',
    text: '#f7f8ff',
    muted: '#a6b0d8'
  }
}

const isValidTheme = (value?: string | null): value is ThemeName => value === 'light' || value === 'dark'

const applyThemeToDom = (next: ThemeName) => {
  if (!import.meta.client) return
  const root = document.documentElement
  const body = document.body

  root.dataset.theme = next
  body.classList.remove('theme-light', 'theme-dark')
  body.classList.add(next === 'dark' ? 'theme-dark' : 'theme-light')
}

export function useTheme() {
  const colorMode = useColorMode()
  const theme = useState<ThemeName>('bembos-theme', () => {
    const preference = colorMode.preference
    if (isValidTheme(preference)) return preference
    if (isValidTheme(colorMode.value)) return colorMode.value
    return DEFAULT_THEME
  })

  const setTheme = (next: ThemeName) => {
    theme.value = next
    colorMode.preference = next
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, next)
    applyThemeToDom(next)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    const saved = import.meta.client ? localStorage.getItem(STORAGE_KEY) : null
    if (isValidTheme(saved)) setTheme(saved)
    else applyThemeToDom(theme.value)
  })

  const palette = computed(() => palettes[theme.value])
  const isDark = computed(() => theme.value === 'dark')

  return {
    theme,
    palette,
    isDark,
    toggleTheme,
    setTheme
  }
}

export type UseThemeReturn = ReturnType<typeof useTheme>
