<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-200">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <!-- List of Links -->
      <div class="mt-4 space-y-4">
        <!-- Edit Profil Anak -->
        <router-link to="/edit-profil-anak" class="flex items-center text-black hover:underline">
          <i class="fas fa-user-edit mr-2"></i>
          <span>Edit Profil Anak</span>
        </router-link>

        <!-- QR Pemeriksaan -->
        <router-link to="/qr-pemeriksaan" class="flex items-center text-black hover:underline">
          <i class="fas fa-qrcode mr-2"></i>
          <span>QR Pemeriksaan</span>
        </router-link>

        <!-- Hapus Akun -->
        <router-link to="/hapus-akun" class="flex items-center text-pink-600 hover:underline">
          <i class="fas fa-trash-alt mr-2"></i>
          <span>Hapus Akun</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountSettings'
}
</script>

<!-- Import Tailwind CSS and FontAwesome -->
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
</style>
