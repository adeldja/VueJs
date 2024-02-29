<template>
  <div class="category-selection">
    <!-- Liste des catégories -->
    <div class="category-column">
      <div v-for="(categoryGroup, index) in categorizedCategories" :key="index">
        <div class="category-card" v-for="category in categoryGroup" :key="category.strCategory">
          <button @click="selectCategory(category)">
            {{ category.strCategory }}
          </button>
        </div>
      </div>
    </div>

    <!-- Affichage des plats de la catégorie sélectionnée -->
    <div v-if="selectedCategory" class="category-detail">
      <h2>{{ selectedCategory.strCategory }}</h2>
      <div class="meal-list">
        <h3>Plats de la catégorie</h3>
        <div class="meal-cards">
          <div class="meal-row">
            <div v-for="meal in paginatedMeals" :key="meal.idMeal" class="meal-card">
              <router-link :to="{ name: 'MealDetail', params: { id: meal.idMeal }}">
                <img :src="meal.strMealThumb" alt="Meal Thumbnail" class="meal-image" />
                <h3>{{ meal.strMeal }}</h3>
              </router-link>
            </div>
          </div>
          <div v-if="totalPages > 1" class="pagination">
            <button v-for="page in totalPages" :key="page" @click="setCurrentPage(page)">
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'CategorySelection',
  setup() {
    const categories = ref([]);
    const selectedCategory = ref(null);
    const selectedCategoryMeals = ref([]);
    const currentPage = ref(1);
    const mealsPerPage = 8; // 4 lignes avec 2 plats par ligne

    const fetchCategories = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const data = await response.json();
        if (data.categories) {
          categories.value = data.categories;
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const selectCategory = async (category) => {
      selectedCategory.value = category;
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.strCategory}`);
      const data = await response.json();
      selectedCategoryMeals.value = data.meals;
      currentPage.value = 1; // Réinitialise la pagination lors du changement de catégorie
    };

    const categorizedCategories = computed(() => {
      const categorized = [];
      for (let i = 0; i < categories.value.length; i += 4) {
        categorized.push(categories.value.slice(i, i + 4));
      }
      return categorized;
    });

    const paginatedMeals = computed(() => {
      const startIndex = (currentPage.value - 1) * mealsPerPage;
      const endIndex = startIndex + mealsPerPage;
      return selectedCategoryMeals.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => Math.ceil(selectedCategoryMeals.value.length / mealsPerPage));

    const setCurrentPage = (pageNumber) => {
      currentPage.value = pageNumber;
    };

    onMounted(fetchCategories);

    return {
      selectedCategory,
      categorizedCategories,
      selectCategory,
      paginatedMeals,
      currentPage,
      totalPages,
      setCurrentPage,
    };
  },
};
</script>

<style scoped>
.category-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.category-column {
  display: flex;
  flex-direction: column;
}

.category-card {
  margin: 10px;
}

.category-card button {
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.category-card button:hover {
  background-color: #0056b3;
}

.category-detail {
  text-align: center;
  padding: 20px;
}

.meal-list {
  margin-top: 20px;
}

.meal-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.meal-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.meal-card {
  width: 150px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.meal-card img {
  width: 100%;
  border-radius: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #0056b3;
}
</style>
