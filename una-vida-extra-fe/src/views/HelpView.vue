<!--Este es un componente estático donde mostrar la ayuda para usuarios-->
<template>
  <section id="faq-overview">
    <div class="row">
      <div class="class col-md-12">
        <h1>Ayuda</h1>
        <p>
          ¡Hola! ¿Tienes curiosidad por saber qué están haciendo todos en
          nuestro divertido trading? ¿plataforma? Echa un vistazo a las cosas
          que nuestros fantásticos usuarios siempre hacen: desde publicar
          artículos amados que ya no usan hasta decidir qué de las solicitudes a
          aceptar.
        </p>
        <p>
          Y oye, si crees que nos estamos perdiendo algo interesante,
          ¡contáctanos! Eran Todos los oídos para cualquier sugerencia para
          darle vida a nuestra sección de preguntas frecuentes. Justo
          <RouterLink :to="{ name: 'contact' }"> contacto </RouterLink>
          nosotros y háganoslo saber. ¡Hagamos que esta comunidad sea aún mejor
          juntos!
        </p>
      </div>
    </div>
  </section>
  <!--Esta es realmente la sección con las preguntas. Se usan componentes para cada pregunta para ganar flexibilidad  y en un futuro sacar el contenido estático a un CMS y obtenerlo en tiempo real. De momento todas las preguntas son estáticas-->
  <h2>Preguntas frecuentes</h2>
  <section id="faq">
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Usuarios</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="how-to-reset-password">
          <template #question>
            <h3>Restablecer contraseña</h3>
          </template>
          <template #questionText>
            <p>No recuerdo mi contraseña 😧. ¿Cómo lo reinicio?</p>
          </template>
          <template #responseText>
            <p>
              ¡Fácil! Si no recuerdas tu contraseña o simplemente quieres
              actualízalo, solo usa la funcionalidad 'Olvidé mi contraseña'
              <RouterLink :to="{ name: 'forgot-password' }">aquí</RouterLink>.
            </p>
          </template>
        </QuestionAndAnswerItem>

        <QuestionAndAnswerItem questionId="user-icon">
          <template #question>
            <h3>Imagen de usuario</h3>
          </template>
          <template #questionText>
            <p>No me gusta mi imagen de perfil de usuario. ¿Cómo la cambio?</p>
          </template>
          <template #responseText>
            <p>
              Como se mencionó en el registro, ¡aquí nuestro objetivo es
              reutilizar! Usamos el
              <a href="https://gravatar.com/" target="_blank"> gravatar </a>
              vinculado a su dirección de correo electrónico registrada. Así que
              si quieres actualizar la imagen mostrada, simplemente actualice su
              gravatar real y Se actualizará en todos los lugares donde lo
              utilices. 😊
            </p>
          </template>
        </QuestionAndAnswerItem>

        <QuestionAndAnswerItem questionId="user-location">
          <template #question>
            <h3>Ubicación del usuario</h3>
          </template>
          <template #questionText>
            <p>
              Me he mudado a una nueva dirección. ¿Cómo actualizo mi perfil?
            </p>
          </template>
          <template #responseText>
            <p>
              ¡Excelente pregunta! Primero debe iniciar sesión y luego ir a su
              <RouterLink :to="{ name: 'profile' }"> perfil </RouterLink> .
              Entonces, Dentro del perfil, verás tus coordenadas. Para
              conseguirlos actualizado, haga clic en el botón 'Obtener mi
              ubicación' y espere a que ubicación a actualizar.
              <br />
              Una vez actualizadas las coordenadas, puede hacer clic en el Botón
              'Actualizar' para confirmar la actualización de tu perfil.
            </p>
          </template>
        </QuestionAndAnswerItem>

        <QuestionAndAnswerItem questionId="user-disabled">
          <template #question>
            <h3>Cuenta de usuario desactivada</h3>
          </template>
          <template #questionText>
            <p>
              Cuando intento iniciar sesión, mi cuenta de usuario está
              desactivada. ¿Por qué?
            </p>
          </template>
          <template #responseText>
            <p>
              Los usuarios administradores pueden desactivar las cuentas de
              usuario si consideran que existe una absoluto en la forma en que
              utilizan la plataforma. Por favor
              <RouterLink :to="{ name: 'contact' }"> contáctenos </RouterLink>
              para analice su caso y recupere su cuenta en línea.
            </p>
          </template>
        </QuestionAndAnswerItem>
      </div>
    </div>
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Productos</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="item-images">
          <template #question>
            <h3>Imágenes de elementos</h3>
          </template>
          <template #questionText>
            <p>¿Por qué no permites más de una imagen por elemento?</p>
          </template>
          <template #responseText>
            <p>
              Intentamos mantener las cosas sencillas. Hacemos todo lo que
              podemos para mantener nuestra huella de carbono bajo control como
              parte de nuestros esfuerzos por ser Respetuoso del medio ambiente.
              Entonces puedes usar una sola imagen, pero puedes actualizarla. si
              quieres. Considérelo un escaparate para mostrar la mejor vista de
              ¡Tu objeto!
              <br />
              (Nota: es posible que reconsideremos esto en el futuro 🤔).
            </p>
          </template>
        </QuestionAndAnswerItem>

        <QuestionAndAnswerItem questionId="item-owner">
          <template #question>
            <h3>Dueño del producto</h3>
          </template>
          <template #questionText>
            <p>
              ¿Cómo puedo saber quién es el dueño de un artículo que me
              interesa?
            </p>
          </template>
          <template #responseText>
            <p>
              Simplemente no puedes. Podrás consultar los detalles del artículo
              así como su ubicación, pero no puedes saber quién es el
              propietario hasta que la solicitud ha sido aceptada.
            </p>
          </template>
        </QuestionAndAnswerItem>
      </div>
    </div>
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Ubicación</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="allow-location-details">
          <template #question>
            <h3>Permitir la geolocalización del navegador</h3>
          </template>
          <template #questionText>
            <p>
              Cuando me registro, el navegador me pide que permita mi ubicación.
              Por que es ¿eso?
            </p>
          </template>
          <template #responseText>
            <p>
              Bueno, nuestro objetivo es reutilizar y reciclar localmente. Así
              que hacer eso y manejar las solicitudes que recibes por
              proximidad, necesitamos saber tu ubicación exacta. Recuerde que
              esta es solo su ubicación, No estás proporcionando ninguna
              dirección. Entonces no estás revelando nada. detalles. Sólo
              asegúrese de registrarse en una ubicación que haga sentido para
              usted y el resto de la comunidad.
            </p>
          </template>
        </QuestionAndAnswerItem>
      </div>
    </div>
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Categorías</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="allow-location-details">
          <template #question>
            <h3>Más categorías</h3>
          </template>
          <template #questionText>
            <p>¿Por qué no puedo agregar una nueva categoría por mi cuenta?</p>
          </template>
          <template #responseText>
            <p>
              Las categorías son administradas por administradores. Si sientes
              que necesitas tener más categorías y cambiarles el nombre, por
              favor
              <RouterLink :to="{ name: 'contact' }"> contáctenos </RouterLink>
              para un usuario administrador puede gestionar su solicitud y
              obtener la nueva categoría añadido para ti.
            </p>
          </template>
        </QuestionAndAnswerItem>
      </div>
    </div>
    <div class="row question-block">
      <hr />
      <div class="col"><h2 class="question-block-title">Etiquetas</h2></div>
      <div class="class col-md-12">
        <QuestionAndAnswerItem questionId="allow-location-details">
          <template #question>
            <h3>Uso de etiquetas</h3>
          </template>
          <template #questionText>
            <p>¿Por qué no puedo actualizar las etiquetas de mis artículos?</p>
          </template>
          <template #responseText>
            <p>
              Somos conscientes de esta limitación 😳. Nuestra plataforma
              comunitaria es todavía en sus primeras etapas por el momento.
              Estamos trabajando para hacer esto sucederá pronto 😊.
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
