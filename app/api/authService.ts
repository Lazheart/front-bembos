export type LoginPayload = { username?: string, email?: string, password?: string }
export type RegisterPayload = Record<string, unknown>

function normalizeAndThrow(err: unknown) {
  const e = err as unknown as Record<string, unknown>
  const out = new Error((e?.message as string) ?? 'Request failed')
  let status: number | undefined
  if (typeof e?.status === 'number') {
    status = e.status as number
  } else if (e?.response && typeof (e.response as Record<string, unknown>).status === 'number') {
    status = (e.response as Record<string, unknown>).status as number
  }

  let body: unknown = undefined
  if ('data' in e && e.data !== undefined) body = e.data
  else if (e?.response && 'data' in (e.response as Record<string, unknown>)) body = (e.response as Record<string, unknown>).data
  else if (e?.response && 'body' in (e.response as Record<string, unknown>)) body = (e.response as Record<string, unknown>).body

  ;(out as unknown as Record<string, unknown>).status = status
  ;(out as unknown as Record<string, unknown>).body = body
  throw out
}

export async function login(payload: LoginPayload) {
  try {
    const config = useRuntimeConfig()
    const base = String(config.public?.apiAuthBase ?? '').replace(/\/+$/, '')
    if (!base) throw new Error('API base not configured (runtimeConfig.public.apiAuthBase)')
    const url = base + '/auth/login'
    return await $fetch(url, { method: 'POST', body: payload })
  } catch (err) {
    normalizeAndThrow(err)
  }
}

export async function register(payload: RegisterPayload) {
  try {
    const config = useRuntimeConfig()
    const base = String(config.public?.apiAuthBase ?? '').replace(/\/+$/, '')
    if (!base) throw new Error('API base not configured (runtimeConfig.public.apiAuthBase)')
    const url = base + '/auth/register'
    return await $fetch(url, { method: 'POST', body: payload })
  } catch (err) {
    normalizeAndThrow(err)
  }
}

export default { login, register }
