<template>
  <div class="countdown-bar" :style="{ width: progressBarWidth }"></div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";

const progressBarWidth = ref("100%");
const props = defineProps({
  duration: {
    type: Number,
    default: 15000, // Set the default value to false
  },
});
// Start countdown when component is mounted
onMounted(() => {
  startCountdown();
});

const startCountdown = () => {
  let startTime = Date.now();

  const updateProgressBar = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min((elapsed / props.duration) * 100, 100);
    progressBarWidth.value = `${100 - progress}%`;
    if (progress < 100) {
      requestAnimationFrame(updateProgressBar);
    }
  };

  updateProgressBar();
};
</script>

<style scoped>
.countdown-bar {
  height: 4px;
  background-color: #ffffff; /* Change this to adjust the color of the countdown bar */
}
</style>
