import api from '../index'
import { API } from '#/global'

export default {
  queryGoods: (data: API.QueryGoodsBody) => api.post<API.QueryGoodsResponse>('goods/queryGoods', data),
  deleteGoods: (data: { id: number }) => api.post('goods/deleteGoods', data),
  updateGoods: (data: API.UpdateGoodsBody) => api.post('goods/updateGoods', data),
  createGoods: (data: API.CreateGoodsBody) => api.post('goods/createGoods', data),
}
