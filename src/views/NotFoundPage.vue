<template>
  <div class="min-h-screen flex items-center justify-center px-6" style="background: #0A1628;">
    <div class="text-center">
      <p class="font-extrabold text-6xl font-mono mb-4" style="color: #E63946;">404</p>
      <h2 class="font-extrabold text-xl mb-2 uppercase tracking-widest" style="color: #FFFFFF;">Halaman Tidak Ditemukan</h2>
      <p class="text-sm mb-8 font-medium" style="color: rgba(255,255,255,0.4);">Halaman yang Anda cari tidak ada.</p>
      <button @click="$router.push('/')" class="w-full max-w-xs mx-auto block py-4 rounded-2xl font-extrabold uppercase tracking-widest" style="background: #E63946; color: #FFFFFF;">
        Kembali ke Scan
      </button>
    </div>
  </div>
</template>