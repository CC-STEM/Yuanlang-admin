import api from '../index'

export default {
  login: (data: {
    username: string
    password: string
  }) => api.post('auth/login', data),

  permission: () => api.get('auth/getInfo'),

  getInfo: () => api.get('auth/getInfo'),

  queryAllUser: params => api.get('user/queryAll', { params }),

  queryAllUserNew: params => api.get('user/queryAllUsers', { params }),

  updateUserStatus: (data: {
    status: string
  }) => api.post('user/updateStatus', data),

  resetUserPassword: (data: { id: number }) => api.post('user/resetUserPass', data),

  sendUserCrami: (data: {
    userId: number
    usesLeft: number
    paintCount: number
    balance: number
  }) => api.post('user/recharge', data),

  updatePassword: (data: {
    oldPassword: string
    password: string
  }) => api.post('auth/updatePassword', data),

  createUser: (data: {
    username: string
    password: string
    email: string
    phone: string
    name: string
  }) => api.post('user/createUserAccount', data),

  configBalance: (data: {
    userId: number
    balance: number
  }) => api.post('accountBalance/update', data),
}
