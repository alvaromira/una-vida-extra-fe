<script setup></script>

<template>
  <div class="form-wrapper">
    <div><p class="loggingOut">Logging Out</p></div>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 50%;
}
.loggingOut {
  font-size: 1rem;
  color: gray;
}

.loggingOut:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(4, end) 900ms infinite;
  animation: ellipsis steps(4, end) 900ms infinite;
  content: "\2026"; /* ascii code for the ellipsis character */
  width: 0px;
}

@keyframes ellipsis {
  to {
    width: 1.25em;
  }
}

@-webkit-keyframes ellipsis {
  to {
    width: 1.25em;
  }
}
</style>
