<template>
  <div class="config-page">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-slate-800">系统配置</h2>
        <button
          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
          @click="handleSaveConfig"
          :disabled="saving"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-save"></i>
          {{ saving ? '保存中...' : '保存配置' }}
        </button>
      </div>

      <template v-if="loading">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="i">
            <Skeleton variant="text" :lines="5" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-slate-700 mb-4">服务器设置</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">服务器端口</label>
                <input
                  type="number"
                  v-model.number="config.SERVER_PORT"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :class="errors.SERVER_PORT ? 'border-red-500' : 'border-slate-300'"
                  min="1"
                  max="65535"
                />
                <p v-if="errors.SERVER_PORT" class="mt-1 text-xs text-red-500">{{ errors.SERVER_PORT }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">API 密钥</label>
                <div class="relative">
                  <input
                    type="password"
                    v-model="config.REQUIRED_API_KEY"
                    :type="showApiKey ? 'text' : 'password'"
                    class="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    :class="errors.REQUIRED_API_KEY ? 'border-red-500' : 'border-slate-300'"
                    placeholder="sk-..."
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    @click="showApiKey = !showApiKey"
                  >
                    <i :class="['fas', showApiKey ? 'fa-eye-slash' : 'fa-eye']"></i>
                  </button>
                </div>
                <p v-if="errors.REQUIRED_API_KEY" class="mt-1 text-xs text-red-500">{{ errors.REQUIRED_API_KEY }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">默认提供商</label>
                <select
                  v-model="config.MODEL_PROVIDER"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="gemini-cli-oauth">Gemini CLI OAuth</option>
                  <option value="claude-custom">Claude Custom</option>
                  <option value="openai-custom">OpenAI Custom</option>
                  <option value="grok-custom">Grok Custom</option>
                  <option value="claude-kiro-oauth">Claude Kiro OAuth</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">代理 URL</label>
                <input
                  type="text"
                  v-model="config.PROXY_URL"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :class="errors.PROXY_URL ? 'border-red-500' : 'border-slate-300'"
                  placeholder="http://proxy:8080"
                />
                <p v-if="errors.PROXY_URL" class="mt-1 text-xs text-red-500">{{ errors.PROXY_URL }}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-slate-700 mb-4">健康检查设置</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">不健康阈值</label>
                <input
                  type="number"
                  v-model.number="config.MAX_ERROR_COUNT"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">令牌刷新间隔（分钟）</label>
                <input
                  type="number"
                  v-model.number="config.CRON_NEAR_MINUTES"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">请求最大重试次数</label>
                <input
                  type="number"
                  v-model.number="config.REQUEST_MAX_RETRIES"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span class="text-slate-700">启用定时健康检查</span>
                <button
                  type="button"
                  class="relative w-12 h-6 rounded-full transition-colors"
                  :class="config.SCHEDULED_HEALTH_CHECK?.enabled ? 'bg-emerald-500' : 'bg-slate-300'"
                  @click="config.SCHEDULED_HEALTH_CHECK.enabled = !config.SCHEDULED_HEALTH_CHECK?.enabled"
                >
                  <span
                    class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                    :class="config.SCHEDULED_HEALTH_CHECK?.enabled ? 'translate-x-7' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-slate-700 mb-4">日志设置</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span class="text-slate-700">启用日志</span>
                <button
                  type="button"
                  class="relative w-12 h-6 rounded-full transition-colors"
                  :class="config.LOG_ENABLED ? 'bg-emerald-500' : 'bg-slate-300'"
                  @click="config.LOG_ENABLED = !config.LOG_ENABLED"
                >
                  <span
                    class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                    :class="config.LOG_ENABLED ? 'translate-x-7' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">日志级别</label>
                <select
                  v-model="config.LOG_LEVEL"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="debug">DEBUG</option>
                  <option value="info">INFO</option>
                  <option value="warn">WARN</option>
                  <option value="error">ERROR</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">日志目录</label>
                <input
                  type="text"
                  v-model="config.LOG_DIR"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="logs"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-slate-700 mb-4">TLS Sidecar 设置</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span class="text-slate-700">启用 TLS Sidecar</span>
                <button
                  type="button"
                  class="relative w-12 h-6 rounded-full transition-colors"
                  :class="config.TLS_SIDECAR_ENABLED ? 'bg-emerald-500' : 'bg-slate-300'"
                  @click="config.TLS_SIDECAR_ENABLED = !config.TLS_SIDECAR_ENABLED"
                >
                  <span
                    class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                    :class="config.TLS_SIDECAR_ENABLED ? 'translate-x-7' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
              <div v-if="config.TLS_SIDECAR_ENABLED">
                <label class="block text-sm font-medium text-slate-700 mb-2">Sidecar 端口</label>
                <input
                  type="number"
                  v-model.number="config.TLS_SIDECAR_PORT"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="1"
                  max="65535"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-start gap-3">
            <i class="fas fa-info-circle text-amber-600 flex-shrink-0 mt-0.5"></i>
            <div>
              <p class="text-amber-800 font-medium">提示</p>
              <p class="text-sm text-amber-700 mt-1">修改配置后需要重启服务才能生效。某些配置更改可能会导致服务自动重启。</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useConfig } from '@/api'
import { useToast } from '@/composables/useToast'
import Skeleton from '@/components/common/Skeleton.vue'

const { config, loading, fetchConfig, saveConfig: saveConfigApi } = useConfig()
const toast = useToast()

const showApiKey = ref(false)
const saving = ref(false)
const errors = ref({})

const validateForm = () => {
  errors.value = {}

  if (!config.SERVER_PORT || config.SERVER_PORT < 1 || config.SERVER_PORT > 65535) {
    errors.value.SERVER_PORT = '端口号必须在 1-65535 之间'
  }

  if (!config.REQUIRED_API_KEY || config.REQUIRED_API_KEY.trim().length < 10) {
    errors.value.REQUIRED_API_KEY = 'API Key 不能为空且长度不少于 10 位'
  }

  if (config.PROXY_URL && !isValidUrl(config.PROXY_URL)) {
    errors.value.PROXY_URL = '代理 URL 格式不正确'
  }

  return Object.keys(errors.value).length === 0
}

const isValidUrl = (string) => {
  if (!string) return true
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

const handleSaveConfig = async () => {
  if (!validateForm()) {
    toast.warning('请检查表单填写是否正确')
    return
  }

  saving.value = true
  try {
    await saveConfigApi(config)
    toast.success('配置保存成功，部分配置可能需要重启服务后生效')
  } catch (err) {
    toast.error(err.message || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchConfig()
  if (!config.SCHEDULED_HEALTH_CHECK) {
    config.SCHEDULED_HEALTH_CHECK = { enabled: false, interval: 60000 }
  }
})
</script>

<style scoped>
.config-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
