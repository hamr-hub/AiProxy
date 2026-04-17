<template>
  <div class="proxy-page">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800">代理配置</h2>
          <p class="text-sm text-slate-500 mt-1">管理系统代理和 TLS Sidecar 设置</p>
        </div>
        <button
          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
          @click="handleSave"
          :disabled="saving"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-save"></i>
          {{ saving ? '保存中...' : '保存配置' }}
        </button>
      </div>

      <template v-if="loading">
        <Skeleton variant="card" />
      </template>

      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <i class="fas fa-network-wired text-blue-500"></i>
              HTTP/HTTPS/SOCKS5 代理
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">代理 URL</label>
                <input
                  type="text"
                  v-model="config.PROXY_URL"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :class="errors.PROXY_URL ? 'border-red-500' : 'border-slate-300'"
                  placeholder="http://proxy:8080 或 socks5://proxy:1080"
                />
                <p v-if="errors.PROXY_URL" class="mt-1 text-xs text-red-500">{{ errors.PROXY_URL }}</p>
                <p class="mt-1 text-xs text-slate-500">支持 http://, https://, socks5://, socks4:// 协议</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">启用代理的提供商</label>
                <div class="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                  <div
                    v-for="provider in availableProviders"
                    :key="provider.value"
                    class="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      :id="'proxy-' + provider.value"
                      :value="provider.value"
                      v-model="config.PROXY_ENABLED_PROVIDERS"
                      class="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <label :for="'proxy-' + provider.value" class="text-sm text-slate-700 cursor-pointer">
                      {{ provider.label }}
                    </label>
                  </div>
                </div>
                <p class="mt-1 text-xs text-slate-500">选中的提供商将使用上述代理</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <i class="fas fa-shield-halved text-purple-500"></i>
              TLS Sidecar
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <span class="text-slate-700 font-medium">启用 TLS Sidecar</span>
                  <p class="text-xs text-slate-500 mt-1">模拟浏览器 TLS 指纹绕过 Cloudflare</p>
                </div>
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

                <label class="block text-sm font-medium text-slate-700 mb-2 mt-4">Sidecar 代理 URL</label>
                <input
                  type="text"
                  v-model="config.TLS_SIDECAR_PROXY_URL"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="可选，如需通过代理连接"
                />

                <label class="block text-sm font-medium text-slate-700 mb-2 mt-4">启用 TLS 的提供商</label>
                <div class="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                  <div
                    v-for="provider in availableProviders"
                    :key="provider.value"
                    class="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      :id="'tls-' + provider.value"
                      :value="provider.value"
                      v-model="config.TLS_SIDECAR_ENABLED_PROVIDERS"
                      class="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <label :for="'tls-' + provider.value" class="text-sm text-slate-700 cursor-pointer">
                      {{ provider.label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-start gap-3">
            <i class="fas fa-info-circle text-amber-600 flex-shrink-0 mt-0.5"></i>
            <div>
              <p class="text-amber-800 font-medium">配置说明</p>
              <ul class="text-sm text-amber-700 mt-1 space-y-1">
                <li>• HTTP/HTTPS 代理：适用于大多数 API 请求</li>
                <li>• SOCKS5 代理：适用于需要 UDP 协议的请求</li>
                <li>• TLS Sidecar：用于模拟浏览器 TLS 指纹，解决 Cloudflare 403 问题</li>
                <li>• 修改配置后需要重启服务才能生效</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold text-slate-700 mb-4">代理连接测试</h3>
          <div class="flex gap-3">
            <input
              type="text"
              v-model="testUrl"
              class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="输入测试 URL"
            />
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              @click="testProxy"
              :disabled="testing"
            >
              <i v-if="testing" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
              {{ testing ? '测试中...' : '测试连接' }}
            </button>
          </div>
          <div v-if="testResult" class="mt-3 p-3 rounded-lg" :class="testResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'">
            <i :class="['fas', testResult.success ? 'fa-check-circle' : 'fa-times-circle', 'mr-2']"></i>
            {{ testResult.message }}
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

const { config: configApi, loading, fetchConfig, saveConfig: saveConfigApi } = useConfig()
const toast = useToast()

const saving = ref(false)
const testing = ref(false)
const testUrl = ref('')
const testResult = ref(null)
const errors = ref({})

const config = reactive({
  PROXY_URL: '',
  PROXY_ENABLED_PROVIDERS: [],
  TLS_SIDECAR_ENABLED: false,
  TLS_SIDECAR_PORT: 9000,
  TLS_SIDECAR_PROXY_URL: '',
  TLS_SIDECAR_ENABLED_PROVIDERS: []
})

const availableProviders = [
  { value: 'gemini-cli-oauth', label: 'Gemini CLI OAuth' },
  { value: 'claude-kiro-oauth', label: 'Claude Kiro OAuth' },
  { value: 'openai-custom', label: 'OpenAI Custom' },
  { value: 'claude-custom', label: 'Claude Custom' },
  { value: 'grok-custom', label: 'Grok Custom' },
  { value: 'openai-qwen-oauth', label: 'Qwen OAuth' },
  { value: 'openai-iflow', label: 'iFlow' },
  { value: 'openai-codex-oauth', label: 'Codex OAuth' },
  { value: 'gemini-antigravity', label: 'Gemini Antigravity' }
]

const validateForm = () => {
  errors.value = {}
  if (config.PROXY_URL && !isValidProxyUrl(config.PROXY_URL)) {
    errors.value.PROXY_URL = '代理 URL 格式不正确'
  }
  return Object.keys(errors.value).length === 0
}

const isValidProxyUrl = (string) => {
  if (!string) return true
  try {
    const url = new URL(string)
    return ['http:', 'https:', 'socks5:', 'socks4:', 'socks:'].includes(url.protocol)
  } catch {
    return false
  }
}

const handleSave = async () => {
  if (!validateForm()) {
    toast.warning('请检查表单填写是否正确')
    return
  }

  saving.value = true
  try {
    await saveConfigApi({
      PROXY_URL: config.PROXY_URL,
      PROXY_ENABLED_PROVIDERS: config.PROXY_ENABLED_PROVIDERS,
      TLS_SIDECAR_ENABLED: config.TLS_SIDECAR_ENABLED,
      TLS_SIDECAR_PORT: config.TLS_SIDECAR_PORT,
      TLS_SIDECAR_PROXY_URL: config.TLS_SIDECAR_PROXY_URL,
      TLS_SIDECAR_ENABLED_PROVIDERS: config.TLS_SIDECAR_ENABLED_PROVIDERS
    })
    toast.success('配置保存成功，部分配置可能需要重启服务后生效')
  } catch (err) {
    toast.error(err.message || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const testProxy = async () => {
  if (!testUrl.value) {
    toast.warning('请输入测试 URL')
    return
  }

  testing.value = true
  testResult.value = null

  try {
    const response = await fetch('/api/proxy/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: testUrl.value, proxyUrl: config.PROXY_URL })
    })
    const data = await response.json()
    testResult.value = {
      success: data.success,
      message: data.message || (data.success ? '连接成功' : '连接失败')
    }
  } catch (err) {
    testResult.value = {
      success: false,
      message: '测试请求失败: ' + err.message
    }
  } finally {
    testing.value = false
  }
}

onMounted(async () => {
  await fetchConfig()
  config.PROXY_URL = configApi.value.PROXY_URL || ''
  config.PROXY_ENABLED_PROVIDERS = configApi.value.PROXY_ENABLED_PROVIDERS || []
  config.TLS_SIDECAR_ENABLED = configApi.value.TLS_SIDECAR_ENABLED || false
  config.TLS_SIDECAR_PORT = configApi.value.TLS_SIDECAR_PORT || 9000
  config.TLS_SIDECAR_PROXY_URL = configApi.value.TLS_SIDECAR_PROXY_URL || ''
  config.TLS_SIDECAR_ENABLED_PROVIDERS = configApi.value.TLS_SIDECAR_ENABLED_PROVIDERS || []
})
</script>

<style scoped>
.proxy-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
