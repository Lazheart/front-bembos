<template>
  <article class="dish-card card flex flex-col gap-4">
    <div class="relative w-full overflow-hidden rounded-2xl bg-(--color-surface-muted)">
      <img
        v-if="dish.image"
        :src="String(dish.image)"
        :alt="String(dish.name ?? 'Platillo Bembos')"
        class="w-full h-48 object-cover"
        loading="lazy"
      >
      <div
        v-else
        class="flex h-48 items-center justify-center text-(--color-muted) gap-2"
      >
        <UIcon name="i-lucide-image-off" />
        <span>Sin imagen</span>
      </div>

      <span
        v-if="isHighlighted"
        class="badge-soft absolute top-4 left-4"
      >
        <UIcon name="i-lucide-star" />
        Favorito
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-2">
      <div class="flex items-start justify-between gap-3">
        <h3
          class="text-xl font-semibold leading-tight"
          :title="String(dish.name ?? '')"
        >
          {{ dish.name ?? 'Hamburguesa sin nombre' }}
        </h3>
        <span class="text-xs uppercase tracking-wider text-(--color-muted)">
          {{ categoryLabel }}
        </span>
      </div>
      <p class="text-sm text-(--color-muted)">
        {{ description }}
      </p>
    </div>

    <div class="flex items-center justify-between pt-2">
      <div>
        <span class="text-xs uppercase tracking-widest text-(--color-muted)">
          Precio
        </span>
        <p class="text-2xl font-black text-(--color-primary)">
          {{ formatPrice(dish.price) }}
        </p>
      </div>
      <button
        class="btn-primary text-sm"
        @click="emitAdd"
      >
        Agregar
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue'

const emit = defineEmits<{
  (e: 'add', payload: Record<string, unknown>): void
}>()

const props = defineProps<{ dish: Record<string, unknown> }>()

const description = computed(() => {
  const raw = props.dish.description
  if (typeof raw === 'string' && raw.trim().length) return raw
  return 'Muy pronto describiremos este nuevo sabor. Mientras tanto, dale una mordida.'
})

const categoryLabel = computed(() => {
  const candidate = props.dish.category ?? props.dish.type ?? props.dish.segment
  if (typeof candidate === 'string' && candidate.trim().length) return candidate
  return 'Especial'
})

const isHighlighted = computed(() => Boolean(props.dish.popular ?? props.dish.featured ?? props.dish.isFeatured))

function emitAdd() {
  emit('add', props.dish)
}

function formatPrice(p: unknown) {
  if (typeof p === 'number') return `S/ ${p.toFixed(2)}`
  if (typeof p === 'string' && p.length) return `S/ ${p}`
  return 'S/ 0.00'
}
</script>
