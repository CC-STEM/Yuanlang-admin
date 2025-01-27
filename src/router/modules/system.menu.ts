import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/system',
  component: Layout,
  redirect: '/system/base',
  name: 'systemMenu',
  meta: {
    title: '系统设置',
    icon: 'sidebar-system',
  },
  children: [
    {
      path: 'dictType',
      name: 'dictTypeMenuBase',
      component: () => import('@/views/system/dictType.vue'),
      meta: {
        title: '字典类型管理',
        icon: 'menu-baidutongji',
      },
    },
    {
      path: 'dictData',
      name: 'dictDataMenuBase',
      component: () => import('@/views/system/dictData.vue'),
      meta: {
        title: '字典数据管理',
        icon: 'menu-baidutongji',
      },
    },
    // {
    //   path: 'fanyi',
    //   name: 'BaiduFanyi',
    //   component: () => import('@/views/system/baidufanyi.vue'),
    //   meta: {
    //     title: '百度翻译配置',
    //     icon: 'menu-baidufanyi',
    //   },
    // },

    // {
    //   path: 'cos',
    //   name: 'systemMenuCos',
    //   component: () => import('@/views/system/cos.vue'),
    //   meta: {
    //     title: '存储设置',
    //   },
    // },
    // {
    //   path: 'secret',
    //   name: 'systemMenuSecret',
    //   component: () => import('@/views/system/secret.vue'),
    //   meta: {
    //     title: 'key池设置',
    //   },
    // },
    {
      path: 'copyright',
      name: 'copyrightConfig',
      component: () => import('@/views/system/copyright.vue'),
      meta: {
        title: '后台版权信息',
        icon: 'menu-copyright',
      },
    },
    // {
    //   path: 'upgrade',
    //   name: 'upgradeConfig',
    //   component: () => import('@/views/system/upgrade.vue'),
    //   meta: {
    //     title: '迁移助手',
    //     icon: 'menu-qianyizhushou',
    //   },
    // },
  ],
}

export default routes
