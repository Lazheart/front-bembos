<template>
  <section class="menu-list container mx-auto py-12 space-y-8">
    <header class="menu-header">
      <span class="pill">
        <UIcon name="i-lucide-utensils" />
        Menú oficial
      </span>
      <h1 class="section-title">
        Nuestro Menú
      </h1>
      <p class="section-subtitle">
        Combina tu hamburguesa favorita con papas crujientes, salsas artesanales y postres helados.
      </p>
    </header>

    <Transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="error"
        key="error"
        class="card is-ghost text-left text-red-500"
        role="alert"
      >
        <p class="font-semibold">
          Ups, no pudimos cargar el menú.
        </p>
        <p class="text-sm text-(--color-text) mt-1">
          {{ error }}
        </p>
        <button
          class="btn-primary mt-4"
          @click="retry"
        >
          Reintentar
        </button>
      </div>

      <div
        v-else
        key="content"
      >
        <div
          v-if="loading && !items.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-hidden="true"
        >
          <div
            v-for="placeholder in placeholderCards"
            :key="placeholder"
            class="card h-64 animate-pulse bg-(--color-surface-muted)"
          />
        </div>

        <div
          v-else-if="isEmpty"
          class="card text-center"
        >
          <p class="text-lg font-semibold">
            Aún no tenemos platos disponibles.
          </p>
          <p class="text-sm text-(--color-muted) mt-2">
            Estamos actualizando la carta, vuelve en unos minutos.
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
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
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCart } from '~/composables/useCart'
import DishCard from './DishCard.vue'
import { getMenu } from '../api/restaurantService'

const LIMIT = 9
const TENANT = 'TENANT#BEMBOS'

const items = ref<Record<string, unknown>[]>([])
const nextKey = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const placeholderCards = Array.from({ length: 6 }, (_, idx) => idx)

const isEmpty = computed(() => !loading.value && !error.value && items.value.length === 0)

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
  try {
    const { addItem } = useCart()
    addItem(dish, 1)
    const toast = useToast()
    toast.add({ title: 'Agregado', description: String(dish.name ?? 'Plato agregado'), color: 'success' })
  } catch (e) {
    console.error('Error agregando al carrito', e)
  }
}

function retry() {
  load(true)
}

onMounted(() => load(true))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
