import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategorieView from '../views/CategorieView.vue'
import MealListcategorie from '../components/MealListcategorie.vue';
import SearchMeals from '../components/SearchMeals.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/categorieList',
    name: 'MealListcategorie',
    component: MealListcategorie
  },
  {
    path: '/CategorieView',
    name: 'CategorieView',
    component: CategorieView
  },
  {
    path: '/SearchMeals',
    name: 'SearchMeals',
    component: SearchMeals
  },
  {
    path: '/meal/:id',
    name: 'MealDetail',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/MealDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
