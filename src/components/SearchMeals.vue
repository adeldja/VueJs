<template>
    <div class="search-meals">
      <input type="text" v-model="searchQuery" placeholder="Recherche par nom">
      <button @click="searchMeals">Rechercher</button>
      <button @click="generatePDF">Générer PDF des ingrédients</button>

      <!-- Section pour afficher les plats choisis -->
      <div class="meal-list">
        <h2>Plats Choisis</h2>
        <ul>
          <li v-for="(meal, index) in selectedMeals" :key="index">
            <span>{{ meal.strMeal }}</span>
            <button @click="removeMealFromSelected(index)">Supprimer</button>
          </li>
        </ul>
      </div>

      <!-- Section pour afficher les résultats de la recherche -->
      <div v-if="meals.length > 0" class="meal-list">
        <h2>Résultats de la recherche</h2>
        <ul>
          <li v-for="(meal, index) in meals" :key="index">
            <button @click="addMealToSelected(meal)">
              {{ meal.strMeal }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { PDFDocument, rgb } from 'pdf-lib';
  
  export default {
    name: 'SearchMeals',
    setup() {
      const searchQuery = ref('');
      const meals = ref([]);
      const selectedMeals = ref([]);
  
      const searchMeals = async () => {
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery.value}`);
          const data = await response.json();
          if (data.meals) {
            meals.value = data.meals.map(meal => ({ ...meal, completed: false }));
          } else {
            meals.value = [];
          }
        } catch (error) {
          console.error('Error searching meals:', error);
        }
      };
  
      const generatePDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { height } = page.getSize();
        const fontSize = 15;
  
        page.drawText('Liste des ingrédients', {
          x: 50,
          y: height - 50,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
  
        let yPosition = height - 100;
        selectedMeals.value.forEach((meal) => {
          page.drawText(`Repas: ${meal.strMeal}`, {
            x: 50,
            y: yPosition,
            size: fontSize,
            color: rgb(0, 0, 0),
          });
          yPosition -= fontSize + 5;
  
          for (let i = 1; i <= 20; i++) {
            const ingredientKey = `strIngredient${i}`;
            const measureKey = `strMeasure${i}`;
            const ingredient = meal[ingredientKey];
            const measure = meal[measureKey];
            if (ingredient && ingredient.trim() !== '') {
              page.drawText(`- ${measure} ${ingredient}`, {
                x: 70,
                y: yPosition,
                size: fontSize,
                color: rgb(0, 0, 0),
              });
              yPosition -= fontSize;
            } else {
              break;
            }
          }
  
          yPosition -= 10; // Espacement entre les repas
        });
  
        const pdfBytes = await pdfDoc.save();
  
        // Crée un objet blob avec les données du PDF
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
        // Crée un URL d'objet à partir du blob
        const url = URL.createObjectURL(blob);
  
        // Ouvre un nouvel onglet avec le PDF
        window.open(url);
      };

  
      const addMealToSelected = (meal) => {
        selectedMeals.value.push(meal);
      };

      const removeMealFromSelected = (index) => {
        selectedMeals.value.splice(index, 1);
      };
  
      return {
        searchQuery,
        meals,
        selectedMeals,
        searchMeals,
        generatePDF,
        addMealToSelected,
        removeMealFromSelected
      };
    }
  };
  </script>
  
  <style scoped>
  .search-meals {
    margin-bottom: 20px;
  }
  
  .search-meals input {
    padding: 5px;
    margin-right: 10px;
  }
  
  .search-meals button {
    padding: 5px 10px;
    background-color: grey;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .search-meals button:hover {
    background-color: grey;
  }
  
  .meal-list {
    margin-top: 20px;
  }
  
  .meal-list ul {
    list-style-type: none;
  }
  
  .meal-list li {
    margin-bottom: 5px;
  }
  
  .meal-list li input[type="checkbox"] {
    margin-right: 5px;
  }

  .meal-list li button {
    margin-left: 10px;
    padding: 3px 5px;
    background-color: #ff4c4c;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  .meal-list li button:hover {
    background-color: #e60000;
  }
  </style>
