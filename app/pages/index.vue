<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-(--color-bg)">
    <div class="card w-full max-w-xl text-center">
      <AppLogo class="mx-auto mb-6 navbar-logo" />
      <h1
        class="text-4xl font-bold mb-2"
        style="color: var(--color-primary)"
      >
        Bienvenido a <span class="highlight">Bembos</span>
      </h1>
      <p
        class="text-lg text-(--color-text) mb-4"
      >
        Disfruta de la mejor hamburguesa con el sabor peruano, ahora en una experiencia digital moderna.
      </p>
      <button class="btn-primary mt-4">
        Ver Menú
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppLogo from '~/components/AppLogo.vue'
// Página principal
</script>
