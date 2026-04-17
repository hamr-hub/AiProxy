import { ref, watch, onMounted } from 'vue'

const THEME_KEY = 'theme'
const THEME_LIGHT = 'light'
const THEME_DARK = 'dark'

export function useTheme() {
  const theme = ref(localStorage.getItem(THEME_KEY) || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT))

  const setTheme = (newTheme) => {
    theme.value = newTheme
    const root = document.documentElement
    if (newTheme === THEME_DARK) {
      root.setAttribute('data-theme', THEME_DARK)
      root.classList.add('dark')
    } else {
      root.removeAttribute('data-theme')
      root.classList.remove('dark')
    }
    localStorage.setItem(THEME_KEY, newTheme)
    updateMetaThemeColor(newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === THEME_DARK ? THEME_LIGHT : THEME_DARK)
  }

  const updateMetaThemeColor = (newTheme) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === THEME_DARK ? '#1f2937' : '#059669')
    }
  }

  const initTheme = () => {
    setTheme(theme.value)
    
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          setTheme(e.matches ? THEME_DARK : THEME_LIGHT)
        }
      })
    }
  }

  return {
    theme,
    isDark: computed(() => theme.value === THEME_DARK),
    setTheme,
    toggleTheme,
    initTheme
  }
}

import { computed } from 'vue'
