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

    <!-- Error state -->
    <div v-else-if="fetchError" class="flex-1 flex items-center justify-center px-6 animate-slide-up">
      <div class="text-center">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: rgba(230,57,70,0.08); border: 1px solid rgba(230,57,70,0.2);">
          <svg class="w-8 h-8" style="color: #E63946;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="font-bold text-lg mb-2" style="color: #0A1628;">Data Tidak Ditemukan</h2>
        <p class="text-sm mb-6" style="color: rgba(10,22,40,0.5);">{{ fetchError }}</p>
        <button @click="goBack" class="w-full py-3.5 rounded-xl font-extrabold uppercase tracking-widest text-sm" style="background: #E63946; color: #FFFFFF;">
          Scan Ulang
        </button>
      </div>
    </div>

    <!-- Registration Form -->
    <form v-else @submit.prevent="submitForm" class="flex-1 px-6 pb-8 animate-slide-up">

      <!-- BIB Info Card -->
      <div v-if="form.bib || form.category" class="rounded-2xl p-5 mb-5" style="background: #0A1628;">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest mb-1" style="color: #E63946;">Kategori</p>
            <p class="font-extrabold text-base" style="color: #FFFFFF;">{{ form.category || '-' }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold uppercase tracking-widest mb-1" style="color: #E63946;">BIB</p>
            <p class="font-extrabold text-3xl font-mono" style="color: #FFFFFF;">{{ form.bib || form.no_bib || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Already registered warning -->
      <div v-if="alreadyRegistered" class="rounded-xl p-4 mb-5" style="border: 1px solid rgba(217,119,6,0.25); background: rgba(217,119,6,0.06);">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: #B45309;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-sm font-semibold" style="color: #B45309;">Kamu sudah terdaftar sebelumnya. Data tidak dapat diubah.</p>
        </div>
      </div>

      <!-- Section: Data Pribadi -->
      <div class="mb-1 mt-5">
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

      <!-- Section: Dokumen -->
      <div class="mb-1 mt-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1 h-4 rounded-full" style="background: #E63946;"></div>
          <p class="text-xs font-extrabold uppercase tracking-[0.15em]" style="color: #E63946;">Dokumen Identitas</p>
          <div class="flex-1 h-px" style="background: rgba(10,22,40,0.08);"></div>
        </div>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Jenis ID</label>
              <select v-model="form.id_type" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;">
                <option value="">Pilih</option>
                <option value="KTP">KTP</option>
                <option value="Passport">Passport</option>
                <option value="SIM">SIM</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Nomor ID</label>
              <input v-model="form.id_number" type="text" placeholder="16 digit" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm font-mono outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Tanggal Lahir</label>
              <input v-model="form.date_of_birth" type="date" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Usia</label>
              <input v-model="form.age" type="number" placeholder="30" :disabled="true" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Alamat -->
      <div class="mb-1 mt-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1 h-4 rounded-full" style="background: #E63946;"></div>
          <p class="text-xs font-extrabold uppercase tracking-[0.15em]" style="color: #E63946;">Alamat</p>
          <div class="flex-1 h-px" style="background: rgba(10,22,40,0.08);"></div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Alamat Lengkap</label>
            <textarea v-model="form.address" rows="2" placeholder="Jl. ..." :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Kota</label>
              <input v-model="form.city" type="text" placeholder="Balikpapan" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Provinsi</label>
              <input v-model="form.province" type="text" placeholder="Kalimantan Timur" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Kewarganegaraan</label>
              <input v-model="form.nationality" type="text" placeholder="WNI" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Negara</label>
              <input v-model="form.country" type="text" placeholder="Indonesia" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Kontak Darurat -->
      <div class="mb-7 mt-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1 h-4 rounded-full" style="background: #E63946;"></div>
          <p class="text-xs font-extrabold uppercase tracking-[0.15em]" style="color: #E63946;">Kontak Darurat</p>
          <div class="flex-1 h-px" style="background: rgba(10,22,40,0.08);"></div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Nama</label>
            <input v-model="form.emergency_contact_name" type="text" placeholder="Nama kontak darurat" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">No. Telepon</label>
              <input v-model="form.emergency_contact_phone" type="tel" placeholder="08xxxxxxxxxx" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider mb-1.5" style="color: rgba(10,22,40,0.45);">Hubungan</label>
              <input v-model="form.emergency_contact_status" type="text" placeholder="Suami/Istri/dll" :disabled="alreadyRegistered" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none disabled:opacity-50" style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.12); color: #0A1628;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <transition name="page">
        <div v-if="submitError" class="rounded-xl p-4 mb-4" style="border: 1px solid rgba(230,57,70,0.25); background: rgba(230,57,70,0.06);">
          <p class="text-sm font-semibold" style="color: #E63946;">{{ submitError }}</p>
        </div>
      </transition>

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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { participantApi } from '@/services/api'
import { useRegistrationStore } from '@/stores/registration'

const router = useRouter()
const store = useRegistrationStore()

const fetching = ref(false)
const fetchError = ref(null)
const submitting = ref(false)
const submitError = ref(null)
const alreadyRegistered = ref(false)

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
  address: '',
  province: '',
  city: '',
  nationality: '',
  country: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_status: '',
})

const fillForm = (data) => {
  Object.keys(form).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      form[key] = data[key]
    }
  })
}

const goBack = () => router.push({ name: 'scan' })

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