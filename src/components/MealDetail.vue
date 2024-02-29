<template>
  <div class="meal-detail">
    <h2>Détails du plat</h2>
    <div v-if="meal" class="meal-info">
      <h3>{{ meal.strMeal }}</h3>
      <div class="slider-container">
        <div class="slider">
          <div v-for="(ingredient, index) in mealIngredients" :key="index" class="slide">
            <p>{{ ingredient }}</p>
          </div>
        </div>
      </div>
      <img :src="meal.strMealThumb" :alt="meal.strMeal" class="meal-image" />
      <p>{{ meal.strInstructions }}</p>
    </div>
    <router-link to="/" class="back-link">Retour à la liste des plats</router-link>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'MealDetail',
  setup() {
    const meal = ref(null);
    const route = useRoute();

    const fetchMealDetail = async () => {
      const mealId = route.params.id;
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        meal.value = data.meals[0];
      }
    };

    onMounted(fetchMealDetail);

    const mealIngredients = ref([]);

    onMounted(() => {
      if (meal.value) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ingredientKey = `strIngredient${i}`;
          const measureKey = `strMeasure${i}`;
          const ingredient = meal.value[ingredientKey];
          const measure = meal.value[measureKey];
          if (ingredient) {
            ingredients.push(`${measure} ${ingredient}`);
          }
        }
        mealIngredients.value = ingredients;
      }
    });

    return {
      meal,
      mealIngredients
    };
  }
};
</script>

<style scoped>
.meal-detail {
  text-align: center;
  padding: 20px;
}

.meal-info {
  margin-bottom: 20px;
}

.meal-image {
  width: 300px;
  height: 200px; /* Ajustez la hauteur pour s'adapter à votre mise en page */
  object-fit: cover; /* Pour maintenir les proportions */
  border-radius: 10px;
  margin-bottom: 10px;
}

.back-link {
  display: inline-block;
  background-color: grey;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: grey;
}

.slider-container {
  width: 100%;
  overflow: hidden;
}

.slider {
  display: flex;
  width: 100%;
  transition: transform 0.5s ease;
}

.slide {
  min-width: 100%;
  flex: 0 0 auto;
  padding: 10px;
}

</style>
