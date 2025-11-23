<template>
  <div class="hero-shell">
    <section class="hero-card">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div class="flex-1 space-y-6">
          <span class="pill">
            <UIcon
              name="i-lucide-sparkles"
              class="h-4 w-4"
            />
            Nueva experiencia digital
          </span>

          <div>
            <h1 class="section-title">
              Sabores criollos con energía futurista
            </h1>
            <p class="section-subtitle">
              Unimos los colores oficiales de Bembos con micro-interacciones suaves para que ordenar tu combo favorito sea tan emocionante como disfrutarlo.
            </p>
          </div>

          <div class="flex flex-wrap gap-4">
            <NuxtLink
              to="/menu"
              class="btn-primary"
            >
              Ver menú
            </NuxtLink>
            <UButton
              to="/offers"
              variant="ghost"
              color="neutral"
              class="border border-(--color-navbar-border) text-(--color-text)"
            >
              Promociones
            </UButton>
          </div>

          <ul
            class="hero-grid"
            aria-label="Indicadores de experiencia Bembos"
          >
            <li
              v-for="item in heroHighlights"
              :key="item.label"
              class="hero-stat"
            >
              <p class="text-sm uppercase tracking-widest text-(--color-muted)">
                {{ item.label }}
              </p>
              <p class="text-3xl font-black mt-2">
                {{ item.value }}
              </p>
            </li>
          </ul>
        </div>

        <div class="flex-1 flex flex-col gap-4">
          <div class="card is-ghost">
            <div class="flex items-center justify-between gap-4">
              <span class="badge-soft">
                <UIcon name="i-lucide-flame" />
                Más pedido
              </span>
              <span class="text-sm text-(--color-muted)">
                Tiempo aprox. 25 min
              </span>
            </div>

            <h3 class="text-2xl font-semibold text-(--color-text) mt-3">
              Combo Parrillero XL
            </h3>
            <p class="text-sm text-(--color-muted)">
              Doble carne parrillera, salsa anticuchera, papas artesanales y bebida ilimitada.
            </p>

            <div class="mt-6 flex flex-wrap items-center gap-4">
              <span class="text-4xl font-black text-(--color-primary)">
                S/ 26.90
              </span>
              <button class="btn-primary text-sm">
                Ordenar ahora
              </button>
            </div>
          </div>

          <div class="card flex flex-col gap-4 sm:flex-row sm:items-center">
            <AppLogo class="h-12 w-auto" />
            <div>
              <p class="text-sm text-(--color-muted)">
                Paleta dinámica
              </p>
              <p class="text-lg font-semibold">
                Modo claro amarillo + blanco y modo oscuro azul con alto contraste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppLogo from '~/components/AppLogo.vue'

const heroHighlights = [
  { label: 'Pedidos diarios', value: '+2.5K' },
  { label: 'Locales activos', value: '80+' },
  { label: 'Entrega promedio', value: '25 min' }
]
</script>
