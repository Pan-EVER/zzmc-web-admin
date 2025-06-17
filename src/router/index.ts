import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    // 产品列表页
    {
      path: '/product',
      name: 'product',
      meta: {
        title: '产品管理',
      },
      component: () => import('@/views/product/list/index.vue'),
    },
    // 产品详情页
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('@/views/product/detail/index.vue'),
    },
    // 案例管理页
    {
      path: '/case',
      name: 'case',
      meta: {
        title: '案例管理',
      },
      component: () => import('@/views/case/list/index.vue'),
    },
    // 案例详情页
    {
      path: '/case/:id',
      name: 'case-detail',
      component: () => import('@/views/case/detail/index.vue'),
    },
    // 专利管理页
    {
      path: '/patent',
      name: 'patent',
      meta: {
        title: '专利管理',
      },
      component: () => import('@/views/patent/index.vue'),
    },
    // 新闻列表管理页
    {
      path: '/news',
      name: 'news',
      meta: {
        title: '新闻管理',
      },
      component: () => import('@/views/news/list/index.vue'),
    },
    // 新闻详情页
    {
      path: '/news/:id',
      name: 'news-detail',

      component: () => import('@/views/news/detail/index.vue'),
    },
    //文件下载管理页
    {
      path: '/file',
      name: 'file',
      meta: {
        title: '文件下载管理',
      },
      component: () => import('@/views/file/index.vue'),
    },
  ],
})

export default router
