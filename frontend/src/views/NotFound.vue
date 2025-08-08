<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 text-center mt-5">
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <router-link to="/">Go to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>