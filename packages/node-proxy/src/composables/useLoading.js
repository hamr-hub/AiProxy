import { ref, readonly } from 'vue'

const loadingState = ref({
  global: false,
  message: '',
  count: 0
})

export function useLoading() {
  const startLoading = (message = '加载中...') => {
    loadingState.value.count++
    loadingState.value.global = true
    loadingState.value.message = message
  }

  const stopLoading = () => {
    if (loadingState.value.count > 0) {
      loadingState.value.count--
    }
    if (loadingState.value.count === 0) {
      loadingState.value.global = false
      loadingState.value.message = ''
    }
  }

  const setLoading = (loading, message = '') => {
    if (loading) {
      startLoading(message)
    } else {
      stopLoading()
    }
  }

  return {
    loadingState: readonly(loadingState),
    startLoading,
    stopLoading,
    setLoading
  }
}
