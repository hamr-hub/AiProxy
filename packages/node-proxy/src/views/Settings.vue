<template>
  <div class="settings-page">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800">设置</h2>
          <p class="text-sm text-slate-500 mt-1">个性化配置界面外观和行为</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <i class="fas fa-palette text-purple-500"></i>
            主题设置
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-3">选择主题</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="theme in themes"
                  :key="theme.value"
                  class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
                  :class="currentTheme === theme.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'"
                  @click="handleThemeChange(theme.value)"
                >
                  <i :class="['fas', theme.icon, currentTheme === theme.value ? 'text-emerald-500' : 'text-slate-400']"></i>
                  <span class="text-sm font-medium" :class="currentTheme === theme.value ? 'text-emerald-700' : 'text-slate-600'">
                    {{ theme.label }}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-3">强调色</label>
              <div class="flex gap-3 flex-wrap">
                <button
                  v-for="color in accentColors"
                  :key="color.value"
                  class="w-10 h-10 rounded-full transition-transform flex items-center justify-center"
                  :class="accentColor === color.value ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'"
                  :style="{ backgroundColor: color.value, '--ring-color': color.value }"
                  :title="color.label"
                  @click="handleAccentChange(color.value)"
                >
                  <i v-if="accentColor === color.value" class="fas fa-check text-white text-xs"></i>
                </button>
              </div>
            </div>

            <div class="p-4 bg-slate-50 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-slate-700">预览</span>
              </div>
              <div class="flex gap-2 flex-wrap">
                <button class="px-4 py-2 rounded-lg text-white text-sm font-medium" :style="{ backgroundColor: accentColor }">
                  主要按钮
                </button>
                <button class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm hover:bg-slate-100 transition-colors">
                  次要按钮
                </button>
                <span class="px-3 py-2 bg-emerald-100 text-emerald-700 text-sm rounded-lg">
                  成功
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <i class="fas fa-cog text-blue-500"></i>
            其他设置
          </h3>

          <div class="space-y-4">
            <div class="p-4 border border-slate-200 rounded-xl">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-slate-800">紧凑模式</p>
                  <p class="text-sm text-slate-500 mt-1">减少界面元素间距</p>
                </div>
                <button
                  type="button"
                  class="relative w-12 h-6 rounded-full transition-colors"
                  :class="compactMode ? 'bg-emerald-500' : 'bg-slate-300'"
                  @click="compactMode = !compactMode"
                >
                  <span
                    class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                    :class="compactMode ? 'translate-x-7' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
            </div>

            <div class="p-4 border border-slate-200 rounded-xl">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-slate-800">减少动画</p>
                  <p class="text-sm text-slate-500 mt-1">禁用界面过渡动画</p>
                </div>
                <button
                  type="button"
                  class="relative w-12 h-6 rounded-full transition-colors"
                  :class="reduceMotion ? 'bg-emerald-500' : 'bg-slate-300'"
                  @click="reduceMotion = !reduceMotion"
                >
                  <span
                    class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                    :class="reduceMotion ? 'translate-x-7' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
            </div>

            <div class="p-4 border border-slate-200 rounded-xl">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-slate-800">自动保存</p>
                  <p class="text-sm text-slate-500 mt-1">输入时自动保存表单数据</p>
                </div>
                <button
                  type="button"
                  class="relative w-12 h-6 rounded-full transition-colors"
                  :class="autoSave ? 'bg-emerald-500' : 'bg-slate-300'"
                  @click="autoSave = !autoSave"
                >
                  <span
                    class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                    :class="autoSave ? 'translate-x-7' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-sm font-semibold text-slate-700 mb-3">数据管理</h4>
            <div class="flex gap-3">
              <button
                class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                @click="exportSettings"
              >
                <i class="fas fa-download"></i>
                导出设置
              </button>
              <label class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <i class="fas fa-upload"></i>
                导入设置
                <input type="file" accept=".json" class="hidden" @change="importSettings" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-slate-100">
        <h3 class="text-lg font-semibold text-slate-700 mb-4">关于</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 bg-slate-50 rounded-xl text-center">
            <p class="text-2xl font-bold text-slate-800">AiProxy</p>
            <p class="text-sm text-slate-500 mt-1">版本 2.0.0</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-xl text-center">
            <p class="text-sm text-slate-500">前端框架</p>
            <p class="font-medium text-slate-800 mt-1">Vue.js 3 + TailwindCSS</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-xl text-center">
            <p class="text-sm text-slate-500">后端框架</p>
            <p class="font-medium text-slate-800 mt-1">Node.js + Express</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const isDark = ref(false)
const currentTheme = ref('light')
const accentColor = ref('#10b981')
const compactMode = ref(false)
const reduceMotion = ref(false)
const autoSave = ref(true)

const themes = [
  { value: 'light', label: '浅色主题', icon: 'fa-sun' },
  { value: 'dark', label: '深色主题', icon: 'fa-moon' },
  { value: 'system', label: '跟随系统', icon: 'fa-desktop' }
]

const accentColors = [
  { value: '#10b981', label: '翠绿' },
  { value: '#3b82f6', label: '天蓝' },
  { value: '#8b5cf6', label: '紫色' },
  { value: '#f59e0b', label: '琥珀' },
  { value: '#ef4444', label: '红色' },
  { value: '#ec4899', label: '粉色' }
]

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '16, 185, 129'
}

const applyTheme = (theme, accent) => {
  const root = document.documentElement

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
  } else {
    isDark.value = theme === 'dark'
  }

  root.classList.remove('light', 'dark')
  root.classList.add(isDark.value ? 'dark' : 'light')
  root.style.setProperty('--accent-color', accent)
  root.style.setProperty('--accent-rgb', hexToRgb(accent))

  localStorage.setItem('theme', theme)
  localStorage.setItem('accent-color', accent)

  if (reduceMotion.value) {
    root.classList.add('reduce-motion')
  } else {
    root.classList.remove('reduce-motion')
  }

  if (compactMode.value) {
    root.classList.add('compact-mode')
  } else {
    root.classList.remove('compact-mode')
  }
}

const handleThemeChange = (newTheme) => {
  currentTheme.value = newTheme
  applyTheme(newTheme, accentColor.value)
}

const handleAccentChange = (newColor) => {
  accentColor.value = newColor
  applyTheme(currentTheme.value, newColor)
}

const exportSettings = () => {
  const settings = {
    theme: currentTheme.value,
    accentColor: accentColor.value,
    compactMode: compactMode.value,
    reduceMotion: reduceMotion.value,
    autoSave: autoSave.value,
    exportedAt: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'aiflow-settings.json'
  a.click()
  URL.revokeObjectURL(url)
  toast.success('设置已导出')
}

const importSettings = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const settings = JSON.parse(e.target.result)
      if (settings.theme && themes.some(t => t.value === settings.theme)) {
        currentTheme.value = settings.theme
      }
      if (settings.accentColor) {
        accentColor.value = settings.accentColor
      }
      if (typeof settings.compactMode === 'boolean') {
        compactMode.value = settings.compactMode
      }
      if (typeof settings.reduceMotion === 'boolean') {
        reduceMotion.value = settings.reduceMotion
      }
      if (typeof settings.autoSave === 'boolean') {
        autoSave.value = settings.autoSave
      }
      applyTheme(currentTheme.value, accentColor.value)
      toast.success('设置已导入')
    } catch {
      toast.error('无效的设置文件')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  const savedAccent = localStorage.getItem('accent-color') || '#10b981'

  currentTheme.value = savedTheme
  accentColor.value = savedAccent
  applyTheme(savedTheme, savedAccent)

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (currentTheme.value === 'system') {
      isDark.value = e.matches
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(isDark.value ? 'dark' : 'light')
    }
  })
})
</script>

<style scoped>
.settings-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ring-offset-2 {
  --tw-ring-offset-shadow: 0 0 0 2px var(--tw-ring-offset-color, #fff);
}
</style>
