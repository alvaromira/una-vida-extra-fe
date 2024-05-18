<!--Vista donde se muestra el contenido de la pagina de sponsor. ES HTML estatico. -->
<template>
  <div class="row d-flex justify-content-center">
    <div class="col-md-10">
      <div class="sponsors-shop-window">
        <h1>Nuestros patrocinadores</h1>
        <p>
          Por el momento, no tenemos ningún patrocinador oficial 😔. Todo
          nuestro trabajo parte de aportaciones privadas 😅. La información de
          nuestros patrocinadores se mostrará en estas tarjetas tan cool 😎.
          (Echa un vistazo a los ejemplo e imagínate ahí).
        </p>
        <div id="sponsors-section">
          <div class="row">
            <div class="col">
              <div class="card mb-3" style="max-width: 540px">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img
                      src="https://source.unsplash.com/photography-of-cafe-with-led-signage-and-pendant-lamps-and-menu-boards-ItaV89TNkks"
                      class="img-fluid"
                      alt="Luna's cafe"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">Luna cafe</h5>
                      <p class="card-text">
                        Luna cafe es más que una simple cafetería: es un lugar
                        de reunión donde los lugareños se reúnen para disfrutar
                        del arte de café de especialidad.
                      </p>
                      <p class="card-text">
                        <small class="text-muted"> luna-cafe.site </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card mb-3" style="max-width: 540px">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img
                      src="https://source.unsplash.com/brown-leather-sandals-on-brown-wooden-floor-FrLEWPxNjl0"
                      class="img-fluid"
                      alt="El jardin Martina"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">El jardín de Martina</h5>
                      <p class="card-text">
                        Ya sea que estés celebrando una ocasión especial o
                        simplemente alegrandole el día a alguien, somos tu
                        destino ideal para todo lo floral.
                      </p>
                      <p class="card-text">
                        <small class="text-muted"> jardin-martina.site </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2>Nuestros patrocinadores y seguidores</h2>
      <p>
        Únase a nosotros en <strong> Una vida extra </strong> y formta parte de
        algo significativo. Juntos, tendremos un impacto positivo en nuestras
        comunidades locales y en todo el planeta.
      </p>
      <p>
        ¿Te apasiona la comunidad, la sostenibilidad y tener un impacto positivo
        en el mundo? Únase a nosotros en Una vida extra, donde tenemos la misión
        para crear una sociedad más conectada, generosa y sostenible evitando el
        derroche y potenciando el reuso.
      </p>

      <h2></h2>

      <div class="sponsor-info">
        <h2>
          Conviértete en patrocinador de Una vida extra: ¡Marca la diferencia!
        </h2>
        <p>
          ¿Te apasiona tu comunidad, la sostenibilidad y tener un impacto
          positivo en el mundo? Únate a nosotros en Una vida extra, donde
          tenemos la misión de crear un mundo más conectado, generoso y
          sostenible.
        </p>
        <p>
          Patrocinando Una vida extra estarás apoyando un proyecto que encarna
          valores como la comunidad, la generosidad y la sostenibilidad. Tu
          patrocinio nos ayudará a seguir trabajando en la plataforma. Además,
          al tiempo que contribuirás a concienciar sobre la importancia de
          reutilización, reciclaje y participación de la comunidad local.
        </p>
        <p>
          Como patrocinador de Una vida extra, recibirás reconocimiento y
          mejorarás la visibilidad de tu marca.
        </p>
        <p>
          Para consultas sobre patrocinio y más información, por favor
          <routerlink :to="{ name: 'contact' }"> contáctenos </routerlink> .
        </p>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
p {
  font-weight: 300;
}
.card {
  border-radius: 10px;
  overflow: hidden;
}
h2,
h1 {
  padding-bottom: 1rem;
}

.sponsor-info,
.sponsors-shop-window {
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.sponsor-info p {
  font-weight: 400;
}
#sponsors-section {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>
