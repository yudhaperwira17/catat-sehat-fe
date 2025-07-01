<script setup lang="ts">
import UI from '@/components/ui/avatar.vue'
import { useAuthProfile } from '@/services/auth-user'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { data } = useAuthProfile()


const router = useRouter()
const message = useMessage()
const showDropdown = ref(false)
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const options = [
  {
    label: 'Profil Pengguna',
    key: 'profilPengguna'
  },
  {
    label: 'Keluar',
    key: 'logout'
  }
]

const handleSelect = (key: string | number) => {
  if (key === 'logout') {
    message.info('Berhasil keluar')
    localStorage.removeItem('userToken')
    router.push('/auth/user-login')
  } else if (key === 'profilPengguna') {
    message.info('Halaman profil.')
    router.push('/user/setting-account')
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
            <UI :seed="data?.name" />
          </div>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>
