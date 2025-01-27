<route lang="yaml">
meta:
  title: 字典类型管理
</route>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import ApiDictType from '@/api/modules/dictType'

import { API } from '#/global'

const router = useRouter()
const formRef = ref<FormInstance>()
const total = ref(0)
const visible = ref(false)
const loading = ref(false)

const formInline = reactive<API.QueryDictTypeBody>({
  name: '',
  type: '',
  status: 0,
  page: 1,
  size: 10
})

const formDictTypeRef = ref<FormInstance>()
const activeDictTypeId = ref(0)
const activeDictType = ref<API.DictType | null>(null)
let formDictType = reactive<API.DictType>({
  name: '',
  type: '',
  status: 0,
  remark: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写字典名称', trigger: 'blur' }],
  type: [{ required: true, message: '请填写字典类型', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ required: false, message: '请填写备注', trigger: 'blur' }]
})

const tableData = ref<API.DictType[]>([])

const dialogTitle = computed(() => {
  return activeDictTypeId.value ? '更新字典类型' : '新增字典类型'
})

const dialogButton = computed(() => {
  return activeDictTypeId.value ? '确认更新' : '确认新增'
})

async function queryDictTypeList() {
  try {
    loading.value = true
    const res = await ApiDictType.queryDictType(formInline)
    const { data, total: totalNum } = res.data
    loading.value = false

    total.value = totalNum
    tableData.value = data
  }
  catch (error) {
    loading.value = false
  }
}

function handleUpdateDictType(row: API.DictType) {
  activeDictTypeId.value = row.id!
  activeDictType.value = { ...row }
  formDictType = { ...row }
  visible.value = true
}

function handlerCloseDialog(formEl: FormInstance | undefined) {
  activeDictTypeId.value = 0
  formEl?.resetFields()
}

async function handleDeleteDictType(row: any) {
  await ApiDictType.deleteDictType({ id: row.id })
  ElMessage.success('删除字典类型成功')
  queryDictTypeList()
}

function handlerReset(formEl: FormInstance | undefined) {
  formEl?.resetFields()
  queryDictTypeList()
}

function handlerSubmit(formEl: FormInstance | undefined) {
  formEl?.validate(async (valid) => {
    if (valid) {
      if (activeDictTypeId.value) {
        await ApiDictType.updateDictType({ id: activeDictTypeId.value, ...formDictType })
        ElMessage({ type: 'success', message: '更新字典类型成功！' })
      }
      else {
        await ApiDictType.createDictType(formDictType as API.CreateDictTypeBody)
        ElMessage({ type: 'success', message: '创建新字典类型成功！' })
      }
      visible.value = false
      queryDictTypeList()
    }
  })
}

const handleClickDictType = (row: API.DictType) => {
  router.push({ path: '/system/dictData', query: { type: row.type } })
}

onMounted(() => {
  queryDictTypeList()
})
</script>

<template>
  <div>
    <page-main>
      <el-alert :closable="false" show-icon title="字典类型说明" description="你创建的为系统字典类型，请慎重调整字典类型信息，以免造成不必要的误解。"
        type="success" />
    </page-main>
    <page-main>
      <el-form ref="formRef" :inline="true" :model="formInline">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="formInline.name" placeholder="字典名称[模糊搜索]" @keydown.enter.prevent="queryDictTypeList" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="formInline.type" placeholder="字典类型[模糊搜索]" @keydown.enter.prevent="queryDictTypeList" />
        </el-form-item>
        <el-form-item style="width: 200px;" label="状态" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择状态" clearable>
            <el-option v-for="item in [{ value: 0, label: '正常' }, { value: 1, label: '停用' }]" :key="item.value"
              :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryDictTypeList">
            查询
          </el-button>
          <el-button @click="handlerReset(formRef)">
            重置
          </el-button>
        </el-form-item>
        <el-button type="success" style="float: right;" @click="visible = true">
          创建字典类型
          <el-icon class="ml-3">
            <Plus />
          </el-icon>
        </el-button>
      </el-form>
    </page-main>

    <page-main style="width: 100%;">
      <el-table v-loading="loading" border :data="tableData" style="width: 100%;" size="large">
        <el-table-column prop="name" label="字典名称" />
        <el-table-column prop="type" label="字典类型">
          <template #default="scope">
            <el-link @click="handleClickDictType(scope.row)">{{ scope.row.type }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="300" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleUpdateDictType(scope.row)">
              编辑
            </el-button>
            <el-popconfirm title="确认删除此字典类型么?" width="200" icon-color="red" @confirm="handleDeleteDictType(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">
                  删除字典类型
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="flex justify-end mt-5">
        <el-pagination v-model:current-page="formInline.page" v-model:page-size="formInline.size" class="mr-5"
          :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="queryDictTypeList" @current-change="queryDictTypeList" />
      </el-row>
    </page-main>
    <el-dialog v-model="visible" :close-on-click-modal="false" :title="dialogTitle" width="570"
      @close="handlerCloseDialog(formDictTypeRef)">
      <el-form ref="formDictTypeRef" label-position="right" label-width="100px" :model="formDictType" :rules="rules">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="formDictType.name" placeholder="请填写字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="formDictType.type" placeholder="请填写字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formDictType.status" :active-value="0" :inactive-value="1" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formDictType.remark" type="textarea" placeholder="请填写备注" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex justify-end mr-5">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handlerSubmit(formDictTypeRef)">
            {{ dialogButton }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
