
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/list/index.vue'),
    name: 'list'
  },
  {
    path: '/add',
    component: () => import('@/views/edit/add.vue'),
    name: 'add'
  },
  {
    path: '/edit',
    component: () => import('@/views/edit/edit.vue'),
    name: 'edit'
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
