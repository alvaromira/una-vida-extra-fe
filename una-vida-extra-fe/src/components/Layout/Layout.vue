<template>
  <Header />
  <slot />
  <Footer />
</template>

<script>
import Header from "./TheHeader/TheHeader.vue";
import Footer from "./TheFooter/TheFooter.vue";

export default {
  name: "Layout",
  components: {
    Header,
    Footer,
  },
};
</script>
