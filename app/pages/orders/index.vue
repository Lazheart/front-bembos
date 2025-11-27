<template>
  <div class="container mx-auto py-8">
    <div class="max-w-3xl mx-auto card p-6">
      <h1 class="text-2xl font-bold" :style="{ color: 'var(--color-primary)' }">Mis órdenes</h1>
      <p class="text-sm text-(--color-muted) mt-1">Lista de órdenes realizadas por tu cuenta.</p>

      <div class="mt-6">
        <div v-if="loading" class="text-center py-6">Cargando...</div>
        <div v-else-if="!orders.length" class="text-center py-8">No hay órdenes todavía.</div>
        <ul v-else class="space-y-3">
          <li v-for="o in orders" :key="o.orderId" class="p-3 border rounded flex items-center justify-between">
            <div>
              <div class="font-semibold">Orden {{ o.orderId }}</div>
              <div class="text-xs text-(--color-muted)">Estado: {{ o.status }} • Total: S/ {{ Number(o.total ?? 0).toFixed(2) }}</div>
            </div>
            <NuxtLink :to="`/orders/${o.orderId}`" class="btn-ghost">Ver</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getOrders } from '~/api/restaurantService'
const orders = ref<any[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const res = await getOrders()
    // expected an array or data property
    if (Array.isArray(res)) orders.value = res
    else if (res && Array.isArray((res as any).orders)) orders.value = (res as any).orders
    else if (res && Array.isArray((res as any).data)) orders.value = (res as any).data
    else if (res && res.order) orders.value = [res.order]
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => load())
</script>
