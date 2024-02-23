<template>
    <div class="category-detail">
      <button class="category-card" @click="toggleDetails">
        <h2>{{ categoryName }}</h2>
        <div v-if="showDetails" class="meal-list">
          <h3>Plats de la catégorie</h3>
          <ul>
            <li v-for="meal in paginatedMeals" :key="meal.idMeal">
              {{ meal.strMeal }}
              <img :src="meal.strMealThumb" alt="Meal Thumbnail" class="meal-image" />
            </li>
          </ul>
          <div class="pagination">
            <button v-for="page in totalPages" :key="page" @click="currentPage = page">{{ page }}</button>
          </div>
        </div>
      </button>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    name: 'CategoryDetail',
    setup() {
      const route = useRoute();
      const categoryName = route.params.categoryName;
      const meals = ref([]);
      const currentPage = ref(1);
      const mealsPerPage = 8; // 2 lignes de 4 plats
  
      const fetchCategoryMeals = async () => {
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
          const data = await response.json();
          if (data.meals) {
            meals.value = data.meals;
          }
        } catch (error) {
          console.error('Error fetching category meals:', error);
        }
      };
  
      const paginatedMeals = computed(() => {
        const startIndex = (currentPage.value - 1) * mealsPerPage;
        const endIndex = startIndex + mealsPerPage;
        return meals.value.slice(startIndex, endIndex);
      });
  
      const totalPages = computed(() => Math.ceil(meals.value.length / mealsPerPage));
  
      const showDetails = ref(false);
  
      const toggleDetails = () => {
        showDetails.value = !showDetails.value;
      };
  
      onMounted(fetchCategoryMeals);
  
      return {
        categoryName,
        paginatedMeals,
        currentPage,
        totalPages,
        toggleDetails,
        showDetails
      };
    }
  };
  </script>
  
  <style scoped>
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
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .pagination button:hover {
    background-color: #0056b3;
  }
  </style>
  