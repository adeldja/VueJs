<template>
  <div class="meal-search">
    <h1>Pas d'idée de repas ?</h1>
    <div class="search-bar">
      <label for="searchTerm">Chercher un repas :</label>
      <input
        type="text"
        id="searchTerm"
        v-model="searchTerm"
        @input="search"
        placeholder="Entrez une lettre"
      />
      <button @click="generateRandomLetter">Lettre aléatoire</button>
    </div>

    <div v-if="meals.length > 0" class="meal-cards">
      <div v-for="(meal, index) in displayedMeals" :key="index" class="meal-card">
        <router-link :to="{ name: 'MealDetail', params: { id: meal.idMeal }}">
          <img :src="meal.strMealThumb" alt="Meal Thumbnail" class="meal-image" />
          <h3>{{ meal.strMeal }}</h3>
        </router-link>
      </div>
    </div>

    <div v-if="pageCount > 1" class="pagination">
      <button v-for="pageNumber in pageCount" :key="pageNumber" @click="setCurrentPage(pageNumber)">
        {{ pageNumber }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: '', 
      meals: [],
      currentPage: 1,
      mealsPerPage: 4,
    };
  },
  computed: {
    displayedMeals() {
      const startIndex = (this.currentPage - 1) * this.mealsPerPage;
      return this.meals.slice(startIndex, startIndex + this.mealsPerPage);
    },
    pageCount() {
      return Math.ceil(this.meals.length / this.mealsPerPage);
    },
  },
  methods: {
    async search() {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${this.searchTerm}`);
        const data = await response.json();
        this.meals = data.meals || [];
        this.currentPage = 1; // Réinitialiser la page courante à 1 après chaque recherche
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    setCurrentPage(pageNumber) {
      this.currentPage = pageNumber;
    },
    generateRandomLetter() {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      this.searchTerm = alphabet[randomIndex];
      this.search(); // Exécuter la recherche automatiquement
    },
  },
};
</script>

<style scoped>
.meal-search {
  text-align: center;
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.meal-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.meal-card {
  width: 200px;
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
  background-color: grey;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:hover {
  background-color:grey;
}
</style>
