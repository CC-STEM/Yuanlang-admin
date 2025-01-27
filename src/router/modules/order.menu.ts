import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/order',
  component: Layout,
  redirect: '/order/orderList',
  name: 'OrderMenu',
  meta: {
    title: '订单管理',
    icon: 'sidebar-order',
  },
  children: [
    {
      path: 'orderList',
      name: 'NewOrderMenuList',
      component: () => import('@/views/order/newIndex.vue'),
      meta: {
        title: '订单列表（新）',
        icon: 'menu-order',
      },
    },
    {
      path: 'list',
      name: 'OrderMenuList',
      component: () => import('@/views/order/index.vue'),
      meta: {
        title: '订单列表',
        icon: 'menu-order',
      },
    },
  ],
}

export default routes
