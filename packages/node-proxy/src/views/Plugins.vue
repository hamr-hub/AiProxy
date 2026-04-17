<template>
  <div class="plugins-page">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-slate-800">插件管理</h2>
        <button
          class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
          @click="fetchPlugins"
          :disabled="loading"
        >
          <i class="fas fa-refresh" :class="{ 'animate-spin': loading }"></i>
          {{ loading ? '加载中...' : '刷新' }}
        </button>
      </div>

      <template v-if="loading">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton v-for="i in 4" :key="i" variant="card" />
        </div>
      </template>

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="plugin in plugins"
            :key="plugin.name"
            class="p-4 border rounded-xl transition-all"
            :class="plugin.enabled ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="plugin.enabled ? 'bg-emerald-100' : 'bg-slate-200'"
                >
                  <i :class="[getPluginIcon(plugin), plugin.enabled ? 'text-emerald-600' : 'text-slate-500']"></i>
                </div>
                <div>
                  <p class="font-medium text-slate-800">{{ plugin.name }}</p>
                  <p class="text-xs text-slate-500">v{{ plugin.version }}</p>
                </div>
              </div>
              <button
                class="relative w-12 h-6 rounded-full transition-colors"
                :class="plugin.enabled ? 'bg-emerald-500' : 'bg-slate-300'"
                @click="handleToggle(plugin)"
                :disabled="toggling === plugin.name"
              >
                <span
                  class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                  :class="plugin.enabled ? 'translate-x-7' : 'translate-x-1'"
                ></span>
              </button>
            </div>
            <p class="text-sm text-slate-600 mb-3">{{ plugin.description }}</p>
            <div class="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span
                v-if="plugin.hasMiddleware"
                class="px-2 py-1 rounded-full bg-purple-100 text-purple-700"
              >
                <i class="fas fa-exchange-alt mr-1"></i>中间件
              </span>
              <span
                v-if="plugin.hasRoutes"
                class="px-2 py-1 rounded-full bg-blue-100 text-blue-700"
              >
                <i class="fas fa-route mr-1"></i>路由
              </span>
              <span
                v-if="plugin.hasHooks"
                class="px-2 py-1 rounded-full bg-amber-100 text-amber-700"
              >
                <i class="fas fa-hook mr-1"></i>钩子
              </span>
            </div>
          </div>
        </div>

        <div v-if="plugins.length === 0" class="text-center py-12 text-slate-400">
          <i class="fas fa-puzzle-piece text-4xl mb-3"></i>
          <p>暂无插件</p>
        </div>
      </template>

      <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex items-start gap-3">
          <i class="fas fa-info-circle text-amber-600 flex-shrink-0 mt-0.5"></i>
          <div>
            <p class="text-amber-800 font-medium">提示</p>
            <p class="text-sm text-amber-700 mt-1">启用或禁用插件后需要重启服务才能生效。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlugins } from '@/api'
import { useToast } from '@/composables/useToast'
import Skeleton from '@/components/common/Skeleton.vue'

const {
  plugins,
  loading,
  fetchPlugins,
  togglePlugin
} = usePlugins()

const toast = useToast()
const toggling = ref(null)

const getPluginIcon = (plugin) => {
  const name = plugin.name.toLowerCase()
  if (name.includes('auth')) return 'fas fa-lock text-lg'
  if (name.includes('monitor')) return 'fas fa-eye text-lg'
  if (name.includes('potluck')) return 'fas fa-users text-lg'
  if (name.includes('usage') || name.includes('stats')) return 'fas fa-chart-bar text-lg'
  if (name.includes('rate')) return 'fas fa-gauge text-lg'
  if (name.includes('log')) return 'fas fa-file-text text-lg'
  return 'fas fa-puzzle-piece text-lg'
}

const handleToggle = async (plugin) => {
  toggling.value = plugin.name
  const newState = !plugin.enabled
  try {
    await togglePlugin(plugin.name, newState)
    plugin.enabled = newState
    toast.success(`插件 ${plugin.name} 已${newState ? '启用' : '禁用'}`)
  } catch (err) {
    toast.error(err.message || '切换插件状态失败')
  } finally {
    toggling.value = null
  }
}

onMounted(() => {
  fetchPlugins()
})
</script>

<style scoped>
.plugins-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
