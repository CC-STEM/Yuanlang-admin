import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/study',
  component: Layout,
  redirect: '/study/list',
  name: 'StudyMenu',
  meta: {
    title: '学习管理',
    icon: 'sidebar-order',
  },
  children: [
    {
      path: 'list',
      name: 'StudyMenuList',
      component: () => import('@/views/study/index.vue'),
      meta: {
        title: '学习资源列表',
        icon: 'menu-order',
      },
    },
  ],
}

export default routes
