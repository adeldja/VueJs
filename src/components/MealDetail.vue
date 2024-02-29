<template>
  <div class="meal-detail">
    <h2>Détails du plat</h2>
    <div v-if="meal" class="meal-info">
      <h3>{{ meal.strMeal }}</h3>
      <img :src="meal.strMealThumb" :alt="meal.strMeal" class="meal-image" />
      <p>{{ meal.strInstructions }}</p>
      <div class="slider-container">
        <div class="slider">
          <div class="slide">
            <div v-for="(ingredientGroup, index) in ingredientGroups" :key="index" class="ingredient-group">
              <div v-for="(ingredient, i) in ingredientGroup" :key="i" class="ingredient">
                <img :src="ingredientImages[ingredient]" :alt="ingredient" class="ingredient-image" />
                <p>{{ ingredient }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    const ingredientGroups = ref([]);
    const ingredientImages = ref({});

    const fetchMealDetail = async () => {
      try {
        const mealId = route.params.id;
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          meal.value = data.meals[0];
          // Appeler extractIngredientGroups une seule fois ici
          ingredientGroups.value = extractIngredientGroups(data.meals[0]);
        }
      } catch (error) {
        console.error('Error fetching meal detail:', error);
      }
    };

    const extractIngredientGroups = (meal) => {
      const groups = [];
      let currentGroup = [];
      for (let i = 1; i <= 20; i++) {
        const ingredientKey = `strIngredient${i}`;
        const ingredient = meal[ingredientKey];
        if (ingredient && ingredient.trim() !== '') {
          currentGroup.push(ingredient);
          if (currentGroup.length === 4 || i === 20) {
            groups.push(currentGroup);
            currentGroup = [];
          }
        }
      }
      return groups;
    };

    const fetchIngredientImages = async () => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    const data = await response.json();
    const ingredients = data.meals;
    if (ingredients) {
      const images = {};
      await Promise.all(ingredients.map(async (ingredient) => {
        const ingredientName = ingredient.strIngredient;
        const imageUrl = `https://www.themealdb.com/images/ingredients/${ingredientName}.png`;
        // Créer une promesse pour le chargement de l'image
        const imgPromise = new Promise((resolve) => {
          const img = new Image();
          img.src = imageUrl;
          img.onload = () => {
            images[ingredientName] = imageUrl;
            resolve();
          };
          img.onerror = () => {
            // En cas d'erreur de chargement, résoudre la promesse
            // pour continuer l'exécution du code
            resolve();
          };
        });
        await imgPromise; // Attendre que l'image soit chargée ou qu'une erreur survienne
      }));
      ingredientImages.value = images;
    }
  } catch (error) {
    console.error('Error fetching ingredient images:', error);
  }
};


    onMounted(() => {
      fetchMealDetail();
      fetchIngredientImages();
    });

    return {
      meal,
      ingredientGroups,
      ingredientImages
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
  overflow: hidden;
  width: 100%;
}

.slider {
  display: flex;
}

.slide {
  display: flex;
}

.ingredient-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.ingredient {
  margin: 10px;
  text-align: center;
}

.ingredient p {
  margin-top: 5px;
}

.ingredient-image {
  width: 100px;
  border-radius: 5px;
}
</style>
