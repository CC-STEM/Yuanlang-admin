import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/activity',
  component: Layout,
  redirect: '/activity/list',
  name: 'ActivityMenu',
  meta: {
    title: '活动管理',
    icon: 'sidebar-order',
  },
  children: [
    {
      path: 'list',
      name: 'ActivityMenuList',
      component: () => import('@/views/activity/index.vue'),
      meta: {
        title: '活动列表',
        icon: 'menu-order',
      },
    },
  ],
}

export default routes
