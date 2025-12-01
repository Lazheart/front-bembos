<template>
  <div class="min-h-screen py-8 px-4 bg-(--color-bg)">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-extrabold" style="color: var(--color-primary)">Locales</h1>
          <p class="text-sm text-(--color-text)">Encuentra tu Bembos más cercano.</p>
        </div>
        <div class="w-full max-w-md">
          <div class="relative">
            <UInput
              v-model="q"
              placeholder="Buscar por nombre o ubicación..."
              icon="i-simple-line-icons-magnifier"
              size="sm"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div v-if="loading && items.length === 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="n in 4" :key="n" class="p-4 bg-white/60 rounded-lg animate-pulse h-28"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="r in filtered" :key="r.kitchenId || r.id" class="flex bg-white/80 rounded-lg shadow p-3 items-center">
          <img :src="r.image || placeholder" alt="imagen" class="w-24 h-24 object-cover rounded-md mr-4" />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">{{ r.name || 'Sin nombre' }}</h3>
              <span :class="['px-2 py-1 text-xs rounded-full font-medium', available(r) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                {{ available(r) ? 'Disponible' : 'No disponible' }}
              </span>
            </div>
            <p class="text-sm text-(--color-text) mt-1">{{ r.location || r.address || 'Ubicación no disponible' }}</p>
            <p class="text-xs text-(--color-text) mt-2">Cocinas: {{ r.kitchenId || '-' }} • Capacidad: {{ r.currentCooking ?? 0 }} / {{ r.maxCooking ?? '-' }}</p>
          </div>
        </div>
      </div>

      <div v-if="nextKey" class="mt-6 text-center">
        <button @click="loadMore" class="px-4 py-2 rounded-md bg-(--color-primary) text-white">Cargar más</button>
      </div>

      <div v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useRestaurant from '../composables/useRestaurant'

const { items, loading, error, nextKey, query, filtered, fetchInitial, loadMore: loadMoreApi } = useRestaurant()

// placeholder image
const placeholder = new URL('../assets/media/bemboslocallarco.jpg', import.meta.url).href

const q = query

function available(r: any) {
  if (typeof r.active === 'boolean') {
    if (!r.active) return false
  }
  const maxC = Number(r.maxCooking ?? 0)
  const cur = Number(r.currentCooking ?? 0)
  if (maxC > 0) return cur < maxC
  return Boolean(r.active)
}

async function loadInitial() {
  try {
    await fetchInitial(20)
  } catch (e) {
    console.error('Error loading initial places:', e)
  }
}

onMounted(() => {
  loadInitial()
})

async function loadMoreHandler() {
  try {
    await loadMoreApi(20)
  } catch (e) {
    console.error('Error loading more places:', e)
  }
}

// simple debounce for search: not required but reduces rapid re-renders
let debounceTimer: number | undefined
watch(q, () => {
  if (debounceTimer) window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    // filtered is reactive; nothing to do here
  }, 200)
})
</script>
