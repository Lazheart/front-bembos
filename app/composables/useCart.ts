import { computed } from 'vue'

export function useCart() {
  // Persisted across pages with useState
  const cart = useState<Record<string, any>[]>('cart_items', () => [])

  function findIndexById(id: string) {
    return cart.value.findIndex(i => String(i.id) === String(id))
  }

  function addItem(dish: Record<string, unknown>, qty = 1) {
    const id = (dish.id ?? dish.slug ?? dish.name ?? Math.random()).toString()
    const idx = findIndexById(id)
    const price = typeof dish.price === 'number' ? dish.price : Number(dish.price) || 0
    if (idx === -1) {
      cart.value.push({ id, name: dish.name ?? 'Plato', price, qty })
    } else {
      const item = cart.value[idx]
      if (item) {
        const currentQty = Number(item.qty || 0)
        item.qty = currentQty + qty
      }
    }
  }

  function removeItem(id: string) {
    const idx = findIndexById(id)
    if (idx !== -1) cart.value.splice(idx, 1)
  }

  function updateQty(id: string, qty: number) {
    const idx = findIndexById(id)
    if (idx !== -1) {
      if (qty <= 0) {
        cart.value.splice(idx, 1)
      } else {
        const item = cart.value[idx]
        if (item) {
          item.qty = qty
        }
      }
    }
  }

  function clear() {
    cart.value = []
  }

  const total = computed(() => {
    return cart.value.reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.qty || 0)), 0)
  })

  const count = computed(() => cart.value.reduce((acc, it) => acc + Number(it.qty || 0), 0))

  return {
    cart,
    addItem,
    removeItem,
    updateQty,
    clear,
    total,
    count
  }
}

export type UseCartReturn = ReturnType<typeof useCart>
