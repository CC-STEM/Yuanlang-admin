import api from '../index'
import { API } from '#/global'

export default {
  queryGoodsOrder: (data: API.QueryGoodsOrderBody) => api.post<API.QueryGoodsOrderResponse>('goodsOrder/queryGoodsOrder', data),
  deleteGoodsOrder: (data: { orderNo: string }) => api.post('goodsOrder/deleteGoodsOrder', data),
  // updateGoodsOrder: (data: API.UpdateGoodsOrderBody) => api.post('goodsOrder/update', data),
  createGoodsOrder: (data: API.CreateGoodsOrderBody) => api.post('goodsOrder/createGoodsOrder', data),
  closeGoodsOrder: (data: { orderNo: string }) => api.post('goodsOrder/closeGoodsOrderByAdmin', data),
  orderShipping: (data: { orderNo: string, expressTrackingNo: string }) => api.post('goodsOrder/orderShipping', data),
}
