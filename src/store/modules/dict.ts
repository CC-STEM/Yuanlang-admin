import { defineStore } from "pinia";
// import type { QueryDictMapRes, DictState } from '../types'
import apiDictData from '@/api/modules/dictData'
import { API } from '#/global'

export const useDictStore = defineStore("dict-store", () => {
  const dictMap = ref<API.DictState | null>(null);
  const fetchDictMap = async () => {
    const { data } = await apiDictData.queryDictMap();
    dictMap.value = data;
    console.log('dictMap', dictMap)
  }

  fetchDictMap()
  return {
    dictMap
  }
})
