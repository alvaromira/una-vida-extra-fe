<!--Vista donde se muestra el contenido de la pagina del proyecto. ES HTML estatico. -->
<!--Una vista muy sencilla con las instrucciones para ponerse en contacto con los administradores. Inspirada en Yummygum-->
<template>
  <div class="row justify-content-md-center">
    <div class="col-md-12 cta-wrapper">
      <div class="row">
        <div class="col-md-6 light-side cta-side">
          <img
            src="https://source.unsplash.com/a-book-shelf-filled-with-lots-of-books-Xhqiy7cuwMA"
            class="img-fluid"
          />
        </div>
        <div class="col-md-6 dark-side cta-side">
          <h2>Una vida extra</h2>
          <p>
            Creemos en el poder de la comunidad, la generosidad y
            sostenibilidad. Nuestra plataforma es una vibrante comunidad web
            donde las personas se reúnen para compartir elementos que ya no
            necesitan, pero que aún les queda mucha vida. Se trata de retribuir,
            reutilizar y reciclar y, lo mejor de todo, es completamente gratis.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 light-side cta-side">
          <h2>Cómo funciona</h2>
          <p>
            <strong> Donar</strong>: ¿Tienes artículos acumulando polvo en casa?
            Dar darles una nueva oportunidad de vida donándolos. Ya sea ropa,
            libros, artículos para el hogar o cualquier otra cosa, sus
            donaciones pueden hacer una diferencia real para otra persona.
          </p>

          <p>
            <strong> Solicitar</strong>: ¿Necesita algo específico? Navega por
            nuestro listados y realizar solicitudes de los artículos que estás
            buscando. Todo Las solicitudes se clasifican primero por proximidad,
            lo que garantiza que los artículos estén preferentemente compartido
            de forma local y sostenible.
          </p>

          <p>
            <strong> Recoger</strong>: Una vez aceptada su solicitud,
            simplemente concertar una hora para recoger el artículo en su
            ubicación original. Es así de fácil: sin dinero involucrado, solo un
            espíritu de comunidad y amabilidad.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 dark-side cta-side">
          <h2>Nuestros valores</h2>
          <p>
            <strong> Comunidad </strong> : nuestro objetivo es unir a las
            personas y fomentar el sentido de pertenencia.
          </p>
          <p>
            <strong> Generosidad </strong> : Compartir es cuidar, y nuestra
            comunidad prospera gracias a la generosidad de sus miembros.
          </p>
          <p>
            <strong> Sostenibilidad </strong> : al reutilizar y reciclar
            artículos, Estamos ayudando a reducir los residuos y disminuir
            nuestro impacto ambiental.
          </p>
        </div>
        <div class="col-md-6 light-side cta-side">
          <img
            src="https://source.unsplash.com/planet-earth-first-signage-sticked-in-gray-post-outdoors-D0xQQsZovws"
            class="img-fluid"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.cta-side {
  background-color: white;
  padding: 4rem;
}
.cta-wrapper {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.cta-side h2 {
  font-size: 4rem;
  letter-spacing: -0.25rem;
  padding-bottom: 2rem;
}
.cta-side p {
  color: rgb(33, 51, 67);
  font-weight: 300;
}
.contact-email {
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
}
.contact-email:hover {
  text-decoration: underline;
}

.light-side {
}

.dark-side {
  background-color: #7ab370;
  color: white;
}
.dark-side p {
  color: white;
}
.dark-side h2 {
  color: white;
}
.dark-side .contact-email {
  color: white;
}
</style>
