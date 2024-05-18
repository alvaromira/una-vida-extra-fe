<!--Sencillo componente para preguntas y respuestas-->
<template>
  <div class="question row" :id="questionId">
    <div class="col-sm-12">
      <div class="question-title">
        <slot name="question"></slot>
      </div>
      <div class="question-content">
        <div class="q"><slot name="questionText"></slot></div>
        <div class="a">
          <slot name="responseText"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
//Propiedades de las preguntas
const props = defineProps({
  questionId: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.question {
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.question-title {
  padding-bottom: 1rem;
}

.question-content .q {
  font-weight: 500;
}
</style>
