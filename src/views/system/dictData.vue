<route lang="yaml">
meta:
  title: 字典值管理
</route>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import ApiDictData from '@/api/modules/dictData'
const route = useRoute()

const query = route.query

import { API } from '#/global'

const formRef = ref<FormInstance>()
const total = ref(0)
const visible = ref(false)
const loading = ref(false)

const formInline = reactive<API.QueryDictDataBody>({
  label: '',
  status: 0,
  type: query.type as string,
  page: 1,
  size: 10
})

const formDictDataRef = ref<FormInstance>()
const activeDictDataId = ref(0)
const activeDictData = ref<API.DictData | null>(null)
let formDictData = ref<API.DictData>({
  label: '',
  value: '',
  type: '',
  status: 0,
  remark: ''
})

const rules = reactive<FormRules>({
  label: [{ required: true, message: '请填写字典标签', trigger: 'blur' }],
  value: [{ required: true, message: '请填写字典键值', trigger: 'blur' }],
  type: [{ required: true, message: '请填写字典类型', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ required: false, message: '请填写备注', trigger: 'blur' }]
})

const tableData = ref<API.DictData[]>([])

const dialogTitle = computed(() => {
  return activeDictDataId.value ? '更新字典值' : '新增字典值'
})

const dialogButton = computed(() => {
  return activeDictDataId.value ? '确认更新' : '确认新增'
})

async function queryDictDataList() {
  try {
    loading.value = true
    const res = await ApiDictData.queryDictData(formInline)
    const { data, total: totalNum } = res.data
    loading.value = false

    total.value = totalNum
    tableData.value = data.map(item => ({
      ...item,
      type: item.dictType?.type
    }))
  }
  catch (error) {
    loading.value = false
  }
}

function handleUpdateDictData(row: API.DictData) {
  activeDictDataId.value = row.id!
  activeDictData.value = row
  formDictData.value = row
  visible.value = true
}

const handleCreateDictData = () => {
  visible.value = true
  formDictData.value = {
    label: '',
    value: '',
    type: '',
    status: 0,
    remark: ''
  }
}

function handlerCloseDialog(formEl: FormInstance | undefined) {
  activeDictDataId.value = 0
  formEl?.resetFields()
}

async function handleDeleteDictData(row: any) {
  await ApiDictData.deleteDictData({ id: row.id })
  ElMessage.success('删除字典值成功')
  queryDictDataList()
}

function handlerReset(formEl: FormInstance | undefined) {
  formEl?.resetFields()
  queryDictDataList()
}

function handlerSubmit(formEl: FormInstance | undefined) {
  formEl?.validate(async (valid) => {
    if (valid) {
      if (activeDictDataId.value) {
        await ApiDictData.updateDictData({ id: activeDictDataId.value, ...formDictData.value })
        ElMessage({ type: 'success', message: '更新字典值成功！' })
      }
      else {
        await ApiDictData.createDictData(formDictData.value as API.CreateDictDataBody)
        ElMessage({ type: 'success', message: '创建新字典值成功！' })
      }
      visible.value = false
      queryDictDataList()
    }
  })
}
onMounted(() => {
  queryDictDataList()
})
</script>

<template>
  <div>
    <page-main>
      <el-alert :closable="false" show-icon title="字典值说明" description="你创建的为系统字典值，请慎重调整字典值信息，以免造成不必要的误解。"
        type="success" />
    </page-main>
    <page-main>
      <el-form ref="formRef" :inline="true" :model="formInline">
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="formInline.label" placeholder="字典标签[模糊搜索]" @keydown.enter.prevent="queryDictDataList" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="formInline.type" placeholder="字典类型[模糊搜索]" @keydown.enter.prevent="queryDictDataList" />
        </el-form-item>
        <el-form-item style="width: 200px;" label="状态" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择状态" clearable>
            <el-option v-for="item in [{ value: 0, label: '正常' }, { value: 1, label: '停用' }]" :key="item.value"
              :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryDictDataList">
            查询
          </el-button>
          <el-button @click="handlerReset(formRef)">
            重置
          </el-button>
        </el-form-item>
        <el-button type="success" style="float: right;" @click="handleCreateDictData">
          创建字典值
          <el-icon class="ml-3">
            <Plus />
          </el-icon>
        </el-button>
      </el-form>
    </page-main>

    <page-main style="width: 100%;">
      <el-table v-loading="loading" border :data="tableData" style="width: 100%;" size="large">
        <el-table-column prop="label" label="字典标签" />
        <el-table-column prop="value" label="字典键值" />
        <el-table-column prop="type" label="字典类型" />
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
            <el-button link type="primary" size="small" @click="handleUpdateDictData(scope.row)">
              编辑
            </el-button>
            <el-popconfirm title="确认删除此字典值么?" width="200" icon-color="red" @confirm="handleDeleteDictData(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">
                  删除字典值
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="flex justify-end mt-5">
        <el-pagination v-model:current-page="formInline.page" v-model:page-size="formInline.size" class="mr-5"
          :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="queryDictDataList" @current-change="queryDictDataList" />
      </el-row>
    </page-main>
    <el-dialog v-model="visible" :close-on-click-modal="false" :title="dialogTitle" width="570"
      @close="handlerCloseDialog(formDictDataRef)">
      <el-form ref="formDictDataRef" label-position="right" label-width="100px" :model="formDictData" :rules="rules">
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="formDictData.label" placeholder="请填写字典标签" />
        </el-form-item>
        <el-form-item label="字典键值" prop="value">
          <el-input v-model="formDictData.value" placeholder="请填写字典键值" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="formDictData.type" placeholder="请填写字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formDictData.status" :active-value="0" :inactive-value="1" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formDictData.remark" type="textarea" placeholder="请填写备注" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex justify-end mr-5">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handlerSubmit(formDictDataRef)">
            {{ dialogButton }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
