<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const pathFilter = route.path.split('/').filter(Boolean)

const breadCrumbItems = [
  {
    label: 'Dashboard',
    to: '/dashboard'
  },
  ...pathFilter.map((segment, index) => {
    const label = segment.replace(/-/g, ' ')
    const to = '/' + pathFilter.slice(0, index + 1).join('/')
    return { label: label.charAt(0).toUpperCase() + label.slice(1), to }
  })
]
</script>
<template>
  <n-breadcrumb>
    <n-breadcrumb-item
      v-for="(item, index) in breadCrumbItems"
      :key="index"
      @click="router.push(item.to)"
      style="cursor: pointer"
    >
      {{ item.label }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
