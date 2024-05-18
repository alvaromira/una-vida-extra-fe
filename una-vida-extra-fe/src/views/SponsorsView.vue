<!--Vista donde se muestra el contenido de la pagina de sponsor. ES HTML estatico. -->
<template>
  <div class="row d-flex justify-content-center">
    <div class="col-md-10">
      <div class="sponsors-shop-window">
        <h1>Our Sponsors</h1>
        <p>
          At the moment, we do not have any official supporter or sponsor 😔.
          All our work is privately supported 😅. Our sponsors's info will be
          shown in these cool looking 😎 cards below! (see some sample and
          picture yourself there!)
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
                      <h5 class="card-title">Luna's cafe</h5>
                      <p class="card-text">
                        Luna's is more than just a cafe – it's a gathering place
                        where locals come together to indulge in the art of
                        specialty coffee.
                      </p>
                      <p class="card-text">
                        <small class="text-muted">luna-cafe.site</small>
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
                      alt="Martina's garden"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">Martina's Garden</h5>
                      <p class="card-text">
                        Whether you're celebrating a special occasion or simply
                        brightening someone's day, we are your go-to destination
                        for all things floral.
                      </p>
                      <p class="card-text">
                        <small class="text-muted">martina-garden.site</small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2>Our sponsors and supporters</h2>
      <p>
        Join us at <strong>Una vida extra</strong> and be part of something
        meaningful. Together, let's make a positive impact on our local
        communities and the planet.
      </p>
      <p>
        Are you passionate about community, sustainability, and making a
        positive impact on the world? Join us at Una vida extra, where we're on
        a mission to create a more connected, generous, and sustainable society.
      </p>

      <h2></h2>

      <div class="sponsor-info">
        <h2>Become a Sponsor of Una vida extra: Make a Difference Today!</h2>
        <p>
          Are you passionate about community, sustainability, and making a
          positive impact on the world? Join us at Una vida extra, where we're
          on a mission to create a more connected, generous, and sustainable
          society.
        </p>
        <p>
          By sponsoring Una vida extra, you'll be supporting a project that
          embodies values such as community, generosity, and sustainability.
          Your sponsorship will help us to continue to work on the platform
          itself, while you contribute to raise awareness about the importance
          of reuse, recycling, and local community engagement.
        </p>
        <p>
          As a sponsor of Una vida extra, you'll receive recognition and brand
          visibily.
        </p>
        <p>
          For sponsorship inquiries and more information, please
          <RouterLink :to="{ name: 'contact' }">contact us</RouterLink>.
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
