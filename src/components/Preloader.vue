<template>
  <div v-if="visible" class="preloader-overlay" :class="{ 'is-leaving': leaving }">
    <div class="preloader-content">

      <!-- Logo with expanding rings -->
      <div class="logo-wrap">
        <div class="pulse-ring ring-1"></div>
        <div class="pulse-ring ring-2"></div>
        <div class="pulse-ring ring-3"></div>
        <div class="logo-mask">
          <img
            src="https://res.cloudinary.com/ddeigqz5d/image/upload/v1790630020/LOGO_BR2026_vbixvo_w7hjua.webp"
            alt="Bayan Run 2026"
            class="logo-img"
          />
        </div>
      </div>

      <!-- Brand label, per-character stagger reveal -->
      <p class="brand-label">
        <span
          v-for="(char, i) in brandChars"
          :key="i"
          class="brand-char"
          :style="{ animationDelay: charDelay(i) }"
        >{{ char === ' ' ? '\u00A0' : char }}</span>
      </p>

      <!-- Loading bar: grows in, then shimmer loops -->
      <div class="loading-track">
        <div class="loading-bar-fill"></div>
        <div class="loading-bar-shimmer"></div>
      </div>

      <p class="loading-text">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  // Minimum time (ms) preloader is shown, to avoid flash-of-content
  minDuration: {
    type: Number,
    default: 4000,
  },
})

const emit = defineEmits(['done'])

const visible = ref(true)
const leaving = ref(false)
const loadingText = ref('Memuat aplikasi...')

const brandText = 'BAYAN RUN · 2026'
const brandChars = computed(() => brandText.split(''))

// Stagger timing, mirip GSAP timeline .to(chars, { stagger: 0.035 })
const charDelay = (i) => `${0.5 + i * 0.035}s`

onMounted(() => {
  const startTime = Date.now()

  const finish = () => {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(props.minDuration - elapsed, 0)
    setTimeout(() => {
      setTimeout(() => {   // tambahan delay
        leaving.value = true
        setTimeout(() => {
          visible.value = false
          emit('done')
        }, 650)
      }, 800) // delay ekstra 0.8 detik
    }, remaining)
  }

  if (document.readyState === 'complete') {
    finish()
  } else {
    window.addEventListener('load', finish, { once: true })
    // fallback safety net kalau event load tidak fire
    setTimeout(finish, props.minDuration + 3000)
  }
})

defineExpose({ visible })
</script>

<style scoped>
.preloader-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F4F6FA;
  /* Exit: container fades + scales down, mirip gsap .to(overlay, {opacity:0, scale:0.96, ease:'power2.inOut'}) */
  animation: overlay-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.preloader-overlay.is-leaving {
  animation: overlay-leave 0.6s cubic-bezier(0.65, 0, 0.35, 1) both;
  pointer-events: none;
}

@keyframes overlay-enter {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes overlay-leave {
  0% { opacity: 1; transform: scale(1); filter: blur(0px); }
  100% { opacity: 0; transform: scale(1.04); filter: blur(6px); }
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* ============ LOGO ============ */
.logo-wrap {
  position: relative;
  width: 7rem;
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.75rem;
}

/* Mask clip-reveal seperti gsap clipPath morph, lalu settle ke breathing loop */
.logo-mask {
  position: relative;
  z-index: 10;
  width: 5.5rem;
  height: 5.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: circle(0% at 50% 50%);
  animation:
    logo-reveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s both,
    logo-breathe 2.2s ease-in-out 0.75s infinite;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes logo-reveal {
  0% {
    clip-path: circle(0% at 50% 50%);
    transform: scale(0.4) rotate(-8deg);
    opacity: 0;
  }
  60% {
    clip-path: circle(65% at 50% 50%);
    transform: scale(1.12) rotate(2deg);
    opacity: 1;
  }
  100% {
    clip-path: circle(75% at 50% 50%);
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes logo-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Three staggered expanding rings, like gsap .fromTo loop with stagger */
.pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 2px solid rgba(230, 57, 70, 0.4);
  opacity: 0;
  animation: ring-expand 2.4s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
}

.ring-1 { animation-delay: 0.6s; }
.ring-2 { animation-delay: 1.4s; }
.ring-3 { animation-delay: 2.2s; }

@keyframes ring-expand {
  0% {
    transform: scale(0.55);
    opacity: 0;
    border-width: 3px;
  }
  15% {
    opacity: 0.6;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
    border-width: 0.5px;
  }
}

/* ============ BRAND LABEL ============ */
.brand-label {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #E63946;
  margin-bottom: 1.75rem;
  display: flex;
}

.brand-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(70%) rotateX(-60deg);
  transform-origin: 50% 100%;
  animation: char-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes char-in {
  0% {
    opacity: 0;
    transform: translateY(70%) rotateX(-60deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

/* ============ LOADING BAR ============ */
.loading-track {
  position: relative;
  width: 10rem;
  height: 4px;
  border-radius: 9999px;
  background: rgba(10, 22, 40, 0.08);
  overflow: hidden;
  margin-bottom: 0.75rem;
  transform: scaleX(0);
  transform-origin: center;
  animation: track-grow 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.95s both;
}

@keyframes track-grow {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}

.loading-bar-fill {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: #E63946;
  transform: scaleX(0);
  transform-origin: left center;
  animation: shimmer-sweep 2.8s linear 1.3s infinite;
}

@keyframes bar-fill-loop {
  0% { transform: scaleX(0); opacity: 1; }
  55% { transform: scaleX(1); opacity: 1; }
  70% { transform: scaleX(1); opacity: 0.3; }
  71% { transform: scaleX(0); opacity: 0; }
  72% { opacity: 1; }
  100% { transform: scaleX(0); }
}

/* Shimmer sweep di atas fill, nambah rasa "polish" ala gsap */
.loading-bar-shimmer {
  position: absolute;
  top: 0;
  left: -30%;
  width: 30%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.65) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer-sweep 1.8s linear 1.3s infinite;
}

@keyframes shimmer-sweep {
  0% { left: -30%; }
  100% { left: 130%; }
}

/* ============ LOADING TEXT ============ */
.loading-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(10, 22, 40, 0.45);
  opacity: 0;
  transform: translateY(6px);
  animation: text-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both;
}

@keyframes text-fade-in {
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>