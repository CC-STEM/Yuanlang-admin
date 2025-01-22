<route lang="yaml">
meta:
  title: 用户管理
</route>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import ApiUser from '@/api/modules/user'
import type { UserStatus } from '@/constants/index'
import { USER_STATUS_MAP, USER_STATUS_OPTIONS, USER_STATUS_TYPE_MAP } from '@/constants/index'
import { utcToShanghaiTime } from '@/utils/utcformatTime'

const formRef = ref<FormInstance>()
const createUserFormRef = ref<FormInstance>()
const total = ref(0)
const visible = ref(false)
const loading = ref(false)
const visibleCrami = ref(false)
const activeUserId = ref(0)
const cramiRef = ref<FormInstance>()

const visibleConfigBalance = ref(false)
const configBalanceRef = ref<FormInstance>()

const form = reactive({
  status: 0,
  id: 0,
})

const formCrami = reactive({
  model3Count: 0,
  model4Count: 0,
  drawMjCount: 0,
})

const formBalance = reactive({
  balance: 0
})

const formInline = reactive({
  username: '',
  email: '',
  status: '',
  phone: '',
  page: 1,
  size: 15,
})

const createUserForm = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  phone: '',
})

const createUserVisible = ref(false)

interface BanlanceInfo {
  drawMjCount: number
  createdAt: Date
  updatedAt: Date
  id: number
  model4Count: number
  useChats: number
  usePaints: number
  useTokens: number
  userId: number
  model3Count: number
}

interface UserItem {
  avatar: string
  email: string
  id: number
  inviteCode: string
  lastLoginIp: string
  role: string
  sign: string
  status: 1 | 2 | 3
  username: string
  createdAt: Date
  updatedAt: Date
  balanceInfo: BanlanceInfo
  accountBalanceInfo?: {
    balance: number
    usedBalance: number
  }
}

const rules = reactive<FormRules>({
  model3Count: [{ required: true, message: '请填写赠送基础模型额度', trigger: 'blur' }],
  model4Count: [{ required: true, message: '请填写赠送高级模型额度', trigger: 'blur' }],
  drawMjCount: [{ required: true, message: '请填写赠绘画积分额度', trigger: 'blur' }],
})

const createUserRules = reactive<FormRules>({
  name: [{ required: false, message: '请填写用户真实姓名', trigger: 'blur' }],
  username: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
  email: [{ required: false, message: '请填写用户邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请填写用户密码', trigger: 'blur' }],
  phone: [{ required: false, message: '请填写用户手机号', trigger: 'blur', len: 11 }],
})

const tableData = ref<UserItem[]>([])

async function queryAllUserList() {
  try {
    loading.value = true
    const res = await ApiUser.queryAllUserNew(formInline)
    const { rows, count } = res.data
    loading.value = false
    total.value = count
    tableData.value = rows
  }
  catch (error) {
    loading.value = false
  }
}

function handleUpdateStatus(row: UserItem) {
  visible.value = true
  form.status = row.status
  form.id = row.id
}

function handleSendCrami(row: UserItem) {
  visibleCrami.value = true
  activeUserId.value = row.id
}

const handleConfigBalance = (row: UserItem) => {
  visibleConfigBalance.value = true
  activeUserId.value = row.id
  formBalance.balance = row.accountBalanceInfo?.balance || 0
}

async function handlerUpateUserStatus() {
  const res: any = await ApiUser.updateUserStatus(form)
  res.success && ElMessage({ type: 'success', message: '变更用户状态成功！' })
  visible.value = false
  queryAllUserList()
}

function handlerReset(formEl: FormInstance | undefined) {
  formEl?.resetFields()
  queryAllUserList()
}



const handleCreateUser = async () => {
  createUserVisible.value = true
}

async function handlerResetUserPass(row: any) {
  const { id, email } = row
  const res: any = await ApiUser.resetUserPassword({ id })
  res.success && ElMessage({ type: 'success', message: `重置用户[${email}密码为初始密码为[123456]完成！` })
}

function handlerCloseDialog(formEl: FormInstance | undefined) {
  activeUserId.value = 0
  formEl?.resetFields()
}

async function handlerSubmitSend(formEl: FormInstance | undefined) {
  formEl?.validate(async (valid) => {
    if (!valid) {
      return
    }
    await ApiUser.sendUserCrami({ ...formCrami, userId: activeUserId.value })
    ElMessage.success('赠送用户成功！')
    visibleCrami.value = false
    queryAllUserList()
  })
}

const handleSubmitConfigBalance = async (formEl: FormInstance | undefined) => {
  formEl?.validate(async (valid) => {
    if (!valid) {
      return
    }
    await ApiUser.configBalance({ ...formBalance, userId: activeUserId.value })
    ElMessage.success('修改用户积分成功！')
    visibleConfigBalance.value = false
    queryAllUserList()
  })
}

const handleCloseCreateUserDialog = (formEl: FormInstance | undefined) => {
  formEl?.resetFields()
}

function handlerCreateUserSubmit(formEl: FormInstance | undefined) {
  formEl?.validate(async (valid) => {
    if (valid) {
      await ApiUser.createUser(createUserForm)
      ElMessage({ type: 'success', message: '创建新用户成功！' })
      createUserVisible.value = false
      queryAllUserList()
    }
  })
}

onMounted(() => queryAllUserList())
</script>

<template>
  <div>
    <page-main>
      <el-form ref="formRef" :inline="true" :model="formInline">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="formInline.username" placeholder="用户姓名[模糊搜索]" clearable />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="formInline.email" placeholder="用户邮箱[模糊搜索]" clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="formInline.phone" placeholder="手机号码[模糊搜索]" clearable />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择用户状态" clearable>
            <el-option v-for="item in USER_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryAllUserList">
            查询
          </el-button>
          <el-button @click="handlerReset(formRef)">
            重置
          </el-button>
          <el-button @click="handleCreateUser()">
            新建用户
          </el-button>
        </el-form-item>
      </el-form>
    </page-main>

    <page-main style="width: 100%;">
      <el-table v-loading="loading" border :data="tableData" style="width: 100%;" size="large">
        <el-table-column prop="avatar" label="用户头像" fixed width="120">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column fixed prop="username" label="用户名称" width="150" />
        <el-table-column prop="email" label="用户邮箱" width="250" align="left" />
        <el-table-column prop="phone" label="用户手机号" width="250" align="left">
          <template #default="scope">
            {{ scope.row?.phone || '未绑定手机号' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="用户状态" width="120" align="center">
          <template #default="{ row }: { row: { status: UserStatus } }">
            <el-tag :type="USER_STATUS_TYPE_MAP[row.status]">
              {{ USER_STATUS_MAP[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accountBalanceInfo.balance" label="绘画余额积分" width="120" align="center" />
        <el-table-column prop="accountBalanceInfo.usedBalance" label="已用绘画积分" width="160" align="center">
          <template #default="scope">
            {{ `${scope.row.accountBalanceInfo?.usedBalance || 0} 积分` }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="lastLoginIp" label="最后登录IP" width="140" align="center" /> -->
        <el-table-column prop="createdAt" label="注册时间" width="200" align="center">
          <template #default="scope">
            {{ utcToShanghaiTime(scope.row.createdAt, 'YYYY-MM-DD hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleUpdateStatus(scope.row)">
              修改状态
            </el-button>
            <el-popconfirm title="确认重置此用户密码为【123456】?" confirm-button-text="确认重置"
              @confirm="handlerResetUserPass(scope.row)">
              <template #reference>
                <el-button link type="danger">
                  重置密码
                </el-button>
              </template>
            </el-popconfirm>
            <!-- <el-button link type="primary" size="small" @click="handleSendCrami(scope.row)">
              赠送卡密
            </el-button> -->
            <el-button link type="primary" size="small" @click="handleConfigBalance(scope.row)">
              修改积分
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="flex justify-end mt-5">
        <el-pagination v-model:current-page="formInline.page" v-model:page-size="formInline.size" class="mr-5"
          :page-sizes="[15, 30, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="queryAllUserList" @current-change="queryAllUserList" />
      </el-row>
    </page-main>

    <el-dialog v-model="visible" title="变更用户状态" width="500px">
      <el-form :model="form" :inline="true">
        <el-form-item label="用户状态" label-width="90px">
          <el-select v-model="form.status" placeholder="请选择用户状态" clearable>
            <el-option v-for="item in USER_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlerUpateUserStatus">
            确认变更
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="visibleCrami" title="主动赠送用户" width="450px" @close="handlerCloseDialog(cramiRef)">
      <el-form ref="cramiRef" :model="formCrami" :rules="rules" label-width="115px">
        <el-form-item label="基础模型积分" prop="model3Count">
          <el-input v-model.number="formCrami.model3Count" type="number" placeholder="赠送基础模型积分" />
        </el-form-item>
        <el-form-item label="高级模型积分" prop="model4Count">
          <el-input v-model.number="formCrami.model4Count" type="number" placeholder="赠送高级模型积分" />
        </el-form-item>
        <el-form-item label="绘画额度积分" prop="drawMjCount">
          <el-input v-model.number="formCrami.drawMjCount" type="number" placeholder="赠送绘画额度积分" />
        </el-form-item>
        <el-form-item class="flex justify-end" />
      </el-form>
      <template #footer>
        <el-button @click="visibleCrami = false">
          放弃赠送
        </el-button>
        <el-button type="primary" @click="handlerSubmitSend(cramiRef)">
          确认赠送
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="visibleConfigBalance" title="配置积分" width="450px" @close="handlerCloseDialog(configBalanceRef)">
      <el-form ref="configBalanceRef" :model="formBalance" :rules="rules" label-width="115px">
        <el-form-item label="积分" prop="balance">
          <el-input v-model.number="formBalance.balance" type="number" placeholder="配置积分" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visibleConfigBalance = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSubmitConfigBalance(configBalanceRef)">
          确认修改
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="createUserVisible" :close-on-click-modal="false" :title="'新建用户'" width="570"
      @close="handleCloseCreateUserDialog(createUserFormRef)">
      <el-form ref="createUserFormRef" label-position="right" label-width="100px" :model="createUserForm"
        :rules="createUserRules">
        <el-form-item label="账户名" prop="username">
          <el-input v-model="createUserForm.username" placeholder="请输入账户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="createUserForm.password" placeholder="请输入账户密码" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="createUserForm.name" placeholder="请输入用户真实姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="createUserForm.email" placeholder="请输入用户邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="createUserForm.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex justify-end mr-5">
          <el-button @click="createUserVisible = false">取消</el-button>
          <el-button type="primary" @click="handlerCreateUserSubmit(createUserFormRef)">
            {{ '确认创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
