<template>
  <RouterLink :to="{ name: 'home' }" class="logo text-decoration-none">
    <span aria-hidden="true">🎟</span> Vue Lottery
  </RouterLink>
</template>

<style scoped lang="scss">
.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #212529;
}
</style>
