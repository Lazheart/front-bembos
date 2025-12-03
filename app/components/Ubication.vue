<template>
  <div :class="stripClasses">
    <div class="store-direction bem max-w-7xl mx-auto px-3">
      <a
        class="store-selector-link-bold action secondary change-direction flex items-center justify-between gap-4 py-2"
        href="#"
        :style="selectedStyle"
        @click.prevent="requestLocation"
      >
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-map-pin"
            class="h-5 w-5"
          />
          <div>
            <div
              v-if="!coords"
              class="not-selected"
            >
              <div class="text-location text-sm font-medium">¡Comienza tu pedido!</div>
              <div class="direction-group text-xs text-(--color-muted)">Elige tu dirección</div>
            </div>
            <div
              v-else
              class="selected"
            >
              <div class="store-title text-sm">
                <span class="method-name">Delivery:</span>
                <strong
                  class="source-name ml-2"
                  style="color: var(--primary-color)"
                >{{ coords.lat.toFixed(5) }}, {{ coords.lng.toFixed(5) }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="actions flex items-center gap-2">
          <UButton
            v-if="!coords && status !== 'loading'"
            size="sm"
            variant="ghost"
            color="primary"
            @click.prevent="requestLocation"
          >Permitir</UButton>
          <UButton
            v-if="coords"
            size="sm"
            variant="outline"
            color="primary"
            :href="mapsLink"
            target="_blank"
          >Abrir</UButton>
          <UButton
            v-if="coords"
            size="sm"
            variant="ghost"
            color="neutral"
            @click.prevent="copyCoords"
          >Copiar</UButton>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocation } from '~/composables/useLocation'
import { useTheme } from '~/composables/useTheme'
import { computed } from 'vue'

const { status, coords, requestLocation, mapsLink, copyCoords } = useLocation()
const { isDark, palette } = useTheme()

const stripClasses = computed(() => {
  return [
    'header-bottom-links w-full shadow-sm rounded-md',
    isDark.value ? 'bg-neutral-900 text-(--color-text) border border-neutral-800' : 'bg-(--color-surface) text-(--color-text)'
  ]
})

const selectedStyle = computed(() => ({
  'color': palette.value.text,
  // highlight primary in selected name
  '--primary-color': palette.value.primary
} as Record<string, string>))
</script>

<style scoped>
.place-card {
    /* simple spacing to match other cards */
}
</style>
