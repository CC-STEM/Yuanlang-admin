import api from '../index'
import { API } from '#/global'

export default {
  queryActivity: (data: API.QueryActivityBody) => api.post<API.QueryActivityResponse>('activityConfig/queryActivityConfig', data),
  deleteActivity: (data: { id: number }) => api.post('activityConfig/deleteActivityConfig', data),
  updateActivity: (data: API.UpdateActivityBody) => api.post('activityConfig/updateActivityConfig', data),
  createActivity: (data: API.CreateActivityBody) => api.post('activityConfig/createActivityConfig', data),
}
