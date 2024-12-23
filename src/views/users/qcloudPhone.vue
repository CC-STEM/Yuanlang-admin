<route lang="yaml">
  meta:
    title: 腾讯云手机验证码配置
      </route>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import apiConfig from '@/api/modules/config'

const formInline = reactive({
  qcloudSecretId: '',
  qcloudSecretKey: '',
  qcloudPhoneRegisterStatus: '',
  qcloudPhoneLoginStatus: '',
  qcloudSMSSDKAppId: '',
  qcloudSMSTemplateId: '',
  qcloudPhoneSignName: '',
})

const rules = ref<FormRules>({
  qcloudPhoneRegisterStatus: [
    { required: false, trigger: 'blur', message: '请选择是否开启手机号注册' },
  ],
  qcloudPhoneLoginStatus: [
    { required: false, trigger: 'blur', message: '请选择是否开启手机号登录' },
  ],
  qcloudSecretId: [
    { required: false, trigger: 'blur', message: 'secretId' }
  ],
  qcloudSecretKey: [
    { required: false, trigger: 'blur', message: 'secretKey' }
  ],
  qcloudSMSSDKAppId: [
    { required: false, trigger: 'blur', message: '请填写腾讯云短信服务SDK APPId' },
  ],
  qcloudSMSTemplateId: [
    { required: false, trigger: 'blur', message: '请填写腾讯云短信服务TemplateId' },
  ],
  qcloudPhoneSignName: [
    { required: false, trigger: 'blur', message: '请填写腾讯云短信服务的模板签名' },
  ]
})
const formRef = ref<FormInstance>()

async function queryAllconfig() {
  const res = await apiConfig.queryConfig({ keys: ['qcloudPhoneRegisterStatus', 'qcloudPhoneLoginStatus', 'qcloudSecretId', 'qcloudSecretKey', 'qcloudSMSSDKAppId', 'qcloudSMSTemplateId', 'qcloudPhoneSignName'] })
  Object.assign(formInline, res.data)
}

function handlerUpdateConfig() {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await apiConfig.setConfig({ settings: fotmatSetting(formInline) })
        ElMessage.success('变更配置信息成功')
      }
      catch (error) { }
      queryAllconfig()
    }
    else {
      ElMessage.error('请填写完整信息')
    }
  })
}

function fotmatSetting(settings: any) {
  return Object.keys(settings).map((key) => {
    return {
      configKey: key,
      configVal: settings[key],
    }
  })
}

onMounted(() => {
  queryAllconfig()
})
</script>

<template>
  <div>
    <page-main>
      <el-alert :closable="false" show-icon title="验证码说明" description="此处采用腾讯云短信服务调试" type="warning" />
    </page-main>
    <el-card style="margin: 20px;">
      <template #header>
        <div class="flex justify-between">
          <b>腾讯云手机验证码配置</b>
          <el-button class="button" text @click="handlerUpdateConfig">
            保存设置
          </el-button>
        </div>
      </template>
      <el-form ref="formRef" :rules="rules" :model="formInline" label-width="170px">
        <el-row>
          <el-col :xs="24" :md="20" :lg="15" :xl="12">
            <el-form-item label="是否开启手机号登录" prop="qcloudPhoneLoginStatus">
              <el-tooltip class="box-item" effect="dark" content="如您启用短信登录、则用户端则可以通过手机号的方式登录！" placement="right">
                <el-switch v-model="formInline.qcloudPhoneLoginStatus" active-value="1" inactive-value="0" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :md="20" :lg="15" :xl="12">
            <el-form-item label="是否开启手机号注册" prop="qcloudPhoneRegisterStatus">
              <el-tooltip class="box-item" effect="dark" content="如您启用短信验证、则用户端则可以通过手机验证码方式注册！" placement="right">
                <el-switch v-model="formInline.qcloudPhoneRegisterStatus" active-value="1" inactive-value="0" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :md="20" :lg="15" :xl="12">
            <el-form-item label="secretId" prop="qcloudSecretId">
              <el-input v-model="formInline.qcloudSecretId" placeholder="请填写SecretId" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :md="20" :lg="15" :xl="12">
            <el-form-item label="secretKey" prop="qcloudSecretKey">
              <el-input v-model="formInline.qcloudSecretKey" placeholder="请填写SecretKey" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :md="20" :lg="15" :xl="12">
            <el-form-item label="短信签名" prop="qcloudPhoneSignName">
              <el-input v-model="formInline.qcloudPhoneSignName" placeholder="请填写您申请的短信签名" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :md="20" :lg="15" :xl="12">
            <el-form-item label="短信模板ID" prop="qcloudSMSTemplateId">
              <el-input v-model="formInline.qcloudSMSTemplateId" placeholder="请填写短信模板ID" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :md="20" :lg="15" :xl="12">
            <el-form-item label="SDKAppId" prop="qcloudSMSSDKAppId">
              <el-input v-model="formInline.qcloudSMSSDKAppId" placeholder="请填写短信SDKAppId" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
