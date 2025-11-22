<template>
  <div class="menu-list container mx-auto py-8">
    <h1
      class="text-3xl font-bold mb-6"
    >
      Nuestro Menú
    </h1>

    <div
      v-if="error"
      class="mb-4 text-red-500"
    >
      {{ error }}
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DishCard
        v-for="(dish, idx) in items"
        :key="String((dish as Record<string, unknown>).id ?? (dish as Record<string, unknown>).slug ?? idx)"
        :dish="dish"
        @add="onAdd"
      />
    </div>

    <div class="mt-6 flex justify-center">
      <button
        v-if="nextKey"
        class="btn-primary"
        :disabled="loading"
        @click="loadMore"
      >
        {{ loading ? 'Cargando...' : 'Cargar más' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DishCard from './DishCard.vue'
import { getMenu } from '../api/restaurantService'

const LIMIT = 9
const TENANT = 'TENANT#BEMBOS'

const items = ref<Record<string, unknown>[]>([])
const nextKey = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

function extractItems(resp: unknown) {
  if (!resp) return { items: [], nextKey: null }
  const r = resp as Record<string, unknown>
  // Common shapes
  if (Array.isArray(resp)) return { items: resp as Record<string, unknown>[], nextKey: null }
  if (r.menu && Array.isArray(r.menu)) return { items: r.menu as Record<string, unknown>[], nextKey: (r.nextKey as string) ?? null }
  if (r.items && Array.isArray(r.items)) return { items: r.items as Record<string, unknown>[], nextKey: (r.nextKey as string) ?? null }
  if (r.data && Array.isArray(r.data)) return { items: r.data as Record<string, unknown>[], nextKey: (r.nextKey as string) ?? null }
  // fallback if response contains array under known keys
  const possible = ['dishes', 'menuItems', 'results']
  for (const k of possible) {
    if (k in r && Array.isArray(r[k])) return { items: r[k] as Record<string, unknown>[], nextKey: (r.nextKey as string) ?? null }
  }
  // if resp has 'nextKey' and 'items' as unknown
  const rr = r as Record<string, unknown>
  if ('nextKey' in rr && 'items' in rr && Array.isArray(rr.items as unknown)) return { items: rr.items as Record<string, unknown>[], nextKey: (rr.nextKey as string) ?? null }
  return { items: [], nextKey: null }
}

async function load(initial = false) {
  loading.value = true
  error.value = null
  try {
    const resp = await getMenu(TENANT, LIMIT, initial ? undefined : nextKey.value ?? undefined)
    const { items: newItems, nextKey: nk } = extractItems(resp)
    if (initial) items.value = newItems
    else items.value = items.value.concat(newItems)
    nextKey.value = nk ?? null
  } catch (err) {
    error.value = (err as Error).message ?? 'Error fetching menu'
  } finally {
    loading.value = false
  }
}

function loadMore() {
  if (!nextKey.value) return
  load(false)
}

function onAdd(dish: Record<string, unknown>) {
  // Placeholder: implement add-to-cart later
  console.log('Agregar al carrito', dish)
}

onMounted(() => load(true))
</script>

<style scoped>
.menu-list h1 {
  color: var(--color-primary);
}
</style>
