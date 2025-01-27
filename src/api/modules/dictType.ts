import api from '../index'
import { API } from '#/global'

export default {
  queryDictType: (data: API.QueryDictTypeBody) => api.post<API.QueryDictTypeResponse>('dictType/list', data),
  deleteDictType: (data: { id: number }) => api.post('dictType/delete', data),
  updateDictType: (data: API.UpdateDictTypeBody) => api.post('dictType/update', data),
  createDictType: (data: API.CreateDictTypeBody) => api.post('dictType/create', data),
}
