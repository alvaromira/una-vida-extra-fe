<template>
  <footer>
    <p>Una Vida Extra {{ new Date().getFullYear() }}.</p>

    <p>Política de privacidad - Política de cookies - Contacto</p>
  </footer>
</template>

<script>
import { computed } from "vue";

export default {
  name: "TheFooter",
};
</script>

<style scoped>
footer {
  width: 100%;
  text-align: center;
  background-color: darkgreen;
  color: aliceblue;
}
p {
  margin: 0;
  padding: 0;
}
</style>
