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
            We believe in the power of community, generosity, and
            sustainability. Our platform is a vibrant web community where people
            come together to share items they no longer need, but that still
            have plenty of life left in them. It's all about giving back,
            reusing, and recycling – and best of all, it's completely free.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 light-side cta-side">
          <h2>How it works</h2>
          <p>
            <strong>Donate</strong>: Have items gathering dust at home? Give
            them a new lease on life by donating them. Whether it's clothing,
            books, household items, or anything in between, your donations can
            make a real difference to someone else.
          </p>

          <p>
            <strong>Request</strong>: Need something specific? Browse our
            listings and make requests for items you're looking for. All
            requests are sorted by proximity first, ensuring that items are
            preferably shared locally and sustainably.
          </p>

          <p>
            <strong>Pick Up</strong>: Once your request is accepted, simply
            arrange a time to pick up the item from its original location. It's
            that easy – no money involved, just a spirit of community and
            kindness.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 dark-side cta-side">
          <h2>Our values</h2>
          <p>
            <strong>Community</strong>: We're all about bringing people together
            and fostering a sense of belonging.
          </p>
          <p>
            <strong>Generosity</strong>: Sharing is caring, and our community
            thrives on the generosity of its members.
          </p>
          <p>
            <strong>Sustainability</strong>: By reusing and recycling items,
            we're helping to reduce waste and lessen our environmental impact.
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
