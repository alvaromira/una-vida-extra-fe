<!--Componente Modal para confirmar o cancelar y devolver al padre un evento corespondiente-->
<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <!--se pone todo el fondo tapado para forzar accion sobre el modal-->
      <div
        class="modal-container"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <slot name="header"> ¡Este es el título predeterminado! </slot>
          <!--se usa un slot para pasar contenido-->
          <button
            type="button"
            class="btn-close"
            @click="onClose"
            aria-label="Cerrar modal"
          ></button>
        </header>

        <section class="modal-body" id="modalDescription">
          <slot name="body"> ¡Este es el cuerpo predeterminado! </slot>
        </section>

        <footer class="modal-footer">
          <!--evento onclick que manda la confirmacion al padre-->
          <button
            type="button"
            class="btn-confirm"
            @click="onConfirm"
            aria-label="Confirm deletion"
          >
            Confirmar
          </button>
          <!--evento onclick que manda la cancelacion al padre-->
          <button
            type="button"
            class="btn-cancel"
            @click="onClose"
            aria-label="Cerrar modal"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits } from "vue";
//El modal va a emitir dos eventos, uno para cerrar y otro para confirmar.
const emit = defineEmits(["modal-close", "modal-confirmed"]);
//funcion para emitir el evento de cierre al padre
function onClose() {
  emit("modal-close");
}
//funcion para emitir el evento de confirmacion al padre
function onConfirm() {
  emit("modal-confirmed");
}
</script>

<style>
/* Clase para poner todo el fondo en semi-opaco */
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: #ffffff;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  max-width: 55%;
  width: 100%;

  border-radius: 8px;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
  opacity: 1;
  transition: opacity 0.5s ease-out; /* Added transition for fading-out effect */
}

.modal-header,
.modal-footer {
  padding: 1.5rem;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #7ab370;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: space-between;
}
.modal-footer button {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  min-width: 100px;
  display: inline-block;
  text-align: center;
}
.modal-body {
  position: relative;
  padding: 1.5rem;
}

.modal-body p {
  padding-bottom: 1rem;
}
.modal-body p:last-child {
  padding-bottom: 0;
}

.btn-close {
  color: #7ab370;
}

.btn-cancel {
  color: white;
  background: #ff5252;
  border: 1px solid #ff5252;
  border-radius: 2px;
  cursor: pointer;
}
.btn-confirm {
  color: white;
  background: #4caf50;
  border: 1px solid #4caf50;
  border-radius: 2px;
  cursor: pointer;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
