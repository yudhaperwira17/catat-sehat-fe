<script setup lang="ts">
import UiAvatarAdmin from '@/components/ui/avatar-admin.vue';
import { useAuthProfileAdmin } from '@/services/auth-user';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { data } = useAuthProfileAdmin()

const showDropdown = ref(false)
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const router = useRouter()
const message = useMessage()

const options = [
  {
    label: 'Keluar',
    key: 'logout'
  }
]

const handleSelect = (key: string | number) => {
  if (key === 'logout') {
    message.info('Berhasil keluar')
    localStorage.removeItem('adminToken')
    router.push('/auth/admin-login')
  }
}
</script>

<template>
  <div class="justify-end items-center my-4 mr-8 hidden md:flex">
    <div class="flex items-center space-x-4">
      <i class="fas fa-bell text-xl"></i>
      <div class="flex items-center relative">
        <n-dropdown
          placement="bottom-end"
          :options="options"
          trigger="click"
          :show-arrow="true"
          @select="handleSelect"
        >
          <div @click="toggleDropdown" class="cursor-pointer flex items-center space-x-2">
            <UiAvatarAdmin :seed="data?.name" />
            <span class="font-medium">{{ data?.name }}</span>
          </div>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>
