<template>
  <transition name="page">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center px-5 py-8"
      style="background: rgba(10,22,40,0.58); backdrop-filter: blur(4px);"
      role="presentation"
    >
      <section
        class="w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl"
        style="background: #FFFFFF; border: 1px solid rgba(10,22,40,0.08);"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="'popup-title'"
        :aria-describedby="'popup-message'"
      >
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          :style="type === 'info'
            ? 'background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.2); color: #B45309;'
            : 'background: rgba(230,57,70,0.08); border: 1px solid rgba(230,57,70,0.2); color: #E63946;'"
        >
          <svg v-if="type === 'info'" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 id="popup-title" class="text-lg font-extrabold mb-2" style="color: #0A1628;">{{ title }}</h2>
        <p id="popup-message" class="text-sm leading-relaxed mb-6" style="color: rgba(10,22,40,0.62);">{{ message }}</p>
        <button
          type="button"
          class="w-full py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-widest"
          style="background: #E63946; color: #FFFFFF;"
          @click="$emit('action')"
        >
          {{ actionLabel }}
        </button>
      </section>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  type: { type: String, default: 'error' },
  title: { type: String, default: 'Terjadi Kesalahan' },
  message: { type: String, default: '' },
  actionLabel: { type: String, default: 'Tutup' },
})

defineEmits(['action'])
</script>