<!--Componente para mostrar resumen de produtos es una vista concreta-->
<template>
  <div id="products-data-wrapper">
    <div id="products-data">
      <div id="re-used-prods-data" class="prod-data-container">
        <span class="prod-data-item">0</span> Productos reutilizados
      </div>
      <div id="no-members-data" class="prod-data-container">
        <span class="prod-data-item">0</span> Miembros
      </div>
      <div id="no-locations-data" class="prod-data-container">
        <span class="prod-data-item">0</span> Ubicaciones
      </div>
    </div>
  </div>
</template>

<style scoped>
#products-data-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}
#products-data-wrapper:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  border-top: thin #edb421 solid;
  z-index: 0;
  width: 100%;
  transform: translateY(-50%);
}
#products-data {
  border: solid #edb421 thin;
  background-color: #fff;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  min-width: 40%;
  width: auto;
  position: relative;
}
.prod-data-item {
  color: #7ab370;
  font-weight: bold;
  font-size: 1.3rem;
}
.prod-data-container {
  min-width: 150px;
  width: auto;
  text-align: center;
}
</style>
