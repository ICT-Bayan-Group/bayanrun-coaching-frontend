<template>
  <div id="app-root">
    <!-- Preloader full-screen, tampil di atas semua konten saat pertama load -->
    <Preloader v-if="showPreloader" :min-duration="1200" @done="showPreloader = false" />

    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Preloader from '../src/components/Preloader.vue'

// Routing tetap ditangani router-view seperti biasa.
// Preloader hanya overlay di atas, otomatis hilang setelah app siap.
const showPreloader = ref(true)
</script>