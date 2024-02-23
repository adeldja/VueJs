import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MealListcategorie from '../components/MealListcategorie.vue';
import CategoryDetail from '../components/CategoryDetail.vue';

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
    path: '/category/:categoryName',
    name: 'CategoryDetail',
    component: CategoryDetail
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
