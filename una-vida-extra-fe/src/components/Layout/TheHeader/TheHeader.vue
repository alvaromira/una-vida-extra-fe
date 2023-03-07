<template>
  <header>
    <h2>Header - OneLifeUp</h2>
    <RouterLink to="/products">
      <img
        alt="Vue logo"
        class="logo"
        src="@/assets/logo.svg"
        width="125"
        height="125"
    /></RouterLink>

    <div>
      <nav>
        <ul>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/about">About</RouterLink></li>
          <li><RouterLink to="/products">Products</RouterLink></li>
          <li><RouterLink to="/sponsors">Sponsors</RouterLink></li>
          <li><RouterLink to="/project">Project</RouterLink></li>
          <li><RouterLink to="/login">Login</RouterLink></li>
          <li><RouterLink to="/register">Register</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "TheHeader",
};
</script>

<style scoped>
header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: brown;
}
</style>
