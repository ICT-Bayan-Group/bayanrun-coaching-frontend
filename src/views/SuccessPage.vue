<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 py-12" style="background: #F4F6FA;">
    <div class="w-full max-w-sm animate-slide-up text-center">

      <!-- Success Icon -->
      <div class="relative inline-block mb-6">
        <div class="w-24 h-24 rounded-full flex items-center justify-center mx-auto" style="background: rgba(34,197,94,0.08); border: 2px solid rgba(34,197,94,0.25);">
          <svg class="w-12 h-12" style="color: #16A34A;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="absolute inset-0 rounded-full animate-ping" style="border: 2px solid rgba(34,197,94,0.18);"></div>
      </div>

      <p class="text-xs font-extrabold tracking-[0.2em] uppercase mb-2" style="color: #E63946;">BAYAN RUN · 2026</p>
      <h1 class="text-2xl font-extrabold tracking-tight mb-2" style="color: #0A1628;">REGISTRASI BERHASIL!</h1>
      <p class="text-sm font-medium mb-8" style="color: rgba(10,22,40,0.5);">
        Sampai jumpa di Coaching Clinic Bayan Run 2026 🎉
      </p>

      <!-- Participant Card -->
      <div class="rounded-2xl p-5 text-left mb-5" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.08);">
        <div class="mb-4 pb-4" style="border-bottom: 1px solid rgba(10,22,40,0.08);">
          <p class="text-xs font-extrabold tracking-widest uppercase mb-0.5" style="color: #E63946;">BAYAN RUN · 2026</p>
          <p class="text-lg font-extrabold" style="color: #0A1628;">DETAIL REGISTRASI</p>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest mb-0.5" style="color: rgba(10,22,40,0.4);">NAMA</p>
              <p class="font-extrabold text-base" style="color: #0A1628;">{{ fullName }}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest" style="background: #0A1628; color: #FFFFFF;">LUNAS</span>
          </div>

          <div style="border-top: 1px solid rgba(10,22,40,0.06);"></div>

          <div>
            <p class="text-xs font-bold uppercase tracking-widest mb-0.5" style="color: rgba(10,22,40,0.4);">NOMOR REGISTRASI</p>
            <p class="font-mono text-sm font-bold break-all" style="color: #0A1628;">{{ successData?.invoice_number || store.invoiceNumber }}</p>
          </div>

          <template v-if="successData?.category">
            <div style="border-top: 1px solid rgba(10,22,40,0.06);"></div>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-widest mb-0.5" style="color: rgba(10,22,40,0.4);">KATEGORI</p>
                <p class="font-extrabold text-base" style="color: #0A1628;">{{ successData.category }}</p>
              </div>
              <div v-if="successData?.bib" class="text-right">
                <p class="text-xs font-bold uppercase tracking-widest mb-0.5" style="color: #E63946;">BIB</p>
                <p class="font-extrabold text-3xl font-mono" style="color: #0A1628;">{{ successData.bib }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Info box -->
      <div class="rounded-xl p-4 mb-8 text-left" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.08);">
        <div class="flex items-start gap-3">
          <svg class="w-4 h-4 mt-0.5 flex-shrink-0" style="color: rgba(10,22,40,0.4);" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-xs font-medium" style="color: rgba(10,22,40,0.5);">Simpan screenshot ini sebagai bukti registrasi Anda.</p>
        </div>
      </div>

      <button @click="scanAnother" class="w-full py-4 rounded-2xl font-extrabold text-base uppercase tracking-widest" style="background: #E63946; color: #FFFFFF;">
        Scan Peserta Lain
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRegistrationStore } from '@/stores/registration'

const router = useRouter()
const store = useRegistrationStore()

const successData = computed(() => store.successData)

const fullName = computed(() => {
  if (successData.value?.first_name) {
    return [successData.value.first_name, successData.value.last_name].filter(Boolean).join(' ')
  }
  return '-'
})

const scanAnother = () => {
  store.reset()
  router.push({ name: 'scan' })
}
</script>