import api from '../index'
import { API } from '#/global'

export default {
  queryDictData: (data: API.QueryDictDataBody) => api.post<API.QueryDictDataResponse>('dictData/list', data),
  deleteDictData: (data: { id: number }) => api.post('dictData/delete', data),
  updateDictData: (data: API.UpdateDictDataBody) => api.post('dictData/update', data),
  createDictData: (data: API.CreateDictDataBody) => api.post('dictData/create', data),
}
