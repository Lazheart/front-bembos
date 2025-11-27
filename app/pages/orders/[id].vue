<template>
  <div class="container mx-auto py-8">
    <div class="max-w-3xl mx-auto card p-6">
      <h1 class="text-2xl font-bold" :style="{ color: 'var(--color-primary)' }">Detalle de orden</h1>
      <p class="text-sm text-(--color-muted) mt-1">Estado y detalle de tu pedido.</p>

      <div class="mt-6">
        <div v-if="loading" class="text-center py-6">Cargando...</div>
        <div v-else-if="!order" class="text-center py-8">Orden no encontrada.</div>

        <div v-else>
          <div class="mb-4">
            <div class="font-semibold">Orden {{ order.orderId ?? order.id }}</div>
            <div class="text-xs text-(--color-muted)">Estado: {{ order.status }} • Creado: {{ order.createdAt ?? order.created }}</div>
          </div>

          <div>
            <h3 class="font-semibold">Platos</h3>
            <ul class="mt-2 space-y-2">
              <li v-for="(it, idx) in order.items || []" :key="idx" class="flex items-center justify-between">
                <div>{{ it.name ?? it.title ?? it.id }}</div>
                <div class="text-sm">x{{ it.qty ?? it.quantity ?? 1 }} — S/ {{ Number(it.price ?? 0).toFixed(2) }}</div>
              </li>
            </ul>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <div class="text-sm">Total</div>
            <div class="text-lg font-bold">S/ {{ Number(order.total ?? 0).toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderById } from '~/api/restaurantService'

const route = useRoute()
const order = ref<any | null>(null)
const loading = ref(false)

async function load() {
  const id = String(route.params.id || route.params.orderId || '')
  if (!id) return
  loading.value = true
  try {
    const res = await getOrderById(id)
    // normalize
    if (res && res.order) order.value = res.order
    else order.value = res
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load())
</script>
