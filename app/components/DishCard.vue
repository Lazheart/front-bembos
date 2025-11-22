<template>
  <div class="dish-card card p-4 flex flex-col items-start">
    <img
      v-if="dish.image"
      :src="String(dish.image)"
      alt="dish"
      class="w-full h-40 object-cover rounded-md mb-3"
    >
    <div class="flex-1 w-full">
      <h3
        class="text-lg font-bold mb-1"
        :title="String(dish.name ?? '')"
      >
        {{ dish.name }}
      </h3>
      <p class="text-sm text-muted mb-2">
        {{ dish.description }}
      </p>
    </div>
    <div class="w-full mt-2 flex items-center justify-between">
      <div class="price font-bold">
        {{ formatPrice(dish.price) }}
      </div>
      <button
        class="btn-primary"
        @click="emitAdd"
      >
        Agregar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const emit = defineEmits<{
  (e: 'add', payload: Record<string, unknown>): void
}>()

const props = defineProps<{ dish: Record<string, unknown> }>()

function emitAdd() {
  emit('add', props.dish)
}

function formatPrice(p: unknown) {
  if (typeof p === 'number') return `S/ ${p.toFixed(2)}`
  if (typeof p === 'string' && p.length) return `S/ ${p}`
  return 'S/ 0.00'
}
</script>

<style scoped>
.dish-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.price {
  color: var(--color-primary);
}
</style>
