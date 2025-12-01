import { ref, computed } from 'vue'
import { useRoute } from '#imports'
import { getKitchens } from '../api/restaurantService'
import { useAuth } from './useAuth'

const DEFAULT_TENANT = 'TENANT#BEMBOS'

export const useRestaurant = () => {
  const { user } = useAuth()
  const items = ref<Array<Record<string, any>>>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const nextKey = ref<string | null>(null)
  const query = ref('')

  async function fetchInitial(limit = 20) {
    error.value = null
    loading.value = true
    try {
      const route = useRoute()
      const tenantId = (user.value && (user.value as any).tenantId) || (route.query.tenantId as string) || DEFAULT_TENANT
      const res = await getKitchens(tenantId, limit)
      items.value = res.kitchens || []
      nextKey.value = res.nextKey || null
      return res
    } catch (e: any) {
      error.value = e?.message || String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loadMore(limit = 20) {
    if (!nextKey.value) return null
    loading.value = true
    try {
      const route = useRoute()
      const tenantId = (user.value && (user.value as any).tenantId) || (route.query.tenantId as string) || DEFAULT_TENANT
      const res = await getKitchens(tenantId, limit, nextKey.value as string)
      items.value = items.value.concat(res.kitchens || [])
      nextKey.value = res.nextKey || null
      return res
    } catch (e: any) {
      error.value = e?.message || String(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return items.value
    return items.value.filter(r => {
      const name = (r.name || '') as string
      const location = (r.location || r.address || '') as string
      return (name + ' ' + location).toLowerCase().includes(q)
    })
  })

  return {
    items,
    loading,
    error,
    nextKey,
    query,
    filtered,
    fetchInitial,
    loadMore
  }
}

export default useRestaurant
