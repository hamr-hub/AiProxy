<template>
  <div class="upload-config-page">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-slate-800">凭据文件管理</h2>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
            @click="handleDownloadAll"
            :disabled="loading"
          >
            <i class="fas fa-download"></i> 下载全部
          </button>
          <button
            class="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            @click="handleDeleteUnbound"
            :disabled="loading || deleting"
          >
            <i v-if="deleting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-trash-can"></i> 删除未绑定
          </button>
        </div>
      </div>

      <template v-if="loading">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton v-for="i in 4" :key="i" variant="card" />
        </div>
      </template>

      <template v-else-if="error">
        <div class="text-center py-12 text-red-500">
          <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
          <p>{{ error }}</p>
          <button class="mt-2 text-emerald-500 hover:underline" @click="fetchConfigs">重试</button>
        </div>
      </template>

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="config in configs"
            :key="config.path"
            class="p-4 border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors"
            :class="{
              'border-green-300 bg-green-50/30': config.isUsed,
              'border-amber-200 bg-amber-50/30': !config.isUsed && config.type === 'oauth'
            }"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="getProviderIconClass(config.provider)"
                >
                  <i :class="getProviderIcon(config.provider)"></i>
                </div>
                <div>
                  <p class="font-medium text-slate-800">{{ config.name }}</p>
                  <p class="text-sm text-slate-500">
                    {{ formatSize(config.size) }}
                    <span v-if="config.provider" class="ml-2">
                      <span class="px-2 py-0.5 rounded-full text-xs" :class="getProviderBadgeClass(config.provider)">
                        {{ config.provider }}
                      </span>
                    </span>
                  </p>
                  <p v-if="config.expiresIn" class="text-xs mt-1" :class="getExpiresClass(config.expiresIn)">
                    <i class="fas fa-clock mr-1"></i>
                    {{ formatExpiresIn(config.expiresIn) }}
                  </p>
                </div>
              </div>
              <div class="flex gap-1">
                <button
                  v-if="config.isUsed"
                  class="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  @click="handleForceRefresh(config)"
                  title="强制刷新令牌"
                >
                  <i class="fas fa-rotate text-blue-500"></i>
                </button>
                <button
                  class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  @click="handleView(config)"
                >
                  <i class="fas fa-eye text-slate-600"></i>
                </button>
                <button
                  class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  @click="handleDownload(config)"
                >
                  <i class="fas fa-download text-slate-600"></i>
                </button>
                <button
                  v-if="!config.isUsed"
                  class="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  @click="handleDelete(config)"
                >
                  <i class="fas fa-trash text-red-500"></i>
                </button>
              </div>
            </div>
            <div v-if="config.isUsed && config.usageInfo" class="mt-3 pt-3 border-t border-slate-100">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(usage, idx) in config.usageInfo.usageDetails"
                  :key="idx"
                  class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                >
                  {{ usage.type }}: {{ usage.location || usage.nodeName || usage.configKey }}
                </span>
              </div>
            </div>
            <div v-if="!config.isValid" class="mt-2 text-xs text-red-500">
              <i class="fas fa-exclamation-triangle mr-1"></i> {{ config.errorMessage }}
            </div>
          </div>
        </div>
      </template>

      <div v-if="!loading && configs.length === 0" class="text-center py-12 text-slate-400">
        <i class="fas fa-folder-open text-4xl mb-3"></i>
        <p>暂无配置文件</p>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showViewModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showViewModal = false">
          <div class="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-slate-800">{{ viewConfigData.name }}</h3>
                <p class="text-sm text-slate-500">{{ viewConfigData.path }}</p>
              </div>
              <button
                class="p-2 hover:bg-slate-100 rounded transition-colors"
                @click="showViewModal = false"
              >
                <i class="fas fa-x text-slate-500"></i>
              </button>
            </div>
            <div class="flex-1 overflow-auto bg-slate-50 rounded-lg p-4">
              <pre class="text-sm text-slate-700 font-mono whitespace-pre-wrap">{{ viewConfigData.content }}</pre>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUploadConfig } from '@/api'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import Skeleton from '@/components/common/Skeleton.vue'

const {
  configs,
  loading,
  error,
  fetchConfigs,
  viewConfig,
  downloadConfig,
  deleteConfig,
  downloadAllConfigs,
  deleteUnboundConfigs,
  forceRefreshConfig
} = useUploadConfig()

const toast = useToast()
const { confirmDelete, confirmAction } = useConfirm()

const showViewModal = ref(false)
const viewConfigData = ref({})
const deleting = ref(false)

const getProviderIconClass = (provider) => {
  const classes = {
    kiro: 'bg-purple-100 text-purple-600',
    gemini: 'bg-blue-100 text-blue-600',
    qwen: 'bg-orange-100 text-orange-600',
    antigravity: 'bg-indigo-100 text-indigo-600',
    codex: 'bg-gray-100 text-gray-600',
    iflow: 'bg-cyan-100 text-cyan-600'
  }
  return classes[provider] || 'bg-slate-100 text-slate-500'
}

const getProviderIcon = (provider) => {
  const icons = {
    kiro: 'fas fa-robot text-purple-600',
    gemini: 'fas fa-gem text-blue-600',
    qwen: 'fas fa-cloud text-orange-600',
    antigravity: 'fas fa-shuttle-space text-indigo-600',
    codex: 'fas fa-code text-gray-600',
    iflow: 'fas fa-water text-cyan-600'
  }
  return icons[provider] || 'fas fa-file-code text-slate-500'
}

const getProviderBadgeClass = (provider) => {
  const classes = {
    kiro: 'bg-purple-100 text-purple-700',
    gemini: 'bg-blue-100 text-blue-700',
    qwen: 'bg-orange-100 text-orange-700',
    antigravity: 'bg-indigo-100 text-indigo-700',
    codex: 'bg-gray-100 text-gray-700',
    iflow: 'bg-cyan-100 text-cyan-700'
  }
  return classes[provider] || 'bg-slate-100 text-slate-700'
}

const formatSize = (bytes) => {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatExpiresIn = (seconds) => {
  if (seconds < 0) return '已过期'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟后过期`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时后过期`
  return `${Math.floor(seconds / 86400)}天后过期`
}

const getExpiresClass = (seconds) => {
  if (seconds < 0) return 'text-red-500'
  if (seconds < 3600) return 'text-red-500'
  if (seconds < 86400) return 'text-amber-500'
  return 'text-green-500'
}

const handleView = async (config) => {
  try {
    const data = await viewConfig(config.path)
    viewConfigData.value = data
    showViewModal.value = true
  } catch (err) {
    toast.error('查看配置失败: ' + err.message)
  }
}

const handleDownload = (config) => {
  downloadConfig(config.path)
  toast.success('开始下载: ' + config.name)
}

const handleDelete = async (config) => {
  try {
    await confirmDelete(config.name)
    await deleteConfig(config.path)
    toast.success('配置文件已删除')
  } catch (err) {
    if (err !== 'cancel') {
      toast.error('删除失败: ' + err.message)
    }
  }
}

const handleDownloadAll = () => {
  downloadAllConfigs()
  toast.info('开始下载所有配置')
}

const handleDeleteUnbound = async () => {
  try {
    await confirmAction('删除未绑定配置', '确定要删除所有未绑定的配置文件吗？此操作不可恢复。', 'danger')
    deleting.value = true
    const result = await deleteUnboundConfigs()
    toast.success(`已删除 ${result.deletedCount} 个未绑定配置`)
  } catch (err) {
    if (err !== 'cancel') {
      toast.error('删除失败: ' + err.message)
    }
  } finally {
    deleting.value = false
  }
}

const handleForceRefresh = async (config) => {
  try {
    const result = await forceRefreshConfig(config.path)
    if (result.refreshTriggered) {
      toast.success(`已触发 ${result.refreshCount} 个节点刷新`)
    } else {
      toast.info('该凭据没有活跃节点')
    }
  } catch (err) {
    toast.error('刷新失败: ' + err.message)
  }
}

onMounted(() => {
  fetchConfigs()
})
</script>

<style scoped>
.upload-config-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
