<template>
  <div class="container mx-auto py-8">
    <div class="max-w-3xl mx-auto card p-6">
      <h1 class="text-2xl font-bold" :style="{ color: 'var(--color-primary)' }">Confirmar pedido</h1>
      <p class="text-sm text-(--color-muted) mt-1">Revisa los platos y procede al pago.</p>

      <div class="mt-6">
        <div v-if="!cart.length" class="text-center py-8">Tu carrito está vacío. Ve al <NuxtLink to="/menu" class="text-(--color-primary)">menú</NuxtLink> para agregar platos.</div>

        <ul v-else class="space-y-4">
          <li v-for="item in cart" :key="item.id" class="flex items-center justify-between gap-4">
            <div class="flex-1">
              <div class="font-semibold">{{ item.name }}</div>
              <div class="text-xs text-(--color-muted)">S/ {{ Number(item.price).toFixed(2) }}</div>
            </div>
            <div class="flex items-center gap-2">
              <button class="px-2 py-1 border rounded" @click="decrease(item)">-</button>
              <div class="px-3">{{ item.qty }}</div>
              <button class="px-2 py-1 border rounded" @click="increase(item)">+</button>
              <div class="w-24 text-right font-bold">S/ {{ (Number(item.price) * item.qty).toFixed(2) }}</div>
            </div>
          </li>
        </ul>

        <div v-if="cart.length" class="mt-6 flex items-center justify-between">
          <div>
            <div class="text-sm">Total estimado</div>
            <div class="text-2xl font-extrabold">S/ {{ carritoTotal.toFixed(2) }}</div>
          </div>
          <div class="space-y-2">
            <button class="btn-primary" :disabled="loading" @click="makeOrder">{{ loading ? 'Procesando...' : 'Hacer pedido / Pagar' }}</button>
            <button class="btn-ghost" @click="clearCart" :disabled="loading">Vaciar carrito</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'
import { createOrder } from '~/api/restaurantService'
const { cart, updateQty, removeItem, clear, total: carritoTotal } = useCart()
const loading = ref(false)
const router = useRouter()

function increase(item: any) {
  updateQty(item.id, Number(item.qty) + 1)
}

function decrease(item: any) {
  const next = Number(item.qty) - 1
  if (next <= 0) removeItem(item.id)
  else updateQty(item.id, next)
}

async function makeOrder() {
  if (!cart.length) return
  loading.value = true
  try {
    const payload = {
      items: cart.map(i => ({ id: i.id, name: i.name, price: Number(i.price), qty: Number(i.qty) })),
      total: Number(carritoTotal.value)
    }
    const res = await createOrder(payload)
    // assume response contains order.orderId
    const orderId = (res && (res.order?.orderId ?? res.orderId ?? res.data?.orderId)) || (res && (res.orderId ?? res.id))
    clear()
    const toast = useToast()
    toast.add({ title: 'Pedido creado', description: 'Tu pedido se creó correctamente', color: 'success' })
    if (orderId) router.push(`/orders/${orderId}`)
    else router.push('/orders')
  } catch (err: any) {
    const toast = useToast()
    toast.add({ title: 'Error', description: err?.message ?? 'No se pudo crear pedido', color: 'error' })
    console.error(err)
  } finally {
    loading.value = false
  }
}

function clearCart() {
  clear()
}
</script>

