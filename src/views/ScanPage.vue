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
        COACHING CLINIC
        <span style="color: #E63946;">REGISTRATION</span>
      </h1>
    </header>

    <!-- Scanner Area -->
    <main class="flex-1 px-6 flex flex-col gap-5 animate-slide-up">
      <div class="text-center">
        <p class="font-bold text-base" style="color: #0A1628;">Scan QR Code Anda</p>
        <p class="text-sm mt-1 font-medium" style="color: rgba(10,22,40,0.5);">Arahkan kamera ke QR code pada tiket Anda</p>
      </div>

      <!-- Camera Viewfinder -->
      <div class="relative rounded-2xl overflow-hidden shadow-sm" style="border: 2px solid rgba(230,57,70,0.25); background: #0A1628;">
        <div v-if="scanning" class="absolute inset-x-0 h-0.5 z-10 animate-scan-line pointer-events-none" style="background: linear-gradient(to right, transparent, #E63946, transparent);"></div>

        <!-- Corner markers -->
        <div class="absolute top-3 left-3 w-6 h-6 z-20" style="border-top: 2px solid #E63946; border-left: 2px solid #E63946; border-radius: 4px 0 0 0;"></div>
        <div class="absolute top-3 right-3 w-6 h-6 z-20" style="border-top: 2px solid #E63946; border-right: 2px solid #E63946; border-radius: 0 4px 0 0;"></div>
        <div class="absolute bottom-3 left-3 w-6 h-6 z-20" style="border-bottom: 2px solid #E63946; border-left: 2px solid #E63946; border-radius: 0 0 0 4px;"></div>
        <div class="absolute bottom-3 right-3 w-6 h-6 z-20" style="border-bottom: 2px solid #E63946; border-right: 2px solid #E63946; border-radius: 0 0 4px 0;"></div>

        <!-- Tombol switch kamera -->
        <button
          v-if="hasMultipleCameras"
          @click="switchCamera"
          type="button"
          class="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 shrink-0"
          style="background: rgba(10,22,40,0.55); backdrop-filter: blur(4px);"
          aria-label="Ganti kamera"
        >
          <svg class="w-4 h-4 shrink-0" style="color: #FFFFFF;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 7h-3.17L15 5H9L7.17 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
            <path d="M16 13a4 4 0 1 1-6.83-2.83" />
            <path d="M9 10.5 9 13 6.5 13" />
          </svg>
        </button>

        <!-- Video kamera: kita kontrol sendiri elemennya, qr-scanner cuma
             attach stream ke sini dan decode dari frame-nya -->
        <video ref="videoEl" class="w-full aspect-square object-cover" muted playsinline></video>

        <div v-if="!cameraReady" class="absolute inset-0 flex items-center justify-center rounded-2xl" style="background: rgba(10,22,40,0.92);">
          <div class="text-center">
            <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style="border-color: #E63946; border-top-color: transparent;"></div>
            <p class="text-sm font-medium" style="color: rgba(255,255,255,0.6);">Memuat kamera...</p>
          </div>
        </div>

        <!-- Processing overlay (dipakai juga saat decode gambar dari galeri) -->
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center rounded-2xl" style="background: rgba(10,22,40,0.92);">
          <div class="text-center">
            <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style="border-color: #E63946; border-top-color: transparent;"></div>
            <p class="text-sm font-medium" style="color: rgba(255,255,255,0.6);">Memproses...</p>
          </div>
        </div>
      </div>

      <!-- Tombol upload dari galeri -->
      <button
        @click="triggerFilePicker"
        type="button"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-colors disabled:opacity-50"
        style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.1); color: #0A1628;"
      >
        <svg class="w-4 h-4 shrink-0" style="color: #E63946;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Upload QR dari Galeri
      </button>
      <input
        ref="fileInputEl"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelected"
      />

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
      <p class="text-xs font-bold tracking-widest uppercase" style="color: rgba(10,22,40,0.35);">Bayan Run 2026 · Coaching Clinic</p>
    </footer>

    <PopupCard
      :visible="Boolean(error)"
      :type="errorType"
      :title="errorType === 'info' ? 'Informasi' : 'Pendaftaran Gagal'"
      :message="error"
      :action-label="errorType === 'info' ? 'Mengerti' : 'Coba Lagi'"
      @action="dismissError"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import QrScanner from 'qr-scanner'
import { participantApi } from '@/services/api'
import { useRegistrationStore } from '@/stores/registration'
import PopupCard from '@/components/PopupCard.vue'

const router = useRouter()
const store = useRegistrationStore()

const videoEl = ref(null)
const fileInputEl = ref(null)
const scanning = ref(false)
const cameraReady = ref(false)
const error = ref(null)
const errorType = ref('error')
const loading = ref(false)
const manualInvoice = ref('')
const hasMultipleCameras = ref(false)
const currentFacingMode = ref('environment') // 'environment' = belakang, 'user' = depan
let qrScanner = null

// ==== Anti-spam scan ====
const SCAN_COOLDOWN_MS = 3000   // QR yang sama diabaikan selama ini
const RESTART_DELAY_MS = 600    // jeda sebelum kamera scan lagi setelah popup ditutup
let isProcessing = false        // lock sinkron (ref terlalu lambat untuk callback 10x/detik)
let lastCode = ''
let lastCodeAt = 0

const handleScanSuccess = async (result) => {
  // abaikan semua scan selama proses berjalan atau popup tampil
  if (isProcessing || loading.value || error.value) return

  const invoiceNumber = (result?.data || result || '').trim().toUpperCase()
  if (!invoiceNumber) return

  // abaikan QR yang sama dalam masa cooldown
  const now = Date.now()
  if (invoiceNumber === lastCode && now - lastCodeAt < SCAN_COOLDOWN_MS) return
  lastCode = invoiceNumber
  lastCodeAt = now

  await processInvoice(invoiceNumber)
}

const processInvoice = async (invoiceNumber) => {
  if (isProcessing) return
  isProcessing = true

  // hentikan scanner selama proses; dinyalakan lagi hanya via dismissError
  scanning.value = false
  qrScanner?.stop()

  loading.value = true
  error.value = null

  try {
    const response = await participantApi.getByInvoice(invoiceNumber)

    if (response.status === 'already_registered') {
      error.value = response.message || 'Peserta ini sudah terdaftar sebelumnya.'
      errorType.value = 'info'
      return
    }

    store.setInvoice(invoiceNumber)
    store.setParticipantData({
      ...response.data,
      invoice_number: invoiceNumber,
    })
    router.push({ name: 'register' })
  } catch (err) {
    error.value = err.userMessage || 'Gagal mengambil data peserta. Pastikan invoice benar.'
    errorType.value = 'error'
  } finally {
    loading.value = false
    isProcessing = false
  }
}

const submitManual = () => {
  const invoice = manualInvoice.value.trim().toUpperCase()
  if (!invoice) return
  lastCode = invoice
  lastCodeAt = Date.now()
  processInvoice(invoice)
}

const restartScanner = async () => {
  if (!qrScanner) return
  try {
    await qrScanner.start()
    scanning.value = true
  } catch (err) {
    console.error('[Scanner] gagal restart kamera:', err)
  }
}

const dismissError = () => {
  error.value = null
  // mulai ulang cooldown dari saat popup ditutup, supaya QR yang masih
  // diarahkan ke kamera tidak langsung terbaca lagi
  lastCodeAt = Date.now()
  setTimeout(() => {
    if (!error.value && !isProcessing) restartScanner()
  }, RESTART_DELAY_MS)
}

// ==== Upload QR dari galeri ====
const triggerFilePicker = () => {
  if (loading.value || isProcessing) return
  fileInputEl.value?.click()
}

const handleFileSelected = async (e) => {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file || isProcessing) return

  loading.value = true
  error.value = null

  qrScanner?.stop()
  scanning.value = false

  try {
    const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true })
    const invoiceNumber = (result?.data || result || '').trim().toUpperCase()

    if (!invoiceNumber) {
      error.value = 'QR code tidak terbaca dari gambar tersebut.'
      errorType.value = 'error'
      loading.value = false
      return // scanner dinyalakan lagi lewat dismissError
    }

    loading.value = false
    lastCode = invoiceNumber
    lastCodeAt = Date.now()
    await processInvoice(invoiceNumber)
  } catch (err) {
    console.error('[Scanner] gagal membaca QR dari gambar:', err)
    error.value = 'Tidak dapat menemukan QR code pada gambar. Coba gambar lain atau gunakan input manual.'
    errorType.value = 'error'
    loading.value = false
  }
}

// ==== Switch kamera depan/belakang ====
const switchCamera = async () => {
  if (!qrScanner || loading.value || isProcessing) return

  const nextMode = currentFacingMode.value === 'environment' ? 'user' : 'environment'

  try {
    await qrScanner.setCamera(nextMode)
    currentFacingMode.value = nextMode
  } catch (err) {
    console.error('[Scanner] gagal ganti kamera:', err)
    error.value = 'Gagal beralih kamera. Perangkat mungkin hanya memiliki satu kamera.'
    errorType.value = 'error'
  }
}

const checkMultipleCameras = async () => {
  try {
    const cameras = await QrScanner.listCameras(true)
    hasMultipleCameras.value = cameras.length > 1
  } catch (err) {
    hasMultipleCameras.value = false
  }
}

const initScanner = async () => {
  if (!videoEl.value) return

  try {
    qrScanner = new QrScanner(
      videoEl.value,
      (result) => handleScanSuccess(result),
      {
        preferredCamera: currentFacingMode.value,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 3, // sebelumnya 10, lebih kalem
      }
    )

    await qrScanner.start()
    cameraReady.value = true
    scanning.value = true

    checkMultipleCameras()
  } catch (err) {
    console.error('[Scanner] gagal memulai kamera:', err)
    cameraReady.value = true

    if (err?.name === 'NotAllowedError' || /permission/i.test(String(err))) {
      error.value = 'Izin kamera ditolak. Aktifkan izin kamera untuk situs ini di pengaturan browser, lalu coba lagi.'
    } else if (err?.name === 'NotFoundError' || /no camera/i.test(String(err))) {
      error.value = 'Kamera tidak ditemukan di perangkat ini.'
    } else {
      error.value = 'Tidak dapat memulai kamera. Coba lagi atau gunakan input invoice manual di bawah.'
    }
    errorType.value = 'error'
  }
}

onMounted(() => {
  store.reset()
  store.setSource('user') // Set source to 'user' when on ScanPage
  initScanner()
})

onUnmounted(() => {
  qrScanner?.stop()
  qrScanner?.destroy()
  qrScanner = null
})
</script>