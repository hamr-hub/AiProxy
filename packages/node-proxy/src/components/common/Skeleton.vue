<template>
  <div class="skeleton" :class="[`skeleton-${variant}`, { 'skeleton-animated': animated }]" :style="skeletonStyle">
    <div v-if="variant === 'text'" class="skeleton-text-lines">
      <div v-for="i in lines" :key="i" class="skeleton-line" :style="{ width: i === lines ? '60%' : '100%' }"></div>
    </div>
    <div v-else-if="variant === 'circular'" class="skeleton-circle"></div>
    <div v-else-if="variant === 'rect'" class="skeleton-rect"></div>
    <div v-else-if="variant === 'card'" class="skeleton-card">
      <div class="skeleton-card-header">
        <div class="skeleton-circle-sm"></div>
        <div class="skeleton-line-sm"></div>
      </div>
      <div class="skeleton-card-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line" style="width: 80%"></div>
        <div class="skeleton-line" style="width: 60%"></div>
      </div>
    </div>
    <div v-else-if="variant === 'table'" class="skeleton-table">
      <div class="skeleton-table-header">
        <div v-for="i in rows > 0 ? 4 : 0" :key="i" class="skeleton-line" style="width: 25%"></div>
      </div>
      <div v-for="row in rows" :key="row" class="skeleton-table-row">
        <div v-for="i in 4" :key="i" class="skeleton-line" :style="{ width: `${15 + Math.random() * 25}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'rect',
    validator: (v) => ['rect', 'circular', 'text', 'card', 'table'].includes(v)
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '20px'
  },
  lines: {
    type: Number,
    default: 3
  },
  rows: {
    type: Number,
    default: 3
  },
  animated: {
    type: Boolean,
    default: true
  },
  borderRadius: {
    type: String,
    default: '8px'
  }
})

const skeletonStyle = computed(() => ({
  width: props.width,
  height: props.variant === 'text' ? 'auto' : props.height,
  borderRadius: props.borderRadius
}))
</script>

<style scoped>
.skeleton {
  background: #e5e7eb;
}

.dark .skeleton {
  background: #374151;
}

.skeleton-animated {
  background: linear-gradient(
    90deg,
    #e5e7eb 25%,
    #f3f4f6 50%,
    #e5e7eb 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.dark .skeleton-animated {
  background: linear-gradient(
    90deg,
    #374151 25%,
    #4b5563 50%,
    #374151 75%
  );
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-rect {
  width: 100%;
  height: 100%;
  min-height: 100px;
  border-radius: 8px;
}

.skeleton-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.skeleton-circle-sm {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-text-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.skeleton-line {
  height: 16px;
  background: #d1d5db;
  border-radius: 4px;
  width: 100%;
}

.dark .skeleton-line {
  background: #4b5563;
}

.skeleton-line-sm {
  height: 12px;
  background: #d1d5db;
  border-radius: 4px;
  flex: 1;
}

.dark .skeleton-line-sm {
  background: #4b5563;
}

.skeleton-card {
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.dark .skeleton-card {
  background: #1f2937;
  border-color: #374151;
}

.skeleton-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-table-header {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.dark .skeleton-table-header {
  border-color: #374151;
}

.skeleton-table-row {
  display: flex;
  gap: 16px;
  padding: 12px 0;
}
</style>
