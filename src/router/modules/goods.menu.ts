import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/goods',
  component: Layout,
  redirect: '/goods/list',
  name: 'GoodsMenu',
  meta: {
    title: '商品管理',
    icon: 'sidebar-order',
  },
  children: [
    {
      path: 'list',
      name: 'GoodsMenuList',
      component: () => import('@/views/goods/index.vue'),
      meta: {
        title: '商品列表',
        icon: 'menu-order',
      },
    },
  ],
}

export default routes
