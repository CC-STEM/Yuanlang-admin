<route lang="yaml">
meta:
  title: 实物商品管理
  </route>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import ApiGoods from '@/api/modules/goods'
import { utcToShanghaiTime } from '@/utils/utcformatTime'

import { GOODS_SELL_STATUS_OPTIONS, GOODS_SELL_STATUS_MAP } from '@/constants/index'
import { API } from '#/global'
import { useDictStore } from '@/store/modules/dict'

const formRef = ref<FormInstance>()
const total = ref(0)
const visible = ref(false)
const loading = ref(false)
const uploadUrl = ref(`${import.meta.env.VITE_APP_API_BASEURL}/upload/file`)
const dictStore = useDictStore()
const goodsDictMap = computed(() => dictStore.dictMap && dictStore.dictMap['goods_category'])

const formInline = reactive<API.QueryGoodsBody>({
  name: '',
  page: 1,
  size: 10,
  // sellStatus: 0
})

const formGoodsRef = ref<FormInstance>()
const activeGoodsId = ref(0)
// const activeGoods = ref<API.Goods | null>(null)
let formGoods = ref<API.Goods>({
  name: '',
  intro: '',
  sellStatus: 0,
  coverImg: '',
  detail: '',
  originalPrice: 1,
  sellingPrice: 1,
  stockNum: 1,
  category: 0
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
  intro: [{ required: true, message: '请填写商品描述', trigger: 'blur' }],
  coverImg: [{ required: false, message: '请填写商品封面图片地址', trigger: 'blur' }],
  detail: [{ required: false, message: '请填写商品详情', trigger: 'blur' }],
  sellStatus: [{ required: true, message: '请选择商品上架状态', trigger: 'change' }],
  originalPrice: [{ required: true, message: '请填写商品原价', trigger: 'blur' }],
  sellingPrice: [{ required: true, message: '请填写商品实际售价', trigger: 'blur' }],
  stockNum: [{ required: true, message: '请填写商品库存数量', trigger: 'blur' }]
})

const tableData = ref<API.Goods[]>([])

const dialogTitle = computed(() => {
  return activeGoodsId.value ? '更新商品' : '新增商品'
})

const dialogButton = computed(() => {
  return activeGoodsId.value ? '确认更新' : '确认新增'
})

async function queryGoodsList() {
  try {
    loading.value = true
    const res = await ApiGoods.queryGoods(formInline)
    const { data, total: totalNum } = res.data
    loading.value = false

    total.value = totalNum
    tableData.value = data
  }
  catch (error) {
    loading.value = false
  }
}

function handleUpdateGoods(row: API.Goods) {
  activeGoodsId.value = row.id!
  // activeGoods.value = row
  formGoods.value = { ...row }
  // const { name, status, des, order, coverImg } = row
  // nextTick(() => {
  //   Object.assign(formGoods, { name, status, des, order, coverImg })
  // })
  visible.value = true
}

function handlerCloseDialog(formEl: FormInstance | undefined) {
  activeGoodsId.value = 0
  formEl?.resetFields()
}

async function handleDeleteGoods(row: any) {
  await ApiGoods.deleteGoods({ id: row.id })
  ElMessage.success('删除分类成功')
  queryGoodsList()
}

function handlerReset(formEl: FormInstance | undefined) {
  formEl?.resetFields()
  queryGoodsList()
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  formGoods.value.coverImg = response.data
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
      if (activeGoodsId.value) {
        await ApiGoods.updateGoods({ id: activeGoodsId.value, ...formGoods.value })
        ElMessage({ type: 'success', message: '更新商品成功！' })
      }
      else {
        await ApiGoods.createGoods(formGoods.value as API.CreateGoodsBody)
        ElMessage({ type: 'success', message: '创建新商品成功！' })
      }
      visible.value = false
      queryGoodsList()
    }
  })
}
onMounted(() => {
  queryGoodsList()
})
</script>

<template>
  <div>
    <page-main>
      <el-alert :closable="false" show-icon title="商品说明" description="你创建的为系统商品，该商品可能被用户下单购买，请慎重调整商品信息，以免造成不必要的误解。"
        type="success" />
    </page-main>
    <page-main>
      <el-form ref="formRef" :inline="true" :model="formInline">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formInline.name" placeholder="商品名称[模糊搜索]" @keydown.enter.prevent="queryGoodsList" />
        </el-form-item>
        <el-form-item style="width: 200px;" label="上架状态" prop="sellStatus">
          <el-select v-model="formInline.sellStatus" placeholder="请选择商品上架状态" clearable>
            <el-option v-for="item in GOODS_SELL_STATUS_OPTIONS" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryGoodsList">
            查询
          </el-button>
          <el-button @click="handlerReset(formRef)">
            重置
          </el-button>
        </el-form-item>
        <el-button type="success" style="float: right;" @click="visible = true">
          创建商品
          <el-icon class="ml-3">
            <Plus />
          </el-icon>
        </el-button>
      </el-form>
    </page-main>

    <page-main style="width: 100%;">
      <el-table v-loading="loading" border :data="tableData" style="width: 100%;" size="large">
        <el-table-column prop="coverImg" label="商品封面" width="120">
          <template #default="scope">
            <el-image style="height: 50px;" :src="scope.row.coverImg" fit="fill" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="category" label="商品分类">
          <template #default="scope">
            {{ goodsDictMap?.find(item => Number(item.value) === scope.row.category)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="stockNum" label="库存数量" />
        <el-table-column prop="originalPrice" label="原价" />
        <el-table-column prop="sellingPrice" label="实际售价" />
        <el-table-column prop="status" label="上架状态">
          <template #default="scope">
            <el-tag :type="scope.row.sellStatus === 1 ? 'success' : 'danger'">
              {{ GOODS_SELL_STATUS_MAP[scope.row.sellStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="intro" label="描述信息" width="300" />
        <el-table-column prop="createdAt" label="创建时间" width="200">
          <template #default="scope">
            {{ utcToShanghaiTime(scope.row.createdAt, 'YYYY-MM-DD hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleUpdateGoods(scope.row)">
              编辑
            </el-button>
            <el-popconfirm title="确认删除此商品么?" width="200" icon-color="red" @confirm="handleDeleteGoods(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">
                  删除商品
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="flex justify-end mt-5">
        <el-pagination v-model:current-page="formInline.page" v-model:page-size="formInline.size" class="mr-5"
          :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="queryGoodsList" @current-change="queryGoodsList" />
      </el-row>
    </page-main>
    <el-dialog v-model="visible" :close-on-click-modal="false" :title="dialogTitle" width="570"
      @close="handlerCloseDialog(formGoodsRef)">
      <el-form ref="formGoodsRef" label-position="right" label-width="100px" :model="formGoods" :rules="rules">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formGoods.name" placeholder="请填写商品名称" />
        </el-form-item>
        <el-form-item label="商品类别" prop="category">
          <el-select v-model="formGoods.category">
            <el-option v-for="item in goodsDictMap" :key="item.value" :label="item.label"
              :value="Number(item.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品上架状态" prop="status">
          <el-switch v-model="formGoods.sellStatus" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <!-- <el-form-item label="封面图地址" prop="coverImg">
          <el-input v-model="formGoods.coverImg" placeholder="请填写封面图地址" />
        </el-form-item> -->

        <el-form-item label="商品封面" prop="coverImg">
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="formGoods.coverImg" :src="formGoods.coverImg" style="width: 100px;" class="avatar">
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <!-- <el-form-item label="排序ID" prop="order">
          <el-input v-model.number="formGoods.order" placeholder="请填写排序ID[数字越大越靠前]" />
        </el-form-item> -->
        <el-form-item label="商品描述" prop="intro">
          <el-input v-model="formGoods.intro" type="textarea" placeholder="请填写分类介绍信息、用于对外展示..." :rows="4" />
        </el-form-item>
        <el-form-item label="商品详情" prop="detail">
          <el-input v-model="formGoods.detail" type="textarea" placeholder="请填写商品详情" :rows="4" />
        </el-form-item>
        <el-form-item label="商品原价" prop="originalPrice">
          <!-- <el-input v-model.number="formGoods.originalPrice" placeholder="请填写商品原价" /> -->
          <el-input-number v-model="formGoods.originalPrice" :precision="2" :step="0.1" placeholder="请填写商品原价" />
        </el-form-item>
        <el-form-item label="商品实际售价" prop="sellingPrice">
          <!-- <el-input v-model.number="formGoods.sellingPrice" placeholder="请填写商品实际售价" /> -->
          <el-input-number v-model="formGoods.sellingPrice" :precision="2" :step="0.1" placeholder="请填写商品实际售价" />
        </el-form-item>
        <el-form-item label="商品库存" prop="stockNum">
          <el-input v-model.number="formGoods.stockNum" placeholder="商品库存数量"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex justify-end mr-5">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handlerSubmit(formGoodsRef)">
            {{ dialogButton }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
