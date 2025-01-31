<route lang="yaml">
meta:
  title: 学习视频管理
</route>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import ApiStudyResource from '@/api/modules/studyResource'
import { utcToShanghaiTime } from '@/utils/utcformatTime'
import { STUDY_RESOURCE_LEVEL_OPTIONS, STUDY_RESOURCE_LEVEL_MAP, STUDY_RESOURCE_CATEGORY_OPTIONS, STUDY_RESOURCE_CATEGORY_MAP } from '@/constants/index'
import { useDictStore } from '@/store/modules/dict'


import { API } from '#/global'

const formRef = ref<FormInstance>()
const total = ref(0)
const visible = ref(false)
const loading = ref(false)
const uploadUrl = ref(`${import.meta.env.VITE_APP_API_BASEURL}/upload/file`)
const dictStore = useDictStore()
const studyResouceCategoryDictMap = computed(() => dictStore.dictMap && dictStore.dictMap['study_resource_category'])
const studyResouceLevelDictMap = computed(() => dictStore.dictMap && dictStore.dictMap['study_resource_level'])

const formInline = reactive<API.QueryStudyResourceBody>({
  name: '',
  page: 1,
  size: 10,
  level: 0,
  category: 0
})

const formStudyResourceRef = ref<FormInstance>()
const activeStudyResourceId = ref(0)
const activeStudyResource = ref<API.StudyResource | null>(null)
let formStudyResource = ref<API.StudyResource>({
  name: '',
  intro: '',
  level: 0,
  category: 0,
  src: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写资源名称', trigger: 'blur' }],
  intro: [{ required: true, message: '请填写资源描述', trigger: 'blur' }],
  src: [{ required: true, message: '请填写资源地址', trigger: 'blur' }],
  level: [{ required: true, message: '请选择资源等级', trigger: 'change' }],
  category: [{ required: true, message: '请选择资源分类', trigger: 'change' }]
})

const tableData = ref<API.StudyResource[]>([])

const dialogTitle = computed(() => {
  return activeStudyResourceId.value ? '更新资源' : '新增资源'
})

const dialogButton = computed(() => {
  return activeStudyResourceId.value ? '确认更新' : '确认新增'
})

const createStudyResouce = () => {
  activeStudyResourceId.value = 0
  formStudyResource.value = {
    name: '',
    intro: '',
    level: 0,
    category: 0,
    src: ''
  }
  visible.value = true
}

async function queryStudyResourceList() {
  try {
    loading.value = true
    const res = await ApiStudyResource.queryStudyResource(formInline)
    const { data, total: totalNum } = res.data
    loading.value = false

    total.value = totalNum
    tableData.value = data
  }
  catch (error) {
    loading.value = false
  }
}

function handleUpdateStudyResource(row: API.StudyResource) {
  activeStudyResourceId.value = row.id!
  activeStudyResource.value = row
  formStudyResource.value = { ...row }
  visible.value = true
}

function handlerCloseDialog(formEl: FormInstance | undefined) {
  activeStudyResourceId.value = 0
  formEl?.resetFields()
}

async function handleDeleteStudyResource(row: any) {
  await ApiStudyResource.deleteStudyResource({ id: row.id })
  ElMessage.success('删除资源成功')
  queryStudyResourceList()
}

function handlerReset(formEl: FormInstance | undefined) {
  formEl?.resetFields()
  queryStudyResourceList()
}

const handleVideoUploadSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  formStudyResource.value.src = response.data
}

const beforeVideoUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log('rawFile', rawFile)
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']

  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('当前系统仅支持 MP4、WebM、MOV 和 Ogg 格式的视频!')
    return false
  }

  else if (rawFile.size / 1024 / 1024 > 100) {
    ElMessage.error('当前限制文件最大不超过 100MB!')
    return false
  }
  return true
}

function handlerSubmit(formEl: FormInstance | undefined) {
  formEl?.validate(async (valid) => {
    if (valid) {
      if (activeStudyResourceId.value) {
        await ApiStudyResource.updateStudyResource({ id: activeStudyResourceId.value, ...formStudyResource.value })
        ElMessage({ type: 'success', message: '更新资源成功！' })
      }
      else {
        await ApiStudyResource.createStudyResource(formStudyResource.value as API.CreateStudyResourceBody)
        ElMessage({ type: 'success', message: '创建新资源成功！' })
      }
      visible.value = false
      queryStudyResourceList()
    }
  })
}
onMounted(() => {
  queryStudyResourceList()
})
</script>

<template>
  <div>
    <page-main>
      <el-alert :closable="false" show-icon title="资源说明" description="你创建的为系统资源，请慎重调整资源信息，以免造成不必要的误解。" type="success" />
    </page-main>
    <page-main>
      <el-form ref="formRef" :inline="true" :model="formInline">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="formInline.name" placeholder="资源名称[模糊搜索]"
            @keydown.enter.prevent="queryStudyResourceList" />
        </el-form-item>
        <el-form-item style="width: 200px;" label="资源等级" prop="level">
          <el-select v-model="formInline.level" placeholder="请选择资源等级" clearable>
            <el-option v-for="item in studyResouceLevelDictMap" :key="item.value" :label="item.label"
              :value="Number(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item style="width: 200px;" label="资源分类" prop="category">
          <el-select v-model="formInline.category" placeholder="请选择资源分类" clearable>
            <el-option v-for="item in studyResouceCategoryDictMap" :key="item.value" :label="item.label"
              :value="Number(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryStudyResourceList">
            查询
          </el-button>
          <el-button @click="handlerReset(formRef)">
            重置
          </el-button>
        </el-form-item>
        <el-button type="success" style="float: right;" @click="createStudyResouce">
          创建资源
          <el-icon class="ml-3">
            <Plus />
          </el-icon>
        </el-button>
      </el-form>
    </page-main>

    <page-main style="width: 100%;">
      <el-table v-loading="loading" border :data="tableData" style="width: 100%;" size="large">
        <el-table-column prop="src" label="资源地址" width="120">
          <template #default="scope">
            <el-link :href="scope.row.src" target="_blank">{{ scope.row.src }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="资源名称" />
        <el-table-column prop="level" label="资源等级">
          <template #default="scope">
            <el-tag>
              {{ studyResouceLevelDictMap?.find((item) => Number(item.value) === scope.row.level)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="资源分类">
          <template #default="scope">
            <el-tag>
              {{ studyResouceCategoryDictMap?.find((item) => Number(item.value) === scope.row.category)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop=" intro" label="描述信息" width="300" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleUpdateStudyResource(scope.row)">
              编辑
            </el-button>
            <el-popconfirm title="确认删除此资源么?" width="200" icon-color="red"
              @confirm="handleDeleteStudyResource(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">
                  删除资源
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="flex justify-end mt-5">
        <el-pagination v-model:current-page="formInline.page" v-model:page-size="formInline.size" class="mr-5"
          :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="queryStudyResourceList" @current-change="queryStudyResourceList" />
      </el-row>
    </page-main>
    <el-dialog v-model="visible" :close-on-click-modal="false" :title="dialogTitle" width="570"
      @close="handlerCloseDialog(formStudyResourceRef)">
      <el-form ref="formStudyResourceRef" label-position="right" label-width="100px" :model="formStudyResource"
        :rules="rules">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="formStudyResource.name" placeholder="请填写资源名称" />
        </el-form-item>
        <el-form-item label="资源等级" prop="level">
          <el-select v-model="formStudyResource.level" placeholder="请选择资源等级">
            <el-option v-for="item in studyResouceLevelDictMap" :key="item.value" :label="item.label"
              :value="Number(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源分类" prop="category">
          <el-select v-model="formStudyResource.category" placeholder="请选择资源分类">
            <el-option v-for="item in studyResouceCategoryDictMap" :key="item.value" :label="item.label"
              :value="Number(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源地址" prop="src">
          <el-upload class="video-uploader" :action="uploadUrl" :show-file-list="false"
            :on-success="handleVideoUploadSuccess" :before-upload="beforeVideoUpload">
            <el-button>上传视频</el-button>
            <video controls width="250" v-if="formStudyResource.src" :src="formStudyResource.src"></video>
          </el-upload>
        </el-form-item>
        <el-form-item label="资源描述" prop="intro">
          <el-input v-model="formStudyResource.intro" type="textarea" placeholder="请填写资源介绍信息、用于对外展示..." :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex justify-end mr-5">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handlerSubmit(formStudyResourceRef)">
            {{ dialogButton }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
