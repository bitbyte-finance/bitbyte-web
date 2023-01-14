import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    name: 'Swap',
    component: () => import('../views/Swap.vue')
  },
  {
    path: '/Mining',
    name: 'Mining',
    component: () => import('../views/Mining')
  },
  {
    path: '/Pool',
    name: 'Pool',
    component: () => import('../views/Pool'),
    redirect:'/Pool/YourLiquidity',
    children:[
      {
        path:'/Pool/YourLiquidity',
        name: 'YourLiquidity',
        component: () => import('../views/Pool/YourLiquidity.vue'),
      },
      {
        path:'/Pool/AddLiquidity',
        name: 'AddLiquidity',
        component: () => import('../views/Pool/AddLiquidity.vue'),
      },
      
    ]
  },
  {
    path: '/farm',
    name: 'farm',
    component: () => import('../views/Mining/farm')
  },
  {
    path: '/RemoveLiquidity',
    name: 'RemoveLiquidity',
    component: () => import('../views/removeLiquidity.vue')
  },
  {
    path: '/bridge',
    name: 'bridge',
    component: () => import('../views/Bridge/Bridge')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
