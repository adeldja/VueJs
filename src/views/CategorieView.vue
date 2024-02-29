<template>
  <h1>
    Toutes les catégories 
  </h1>
  <MealListcategorie/>
</template>

<script>
import MealListcategorie from '../components/MealListcategorie.vue';
export default {
  name: 'CategorieView',
  components: {
    MealListcategorie,
  },
};
</script>