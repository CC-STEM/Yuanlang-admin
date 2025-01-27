import type { RouteRecordRaw } from 'vue-router'

type RecursiveRequired<T> = {
  [P in keyof T]-?: RecursiveRequired<T[P]>
}
type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

declare namespace Settings {
  interface app {
    /**
     * 颜色方案
     * @默认值 `''` 跟随系统
     * @可选值 `'light'` 明亮模式
     * @可选值 `'dark'` 暗黑模式
     */
    colorScheme?: '' | 'light' | 'dark'
    /**
     * Element Plus 组件默认尺寸
     * @默认值 `'default'` 默认
     * @可选值 `'large'` 大号
     * @可选值 `'small'` 小号
     */
    elementSize?: 'default' | 'large' | 'small'
    /**
     * 是否将 iconify 图标集中的 Element Plus 图标下载到本地，以便在离线环境下使用
     * @默认值 `false`
     */
    iconifyOfflineUse?: boolean
    /**
     * 是否开启权限功能
     * @默认值 `false`
     */
    enablePermission?: boolean
    /**
     * 是否开启载入进度条
     * @默认值 `true`
     */
    enableProgress?: boolean
    /**
     * 是否开启动态标题
     * @默认值 `false`
     */
    enableDynamicTitle?: boolean
    /**
     * 路由数据来源
     * @默认值 `'frontend'` 前端
     * @可选值 `'backend'` 后端
     * @可选值 `'filesystem'` 文件系统
     */
    routeBaseOn?: 'frontend' | 'backend' | 'filesystem'
    /**
     * 是否开启应用配置，强烈建议在生产环境中关闭
     * @默认值 `false`
     */
    enableAppSetting?: boolean
  }
  interface home {
    /**
     * 是否开启主页页面
     * @默认值 `true`
     */
    enable?: boolean
    /**
     * 主页名称
     * @默认值 `'主页'`
     */
    title?: string
  }
  interface layout {
    /**
     * 是否开启移动端适配，开启后当页面宽度小于 992px 时自动切换为移动端展示
     * @默认值 `false`
     */
    enableMobileAdaptation?: boolean
  }
  interface menu {
    /**
     * 导航栏数据来源，当 `app.routeBaseOn: 'filesystem'` 时生效
     * @默认值 `'frontend'` 前端
     * @可选值 `'backend'` 后端
     */
    baseOn?: 'frontend' | 'backend'
    /**
     * 导航栏模式
     * @默认值 `'side'` 侧边栏模式（有主导航）
     * @可选值 `'head'` 顶部模式
     * @可选值 `'single'` 侧边栏模式（无主导航）
     */
    menuMode?: 'side' | 'head' | 'single'
    /**
     * 切换主导航是否跳转页面
     * @默认值 `false`
     */
    switchMainMenuAndPageJump?: boolean
    /**
     * 次导航是否只保持一个子项的展开
     * @默认值 `true`
     */
    subMenuUniqueOpened?: boolean
    /**
     * 次导航是否收起
     * @默认值 `false`
     */
    subMenuCollapse?: boolean
    /**
     * 是否开启次导航的展开/收起按钮
     * @默认值 `false`
     */
    enableSubMenuCollapseButton?: boolean
    /**
     * 是否开启主导航切换快捷键
     * @默认值 `false`
     */
    enableHotkeys?: boolean
  }
  interface topbar {
    /**
     * 模式
     * @默认值 `'static'` 静止，跟随页面滚动
     * @可选值 `'fixed'` 固定，不跟随页面滚动，始终固定在顶部
     * @可选值 `'sticky'` 粘性，页面往下滚动时隐藏，往上滚动时显示
     */
    mode?: 'static' | 'fixed' | 'sticky'
  }
  interface toolbar {
    /**
     * 是否开启全屏
     * @默认值 `false`
     */
    enableFullscreen?: boolean
    /**
     * 是否开启页面刷新
     * @默认值 `false`
     */
    enablePageReload?: boolean
    /**
     * 是否开启颜色主题
     * @默认值 `false`
     */
    enableColorScheme?: boolean
  }
  interface breadcrumb {
    /**
     * 是否开启面包屑导航
     * @默认值 `true`
     */
    enable?: boolean
  }
  interface navSearch {
    /**
     * 是否开启导航搜索
     * @默认值 `true`
     */
    enable?: boolean
    /**
     * 是否开启导航搜索快捷键
     * @默认值 `true`
     */
    enableHotkeys?: boolean
  }
  interface copyright {
    /**
     * 是否开启底部版权，同时在路由 meta 对象里可以单独设置某个路由是否显示底部版权信息
     * @默认值 `true`
     */
    enable?: boolean
    /**
     * 网站运行日期
     * @默认值 `'2020-2022'`
     */
    dates?: string
    /**
     * 公司名称
     * @默认值 `'Fantastic-admin'`
     */
    company?: string
    /**
     * 网站地址
     * @默认值 `'https://hooray.gitee.io/fantastic-admin/'`
     */
    website?: string
    /**
     * 网站备案号
     * @默认值 `''`
     */
    beian?: string
  }
  interface all {
    /** 应用设置 */
    app?: app
    /** 主页设置 */
    home?: home
    /** 布局设置 */
    layout?: layout
    /** 导航栏设置 */
    menu?: menu
    /** 顶栏设置 */
    topbar?: topbar
    /** 工具栏设置 */
    toolbar?: toolbar
    /** 面包屑导航设置 */
    breadcrumb?: breadcrumb
    /** 导航搜索设置 */
    navSearch?: navSearch
    /** 底部版权设置 */
    copyright?: copyright
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string | Function
    i18n?: string
    icon?: string
    activeIcon?: string
    defaultOpened?: boolean
    auth?: string | string[]
    sidebar?: boolean
    breadcrumb?: boolean
    activeMenu?: string
    cache?: boolean | string | string[]
    link?: string
    breadcrumbNeste?: Route.breadcrumb[]
  }
}

declare namespace Route {
  interface recordMainRaw {
    meta?: {
      title?: string | Function
      icon?: string
      auth?: string | string[]
    }
    children: RouteRecordRaw[]
  }
  interface breadcrumb {
    path: string
    title?: string | Function
    hide: boolean
  }
}

declare namespace Menu {
  /** 原始 */
  interface recordRaw {
    path?: string
    meta?: {
      title?: string
      icon?: string
      defaultOpened?: boolean
      auth?: string | string[]
      sidebar?: boolean
      link?: string
    }
    children?: recordRaw[]
  }
  /** 主导航 */
  interface recordMainRaw {
    meta?: {
      title?: string
      icon?: string
      auth?: string | string[]
    }
    children: recordRaw[]
  }
}


declare namespace API {

  interface BaseRes {
    code: string
    message: string
  }

  interface CreateGoodsBody {
    name: string
    intro?: string
    category: number
    sellStatus: number
    coverImg: string
    detail: string
    originalPrice?: number
    sellingPrice: number
    stockNum: number
  }

  interface UpdateGoodsBody {
    id: number
    name?: string
    intro?: string
    category?: number
    sellStatus?: number
    coverImg?: string
    detail?: string
    originalPrice?: number
    sellingPrice?: number
    stockNum?: number
  }


  interface QueryGoodsBody {
    page?: number
    size?: number
    name?: string
    category?: number
    sellStatus?: number
  }

  interface Goods {
    id?: number
    name?: string
    intro?: string
    category?: number
    sellStatus?: number
    coverImg?: string
    detail?: string
    originalPrice?: number
    sellingPrice?: number
    stockNum?: number
    createUser?: number
    updateUser?: number
  }

  interface QueryGoodsResponse extends BaseRes {
    data: Goods[],
    total: number
  }

  interface Activity {
    id?: number
    name?: string // 活动名称
    intro?: string // 活动介绍
    category?: number // 参与方式
    coverImg?: string // 活动图
    activityRewards?: string // 活动奖励
    startTime?: string // 开始时间
    endTime?: string // 结束时间
    status?: number // 活动状态
    createUser?: number // 创建人
    updateUser?: number // 修改人
  }
  interface CreateActivityBody {
    name: string
    intro?: string
    category: number
    coverImg: string
    activityRewards: string
    startTime: string
    endTime: string
    status: number
  }

  interface UpdateActivityBody {
    id: number
    name?: string
    intro?: string
    category?: number
    coverImg?: string
    activityRewards?: string
    startTime?: string
    endTime?: string
    status?: number
  }

  interface QueryActivityBody {
    page?: number
    size?: number
    name?: string
    category?: number
    status?: number
  }

  interface QueryActivityResponse extends BaseRes {
    data: Activity[]
    total: number
  }

  interface StudyResource {
    id?: number;
    name?: string;
    intro?: string;
    level?: number;
    category?: number;
    src?: string;
    createUser?: number;
    updateUser?: number;
  }

  interface CreateStudyResourceBody {
    name: string
    intro?: string
    level: number
    category: number
    src: string
  }

  interface UpdateStudyResourceBody {
    id: number
    name?: string
    intro?: string
    level?: number
    category?: number
    src?: string
  }

  interface QueryStudyResourceBody {
    page?: number
    size?: number
    name?: string
    level?: number
    category?: number
  }

  interface QueryStudyResourceResponse extends BaseRes {
    data: StudyResource[]
    total: number
  }

  interface DictType {
    id?: number
    name?: string // 字典名称
    type?: string // 字典类型
    status?: number // 状态（0正常 1停用）
    remark?: string // 备注
    createUser?: number // 创建者
    updateUser?: number //  更新者
  }


  interface CreateDictTypeBody {
    name: string
    type: string
    status: number
    remark?: string
  }

  interface UpdateDictTypeBody {
    id: number
    name?: string
    type?: string
    status?: number
    remark?: string
  }

  interface QueryDictTypeBody {
    name?: string
    type?: string
    status?: number
    page: number
    size: number
  }

  interface QueryDictTypeResponse extends BaseRes {
    data: DictType[]
    total: number
  }

  interface DictData {
    id?: number
    label?: string // 字典标签
    value?: string // 字典键值
    type?: string // 字典类型
    dictType?: DictType
    status?: number // 状态（0正常 1停用）
    remark?: string // 备注
    createUser?: number // 创建者
    updateUser?: number // 更新者
  }
  interface CreateDictDataBody {
    label: string
    value: string
    type: string
    status: number
    remark?: string
  }

  interface UpdateDictDataBody {
    id: number
    label?: string
    value?: string
    type?: string
    status?: number
    remark?: string
  }

  interface QueryDictDataBody {
    label?: string
    type?: string
    status?: number
    page: number
    size: number
  }

  interface QueryDictDataResponse extends BaseRes {
    data: DictData[]
    total: number
  }

  interface GoodsOrderItem {
    orderNo: string;
    goodsId: number;
    goodsName: string; // 下单时商品名称
    goodsCoverImg?: string; // 下单时商品图
    sellingPrice: number; // 下单时商品价格
    goodsCount: number; // 下单商品数量
  }

  interface GoodsOrder {
    id?: number
    orderNo?: string // 订单号
    payPlatform?: string // 支付平台【wechatpay|alipay】
    channel?: string // 支付渠道 【native|jsapi|h5】）
    userId?: number // 用户ID
    total?: number // 订单总金额
    payStatus?: number // 支付状态（0：未支付、1：已支付、-1、支付失败
    paidAt?: string // 支付时间
    status?: number // 订单状态（0：待付款（下订单）、1：待发货（支付成功）、2、已发货（待收货）、3：交易成功（确认收货）、4：售后中（申请退货退款）、5：交易关闭-用户取消、6：交易关闭-超时取消、7：交易关闭-商家取消）
    receiverName?: string // 收货人姓名
    receiverPhone?: string // 收货人电话
    receiverAddress?: string // 收货人地址
    expressTrackingNo?: string // 快递单号
    shippingTime?: string // 发货时间
    completeTime?: string // 交易成功时间
    applyAfterSaleTime?: string // 申请退货退款时间
    closeTime?: string // 交易关闭时间
    goodsItems?: GoodsOrderItem[] // 当前订单包含的订单项
  }

  interface CreateGoodsOrderBody {
    orderNo: string
    payPlatform: string
    channel: string
    userId: number
    total: number
    payStatus: number
    status: number
    receiverName: string
    receiverPhone: string
    receiverAddress: string
    expressTrackingNo?: string
    shippingTime?: string
    completeTime?: string
    applyAfterSaleTime?: string
    closeTime?: string
  }

  interface UpdateGoodsOrderBody {
    orderNo: string
    payPlatform?: string
    channel?: string
    userId?: number
    total?: number
    payStatus?: number
    status?: number
    receiverName?: string
    receiverPhone?: string
    receiverAddress?: string
    expressTrackingNo?: string
    shippingTime?: string
    completeTime?: string
    applyAfterSaleTime?: string
    closeTime?: string
  }

  interface QueryGoodsOrderBody {
    orderNo?: string
    userId?: number
    status?: number
    page: number
    size: number
  }

  interface QueryGoodsOrderResponse extends BaseRes {
    data: GoodsOrder[]
    total: number
  }
}
