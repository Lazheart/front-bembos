import { ref, computed } from 'vue'

type Coords = { lat: number; lng: number }

const status = ref<'idle' | 'loading' | 'granted' | 'denied' | 'unsupported'>('idle')
const coords = ref<Coords | null>(null)

export function useLocation() {
  const mapsLink = computed(() => {
    if (!coords.value) return ''
    return `https://www.google.com/maps?q=${coords.value.lat},${coords.value.lng}`
  })

  const osmEmbed = computed(() => {
    if (!coords.value) return ''
    const lat = coords.value.lat
    const lon = coords.value.lng
    const delta = 0.01
    const minlon = (lon - delta).toFixed(6)
    const minlat = (lat - delta).toFixed(6)
    const maxlon = (lon + delta).toFixed(6)
    const maxlat = (lat + delta).toFixed(6)
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minlon},${minlat},${maxlon},${maxlat}&layer=mapnik&marker=${lat},${lon}`
  })

  function requestLocation() {
    if (!('geolocation' in navigator)) {
      status.value = 'unsupported'
      return
    }

    status.value = 'loading'
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        coords.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        status.value = 'granted'
      },
      (err) => {
        console.warn('Geolocation error', err)
        status.value = 'denied'
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function clearLocation() {
    coords.value = null
    status.value = 'idle'
  }

  function copyCoords() {
    if (!coords.value) return
    const text = `${coords.value.lat},${coords.value.lng}`
    return navigator.clipboard.writeText(text)
  }

  return {
    status,
    coords,
    requestLocation,
    clearLocation,
    mapsLink,
    osmEmbed,
    copyCoords
  }
}

export type UseLocationReturn = ReturnType<typeof useLocation>
