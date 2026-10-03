<template>
  <div class="min-h-screen flex flex-col" style="background: #F4F6FA;">
    <!-- Header -->
    <header class="px-6 pt-10 pb-6 text-center animate-fade-in">
      <img
        src="https://res.cloudinary.com/ddeigqz5d/image/upload/v1790630020/LOGO_BR2026_vbixvo_w7hjua.webp"
        alt="Bayan Run 2026 Logo"
        class="w-30 h-20 object-contain mx-auto mb-4"
      />
      <p class="text-xs font-extrabold tracking-[0.2em] uppercase mb-1" style="color: #E63946;">BAYAN RUN · 2026</p>
      <h1 class="text-2xl font-extrabold tracking-tight" style="color: #0A1628;">
        ADMIN QUICK
        <span style="color: #E63946;">REGISTER</span>
      </h1>
      <p class="text-xs font-bold mt-2 px-3 py-1 rounded-full inline-block" style="background: rgba(230,57,70,0.08); color: #E63946;">
        Mode Admin · Langsung Terdaftar
      </p>
    </header>

    <!-- Scanner Area -->
    <main class="flex-1 px-6 flex flex-col gap-5 animate-slide-up">
      <div class="text-center">
        <p class="font-bold text-base" style="color: #0A1628;">Scan QR Code Peserta</p>
        <p class="text-sm mt-1 font-medium" style="color: rgba(10,22,40,0.5);">Peserta akan otomatis terdaftar tanpa isi form</p>
      </div>

      <!-- Camera Viewfinder -->
      <div class="relative rounded-2xl overflow-hidden shadow-sm" style="border: 2px solid rgba(230,57,70,0.25); background: #0A1628;">
        <div v-if="scanning" class="absolute inset-x-0 h-0.5 z-10 animate-scan-line pointer-events-none" style="background: linear-gradient(to right, transparent, #E63946, transparent);"></div>

        <!-- Corner markers -->
        <div class="absolute top-3 left-3 w-6 h-6 z-20" style="border-top: 2px solid #E63946; border-left: 2px solid #E63946; border-radius: 4px 0 0 0;"></div>
        <div class="absolute top-3 right-3 w-6 h-6 z-20" style="border-top: 2px solid #E63946; border-right: 2px solid #E63946; border-radius: 0 4px 0 0;"></div>
        <div class="absolute bottom-3 left-3 w-6 h-6 z-20" style="border-bottom: 2px solid #E63946; border-left: 2px solid #E63946; border-radius: 0 0 0 4px;"></div>
        <div class="absolute bottom-3 right-3 w-6 h-6 z-20" style="border-bottom: 2px solid #E63946; border-right: 2px solid #E63946; border-radius: 0 0 4px 0;"></div>

        <video ref="videoEl" class="w-full aspect-square object-cover" muted playsinline></video>

        <div v-if="!cameraReady" class="absolute inset-0 flex items-center justify-center rounded-2xl" style="background: rgba(10,22,40,0.92);">
          <div class="text-center">
            <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style="border-color: #E63946; border-top-color: transparent;"></div>
            <p class="text-sm font-medium" style="color: rgba(255,255,255,0.6);">Memuat kamera...</p>
          </div>
        </div>

        <!-- Processing overlay -->
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center rounded-2xl" style="background: rgba(10,22,40,0.92);">
          <div class="text-center">
            <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style="border-color: #E63946; border-top-color: transparent;"></div>
            <p class="text-sm font-medium" style="color: rgba(255,255,255,0.6);">Mendaftarkan peserta...</p>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <transition name="page">
        <div v-if="error" class="rounded-xl p-4" style="border: 1px solid rgba(230,57,70,0.25); background: rgba(230,57,70,0.06);">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: #E63946;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-semibold text-sm" style="color: #E63946;">{{ error }}</p>
              <button @click="error = null; restartScanner()" class="text-xs mt-1.5 underline underline-offset-2 font-medium" style="color: rgba(10,22,40,0.6);">
                Coba lagi
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Manual input fallback -->
      <div class="rounded-2xl p-4" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.08);">
        <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color: rgba(10,22,40,0.4);">Atau masukkan invoice manual</p>
        <div class="flex gap-2">
          <input
            v-model="manualInvoice"
            type="text"
            placeholder="Contoh: BYRN202509020618277481"
            class="flex-1 rounded-xl px-3 py-2.5 text-xs font-mono outline-none transition-all"
            style="background: #F4F6FA; border: 1px solid rgba(10,22,40,0.1); color: #0A1628;"
            @keyup.enter="submitManual"
          />
          <button
            @click="submitManual"
            :disabled="!manualInvoice.trim() || loading"
            class="font-bold px-4 rounded-xl transition-colors text-sm disabled:opacity-50"
            style="background: #E63946; color: #FFFFFF;"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span v-else>Cari</span>
          </button>
        </div>
      </div>
    </main>

    <footer class="px-6 py-6 text-center">
      <p class="text-xs font-bold tracking-widest uppercase" style="color: rgba(10,22,40,0.35);">Bayan Run 2026 · Admin Panel</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import QrScanner from 'qr-scanner'
import { participantApi } from '@/services/api'
import { useRegistrationStore } from '@/stores/registration'

const router = useRouter()
const store = useRegistrationStore()

const videoEl = ref(null)
const scanning = ref(false)
const cameraReady = ref(false)
const error = ref(null)
const loading = ref(false)
const manualInvoice = ref('')
let qrScanner = null

const handleScanSuccess = async (result) => {
  if (loading.value) return
  const invoiceNumber = (result?.data || result || '').trim().toUpperCase()
  if (!invoiceNumber) return

  scanning.value = false
  qrScanner?.stop()

  await processInvoice(invoiceNumber)
}

const processInvoice = async (invoiceNumber) => {
  loading.value = true
  error.value = null

  try {
    // 1. Ambil data peserta dari invoice
    const lookupResponse = await participantApi.getByInvoice(invoiceNumber)

    if (lookupResponse.status === 'already_registered') {
      error.value = lookupResponse.message
      restartScanner()
      return
    }

    // 2. Langsung register tanpa lewat form
    // NOTE: sesuaikan payload ini dengan field yang wajib di backend.
    // Kalau RegisterPage.vue punya field tambahan (emergency contact, size baju, dll)
    // yang wajib diisi, tambahkan default/placeholder-nya di sini.
    const registerPayload = {
      invoice_number: invoiceNumber,
      ...lookupResponse.data,
      admin_confirmed: true,
    }

    const registerResponse = await participantApi.register(registerPayload)

    store.setInvoice(invoiceNumber)
    store.setSuccessData(registerResponse.data)
    router.push({ name: 'success' })
  } catch (err) {
    error.value = err.userMessage || 'Gagal mendaftarkan peserta. Pastikan invoice benar.'
    restartScanner()
  } finally {
    loading.value = false
  }
}

const submitManual = () => {
  const invoice = manualInvoice.value.trim().toUpperCase()
  if (!invoice) return
  processInvoice(invoice)
}

const restartScanner = () => {
  scanning.value = false
  qrScanner?.start().then(() => { scanning.value = true })
}

const initScanner = async () => {
  if (!videoEl.value) return

  try {
    qrScanner = new QrScanner(
      videoEl.value,
      (result) => handleScanSuccess(result),
      {
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 10,
      }
    )

    await qrScanner.start()
    cameraReady.value = true
    scanning.value = true
  } catch (err) {
    console.error('[ScannerAdmin] gagal memulai kamera:', err)
    cameraReady.value = true

    if (err?.name === 'NotAllowedError' || /permission/i.test(String(err))) {
      error.value = 'Izin kamera ditolak. Aktifkan izin kamera untuk situs ini di pengaturan browser, lalu coba lagi.'
    } else if (err?.name === 'NotFoundError' || /no camera/i.test(String(err))) {
      error.value = 'Kamera tidak ditemukan di perangkat ini.'
    } else {
      error.value = 'Tidak dapat memulai kamera. Coba lagi atau gunakan input invoice manual di bawah.'
    }
  }
}

onMounted(() => {
  store.reset()
  store.setSource('admin') // Set source to 'admin' when on ScanAdminPage
  initScanner()
})

onUnmounted(() => {
  qrScanner?.stop()
  qrScanner?.destroy()
  qrScanner = null
})
</script>