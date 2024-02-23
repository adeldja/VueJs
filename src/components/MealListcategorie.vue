<template>
    <div class="category-selection">
      <div class="category-list">
        <div v-for="(categoryGroup, index) in categorizedCategories" :key="index" class="category-group">
          <div class="category-card" v-for="category in categoryGroup" :key="category.strCategory">
            <button @click="selectCategory(category.strCategory)">
              {{ category.strCategory }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="selectedCategory" class="category-detail">
        <h2>{{ selectedCategory }}</h2>
        <div class="meal-list">
          <h3>Plats de la catégorie</h3>
          <div class="meal-cards">
            <div class="meal-row" v-for="(mealRow, index) in displayedRows" :key="index">
              <div v-for="meal in mealRow" :key="meal.idMeal" class="meal-card">
                <router-link :to="{ name: 'MealDetail', params: { categoryName: meal.strMeal }}">
                  <img :src="meal.strMealThumb" alt="Meal Thumbnail" class="meal-image" />
                  <h3>{{ meal.strMeal }}</h3>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div v-if="totalPages > 1" class="pagination">
          <button v-for="page in totalPages" :key="page" @click="setCurrentPage(page)">
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'CategorySelection',
    setup() {
      const router = useRouter();
      const categories = ref([]);
      const currentPage = ref(1);
      const categoriesPerPage = 8; // 2 lignes de 4 catégories
      const selectedCategory = ref(null);
  
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
  
      const categorizedCategories = computed(() => {
        const categorized = [];
        for (let i = 0; i < categories.value.length; i += 4) {
          categorized.push(categories.value.slice(i, i + 4));
        }
        return categorized;
      });
  
      const displayedRows = computed(() => {
        const startIndex = (currentPage.value - 1) * categoriesPerPage;
        const endIndex = startIndex + categoriesPerPage;
        return categorizedCategories.value.slice(startIndex, endIndex);
      });
  
      const totalPages = computed(() => Math.ceil(categorizedCategories.value.length / categoriesPerPage));
  
      const setCurrentPage = (pageNumber) => {
        currentPage.value = pageNumber;
      };
  
      const selectCategory = (categoryName) => {
        selectedCategory.value = categoryName;
        if (selectedCategory.value) {
        router.push({ name: 'CategoryDetail', params: { categoryName } });
    }
    };
  
      onMounted(fetchCategories);
  
      return {
        selectedCategory,
        categorizedCategories,
        displayedRows,
        currentPage,
        totalPages,
        setCurrentPage,
        selectCategory
      };
    }
  };
  </script>
  
  <style scoped>
  .category-selection {
    display: flex;
    justify-content: center;
  }
  
  .category-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .category-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .meal-card {
    width: calc(100% / 4 - 20px);
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
  