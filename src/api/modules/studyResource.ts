import api from '../index'
import { API } from '#/global'

export default {
  queryStudyResource: (data: API.QueryStudyResourceBody) => api.post<API.QueryStudyResourceResponse>('studyResource/list', data),
  deleteStudyResource: (data: { id: number }) => api.post('studyResource/delete', data),
  updateStudyResource: (data: API.UpdateStudyResourceBody) => api.post('studyResource/update', data),
  createStudyResource: (data: API.CreateStudyResourceBody) => api.post('studyResource/create', data),
}
