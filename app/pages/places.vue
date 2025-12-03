<template>
  <div class="min-h-screen py-8 px-4 bg-(--color-bg)">
    <div class="max-w-5xl mx-auto">
      <!-- Two-column layout: minimap left, list right -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="md:col-span-1">
          <div :class="mapCardClasses">
            <div v-if="coords">
              <iframe
                :src="osmEmbed"
                class="w-full h-64 md:h-80"
                frameborder="0"
                loading="lazy"
              />
              <div class="p-3 flex items-center justify-between">
                <div class="text-sm text-(--color-text)">
                  Mostrando tu ubicación aproximada
                </div>
                <div class="flex items-center gap-2">
                  <UButton
                    size="sm"
                    variant="outline"
                    color="primary"
                    :href="mapsLink"
                    target="_blank"
                  >
                    Abrir en Maps
                  </UButton>
                  <UButton
                    size="sm"
                    variant="ghost"
                    color="neutral"
                    @click="copyCoords"
                  >
                    Copiar
                  </UButton>
                </div>
              </div>
            </div>
            <div v-else class="p-4 text-center">
              <div class="text-sm font-medium">
                Activa tu ubicación
              </div>
              <div class="text-xs text-(--color-muted) mt-1">
                Permite el acceso para ver locales cercanos en el mapa
              </div>
              <div class="mt-3">
                <UButton
                  size="sm"
                  color="primary"
                  @click="requestLocation"
                >
                  Permitir ubicación
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <div class="md:col-span-2">
          <!-- Right column: the existing list content -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1
                class="text-3xl font-extrabold"
                style="color: var(--color-primary)"
              >
                Locales
              </h1>
              <p class="text-sm text-(--color-text)">
                Encuentra tu Bembos más cercano.
              </p>
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

          <div
            v-if="loading && items.length === 0"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div
              v-for="n in 4"
              :key="n"
              class="p-4 bg-white/60 rounded-lg animate-pulse h-28"
            />
          </div>

          <div
            v-else
            class="grid grid-cols-1 gap-4"
          >
            <div v-for="r in filtered" :key="r.kitchenId || r.id" :class="['flex rounded-lg shadow p-3 items-center', isDark ? 'bg-neutral-800 text-white' : 'bg-white/80']">
              <img
                :src="r.image || placeholder"
                alt="imagen"
                class="w-24 h-24 object-cover rounded-md mr-4"
              >
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">
                    {{ r.name || 'Sin nombre' }}
                  </h3>
                  <span :class="['px-2 py-1 text-xs rounded-full font-medium', available(r) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ available(r) ? 'Disponible' : 'No disponible' }}
                  </span>
                </div>
                <p class="text-sm text-(--color-text) mt-1">
                  {{ r.location || r.address || 'Ubicación no disponible' }}
                </p>
                <p class="text-xs text-(--color-text) mt-2">
                  Cocinas: {{ r.kitchenId || '-' }} • Capacidad: {{ r.currentCooking ?? 0 }} / {{ r.maxCooking ?? '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="nextKey"
        class="mt-6 text-center"
      >
        <button
          class="px-4 py-2 rounded-md bg-(--color-primary) text-white"
          @click="loadMoreHandler"
        >
          Cargar más
        </button>
      </div>

      <div
        v-if="error"
        class="mt-4 text-sm text-red-600"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import useRestaurant from '../composables/useRestaurant'
import { useLocation } from '~/composables/useLocation'
import { useTheme } from '~/composables/useTheme'

const { items, loading, error, nextKey, query, filtered, fetchInitial, loadMore: loadMoreApi } = useRestaurant()

// placeholder image
const placeholder = new URL('../assets/media/bemboslocallarco.jpg', import.meta.url).href

const q = query

const { coords, osmEmbed, mapsLink, copyCoords, status, requestLocation } = useLocation()
const { isDark, palette } = useTheme()

const mapCardClasses = computed(() => {
  return [
    'rounded-lg overflow-hidden border shadow h-full',
    isDark.value ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white/80 border-neutral-200'
  ]
})

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
