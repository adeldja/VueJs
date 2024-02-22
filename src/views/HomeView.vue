<template>
  <div class="home-container">
    <h1 class="home-title">DailyDish</h1>
    <p class="home-introduction">
      Bienvenue sur DailyDish, votre destination culinaire pour découvrir une variété de plats délicieux et inspirants. Parcourez notre collection de recettes et laissez-vous emporter par un voyage gustatif exceptionnel.
    </p>
    
    <MealSearchPagination />
  </div>
</template>

<script>
import MealSearchPagination from '../components/MealSearchPagination.vue';

export default {
  name: 'HomeView',
  components: {
    MealSearchPagination,
  },
};
</script>

<style scoped>
/* Styles CSS spécifiques au composant Home */
.home-container {
  text-align: center;
  padding: 20px;
}

.home-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.home-introduction {
  font-size: 1.2rem;
}
</style>
