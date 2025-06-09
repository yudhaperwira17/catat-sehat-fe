<script setup lang="ts">
import { NButton, NCard } from 'naive-ui'

const router = useRouter()

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleLogin() {
  router.push('/auth/user-login')
}
function handleRegister() {
  router.push('/auth/registration-form')
}
</script>
<template>
  <div class="min-h-screen w-full bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="flex items-center space-x-2">
              <img
                src="/src/assets/images/Logo transparan catatsehat.png"
                alt="Logo"
                width="207"
                height="41"
              />
            </div>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a
              href="#home"
              @click="scrollTo('home')"
              class="text-gray-700 hover:text-blue-600 cursor-pointer font-medium"
            >
              Home
            </a>
            <a
              href="#fitur"
              @click="scrollTo('fitur')"
              class="text-gray-700 hover:text-blue-600 cursor-pointer font-medium"
            >
              Fitur
            </a>
            <a
              href="#artikel"
              @click="scrollTo('artikel')"
              class="text-gray-700 hover:text-blue-600 cursor-pointer font-medium"
            >
              Artikel
            </a>
          </nav>

          <!-- Login Button -->
          <n-button type="primary" size="medium" @click="handleLogin"> Masuk </n-button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="home" class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <!-- Hero Content -->
          <div class="lg:col-span-2">
            <n-card class="p-8 shadow-lg rounded-3xl" :bordered="false">
              <div class="space-y-6">
                <div>
                  <h1 class="text-3xl lg:text-4xl font-bold text-blue-600 mb-4">Catat !</h1>
                  <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Kesehatan Ibu, Kesehatan Anak, dan Kesehatan Lansia
                  </h2>
                  <p class="text-gray-600 text-lg leading-relaxed">
                    Catat Sehat sebagai aplikasi berbasis web sebagai sahar digitalisasi buku kia
                    membantu memudahkan pencatatan kesehatan dengan lebih optimal
                  </p>
                </div>
                <n-button type="primary" size="large" class="px-8" @click="handleRegister">
                  Daftar
                </n-button>
              </div>
            </n-card>
          </div>

          <!-- Hero Illustration -->
          <div class="lg:col-span-1">
            <n-card
              class="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 shadow-lg rounded-3xl"
              :bordered="false"
            >
              <div class="text-center space-y-4">
                <div class="flex justify-center items-center space-x-4">
                  <img
                    src="/src/assets/images/yudha-removebg-preview 1.png"
                    alt="Logo"
                    width="337"
                    height="337"
                  />
                </div>
              </div>
            </n-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="fitur" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <n-card class="p-8" :bordered="false">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Masa Depan Pemantauan Kesehatan Ibu, Kesehatan Anak, dan Kesehatan Lansia
            </h2>
            <p class="text-gray-600 max-w-3xl mx-auto">
              Solusi digital untuk pencatatan dan pemantauan kesehatan yang lebih mudah, aman, dan
              efisien.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Feature 1 -->
            <div class="text-center space-y-4">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto"
              >
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">Mudah Digunakan</h3>
              <p class="text-sm text-gray-600">
                Interface yang intuitif dan mudah dipahami untuk semua kalangan pengguna.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="text-center space-y-4">
              <div
                class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto"
              >
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">Keamanan Terjamin</h3>
              <p class="text-sm text-gray-600">
                Data kesehatan Anda tersimpan dengan aman menggunakan enkripsi terkini.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="text-center space-y-4">
              <div
                class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto"
              >
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">Aksesibilitas Tinggi</h3>
              <p class="text-sm text-gray-600">
                Dapat diakses kapan saja dan dimana saja melalui berbagai perangkat.
              </p>
            </div>

            <!-- Feature 4 -->
            <div class="text-center space-y-4">
              <div
                class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto"
              >
                <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">Terintegrasi & Efisien</h3>
              <p class="text-sm text-gray-600">
                Terintegrasi dengan sistem kesehatan yang ada untuk efisiensi maksimal.
              </p>
            </div>
          </div>
        </n-card>
      </div>
    </section>

    <!-- Health Categories Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <!-- Kesehatan Ibu -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <n-card class="p-8" :bordered="false">
            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-gray-900">Kesehatan Ibu</h3>
              <p class="text-gray-600">
                Catat kesehatan ibu hamil hingga ibu nifas didukung dengan fitur bmi ibu hamil dan
                obat penambah darah
              </p>
            </div>
          </n-card>
          <n-card
            class="bg-gradient-to-br from-blue-500 to-blue-700 p-8 flex items-center justify-center"
            :bordered="false"
          >
            <div
              class="w-32 h-56 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center"
            >
              <div class="w-24 h-48 bg-white rounded-xl"></div>
            </div>
          </n-card>
        </div>

        <!-- Kesehatan Anak -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <n-card
            class="bg-gradient-to-br from-blue-500 to-blue-700 p-8 flex items-center justify-center lg:order-1"
            :bordered="false"
          >
            <div
              class="w-32 h-56 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center"
            >
              <div class="w-24 h-48 bg-white rounded-xl"></div>
            </div>
          </n-card>
          <n-card class="p-8 lg:order-2" :bordered="false">
            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-gray-900">Kesehatan Anak</h3>
              <p class="text-gray-600">
                Pantau kesehatan anak dengan fitur pencatatan imunisasi, tumbuh kembang, dan fitur
                lainnya secara terpadu.
              </p>
            </div>
          </n-card>
        </div>

        <!-- Kesehatan Lansia -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <n-card class="p-8" :bordered="false">
            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-gray-900">Kesehatan Lansia</h3>
              <p class="text-gray-600">
                Pantau kesehatan lansia dengan fitur khusus untuk kebutuhan gaya hidup, kesehatan
                mental, dan aktivitas fisik untuk menjaga kesehatan para orang hingga artikel
                informasi mengenai kesehatan.
              </p>
            </div>
          </n-card>
          <n-card
            class="bg-gradient-to-br from-blue-500 to-blue-700 p-8 flex items-center justify-center"
            :bordered="false"
          >
            <div
              class="w-32 h-56 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center"
            >
              <div class="w-24 h-48 bg-white rounded-xl"></div>
            </div>
          </n-card>
        </div>
      </div>
    </section>

    <!-- Articles Section -->
    <section id="artikel" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Artikel Kesehatan</h2>
          <p class="text-gray-600">Dapatkan informasi kesehatan terkini dan tips berguna</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <n-card
            v-for="i in 6"
            :key="i"
            class="hover:shadow-lg transition-shadow"
            :bordered="false"
          >
            <div class="space-y-4">
              <div class="w-full h-48 bg-gray-200 rounded-lg"></div>
              <h3 class="font-semibold text-gray-900">Tips Kesehatan Ibu Hamil</h3>
              <p class="text-sm text-gray-600">
                Panduan lengkap untuk menjaga kesehatan selama masa kehamilan...
              </p>
              <n-button text type="primary">Baca Selengkapnya</n-button>
            </div>
          </n-card>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-xl font-bold">catatsehat</span>
            </div>
            <p class="text-gray-400">
              Solusi digital untuk pencatatan kesehatan yang mudah dan aman.
            </p>
          </div>

          <div>
            <h4 class="font-semibold mb-4">Fitur</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Kesehatan Ibu</a></li>
              <li><a href="#" class="hover:text-white">Kesehatan Anak</a></li>
              <li><a href="#" class="hover:text-white">Kesehatan Lansia</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-4">Bantuan</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">FAQ</a></li>
              <li><a href="#" class="hover:text-white">Kontak</a></li>
              <li><a href="#" class="hover:text-white">Dukungan</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white">Privasi</a></li>
              <li><a href="#" class="hover:text-white">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CatatSehat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
<style scoped>
/* Custom styles if needed */
.n-card {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.n-card:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
