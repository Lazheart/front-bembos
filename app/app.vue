<script setup>
const { theme } = useTheme()
const themeColor = computed(() => theme.value === 'dark' ? '#0d1fb3' : '#ffd600')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: () => themeColor.value }
  ],
  link: [
    { rel: 'icon', href: 'https://www.bembos.com.pe/media/favicon/stores/9/favicon-bembos.png' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Bemmbos'
const description = 'Template Bembos para Nuxt 3 y Nuxt UI by Lazheart'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const carritoTotal = ref(0)
const mostrarBusqueda = ref(false)
const busqueda = ref('')
</script>

<template>
  <UApp>
    <UHeader
      class="bembos-header"
      :ui="{
        center: 'flex items-center'
      }"
    >
      <template #left>
        <div class="flex items-center gap-1 max-w-fit">
          <NuxtLink to="/">
            <AppLogo class="h-8 w-auto" />
          </NuxtLink>
          <ThemeToggle />
        </div>
      </template>

      <template #default>
        <!-- moved center slightly more to the left to prevent overlap when search is active -->
        <div class="flex items-center gap-1 lg:gap-2 -ml-8 lg:-ml-14">
          <!-- Link Promociones -->
          <UButton
            to="/offers"
            variant="ghost"
            color="neutral"
            icon="i-lucide-tag"
            class="hidden lg:inline-flex text-base font-medium"
            size="md"
          >
            Promociones
          </UButton>

          <!-- Link Menú -->
          <UButton
            to="/menu"
            variant="ghost"
            color="neutral"
            icon="ic:outline-fastfood"
            class="hidden lg:inline-flex text-base font-medium"
            size="md"
          >
            Menú
          </UButton>

          <!-- Link Locales -->
          <UButton
            to="/places"
            variant="ghost"
            color="neutral"
            icon="i-lucide-map-pin"
            class="hidden lg:inline-flex text-base font-medium"
            size="md"
          >
            Locales
          </UButton>

          <!-- Buscador -->
          <div class="relative flex items-center">
            <UInput
              v-if="mostrarBusqueda"
              v-model="busqueda"
              placeholder="Buscar..."
              icon="i-simple-line-icons-magnifier"
              autofocus
              class="w-28 lg:w-40"
              size="sm"
              @keyup.escape="mostrarBusqueda = false; busqueda = ''"
              @blur="() => { if (!busqueda) mostrarBusqueda = false }"
            />
            <UButton
              v-else
              icon="i-simple-line-icons-magnifier"
              variant="ghost"
              color="neutral"
              size="sm"
              aria-label="Buscar"
              @click="mostrarBusqueda = true"
            />
          </div>
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-2 lg:gap-4 whitespace-nowrap">
          <UButton
            href="tel:01419-1919"
            target="_blank"
            title="01419-1919"
            variant="ghost"
            color="neutral"
            size="sm"
            class="flex flex-col items-center gap-1 text-sm whitespace-nowrap min-w-[72px]"
          >
            <span class="uppercase tracking-wide text-xs font-semibold">Llámanos</span>
            <span class="flex items-center gap-2">
              <UIcon
                name="i-lucide-phone"
                class="h-4 w-4"
                aria-hidden="true"
              />
              <strong class="number-phone">01419-1919</strong>
            </span>
          </UButton>

          <template v-if="isLoggedIn">
            <span class="text-sm hidden lg:inline whitespace-nowrap">
              <span>Hola,</span>
              <strong class="ml-1">{{ usuario }}</strong>
            </span>
          </template>
          <template v-else>
            <!-- Mostrar en línea en pantallas grandes para evitar saltos/solapamientos -->
            <span class="text-sm hidden lg:inline-flex items-center text-center gap-2 whitespace-nowrap">
              <span class="block">Hola,</span>
              <NuxtLink
                to="/auth"
                class="inline-flex items-center gap-2 hover:underline focus-visible:underline"
              >
                <UIcon
                  name="mdi:account-circle"
                  class="h-5 w-5"
                  aria-hidden="true"
                />
                <span>Iniciar sesión</span>
              </NuxtLink>
            </span>
          </template>

          <!-- Carrito de compras -->
          <UButton
            icon="i-lucide-shopping-cart"
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label="Carrito"
            class="min-w-16"
          >
            <span class="hidden sm:inline ml-2 text-sm whitespace-nowrap">
              S/ {{ carritoTotal.toFixed(2) }}
            </span>
          </UButton>
        </div>
      </template>

      <template #body>
        <!-- animación simple para el menú móvil -->
        <div class="flex flex-col gap-2 lg:hidden slide-down">
          <!-- Buscador dentro del menú móvil (primero) -->
          <div class="px-3 pt-2">
            <UInput
              v-model="busqueda"
              placeholder="Buscar..."
              icon="i-simple-line-icons-magnifier"
              class="w-full"
              size="sm"
              @keyup.enter="() => { /* puedes manejar la búsqueda aquí */ }"
            />
          </div>

          <UButton
            to="/offers"
            variant="ghost"
            color="neutral"
            icon="i-lucide-tag"
            block
          >
            Promociones
          </UButton>
          <UButton
            to="/places"
            variant="ghost"
            color="neutral"
            icon="i-lucide-map-pin"
            block
          >
            Locales
          </UButton>

          <UButton
            to="/menu"
            variant="ghost"
            color="neutral"
            icon="ic:outline-fastfood"
            block
          >
            Menú
          </UButton>

          <template v-if="!isLoggedIn">
            <!-- Móvil: mostrar solo el botón 'Iniciar sesión' centrado -->
            <div class="px-3 py-2 text-sm flex justify-center">
              <UButton
                to="/auth"
                variant="ghost"
                color="neutral"
                class="inline-flex items-center gap-2 w-full max-w-xs justify-center"
              >
                <UIcon
                  name="mdi:account-circle"
                  class="h-5 w-5"
                  aria-hidden="true"
                />
                <span class="hidden sm:inline">Iniciar sesión</span>
                <span class="inline-block sm:hidden  tracking-wide text-xs font-semibold">Iniciar sesión</span>
              </UButton>
            </div>
          </template>
          <template v-else>
            <div class="px-3 py-2 text-sm">
              Hola {{ usuario }}
            </div>
          </template>
        </div>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter class="bembos-footer">
      <template #left>
        <div class="flex flex-col items-start gap-3">
          <AppLogo class="h-8 w-auto" />

          <!-- Social links debajo del logo -->
          <div class="mt-1">
            <div class="text-sm font-semibold">
              Síguenos en
            </div>
            <ul class="flex items-center gap-3 mt-2">
              <li>
                <a
                  class="text-neutral-700 hover:text-blue-600"
                  aria-label="Bembos Oficial Facebook"
                  href="https://www.facebook.com/bembos/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <!-- Facebook SVG -->
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898v-2.888h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  class="text-neutral-700 hover:text-red-600"
                  aria-label="Bembos Oficial Youtube"
                  href="https://www.youtube.com/user/BembosCanal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <!-- YouTube SVG -->
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a2.996 2.996 0 0 0-2.106-2.12C19.65 3.5 12 3.5 12 3.5s-7.65 0-9.392.566A2.996 2.996 0 0 0 .502 6.186 31.54 31.54 0 0 0 0 12a31.54 31.54 0 0 0 .502 5.814 2.996 2.996 0 0 0 2.106 2.12C4.35 20.5 12 20.5 12 20.5s7.65 0 9.392-.566a2.996 2.996 0 0 0 2.106-2.12A31.54 31.54 0 0 0 24 12a31.54 31.54 0 0 0-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  class="text-neutral-700 hover:text-sky-500"
                  aria-label="Bembos Oficial Twitter"
                  href="https://twitter.com/BembosOficial"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <!-- Twitter SVG -->
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M22.162 5.656c-.63.28-1.305.47-2.016.556a3.517 3.517 0 0 0 1.543-1.94 7.044 7.044 0 0 1-2.229.852 3.513 3.513 0 0 0-5.98 3.203A9.973 9.973 0 0 1 3.11 4.9a3.513 3.513 0 0 0 1.087 4.69 3.49 3.49 0 0 1-1.592-.44v.044a3.513 3.513 0 0 0 2.818 3.444 3.53 3.53 0 0 1-.922.123c-.225 0-.445-.022-.66-.063a3.514 3.514 0 0 0 3.278 2.435A7.045 7.045 0 0 1 2 18.407 9.946 9.946 0 0 0 7.29 20c6.035 0 9.342-5 9.342-9.342 0-.142-.003-.284-.01-.425a6.67 6.67 0 0 0 1.63-1.497l.01-.01z" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  class="text-neutral-700 hover:text-pink-600"
                  aria-label="Bembos Oficial Instagram"
                  href="https://www.instagram.com/bembosoficial"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <!-- Instagram SVG -->
                  <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.5 6.5h.01"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <p class="text-sm text-muted">
            Lazheart Bemmbos • © {{ new Date().getFullYear() }}
          </p>
        </div>
      </template>

      <template #default>
        <div class="pagebuilder-column mt-4 w-full">
          <div class="footer-column-content flex flex-col gap-3 sm:flex-row sm:gap-6">
            <div class="libro-de-reclamaciones">
              <div class="title text-center">
                <span class="block">Libro de Reclamaciones</span>
              </div>
              <div class="column-content mt-1">
                <div class="footer-link-style flex justify-center">
                  <a
                    href="https://www.bembos.com.pe/bembos-reclamaciones/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-block"
                  >
                    <img
                      src="https://www.bembos.com.pe/static/version1762780857/frontend/Ngr/bembos/es_PE/images/libro-de-reclamaciones.jpg"
                      alt="Libro de Reclamaciones"
                      width="88"
                      height="22"
                      loading="lazy"
                      class="mx-auto"
                    >
                  </a>
                </div>
              </div>
            </div>

            <div class="footer-payment">
              <div class="title text-center">
                <span class="block">Métodos de Pago</span>
              </div>
              <div class="column-content mt-1">
                <ul class="links inline-sections">
                  <li>
                    <img
                      src="https://www.bembos.com.pe/media/wysiwyg/bembos/pagos.png"
                      alt="Métodos de Pago"
                      loading="lazy"
                      width="156"
                      height="37"
                    >
                  </li>
                </ul>
              </div>
            </div>

            <div class="footer-payment apps">
              <div class="title text-center">
                <span class="block">Bembos App</span>
              </div>
              <div class="column-content mt-1">
                <ul class="links inline-sections flex gap-2">
                  <li>
                    <img
                      src="https://www.bembos.com.pe/media/wysiwyg/bembos/google-play.png"
                      alt="Google Play"
                      loading="lazy"
                      width="85"
                      height="25"
                    >
                  </li>
                  <li>
                    <img
                      src="https://www.bembos.com.pe/media/wysiwyg/bembos/app-store.png"
                      alt="App Store"
                      loading="lazy"
                      width="85"
                      height="25"
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #right>
        <UButton
          to="https://github.com/Lazheart/front-bembos.git"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>

<style scoped>
/* Animación simple para desplegar el menú móvil */
.slide-down {
  animation: slideDown 220ms ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
