import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/pictest',
    name: 'PicTest',
    // Lazy Loading
    component: () => import('../views/PicTest.vue'),
  },
  {
    path: '/emoji_game',
    name: 'EmojiGame',
    component: () => import('../views/EmojiGame.vue'),
  },
  {
    path: '/laugh_game',
    name: 'LaughGame',
    component: () => import('../views/LaughGame.vue'),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
