<route lang="yaml">
meta:
  title: 活动管理
</route>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import ApiActivity from '@/api/modules/activity'
import { utcToShanghaiTime } from '@/utils/utcformatTime'
import { ACTIVITY_STATUS_OPTIONS, ACTIVITY_STATUS_MAP } from '@/constants/index'

import { API } from '#/global'

const formRef = ref<FormInstance>()
const total = ref(0)
const visible = ref(false)
const loading = ref(false)
const uploadUrl = ref(`${import.meta.env.VITE_APP_API_BASEURL}/upload/file`)

const formInline = reactive<API.QueryActivityBody>({
  name: '',
  page: 1,
  size: 10,
  status: 0
})

const formActivityRef = ref<FormInstance>()
const activeActivityId = ref(0)
const activeActivity = ref<API.Activity | null>(null)
let formActivity = reactive<API.Activity>({
  name: '',
  intro: '',
  category: 0,
  coverImg: '',
  activityRewards: '',
  startTime: '',
  endTime: '',
  status: 0
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写活动名称', trigger: 'blur' }],
  intro: [{ required: true, message: '请填写活动描述', trigger: 'blur' }],
  coverImg: [{ required: false, message: '请填写活动封面图片地址', trigger: 'blur' }],
  activityRewards: [{ required: true, message: '请填写活动奖励', trigger: 'blur' }],
  startTime: [{ required: true, message: '请填写活动开始时间', trigger: 'blur' }],
  endTime: [{ required: true, message: '请填写活动结束时间', trigger: 'blur' }],
  status: [{ required: true, message: '请选择活动状态', trigger: 'change' }]
})

const tableData = ref<API.Activity[]>([])

const dialogTitle = computed(() => {
  return activeActivityId.value ? '更新活动' : '新增活动'
})

const dialogButton = computed(() => {
  return activeActivityId.value ? '确认更新' : '确认新增'
})

async function queryActivityList() {
  try {
    loading.value = true
    const res = await ApiActivity.queryActivity(formInline)
    const { data, total: totalNum } = res.data
    loading.value = false

    total.value = totalNum
    tableData.value = data
  }
  catch (error) {
    loading.value = false
  }
}

function handleUpdateActivity(row: API.Activity) {
  activeActivityId.value = row.id!
  activeActivity.value = row
  formActivity = row
  visible.value = true
}

function handlerCloseDialog(formEl: FormInstance | undefined) {
  activeActivityId.value = 0
  formEl?.resetFields()
}

async function handleDeleteActivity(row: any) {
  await ApiActivity.deleteActivity({ id: row.id })
  ElMessage.success('删除活动成功')
  queryActivityList()
}

function handlerReset(formEl: FormInstance | undefined) {
  formEl?.resetFields()
  queryActivityList()
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  formActivity.coverImg = response.data
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']

  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('当前系统仅支持 PNG、JPEG、GIF、和 WebP 格式的图片!')
    return false
  }

  else if (rawFile.size / 1024 > 300) {
    ElMessage.error('当前限制文件最大不超过 300KB!')
    return false
  }
  return true
}

function handlerSubmit(formEl: FormInstance | undefined) {
  formEl?.validate(async (valid) => {
    if (valid) {
      if (activeActivityId.value) {
        await ApiActivity.updateActivity({ id: activeActivityId.value, ...formActivity })
        ElMessage({ type: 'success', message: '更新活动成功！' })
      }
      else {
        await ApiActivity.createActivity(formActivity as API.CreateActivityBody)
        ElMessage({ type: 'success', message: '创建新活动成功！' })
      }
      visible.value = false
      queryActivityList()
    }
  })
}
onMounted(() => {
  queryActivityList()
})
</script>

<template>
  <div>
    <page-main>
      <el-alert :closable="false" show-icon title="活动说明" description="你创建的为系统活动，请慎重调整活动信息，以免造成不必要的误解。" type="success" />
    </page-main>
    <page-main>
      <el-form ref="formRef" :inline="true" :model="formInline">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="formInline.name" placeholder="活动名称[模糊搜索]" @keydown.enter.prevent="queryActivityList" />
        </el-form-item>
        <el-form-item style="width: 200px;" label="活动状态" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择活动状态" clearable>
            <el-option v-for="item in ACTIVITY_STATUS_OPTIONS" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryActivityList">
            查询
          </el-button>
          <el-button @click="handlerReset(formRef)">
            重置
          </el-button>
        </el-form-item>
        <el-button type="success" style="float: right;" @click="visible = true">
          创建活动
          <el-icon class="ml-3">
            <Plus />
          </el-icon>
        </el-button>
      </el-form>
    </page-main>

    <page-main style="width: 100%;">
      <el-table v-loading="loading" border :data="tableData" style="width: 100%;" size="large">
        <el-table-column prop="coverImg" label="活动封面" width="120">
          <template #default="scope">
            <el-image style="height: 50px;" :src="scope.row.coverImg" fit="fill" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="活动名称" />
        <el-table-column prop="category" label="参与方式" />
        <el-table-column prop="activityRewards" label="活动奖励" />
        <el-table-column prop="status" label="活动状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ ACTIVITY_STATUS_MAP[scope.row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="intro" label="描述信息" width="300" />
        <el-table-column prop="startTime" label="开始时间" width="200">
          <template #default="scope">
            {{ utcToShanghaiTime(scope.row.startTime, 'YYYY-MM-DD hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="200">
          <template #default="scope">
            {{ utcToShanghaiTime(scope.row.endTime, 'YYYY-MM-DD hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleUpdateActivity(scope.row)">
              编辑
            </el-button>
            <el-popconfirm title="确认删除此活动么?" width="200" icon-color="red" @confirm="handleDeleteActivity(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">
                  删除活动
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="flex justify-end mt-5">
        <el-pagination v-model:current-page="formInline.page" v-model:page-size="formInline.size" class="mr-5"
          :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="queryActivityList" @current-change="queryActivityList" />
      </el-row>
    </page-main>
    <el-dialog v-model="visible" :close-on-click-modal="false" :title="dialogTitle" width="570"
      @close="handlerCloseDialog(formActivityRef)">
      <el-form ref="formActivityRef" label-position="right" label-width="100px" :model="formActivity" :rules="rules">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="formActivity.name" placeholder="请填写活动名称" />
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <el-switch v-model="formActivity.status" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="活动封面" prop="coverImg">
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="formActivity.coverImg" :src="formActivity.coverImg" style="width: 100px;" class="avatar">
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="活动描述" prop="intro">
          <el-input v-model="formActivity.intro" type="textarea" placeholder="请填写活动介绍信息、用于对外展示..." :rows="4" />
        </el-form-item>
        <el-form-item label="活动奖励" prop="activityRewards">
          <el-input v-model="formActivity.activityRewards" type="textarea" placeholder="请填写活动奖励" :rows="4" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="formActivity.startTime" type="datetime" placeholder="请选择开始时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="formActivity.endTime" type="datetime" placeholder="请选择结束时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex justify-end mr-5">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handlerSubmit(formActivityRef)">
            {{ dialogButton }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
