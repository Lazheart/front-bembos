import { useRuntimeConfig } from '#app'

function getBaseUrl() {
  const config = useRuntimeConfig()
  const base = String(config.public?.apiBaseUrl ?? '').replace(/\/+$/, '')
  if (!base) throw new Error('API base not configured (runtimeConfig.public.apiBaseUrl). Set API_BASE_URL in your environment or update runtimeConfig in nuxt.config.ts')
  return base
}

// --- MENU ---
export async function getMenu(tenantId: string, limit?: number, lastKey?: string) {
  const params = new URLSearchParams({ tenantId })
  if (typeof limit === 'number') params.set('limit', String(limit))
  if (typeof lastKey === 'string' && lastKey.length) params.set('lastKey', lastKey)
  const url = `${getBaseUrl()}/menu?${params.toString()}`
  return await $fetch(url)
}

export async function upsertDish(payload: Record<string, unknown>) {
  const url = `${getBaseUrl()}/admin/menu`
  return await $fetch(url, { method: 'POST', body: payload })
}

// --- KITCHENS ---
export async function getKitchens(tenantId: string) {
  const url = `${getBaseUrl()}/kitchens?tenantId=${encodeURIComponent(tenantId)}`
  return await $fetch(url)
}

export async function createKitchen(payload: Record<string, unknown>) {
  const url = `${getBaseUrl()}/kitchens`
  return await $fetch(url, { method: 'POST', body: payload })
}

// --- ORDERS ---
export async function createOrder(payload: Record<string, unknown>) {
  const url = `${getBaseUrl()}/orders`
  return await $fetch(url, { method: 'POST', body: payload })
}

export async function getOrders() {
  const url = `${getBaseUrl()}/orders`
  return await $fetch(url)
}

export async function getOrderById(orderId: string) {
  const url = `${getBaseUrl()}/orders/${encodeURIComponent(orderId)}`
  return await $fetch(url)
}

export async function updateOrderStatus(orderId: string, status: string) {
  const url = `${getBaseUrl()}/orders/${encodeURIComponent(orderId)}/status`
  return await $fetch(url, { method: 'PATCH', body: { status } })
}
