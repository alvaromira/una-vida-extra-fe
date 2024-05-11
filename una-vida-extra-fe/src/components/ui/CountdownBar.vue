<!--Componente auxiliar tipo barra de carga que va disminuyendo visualmente hasta que se consume el tiempo de vida. Se usa principalmente en los toasts. -->
<template>
  <div
    class="countdown-bar"
    :style="{ width: progressBarWidth }"
    :class="mode"
  ></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const progressBarWidth = ref("100%");
const props = defineProps({
  duration: {
    type: Number,
    default: 15000, // de forma predeterminada, 15000 milisegundos
  },
  mode: {
    type: String,
    default: "info", //realmente se permite visualmente error, success e info
  },
});
// Cuando se monta el componente se arranca el contador
onMounted(() => {
  startCountdown();
});

//Funcion recursiva para generar el progreso visual de la barra usando el contador
const startCountdown = () => {
  let startTime = Date.now();

  const updateProgressBar = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min((elapsed / props.duration) * 100, 100);
    progressBarWidth.value = `${100 - progress}%`; //se resta el tiempo pasado desde el arranque del total inicial del 100 y mientras progress exista, se sigue restando hasta llegar a cero
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
  background-color: #ffffff;
}

/* Las siguientes clases son las que se usan con la propiedad mode para mostrar barras de diferentes colores */
.countdown-bar.success {
  background-color: #4caf50;
}
.countdown-bar.info {
  background-color: #ffc107;
}
.countdown-bar.error {
  background-color: #ff5252;
}
</style>
