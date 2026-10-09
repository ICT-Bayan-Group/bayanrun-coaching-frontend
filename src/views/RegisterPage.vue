<template>
  <div class="min-h-screen flex flex-col" style="background: #F4F6FA;">
    <!-- Header -->
    <header class="px-6 pt-8 pb-4 flex items-center gap-4 animate-fade-in">
      <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-xl transition-colors" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.08);">
        <svg class="w-5 h-5" style="color: #0A1628;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-lg font-extrabold tracking-tight" style="color: #0A1628;">FORM REGISTRASI</h1>
        <p class="text-xs font-mono mt-0.5" style="color: rgba(10,22,40,0.4);">{{ store.invoiceNumber }}</p>
      </div>
    </header>

    <!-- Loading state -->
    <div v-if="fetching" class="flex-1 flex items-center justify-center animate-fade-in">
      <div class="text-center">
        <div class="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style="border-color: #E63946; border-top-color: transparent;"></div>
        <p class="text-sm font-medium" style="color: rgba(10,22,40,0.5);">Mengambil data peserta...</p>
      </div>
    </div>

    <div v-else-if="fetchError" class="flex-1"></div>

    <!-- Registration Form -->
    <form v-else @submit.prevent="submitForm" class="flex-1 px-6 pb-8 animate-slide-up">

      <!-- Section: Data Pribadi -->
      <div class="mb-7 mt-5">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1 h-4 rounded-full" style="background: #E63946;"></div>
          <p class="text-xs font-extrabold uppercase tracking-[0.15em]" style="color: #E63946;">Data Pribadi</p>
          <div class="flex-1 h-px" style="background: rgba(10,22,40,0.08);"></div>
        </div>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Nama Depan *</label>
              <input v-model="form.first_name" type="text" placeholder="Nama depan" required :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Nama Belakang</label>
              <input v-model="form.last_name" type="text" placeholder="Nama belakang" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Email *</label>
            <input v-model="form.email" type="email" placeholder="email@domain.com" required :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">No. HP *</label>
              <input v-model="form.phone" type="tel" placeholder="08xxxxxxxxxx" required :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Jenis Kelamin</label>
              <select v-model="form.gender" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;">
                <option value="">Pilih</option>
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Dokumen Identitas & Kontak Darurat: disembunyikan dari tampilan.
           Data tetap ada di `form` dan ikut terkirim ke API. -->

      <!-- Submit Button -->
      <button
        v-if="!alreadyRegistered"
        type="submit"
        :disabled="submitting"
        class="w-full py-4 rounded-2xl font-extrabold text-base uppercase tracking-widest transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        style="background: #E63946; color: #FFFFFF;"
      >
        <svg v-if="submitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ submitting ? 'Mendaftar...' : 'DAFTAR' }}
      </button>

      <button v-else type="button" @click="goBack" class="w-full py-4 rounded-2xl font-extrabold text-base uppercase tracking-widest" style="background: #E63946; color: #FFFFFF;">
        Kembali ke Scan
      </button>
    </form>

    <PopupCard
      :visible="Boolean(fetchError || submitError || alreadyRegistered)"
      :type="alreadyRegistered ? 'info' : 'error'"
      :title="alreadyRegistered ? 'Informasi' : 'Registrasi Gagal'"
      :message="fetchError || submitError || 'Kamu sudah terdaftar sebelumnya. Data tidak dapat diubah.'"
      :action-label="fetchError || alreadyRegistered ? 'Kembali ke Scan' : 'Coba Lagi'"
      @action="dismissNotice"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { participantApi } from '@/services/api'
import { useRegistrationStore } from '@/stores/registration'
import PopupCard from '@/components/PopupCard.vue'

const router = useRouter()
const store = useRegistrationStore()

const fetching = ref(false)
const fetchError = ref(null)
const submitting = ref(false)
const submitError = ref(null)
const alreadyRegistered = ref(false)
const idLocked = ref(false)

const form = reactive({
  invoice_number: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  gender: '',
  id_type: '',
  id_number: '',
  date_of_birth: '',
  age: '',
  bib_code: '',
  no_bib: '',
  bib: '',
  category: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_status: '',
})

// Tampilkan hanya 5 karakter terakhir, sisanya X
const maskedIdNumber = computed(() => {
  const id = String(form.id_number || '')
  if (id.length <= 5) return id
  return 'X'.repeat(id.length - 5) + id.slice(-5)
})

const fillForm = (data) => {
  Object.keys(form).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      form[key] = data[key]
    }
  })
  idLocked.value = Boolean(form.id_number)
}

const goBack = () => router.push({ name: 'scan' })

const dismissNotice = () => {
  if (fetchError.value || alreadyRegistered.value) {
    goBack()
    return
  }
  submitError.value = null
}

const submitForm = async () => {
  submitting.value = true
  submitError.value = null

  try {
    const response = await participantApi.register({ ...form })

    if (response.status === 'already_registered') {
      alreadyRegistered.value = true
      return
    }

    store.setSuccessData(response.data)
    router.push({ name: 'success' })
  } catch (err) {
    submitError.value = err.userMessage || 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  store.setSource('user') // Set source to 'user' when on RegisterPage
  // If data already in store (from scan), use it
  if (store.invoiceNumber && store.participantData) {
    form.invoice_number = store.invoiceNumber
    fillForm(store.participantData)
    return
  }

  // Otherwise, try fetching from query param
  const urlParams = new URLSearchParams(window.location.search)
  const invoiceFromUrl = urlParams.get('invoice')

  if (!invoiceFromUrl) {
    router.push({ name: 'scan' })
    return
  }

  fetching.value = true
  try {
    const response = await participantApi.getByInvoice(invoiceFromUrl)

    if (response.status === 'already_registered') {
      alreadyRegistered.value = true
      fillForm(response.data)
    } else {
      fillForm(response.data)
      form.invoice_number = invoiceFromUrl
    }
  } catch (err) {
    fetchError.value = err.userMessage || 'Data tidak ditemukan.'
  } finally {
    fetching.value = false
  }
})
</script>