<!--Pagina estatica con informacion sobre las cookies-->
<template>
  <h2>Política de Cookies&nbsp;🍪</h2>

  <div>
    <p>
      Nuestro sitio web utiliza servicios de autenticación de sesión basados en
      cookies integrados para brindarte una experiencia de autenticación sin
      problemas. Además, ten en cuenta que pueden generarse cookies relacionadas
      con Amazon y Google Fonts debido a nuestro uso de cubos de Amazon S3 para
      almacenamiento de imágenes y Google Fonts en nuestro sitio.
    </p>
    <p>
      Estas cookies son necesarias para el funcionamiento de nuestro sistema de
      autenticación, almacenamiento de imágenes y representación de fuentes, y
      se implementan únicamente para estos fines.
    </p>
    <p>
      Al utilizar nuestro sitio web, aceptas el uso de estas cookies según se
      describe en nuestra
      <RouterLink :to="{ name: 'privacy' }">Política de privacidad</RouterLink>.
    </p>
    <p>
      Para obtener más información sobre cómo manejamos tus datos personales y
      tus derechos en materia de privacidad, consulta nuestra
      <RouterLink :to="{ name: 'privacy' }">Política de privacidad</RouterLink>.
    </p>
    <p>
      Si tienes alguna pregunta o inquietud sobre nuestro uso de cookies,
      contáctanos.
    </p>
    <p>Última actualización: 2024/05/15</p>
  </div>
</template>
<style scoped>
h2 {
  padding-bottom: 2rem;
}
</style>
