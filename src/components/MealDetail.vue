<template>
  <div class="meal-detail">
    <h2>Détails du plat</h2>
    <div v-if="meal" class="meal-info">
      <h3>{{ meal.strMeal }}</h3>
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

    return {
      meal
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
.category-detail {
    text-align: center;
    padding: 20px;
  }
  
  .category-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    cursor: pointer;
    transition: box-shadow 0.3s;
  }
  
  .category-card:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .meal-list {
    margin-top: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
  }
  
  .meal-image {
    width: 100px;
    border-radius: 5px;
  }
  
  .pagination {
    margin-top: 20px;
  }
  
  .pagination button {
    margin-right: 5px;
    background-color: grey;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .pagination button:hover {
    background-color: grey;
  }


</style>
