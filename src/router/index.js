import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/pictest',
    name: 'PicTest',
    // Lazy Loading
    component: () => import('../views/PicTest.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // Lazy Loading
    component: () => import('../views/About.vue'),
  },
  {
    path: '/emoji_game',
    name: 'EmojiGame',
    component: () => import('../views/EmojiGame.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
