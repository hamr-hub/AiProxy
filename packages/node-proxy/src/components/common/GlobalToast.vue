<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="[`toast-${toast.type}`, `toast-${toast.position}`]"
        >
          <div class="toast-icon">
            <i :class="getIcon(toast.type)"></i>
          </div>
          <div class="toast-content">
            <p v-if="toast.title" class="toast-title">{{ toast.title }}</p>
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button class="toast-close" @click="removeToast(toast.id)">
            <i class="fas fa-times"></i>
          </button>
          <div v-if="toast.progress !== null" class="toast-progress" :style="{ width: toast.progress + '%' }"></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast, getIcon } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  min-width: 320px;
  max-width: 420px;
  pointer-events: auto;
  position: relative;
  overflow: hidden;
  border-left: 4px solid;
}

.toast-top-right {
  top: 20px;
  right: 20px;
}

.toast-top-left {
  top: 20px;
  left: 20px;
}

.toast-bottom-right {
  bottom: 20px;
  right: 20px;
}

.toast-bottom-left {
  bottom: 20px;
  left: 20px;
}

.toast-success {
  border-left-color: #10b981;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 2px;
}

.toast-message {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  color: #4b5563;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  transition: width 0.1s linear;
}

.toast-success .toast-progress {
  background: #10b981;
}

.toast-error .toast-progress {
  background: #ef4444;
}

.toast-warning .toast-progress {
  background: #f59e0b;
}

.toast-info .toast-progress {
  background: #3b82f6;
}

.toast-enter-active {
  animation: toast-in 0.3s ease;
}

.toast-leave-active {
  animation: toast-out 0.3s ease;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100px);
  }
}
</style>
