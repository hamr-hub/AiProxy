<template>
  <div class="providers-page">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-slate-800">提供商池管理</h2>
        <button
          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
          @click="openAddModal"
        >
          <i class="fas fa-plus"></i> 添加提供商
        </button>
      </div>

      <div class="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="stat-card bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-server text-blue-600 text-xl"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800">{{ stats.activeConnections }}</p>
              <p class="text-sm text-slate-500">活动连接</p>
            </div>
          </div>
        </div>
        <div class="stat-card bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-network-wired text-purple-600 text-xl"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800">{{ stats.activeProviders }}</p>
              <p class="text-sm text-slate-500">活跃提供商</p>
            </div>
          </div>
        </div>
        <div class="stat-card bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-check-circle text-emerald-600 text-xl"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800">{{ stats.healthyProviders }}</p>
              <p class="text-sm text-slate-500">健康提供商</p>
            </div>
          </div>
        </div>
      </div>

      <div class="search-bar flex gap-4 mb-6">
        <div class="flex-1 relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            v-model="searchQuery"
            class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="搜索提供商名称或节点内容..."
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">全部状态</option>
          <option value="healthy">健康</option>
          <option value="unhealthy">不健康</option>
        </select>
      </div>

      <div class="providers-list space-y-4">
        <template v-if="loading">
          <Skeleton v-for="i in 3" :key="i" variant="card" class="mb-4" />
        </template>

        <div v-else-if="filteredProviders.length === 0" class="text-center py-8 text-slate-500">
          <i class="fas fa-inbox text-4xl mb-2"></i>
          <p>暂无提供商</p>
        </div>

        <div
          v-for="provider in filteredProviders"
          :key="provider.id"
          class="provider-item border border-slate-200 rounded-xl p-4 hover:border-emerald-300 transition-colors"
          :class="{
            'bg-emerald-50 border-emerald-200': provider.status === 'healthy',
            'bg-red-50 border-red-200': provider.status === 'unhealthy'
          }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-emerald-500': provider.status === 'healthy',
                    'bg-red-500': provider.status === 'unhealthy'
                  }"
                ></span>
                <span class="font-medium text-slate-800">{{ provider.name || provider.type }}</span>
                <span class="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">
                  {{ provider.type }}
                </span>
              </div>
              <p class="text-sm text-slate-600 mb-2">{{ provider.description || getProviderDescription(provider) }}</p>
              <div class="flex items-center gap-4 text-xs text-slate-500">
                <span v-if="provider.accounts?.length">
                  <i class="fas fa-user mr-1"></i>{{ provider.accounts.length }} 账户
                </span>
                <span v-if="provider.errorCount">
                  <i class="fas fa-exclamation-triangle mr-1 text-red-500"></i>{{ provider.errorCount }} 错误
                </span>
                <span v-if="provider.lastHealthCheck">
                  <i class="fas fa-clock mr-1"></i>{{ formatTime(provider.lastHealthCheck) }}
                </span>
              </div>
              <div v-if="provider.status === 'unhealthy' && provider.errorMessage" class="mt-2 p-2 bg-red-100 rounded-lg text-xs text-red-700">
                <i class="fas fa-exclamation-circle mr-1"></i>{{ provider.errorMessage }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                @click="openEditModal(provider)"
                title="编辑"
              >
                <i class="fas fa-edit text-slate-600"></i>
              </button>
              <button
                class="p-2 hover:bg-red-100 rounded-lg transition-colors"
                @click="handleDeleteProvider(provider)"
                title="删除"
              >
                <i class="fas fa-trash text-red-500"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModal">
          <div class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-800">
                {{ isEditing ? '编辑提供商' : '添加提供商' }}
              </h3>
              <button class="p-1 hover:bg-slate-100 rounded transition-colors" @click="closeModal">
                <i class="fas fa-x text-slate-500"></i>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">提供商名称</label>
                <input
                  type="text"
                  v-model="formData.name"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :class="errors.name ? 'border-red-500' : 'border-slate-300'"
                  placeholder="输入提供商名称"
                />
                <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">提供商类型</label>
                <select
                  v-model="formData.type"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :disabled="isEditing"
                >
                  <option value="gemini-cli-oauth">Gemini CLI OAuth</option>
                  <option value="claude-kiro-oauth">Claude Kiro OAuth</option>
                  <option value="openai-custom">OpenAI Custom</option>
                  <option value="claude-custom">Claude Custom</option>
                  <option value="grok-custom">Grok Custom</option>
                  <option value="openai-qwen-oauth">Qwen OAuth</option>
                  <option value="openai-iflow">iFlow</option>
                  <option value="openai-codex-oauth">Codex OAuth</option>
                  <option value="gemini-antigravity">Gemini Antigravity</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  API Key <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    :type="showApiKey ? 'text' : 'password'"
                    v-model="formData.apiKey"
                    class="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    :class="errors.apiKey ? 'border-red-500' : 'border-slate-300'"
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
                <p v-if="errors.apiKey" class="mt-1 text-xs text-red-500">{{ errors.apiKey }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Base URL</label>
                <input
                  type="text"
                  v-model="formData.baseUrl"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :class="errors.baseUrl ? 'border-red-500' : 'border-slate-300'"
                  placeholder="https://api.example.com/v1"
                />
                <p v-if="errors.baseUrl" class="mt-1 text-xs text-red-500">{{ errors.baseUrl }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">并发限制</label>
                  <input
                    type="number"
                    v-model="formData.concurrencyLimit"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="10"
                    min="1"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">队列限制</label>
                  <input
                    type="number"
                    v-model="formData.queueLimit"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="50"
                    min="1"
                  />
                </div>
              </div>

              <div class="flex items-center gap-2">
                <input type="checkbox" id="checkHealth" v-model="formData.checkHealth" class="w-4 h-4" />
                <label for="checkHealth" class="text-sm text-slate-700">启用健康检查</label>
              </div>
            </div>

            <div class="flex gap-3 pt-6">
              <button
                class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                @click="closeModal"
              >
                取消
              </button>
              <button
                class="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                @click="handleSave"
                :disabled="saving"
              >
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ isEditing ? '保存' : '添加' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProviderPool } from '@/api'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import Skeleton from '@/components/common/Skeleton.vue'

const {
  providers,
  loading,
  fetchProviders,
  addProvider,
  updateProvider,
  deleteProvider: removeProvider
} = useProviderPool()

const toast = useToast()
const { confirmDelete } = useConfirm()

const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const editingProvider = ref(null)
const showApiKey = ref(false)
const saving = ref(false)

const errors = ref({})

const defaultFormData = {
  name: '',
  type: 'gemini-cli-oauth',
  apiKey: '',
  baseUrl: '',
  concurrencyLimit: 10,
  queueLimit: 50,
  checkHealth: true
}

const formData = ref({ ...defaultFormData })

const isEditing = computed(() => !!editingProvider.value)

const stats = computed(() => {
  const all = providers.value
  const healthy = all.filter(p => p.status === 'healthy')
  return {
    activeConnections: all.reduce((sum, p) => sum + (p.accounts?.length || 0), 0),
    activeProviders: all.length,
    healthyProviders: healthy.length
  }
})

const filteredProviders = computed(() => {
  let result = providers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      (p.name || '').toLowerCase().includes(query) ||
      (p.type || '').toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    result = result.filter(p => p.status === statusFilter.value)
  }

  return result
})

const getProviderDescription = (provider) => {
  const typeDescriptions = {
    'gemini-cli-oauth': 'Google Gemini CLI OAuth',
    'claude-kiro-oauth': 'Claude Kiro OAuth',
    'openai-custom': 'OpenAI API',
    'claude-custom': 'Claude API',
    'grok-custom': 'Grok API',
    'openai-qwen-oauth': 'Qwen OAuth',
    'openai-iflow': 'iFlow',
    'openai-codex-oauth': 'Codex OAuth',
    'gemini-antigravity': 'Gemini Antigravity'
  }
  return typeDescriptions[provider.type] || provider.type
}

const formatTime = (timestamp) => {
  if (!timestamp) return '--'
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.apiKey.trim()) {
    errors.value.apiKey = 'API Key 不能为空'
  } else if (formData.value.apiKey.trim().length < 10) {
    errors.value.apiKey = 'API Key 格式不正确'
  }

  if (formData.value.baseUrl && !isValidUrl(formData.value.baseUrl)) {
    errors.value.baseUrl = 'Base URL 格式不正确'
  }

  return Object.keys(errors.value).length === 0
}

const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

const openAddModal = () => {
  editingProvider.value = null
  formData.value = { ...defaultFormData }
  errors.value = {}
  showModal.value = true
}

const openEditModal = (provider) => {
  editingProvider.value = provider
  formData.value = {
    name: provider.name || '',
    type: provider.type || 'gemini-cli-oauth',
    apiKey: provider.apiKey || '',
    baseUrl: provider.baseUrl || '',
    concurrencyLimit: provider.concurrencyLimit || 10,
    queueLimit: provider.queueLimit || 50,
    checkHealth: provider.checkHealth !== false
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProvider.value = null
  formData.value = { ...defaultFormData }
  errors.value = {}
  showApiKey.value = false
}

const handleSave = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    const data = { ...formData.value }
    if (isEditing.value) {
      await updateProvider(editingProvider.value.id, data)
      toast.success('提供商更新成功')
    } else {
      await addProvider(data)
      toast.success('提供商添加成功')
    }
    await fetchProviders()
    closeModal()
  } catch (err) {
    toast.error(err.message || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const handleDeleteProvider = async (provider) => {
  try {
    await confirmDelete(provider.name || provider.type)
    await removeProvider(provider.id)
    await fetchProviders()
    toast.success('提供商删除成功')
  } catch (err) {
    if (err !== 'cancel') {
      toast.error(err.message || '删除失败，请重试')
    }
  }
}

onMounted(() => {
  fetchProviders()
})
</script>

<style scoped>
.providers-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.provider-item {
  animation: slideUp 0.2s ease backwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active {
  animation: modal-in 0.2s ease;
}

.modal-leave-active {
  animation: modal-out 0.2s ease;
}

@keyframes modal-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
