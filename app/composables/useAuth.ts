import { ref, computed } from 'vue'
import { login as apiLogin } from '../api/authService'

export const useAuth = () => {
  const user = useState<Record<string, unknown> | null>('auth_user', () => null)
  const token = useState<string | null>('auth_token', () => null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const toast = useToast()
  const cookieUser = useCookie('auth_user')

  // Prefer persisted localStorage values if present (client-side "Remember me")
  if (typeof window !== 'undefined') {
    try {
      const lsToken = localStorage.getItem('auth_token')
      const lsUser = localStorage.getItem('auth_user')
      if (lsToken && !token.value) {
        token.value = lsToken
      }
      if (lsUser && !user.value) {
        user.value = JSON.parse(lsUser)
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  if (cookieUser.value && !user.value) {
    user.value = cookieUser.value as unknown as Record<string, unknown>
  }

  const cookieToken = useCookie('auth_token')
  if (cookieToken.value && !token.value) {
    token.value = cookieToken.value as string
  }

  function getUserName(u: Record<string, unknown> | null) {
    if (!u) return null
    if (typeof u.username === 'string') return u.username
    return null
  }

  const name = computed(() => getUserName(user.value))
  const greeting = computed(() => (name.value ? `Hola ${name.value}` : null))

  const login = async (payload: Record<string, unknown>) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiLogin(payload)

      let t: string | undefined
      if (res && typeof res === 'object') {
        const r = res as Record<string, unknown>
        if (typeof r.token === 'string') t = r.token
        else if (r.data && typeof r.data === 'object') {
          const d = r.data as Record<string, unknown>
          if (typeof d.token === 'string') t = d.token
        }
      }

      if (t) {
        token.value = t
        const rememberFlag = Boolean(payload && (payload as Record<string, unknown>).remember)
        if (rememberFlag && typeof window !== 'undefined') {
          try {
            localStorage.setItem('auth_token', t)
          } catch (e) {
            // ignore storage errors
          }
        } else {
          const authCookie = useCookie('auth_token', {
            path: '/',
            sameSite: 'lax',
            secure: true,
            maxAge: 60 * 60 // 1 hour
          })
          authCookie.value = t
        }
      }

      let u: Record<string, unknown> | null = null
      if (res && typeof res === 'object') {
        const r = res as Record<string, unknown>
        if (r.user && typeof r.user === 'object') u = r.user as Record<string, unknown>
        else if (r.data && typeof r.data === 'object') {
          const d = r.data as Record<string, unknown>
          if (d.user && typeof d.user === 'object') u = d.user as Record<string, unknown>
          else u = d as Record<string, unknown>
        }
      }

      if (u) {
        user.value = u
        const rememberFlag = Boolean(payload && (payload as Record<string, unknown>).remember)
        if (rememberFlag && typeof window !== 'undefined') {
          try {
            localStorage.setItem('auth_user', JSON.stringify(u))
          } catch (e) {
            // ignore storage errors
          }
        } else {
          const userCookie = useCookie('auth_user', {
            path: '/',
            sameSite: 'lax',
            secure: true,
            maxAge: 60 * 60 * 24 * 7 // 7 days
          })
          userCookie.value = JSON.stringify(u)
        }
      }

      toast.add({ title: 'Login exitoso', description: greeting.value ?? 'Bienvenido', color: 'success' })
      return res
    } catch (err: unknown) {
      error.value = error.value || 'Error desconocido durante el inicio de sesión'
      toast.add({ title: 'Error de autenticación', description: error.value, color: 'error' })
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    const userCookie = useCookie('auth_user')
    const tokenCookie = useCookie('auth_token')
    userCookie.value = null
    tokenCookie.value = null
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
      } catch (e) {
        // ignore
      }
    }
    toast.add({ title: 'Sesión cerrada', description: 'Has cerrado sesión', color: 'info' })
  }

  return {
    user,
    token,
    loading,
    error,
    name,
    greeting,
    login,
    logout
  }
}
