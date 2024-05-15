<!--Este es un componente estático donde mostrar la ayuda para usuarios-->
<template>
  <section id="faq-overview">
    <div class="row">
      <div class="class col-md-12">
        <h1>Help</h1>
        <p>
          Hey there! Curious about what everyone's up to on our fun trading
          platform? Check out the stuff our awesome users are always doing –
          from publishing loved items they do not use anylonger to deciding what
          of the requests to accept.
        </p>
        <p>
          And hey, if you think we're missing something cool, hit us up! We're
          all ears for any suggestions to spice up our FAQ section. Just
          <RouterLink :to="{ name: 'contact' }">contact</RouterLink>
          us and let us know. Let's make this community even better together!
        </p>
      </div>
    </div>
  </section>
  <!--Esta es realmente la sección con las preguntas. Se usan componentes para cada pregunta para ganar flexibilidad  y en un futuro sacar el contenido estático a un CMS y obtenerlo en tiempo real. De momento todas las preguntas son estáticas-->
  <h2>Frequently Asked Questions</h2>
  <section id="faq">
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Users</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="how-to-reset-password">
          <template #question>
            <h3>Password reset</h3>
          </template>
          <template #questionText>
            <p>I do not remember my password 😧. How do I reset it?</p>
          </template>
          <template #responseText>
            <p>
              Easy! If you do not remember your password or you simply want to
              update it, just use the 'Forgot password' functionality
              <RouterLink :to="{ name: 'forgot-password' }">here</RouterLink>.
            </p>
          </template>
        </QuestionAndAnswerItem>

        <QuestionAndAnswerItem questionId="user-icon">
          <template #question>
            <h3>User Image</h3>
          </template>
          <template #questionText>
            <p>I do not like my user profile image. How do I change it?</p>
          </template>
          <template #responseText>
            <p>
              As mentioned in the registration, we are all about re-using here!
              We use the
              <a href="https://gravatar.com/" target="_blank">gravatar</a>
              linked to your registered email address. So if you want to update
              the picture displayed, just update your actual gravatar and it
              will be updated in all the places where you use it. 😊
            </p>
          </template>
        </QuestionAndAnswerItem>

        <QuestionAndAnswerItem questionId="user-location">
          <template #question>
            <h3>User Location</h3>
          </template>
          <template #questionText>
            <p>I have moved to a new address. How do I update my profile?</p>
          </template>
          <template #responseText>
            <p>
              Excellent question! First you need to login and then go to your
              <RouterLink :to="{ name: 'profile' }">profile</RouterLink>. Then,
              inside the profile, you will see your coordinates. To get them
              updated, click on the 'Get my Location' button and wait for the
              location to be updated.
              <br />
              Once the coordinates are updated, you can then click on the
              'Update' button to confirm the update of your profile.
            </p>
          </template>
        </QuestionAndAnswerItem>

        <QuestionAndAnswerItem questionId="user-disabled">
          <template #question>
            <h3>User Account Disabled</h3>
          </template>
          <template #questionText>
            <p>When I try to log in, my user account is disabled. Why?</p>
          </template>
          <template #responseText>
            <p>
              Admin users can disable user accounts if they consider there is an
              absolute in the way they use the platform. Please
              <RouterLink :to="{ name: 'contact' }">contact</RouterLink> us to
              discuss your case and get your account back online.
            </p>
          </template>
        </QuestionAndAnswerItem>
      </div>
    </div>
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Items</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="item-images">
          <template #question>
            <h3>Item Images</h3>
          </template>
          <template #questionText>
            <p>Why don't you allow more than one image per item?</p>
          </template>
          <template #responseText>
            <p>
              We try to keep things lean. We do as much as we can to keep our
              carbon footprint under control as part of our efforts to be
              eco-friendly. So you can use one image only, but you can update it
              if you want. Consider it a shop window to display the best view of
              your item!
              <br />
              (Note: we may reconsider this in the future 🤔.)
            </p>
          </template>
        </QuestionAndAnswerItem>

        <QuestionAndAnswerItem questionId="item-owner">
          <template #question>
            <h3>Item Owner</h3>
          </template>
          <template #questionText>
            <p>
              How can I find out who is the owner of an item I am interested in?
            </p>
          </template>
          <template #responseText>
            <p>
              You simply can't. You can check the details of the item as well as
              its location, but you cannot know who the onwer is until your
              request has been accepted.
            </p>
          </template>
        </QuestionAndAnswerItem>
      </div>
    </div>
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Location</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="allow-location-details">
          <template #question>
            <h3>Allowing Browser Geolocation</h3>
          </template>
          <template #questionText>
            <p>
              When I register, the browser asks me to allow my location. Why is
              that?
            </p>
          </template>
          <template #responseText>
            <p>
              Well, we are all about re-using and reciclying locally. So to do
              that and handle requests you receive by proximity, we need to know
              your exact location. Please remember this is just your location,
              you are not providind any addresses. So you are not revealing any
              details. Just make sure you register with a location that makes
              sense for you and the rest of the community.
            </p>
          </template>
        </QuestionAndAnswerItem>
      </div>
    </div>
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Categories</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="allow-location-details">
          <template #question>
            <h3>More Categories</h3>
          </template>
          <template #questionText>
            <p>Why can't I add a new category on my own?</p>
          </template>
          <template #responseText>
            <p>
              Categories are managed by admins. If you feel you need to have
              more categories and get them renamed, please
              <RouterLink :to="{ name: 'contact' }">contact</RouterLink> us so
              an admin user can get manage your request and get the new category
              added for you.
            </p>
          </template>
        </QuestionAndAnswerItem>
      </div>
    </div>
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Tags</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="allow-location-details">
          <template #question>
            <h3>Use of Tags</h3>
          </template>
          <template #questionText>
            <p>Why can't I get tags updated in my items?</p>
          </template>
          <template #responseText>
            <p>
              We are aware of this limitation 😳. Our community platform is
              still in its early stages at the moment. We are working to make
              this happen soon 😊.
            </p>
          </template>
        </QuestionAndAnswerItem>
      </div>
    </div>
  </section>
</template>

<script setup>
import QuestionAndAnswerItem from "../components/ui/QuestionAndAnswerItem.vue";
</script>
<style scoped>
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
h1 {
  padding-bottom: 2rem;
  text-align: center;
}
h2.question-block-title {
  padding-bottom: 1rem;
}
.question-title h3 {
  color: gray !important;
}
#faq-overview {
  padding-bottom: 2rem;
}
</style>
