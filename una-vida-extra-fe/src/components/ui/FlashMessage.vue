<template>
  <div class="fixed top-0 right-0 m-6" v-if="message && !visible">
    <Transition name="slide-fade">
      <div
        :class="{
          'bg-red-200 text-red-900': props.type === 'error',
          'bg-green-200 text-green-900': props.type === 'success',
        }"
        class="rounded-lg shadow-md p-6 pr-10"
        style="min-width: 240px"
      >
        <button
          class="opacity-75 cursor-pointer absolute top-0 right-0 py-2 px-3 hover:opacity-100"
          @click.prevent="toggleVisibility"
        >
          &times;
        </button>
        <div class="flex items-center">
          {{ props.text }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, defineProps } from "vue";

const message = computed(() => {
  return props.text.length > 0;
});

const visible = ref(false);

function toggleVisibility() {
  visible.value = !visible.value;
}

const props = defineProps({
  type: String,
  text: String,
});
</script>
<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(400px);
  opacity: 0;
}
</style>
