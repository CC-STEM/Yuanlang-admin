<route lang="yaml">
meta:
  title: 订单管理（新）
</route>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import ApiGoodsOrder from '@/api/modules/goodsOrder'
import { NEW_ORDER_STATUS_OPTIONS, NEW_ORDER_STATUS_MAP } from '@/constants'
import { NEW_PAY_STATUS_OPTIONS, NEW_PAY_STATUS_MAP } from '@/constants/index'

import { API } from '#/global'

const formRef = ref<FormInstance>()
const total = ref(0)
const visible = ref(false)
const loading = ref(false)

const formInline = reactive<API.QueryGoodsOrderBody>({
  orderNo: undefined,
  userId: undefined,
  status: undefined,
  page: 1,
  size: 10
})

const formGoodsOrderRef = ref<FormInstance>()
const activeGoodsOrderId = ref(0)
const activeGoodsOrder = ref<API.GoodsOrder | null>(null)
let formGoodsOrder = reactive<API.GoodsOrder>({
  orderNo: '',
  payPlatform: '',
  channel: '',
  userId: undefined,
  total: undefined,
  payStatus: undefined,
  status: undefined,
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  expressTrackingNo: '',
  shippingTime: '',
  completeTime: '',
  applyAfterSaleTime: '',
  closeTime: ''
})

const rules = reactive<FormRules>({
  orderNo: [{ required: true, message: '请填写订单号', trigger: 'blur' }],
  payPlatform: [{ required: true, message: '请填写支付平台', trigger: 'blur' }],
  channel: [{ required: true, message: '请填写支付渠道', trigger: 'blur' }],
  userId: [{ required: true, message: '请填写用户ID', trigger: 'blur' }],
  total: [{ required: true, message: '请填写订单总金额', trigger: 'blur' }],
  payStatus: [{ required: true, message: '请选择支付状态', trigger: 'change' }],
  status: [{ required: true, message: '请选择订单状态', trigger: 'change' }],
  receiverName: [{ required: true, message: '请填写收货人姓名', trigger: 'blur' }],
  receiverPhone: [{ required: true, message: '请填写收货人电话', trigger: 'blur' }],
  receiverAddress: [{ required: true, message: '请填写收货人地址', trigger: 'blur' }],
  expressTrackingNo: [{ required: false, message: '请填写快递单号', trigger: 'blur' }],
  shippingTime: [{ required: false, message: '请填写发货时间', trigger: 'blur' }],
  completeTime: [{ required: false, message: '请填写完成时间', trigger: 'blur' }],
  applyAfterSaleTime: [{ required: false, message: '请填写申请售后时间', trigger: 'blur' }],
  closeTime: [{ required: false, message: '请填写关闭时间', trigger: 'blur' }]
})

const tableData = ref<API.GoodsOrder[]>([])

const dialogTitle = computed(() => {
  return activeGoodsOrderId.value ? '更新订单' : '新增订单'
})

const dialogButton = computed(() => {
  return activeGoodsOrderId.value ? '确认更新' : '确认新增'
})

async function queryGoodsOrderList() {
  try {
    loading.value = true
    const res = await ApiGoodsOrder.queryGoodsOrder(formInline)
    const { data, total: totalNum } = res.data
    loading.value = false

    total.value = totalNum
    tableData.value = data
  }
  catch (error) {
    loading.value = false
  }
}

function handleUpdateGoodsOrder(row: API.GoodsOrder) {
  activeGoodsOrderId.value = row.id!
  activeGoodsOrder.value = row
  formGoodsOrder = row
  visible.value = true
}

function handlerCloseDialog(formEl: FormInstance | undefined) {
  activeGoodsOrderId.value = 0
  formEl?.resetFields()
}

async function handleDeleteGoodsOrder(row: any) {
  await ApiGoodsOrder.deleteGoodsOrder({ orderNo: row.orderNo })
  ElMessage.success('删除订单成功')
  queryGoodsOrderList()
}

function handlerReset(formEl: FormInstance | undefined) {
  formEl?.resetFields()
  queryGoodsOrderList()
}

function handlerSubmit(formEl: FormInstance | undefined) {
  formEl?.validate(async (valid) => {
    if (valid) {
      if (activeGoodsOrderId.value) {
        // TODO: 更新订单状态成功
        // await ApiGoodsOrder.updateGoodsOrder({ orderNo: activeGoodsOrderId.value, ...formGoodsOrder })
        ElMessage({ type: 'success', message: '更新订单成功！' })
      }
      else {
        await ApiGoodsOrder.createGoodsOrder(formGoodsOrder as API.CreateGoodsOrderBody)
        ElMessage({ type: 'success', message: '创建新订单成功！' })
      }
      visible.value = false
      queryGoodsOrderList()
    }
  })
}
onMounted(() => {
  queryGoodsOrderList()
})
</script>

<template>
  <div>
    <page-main>
      <el-alert :closable="false" show-icon title="订单说明" description="你创建的为系统订单，请慎重调整订单信息，以免造成不必要的误解。" type="success" />
    </page-main>
    <page-main>
      <el-form ref="formRef" :inline="true" :model="formInline">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="formInline.orderNo" placeholder="订单号[模糊搜索]" @keydown.enter.prevent="queryGoodsOrderList" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userName">
          <el-input v-model="formInline.userId" placeholder="用户ID[模糊搜索]" @keydown.enter.prevent="queryGoodsOrderList" />
        </el-form-item>
        <el-form-item style="width: 200px;" label="订单状态" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择订单状态" clearable>
            <el-option v-for="item in NEW_ORDER_STATUS_OPTIONS" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryGoodsOrderList">
            查询
          </el-button>
          <el-button @click="handlerReset(formRef)">
            重置
          </el-button>
        </el-form-item>
        <!-- <el-button type="success" style="float: right;" @click="visible = true">
          创建订单
          <el-icon class="ml-3">
            <Plus />
          </el-icon>
        </el-button> -->
      </el-form>
    </page-main>

    <page-main style="width: 100%;">
      <el-table v-loading="loading" border :data="tableData" style="width: 100%;" size="large">
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="payPlatform" label="支付平台" />
        <el-table-column prop="channel" label="支付渠道" />
        <el-table-column prop="userId" label="用户ID" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="total" label="订单总金额" />
        <el-table-column prop="payStatus" label="支付状态">
          <template #default="scope">
            <el-tag :type="scope.row.payStatus === 1 ? 'success' : scope.row.payStatus === -1 ? 'danger' : 'warning'">
              {{ scope.row.payStatus === 1 ? '已支付' : scope.row.payStatus === -1 ? '支付失败' : '未支付' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template #default="scope">
            <el-tag :type="'success'">
              {{ NEW_ORDER_STATUS_MAP[scope.row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="receiverName" label="收货人姓名" />
        <el-table-column prop="receiverPhone" label="收货人电话" />
        <el-table-column prop="receiverAddress" label="收货人地址" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleUpdateGoodsOrder(scope.row)">
              编辑
            </el-button>
            <el-popconfirm title="确认删除此订单么?" width="200" icon-color="red" @confirm="handleDeleteGoodsOrder(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">
                  删除订单
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="flex justify-end mt-5">
        <el-pagination v-model:current-page="formInline.page" v-model:page-size="formInline.size" class="mr-5"
          :page-sizes="[10, 20, 30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="queryGoodsOrderList" @current-change="queryGoodsOrderList" />
      </el-row>
    </page-main>
    <el-dialog v-model="visible" :close-on-click-modal="false" :title="dialogTitle" width="570"
      @close="handlerCloseDialog(formGoodsOrderRef)">
      <el-form ref="formGoodsOrderRef" label-position="right" label-width="100px" :model="formGoodsOrder"
        :rules="rules">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="formGoodsOrder.orderNo" placeholder="请填写订单号" />
        </el-form-item>
        <el-form-item label="支付平台" prop="payPlatform">
          <el-input v-model="formGoodsOrder.payPlatform" placeholder="请填写支付平台" />
        </el-form-item>
        <el-form-item label="支付渠道" prop="channel">
          <el-input v-model="formGoodsOrder.channel" placeholder="请填写支付渠道" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formGoodsOrder.userId" placeholder="请填写用户ID" />
        </el-form-item>
        <el-form-item label="订单总金额" prop="total">
          <el-input v-model="formGoodsOrder.total" placeholder="请填写订单总金额" />
        </el-form-item>
        <el-form-item label="支付状态" prop="payStatus">
          <el-select v-model="formGoodsOrder.payStatus" placeholder="请选择支付状态">
            <el-option v-for="item in NEW_PAY_STATUS_OPTIONS" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="formGoodsOrder.status" placeholder="请选择订单状态">
            <el-option v-for="item in NEW_ORDER_STATUS_OPTIONS" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货人姓名" prop="receiverName">
          <el-input v-model="formGoodsOrder.receiverName" placeholder="请填写收货人姓名" />
        </el-form-item>
        <el-form-item label="收货人电话" prop="receiverPhone">
          <el-input v-model="formGoodsOrder.receiverPhone" placeholder="请填写收货人电话" />
        </el-form-item>
        <el-form-item label="收货人地址" prop="receiverAddress">
          <el-input v-model="formGoodsOrder.receiverAddress" placeholder="请填写收货人地址" />
        </el-form-item>
        <el-form-item label="快递单号" prop="expressTrackingNo">
          <el-input v-model="formGoodsOrder.expressTrackingNo" placeholder="请填写快递单号" />
        </el-form-item>
        <el-form-item label="发货时间" prop="shippingTime">
          <el-date-picker v-model="formGoodsOrder.shippingTime" type="datetime" placeholder="请选择发货时间" />
        </el-form-item>
        <el-form-item label="完成时间" prop="completeTime">
          <el-date-picker v-model="formGoodsOrder.completeTime" type="datetime" placeholder="请选择完成时间" />
        </el-form-item>
        <el-form-item label="申请售后时间" prop="applyAfterSaleTime">
          <el-date-picker v-model="formGoodsOrder.applyAfterSaleTime" type="datetime" placeholder="请选择申请售后时间" />
        </el-form-item>
        <el-form-item label="关闭时间" prop="closeTime">
          <el-date-picker v-model="formGoodsOrder.closeTime" type="datetime" placeholder="请选择关闭时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex justify-end mr-5">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handlerSubmit(formGoodsOrderRef)">
            {{ dialogButton }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
