<script setup lang="ts">
import { useAuthProfile } from '@/services/auth-user'
import { useReadDashboard, useReadProfileDashboard } from '@/services/dashboard'
import { DateTime } from 'luxon'
import { onMounted, ref } from 'vue'
import headerImage from '@/assets/images/header-dashboard.png'

const { data: user } = useAuthProfile()
const params = ref({ someParam: 'value' }) // Dynamic params for the API
const { data } = useReadDashboard(params)
const { data: profile } = useReadProfileDashboard(params)
// Reactive state
const currentIndex = ref(0)
const images = [headerImage, headerImage, headerImage] // Using imported images

// Function to go to the next image
const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

// Function to go to the previous image
const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

// Auto-scroll function
const autoScroll = () => {
  setInterval(() => {
    nextImage()
  }, 3000)
}

// Lifecycle hook to start auto-scroll when component is mounted
onMounted(() => {
  autoScroll()
})

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="flex bg-gray-50 min-h-screen">
    <div class="flex-1 max-w-full px-6">
      <div class="flex justify-between">
        <div class="flex flex-col">
          <h2
            class="text-base text-medium md:text-xl md:font-bold text-black text-left mt-6 mb-4 md:mt-auto md:mb-auto"
          >
            Dashboard
          </h2>
          <p class="text-l text-black text-left mt-2 mb-4 hidden md:block">
            Informasi tentang aktifitas anda
          </p>
        </div>
        <div class="flex flex-row text-right text-sm my-auto">
          <i-solar:calendar-bold-duotone class="pr-2 w-5 h-5"> </i-solar:calendar-bold-duotone>
          {{ formatDate(new Date()) }}
        </div>
      </div>

      <!-- Banner -->
      <div class="h-24 relative mb-4 bg-blue-500 rounded-lg flex items-center md:h-52 gap-y-6">
        <!-- Tulisan "Kesehatan Gigi" -->
        <h2
          class="absolute ml-4 mt-0 md:left-5 md:top-1/2 md:transform md:-translate-y-1/2 text-sm text-white md:text-5xl font-semibold z-10"
        >
          Kesehatan Gigi
        </h2>

        <p
          class="absolute ml-4 mt-6 text-xs md:left-5 md:top-3/4 md:transform md:-translate-y-1/2 text-white md:text-xl font-medium z-10 md:mt-0"
        >
          Mulai dari dini
        </p>

        <!-- Gambar Banner -->
        <n-carousel autoplay>
          <img
            v-for="(image, index) in images"
            :key="index"
            class="w-full h-full object-cover rounded-lg transition-opacity duration-500"
            :src="images[currentIndex]"
            alt="Gambar Banner"
          />
        </n-carousel>
      </div>
      <div class="bg-white h-20 rounded-lg md:hidden mb-4">
        <div class="flex flex-row h-20 p-3 rounded-lg shadow-md">
          <div class="flex md:flex md:items-center md:space-x-4">
            <ui-avatar :seed="user?.fullName" />
            <div class="flex flex-col my-auto ml-4">
              <!-- Menggunakan flex-col untuk menyusun nama dan email secara vertikal -->
              <p class="font-bold text-xs">{{ profile?.fullName }}</p>
              <p class="text-gray-800 text-xs font-normal">{{ profile?.email }}</p>
              <!-- Email di bawah nama -->
            </div>
          </div>
          <div class="flex justify-end items-center ml-auto">
            <!-- Menempatkan tombol di sebelah kanan -->
            <router-link to="/user/setting-account">
              <n-button type="tertiary" class="text-black">Ubah Profil </n-button>
            </router-link>
          </div>
        </div>
      </div>

      <!-- tampilan mobile -->
      <div class="grid grid-cols-3 mb-4 gap-4 md:hidden">
        <div class="rounded-lg">
          <div
            id="perkembangan anak"
            class="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
            style="background: linear-gradient(135deg, white 60%, #e4f1fc 80%, #d1e8fa 100%)"
          >
            <div class="flex flex-col items-center justify-center mb-2">
              <div class="flex flex-col items-center">
                <div class="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_518_2954)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.513 2.452C3.69337 2.37806 3.83786 2.23679 3.91585 2.05814C3.99385 1.87948 3.99922 1.67748 3.93083 1.49493C3.86244 1.31239 3.72566 1.16364 3.54948 1.08021C3.3733 0.996785 3.17155 0.985233 2.987 1.048L1.96 1.433C1.53126 1.59378 1.16177 1.88153 0.90089 2.25785C0.640009 2.63416 0.500153 3.08111 0.5 3.539V6C0.499774 7.17753 0.936931 8.31316 1.72666 9.1866C2.5164 10.06 3.6024 10.609 4.774 10.727C4.89633 11.9393 5.47985 13.0582 6.40391 13.8524C7.32797 14.6466 8.52189 15.0554 9.7388 14.9941C10.9557 14.9328 12.1026 14.4063 12.9422 13.5233C13.7818 12.6403 14.25 11.4685 14.25 10.25V9.886C14.8201 9.70681 15.3071 9.32943 15.623 8.82218C15.9389 8.31494 16.0627 7.71136 15.9721 7.12072C15.8814 6.53007 15.5823 5.9914 15.1288 5.60223C14.6754 5.21306 14.0976 4.99911 13.5 4.99911C12.9024 4.99911 12.3246 5.21306 11.8712 5.60223C11.4177 5.9914 11.1186 6.53007 11.0279 7.12072C10.9373 7.71136 11.0611 8.31494 11.377 8.82218C11.6929 9.32943 12.1799 9.70681 12.75 9.886V10.25C12.751 11.0788 12.4354 11.8768 11.8675 12.4805C11.2997 13.0843 10.5227 13.4484 9.69534 13.4982C8.868 13.548 8.05289 13.2798 7.41673 12.7485C6.78056 12.2172 6.37143 11.463 6.273 10.64C7.3299 10.4069 8.27551 9.81987 8.95328 8.97607C9.63105 8.13227 10.0003 7.0823 10 6V3.54C10.0001 3.08194 9.86029 2.63477 9.59939 2.25826C9.3385 1.88175 8.9689 1.59384 8.54 1.433L7.513 1.048C7.32845 0.985233 7.1267 0.996785 6.95052 1.08021C6.77434 1.16364 6.63756 1.31239 6.56917 1.49493C6.50078 1.67748 6.50615 1.87948 6.58415 2.05814C6.66214 2.23679 6.80663 2.37806 6.987 2.452L8.013 2.837C8.15598 2.89054 8.27921 2.98644 8.36623 3.11188C8.45326 3.23732 8.49992 3.38633 8.5 3.539V6C8.5 6.86196 8.15759 7.68861 7.5481 8.2981C6.9386 8.90759 6.11195 9.25 5.25 9.25C4.38805 9.25 3.5614 8.90759 2.9519 8.2981C2.34241 7.68861 2 6.86196 2 6V3.54C1.99987 3.38716 2.04645 3.23793 2.13348 3.11229C2.22052 2.98665 2.34386 2.8906 2.487 2.837L3.513 2.452ZM13.5 8.5C13.7652 8.5 14.0196 8.39465 14.2071 8.20711C14.3946 8.01957 14.5 7.76522 14.5 7.5C14.5 7.23479 14.3946 6.98043 14.2071 6.7929C14.0196 6.60536 13.7652 6.5 13.5 6.5C13.2348 6.5 12.9804 6.60536 12.7929 6.7929C12.6054 6.98043 12.5 7.23479 12.5 7.5C12.5 7.76522 12.6054 8.01957 12.7929 8.20711C12.9804 8.39465 13.2348 8.5 13.5 8.5Z"
                        fill="#E74694"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_518_2954">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                <!-- Angka 5 ditaruh di tengah -->
                <p class="text-[18] font-bold text-center">{{ data?.checkupTotal }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <p class="text-xs text-center font-normal">Total Periksa</p>
            </div>
          </div>
        </div>
        <div class="rounded-lg">
          <router-link to="/user/checkup-child">
            <div
              class="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
              style="background: linear-gradient(135deg, white 60%, #e4f1fc 80%, #d1e8fa 100%)"
            >
              <div class="flex flex-col items-center justify-center mb-2">
                <div class="flex flex-col items-center">
                  <div class="mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 15 18"
                      fill="none"
                    >
                      <path
                        d="M0.404541 15.412V12.206C0.404541 11.0973 0.795404 10.1523 1.57713 9.37116C2.35885 8.58997 3.30382 8.1991 4.41202 8.19857H13.0081C13.5157 8.19857 13.9466 8.37223 14.3009 8.71954C14.6551 9.06686 14.832 9.49432 14.8315 10.0019C14.8315 10.416 14.7046 10.7869 14.4508 11.1144C14.1969 11.442 13.8763 11.6589 13.489 11.7652L11.6255 12.3062V15.412C11.6255 15.6926 11.5622 15.9464 11.4355 16.1735C11.3089 16.4005 11.1384 16.5876 10.9242 16.7345C10.7099 16.8814 10.4761 16.9717 10.2229 17.0054C9.96959 17.0391 9.7091 17.0022 9.4414 16.8948L5.65434 15.412H0.404541ZM10.0225 13.0075H5.51408C5.42057 13.0075 5.35057 13.0343 5.30408 13.0877C5.2576 13.1411 5.22741 13.2012 5.21352 13.268C5.19962 13.3348 5.20977 13.3984 5.24397 13.4588C5.27817 13.5192 5.33481 13.5624 5.41389 13.5886L10.0225 15.412V13.0075ZM2.00753 13.809H3.69067C3.66396 13.7289 3.64392 13.6487 3.63056 13.5686C3.6172 13.4884 3.61052 13.4016 3.61052 13.3081C3.61052 12.7871 3.79754 12.3396 4.17157 11.9656C4.5456 11.5916 4.9931 11.4046 5.51408 11.4046H8.78017L13.0682 10.2223C13.135 10.1956 13.1817 10.1622 13.2084 10.1222C13.2352 10.0821 13.2418 10.0353 13.2285 9.9819C13.2151 9.92846 13.1916 9.88518 13.1579 9.85205C13.1243 9.81893 13.0743 9.80209 13.0081 9.80156H4.41202C3.74411 9.80156 3.17638 10.0353 2.70884 10.5029C2.2413 10.9704 2.00753 11.5381 2.00753 12.206V13.809ZM6.01501 7.39707C5.13337 7.39707 4.37862 7.08315 3.75079 6.45532C3.12295 5.82748 2.80903 5.07274 2.80903 4.19109C2.80903 3.30944 3.12295 2.5547 3.75079 1.92686C4.37862 1.29903 5.13337 0.985107 6.01501 0.985107C6.89666 0.985107 7.6514 1.29903 8.27924 1.92686C8.90707 2.5547 9.22099 3.30944 9.22099 4.19109C9.22099 5.07274 8.90707 5.82748 8.27924 6.45532C7.6514 7.08315 6.89666 7.39707 6.01501 7.39707ZM6.01501 5.79408C6.45583 5.79408 6.83334 5.63726 7.14752 5.3236C7.46171 5.00995 7.61854 4.63245 7.618 4.19109C7.61747 3.74973 7.46064 3.3725 7.14752 3.05938C6.83441 2.74626 6.4569 2.58917 6.01501 2.5881C5.57312 2.58703 5.19588 2.74412 4.8833 3.05938C4.57072 3.37463 4.41362 3.75187 4.41202 4.19109C4.41042 4.63031 4.56751 5.00781 4.8833 5.3236C5.19909 5.63939 5.57633 5.79622 6.01501 5.79408Z"
                        fill="#E74694"
                      />
                    </svg>
                  </div>

                  <!-- Angka 5 ditaruh di tengah -->
                  <p class="text-[18] font-bold text-center">{{ data?.checkupChild }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-xs text-center font-normal">Monitoring Anak</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="rounded-lg">
          <router-link to="/user/health-mom">
            <div
              class="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
              style="background: linear-gradient(135deg, white 60%, #e4f1fc 80%, #d1e8fa 100%)"
            >
              <div class="flex flex-col items-center justify-center mb-2">
                <div class="flex flex-col items-center">
                  <div class="mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 11.4737C11.0415 11.4737 10.1046 11.1959 9.30762 10.6754C8.51068 10.1549 7.88953 9.4151 7.52274 8.54955C7.15594 7.68401 7.05997 6.73159 7.24696 5.81273C7.43395 4.89387 7.89551 4.04985 8.57325 3.38739C9.251 2.72493 10.1145 2.27379 11.0546 2.09102C11.9946 1.90825 12.969 2.00205 13.8545 2.36057C14.7401 2.71909 15.4969 3.32623 16.0294 4.1052C16.5619 4.88416 16.8462 5.79998 16.8462 6.73684C16.8447 7.9927 16.3337 9.19673 15.4252 10.0848C14.5167 10.9728 13.2848 11.4723 12 11.4737ZM12 4.10526C11.4675 4.10526 10.947 4.2596 10.5042 4.54877C10.0615 4.83793 9.71641 5.24892 9.51263 5.72978C9.30886 6.21064 9.25554 6.73976 9.35942 7.25024C9.46331 7.76072 9.71973 8.22962 10.0963 8.59765C10.4728 8.96568 10.9525 9.21632 11.4748 9.31786C11.997 9.4194 12.5383 9.36728 13.0303 9.16811C13.5223 8.96893 13.9427 8.63163 14.2386 8.19887C14.5344 7.76611 14.6923 7.25732 14.6923 6.73684C14.6923 6.03891 14.4087 5.36955 13.9037 4.87604C13.3988 4.38252 12.714 4.10526 12 4.10526Z"
                        fill="#E74694"
                      />
                      <path
                        d="M17.9231 22H6.07692C5.79131 22 5.51739 21.8891 5.31542 21.6917C5.11346 21.4943 5 21.2265 5 20.9474V17.7895C5.00171 16.3941 5.56957 15.0564 6.57901 14.0697C7.58845 13.083 8.95705 12.528 10.3846 12.5263H13.6154C15.0429 12.528 16.4116 13.083 17.421 14.0697C18.4304 15.0564 18.9983 16.3941 19 17.7895V20.9474C19 21.2265 18.8865 21.4943 18.6846 21.6917C18.4826 21.8891 18.2087 22 17.9231 22ZM7.15385 19.8947H16.8462V17.7895C16.8462 16.9519 16.5058 16.1487 15.8999 15.5565C15.294 14.9643 14.4722 14.6316 13.6154 14.6316H10.3846C9.52776 14.6316 8.706 14.9643 8.10012 15.5565C7.49423 16.1487 7.15385 16.9519 7.15385 17.7895V19.8947Z"
                        fill="#E74694"
                      />
                    </svg>
                  </div>

                  <!-- Angka 5 ditaruh di tengah -->
                  <p class="text-[18] font-bold text-center">{{ data?.checkupMother }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-xs text-center font-normal">Monitoring Ibu</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <!-- tampilan tablet -->
      <div class="md:grid grid-cols-2 mb-4 gap-4 lg:hidden hidden">
        <div class="rounded-lg">
          <div
            id="card"
            class="bg-white p-6 rounded-lg shadow-md border border-grey-200"
            style="background: white"
          >
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-bold text-sm">Profil Pengguna</h3>
              <router-link to="/user/setting-account">
                <n-button
                  class="text-black bg-white border text-xs border-blue-500 px-2 py-2 rounded-lg"
                >
                  Ubah Profil
                </n-button>
              </router-link>
            </div>
            <div class="md:flex md:items-center md:space-x-4">
              <ui-avatar :seed="user?.fullName" />
              <div>
                <p class="font-medium text-xl">{{ profile?.fullName }}</p>
                <p class="text-gray-500">{{ profile?.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg">
          <div
            id="perkembangan anak"
            class="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
            style="background: linear-gradient(135deg, white 60%, #e4f1fc 80%, #d1e8fa 100%)"
          >
            <div class="flex flex-col items-center justify-center mb-2">
              <div class="flex flex-col items-center">
                <div class="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_518_2954)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.513 2.452C3.69337 2.37806 3.83786 2.23679 3.91585 2.05814C3.99385 1.87948 3.99922 1.67748 3.93083 1.49493C3.86244 1.31239 3.72566 1.16364 3.54948 1.08021C3.3733 0.996785 3.17155 0.985233 2.987 1.048L1.96 1.433C1.53126 1.59378 1.16177 1.88153 0.90089 2.25785C0.640009 2.63416 0.500153 3.08111 0.5 3.539V6C0.499774 7.17753 0.936931 8.31316 1.72666 9.1866C2.5164 10.06 3.6024 10.609 4.774 10.727C4.89633 11.9393 5.47985 13.0582 6.40391 13.8524C7.32797 14.6466 8.52189 15.0554 9.7388 14.9941C10.9557 14.9328 12.1026 14.4063 12.9422 13.5233C13.7818 12.6403 14.25 11.4685 14.25 10.25V9.886C14.8201 9.70681 15.3071 9.32943 15.623 8.82218C15.9389 8.31494 16.0627 7.71136 15.9721 7.12072C15.8814 6.53007 15.5823 5.9914 15.1288 5.60223C14.6754 5.21306 14.0976 4.99911 13.5 4.99911C12.9024 4.99911 12.3246 5.21306 11.8712 5.60223C11.4177 5.9914 11.1186 6.53007 11.0279 7.12072C10.9373 7.71136 11.0611 8.31494 11.377 8.82218C11.6929 9.32943 12.1799 9.70681 12.75 9.886V10.25C12.751 11.0788 12.4354 11.8768 11.8675 12.4805C11.2997 13.0843 10.5227 13.4484 9.69534 13.4982C8.868 13.548 8.05289 13.2798 7.41673 12.7485C6.78056 12.2172 6.37143 11.463 6.273 10.64C7.3299 10.4069 8.27551 9.81987 8.95328 8.97607C9.63105 8.13227 10.0003 7.0823 10 6V3.54C10.0001 3.08194 9.86029 2.63477 9.59939 2.25826C9.3385 1.88175 8.9689 1.59384 8.54 1.433L7.513 1.048C7.32845 0.985233 7.1267 0.996785 6.95052 1.08021C6.77434 1.16364 6.63756 1.31239 6.56917 1.49493C6.50078 1.67748 6.50615 1.87948 6.58415 2.05814C6.66214 2.23679 6.80663 2.37806 6.987 2.452L8.013 2.837C8.15598 2.89054 8.27921 2.98644 8.36623 3.11188C8.45326 3.23732 8.49992 3.38633 8.5 3.539V6C8.5 6.86196 8.15759 7.68861 7.5481 8.2981C6.9386 8.90759 6.11195 9.25 5.25 9.25C4.38805 9.25 3.5614 8.90759 2.9519 8.2981C2.34241 7.68861 2 6.86196 2 6V3.54C1.99987 3.38716 2.04645 3.23793 2.13348 3.11229C2.22052 2.98665 2.34386 2.8906 2.487 2.837L3.513 2.452ZM13.5 8.5C13.7652 8.5 14.0196 8.39465 14.2071 8.20711C14.3946 8.01957 14.5 7.76522 14.5 7.5C14.5 7.23479 14.3946 6.98043 14.2071 6.7929C14.0196 6.60536 13.7652 6.5 13.5 6.5C13.2348 6.5 12.9804 6.60536 12.7929 6.7929C12.6054 6.98043 12.5 7.23479 12.5 7.5C12.5 7.76522 12.6054 8.01957 12.7929 8.20711C12.9804 8.39465 13.2348 8.5 13.5 8.5Z"
                        fill="#E74694"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_518_2954">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>

                <!-- Angka 5 ditaruh di tengah -->
                <p class="text-[18] font-bold text-center">{{ data?.checkupTotal }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <p class="text-xs text-center font-normal">Total Periksa</p>
            </div>
          </div>
        </div>
        <div class="rounded-lg">
          <router-link to="/user/checkup-child">
            <div
              class="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
              style="background: linear-gradient(135deg, white 60%, #e4f1fc 80%, #d1e8fa 100%)"
            >
              <div class="flex flex-col items-center justify-center mb-2">
                <div class="flex flex-col items-center">
                  <div class="mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 15 18"
                      fill="none"
                    >
                      <path
                        d="M0.404541 15.412V12.206C0.404541 11.0973 0.795404 10.1523 1.57713 9.37116C2.35885 8.58997 3.30382 8.1991 4.41202 8.19857H13.0081C13.5157 8.19857 13.9466 8.37223 14.3009 8.71954C14.6551 9.06686 14.832 9.49432 14.8315 10.0019C14.8315 10.416 14.7046 10.7869 14.4508 11.1144C14.1969 11.442 13.8763 11.6589 13.489 11.7652L11.6255 12.3062V15.412C11.6255 15.6926 11.5622 15.9464 11.4355 16.1735C11.3089 16.4005 11.1384 16.5876 10.9242 16.7345C10.7099 16.8814 10.4761 16.9717 10.2229 17.0054C9.96959 17.0391 9.7091 17.0022 9.4414 16.8948L5.65434 15.412H0.404541ZM10.0225 13.0075H5.51408C5.42057 13.0075 5.35057 13.0343 5.30408 13.0877C5.2576 13.1411 5.22741 13.2012 5.21352 13.268C5.19962 13.3348 5.20977 13.3984 5.24397 13.4588C5.27817 13.5192 5.33481 13.5624 5.41389 13.5886L10.0225 15.412V13.0075ZM2.00753 13.809H3.69067C3.66396 13.7289 3.64392 13.6487 3.63056 13.5686C3.6172 13.4884 3.61052 13.4016 3.61052 13.3081C3.61052 12.7871 3.79754 12.3396 4.17157 11.9656C4.5456 11.5916 4.9931 11.4046 5.51408 11.4046H8.78017L13.0682 10.2223C13.135 10.1956 13.1817 10.1622 13.2084 10.1222C13.2352 10.0821 13.2418 10.0353 13.2285 9.9819C13.2151 9.92846 13.1916 9.88518 13.1579 9.85205C13.1243 9.81893 13.0743 9.80209 13.0081 9.80156H4.41202C3.74411 9.80156 3.17638 10.0353 2.70884 10.5029C2.2413 10.9704 2.00753 11.5381 2.00753 12.206V13.809ZM6.01501 7.39707C5.13337 7.39707 4.37862 7.08315 3.75079 6.45532C3.12295 5.82748 2.80903 5.07274 2.80903 4.19109C2.80903 3.30944 3.12295 2.5547 3.75079 1.92686C4.37862 1.29903 5.13337 0.985107 6.01501 0.985107C6.89666 0.985107 7.6514 1.29903 8.27924 1.92686C8.90707 2.5547 9.22099 3.30944 9.22099 4.19109C9.22099 5.07274 8.90707 5.82748 8.27924 6.45532C7.6514 7.08315 6.89666 7.39707 6.01501 7.39707ZM6.01501 5.79408C6.45583 5.79408 6.83334 5.63726 7.14752 5.3236C7.46171 5.00995 7.61854 4.63245 7.618 4.19109C7.61747 3.74973 7.46064 3.3725 7.14752 3.05938C6.83441 2.74626 6.4569 2.58917 6.01501 2.5881C5.57312 2.58703 5.19588 2.74412 4.8833 3.05938C4.57072 3.37463 4.41362 3.75187 4.41202 4.19109C4.41042 4.63031 4.56751 5.00781 4.8833 5.3236C5.19909 5.63939 5.57633 5.79622 6.01501 5.79408Z"
                        fill="#E74694"
                      />
                    </svg>
                  </div>

                  <!-- Angka 5 ditaruh di tengah -->
                  <p class="text-[18] font-bold text-center">{{ data?.checkupChild }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-xs text-center font-normal">Monitoring Anak</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="rounded-lg">
          <router-link to="/user/health-mom">
            <div
              class="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
              style="background: linear-gradient(135deg, white 60%, #e4f1fc 80%, #d1e8fa 100%)"
            >
              <div class="flex flex-col items-center justify-center mb-2">
                <div class="flex flex-col items-center">
                  <div class="mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 11.4737C11.0415 11.4737 10.1046 11.1959 9.30762 10.6754C8.51068 10.1549 7.88953 9.4151 7.52274 8.54955C7.15594 7.68401 7.05997 6.73159 7.24696 5.81273C7.43395 4.89387 7.89551 4.04985 8.57325 3.38739C9.251 2.72493 10.1145 2.27379 11.0546 2.09102C11.9946 1.90825 12.969 2.00205 13.8545 2.36057C14.7401 2.71909 15.4969 3.32623 16.0294 4.1052C16.5619 4.88416 16.8462 5.79998 16.8462 6.73684C16.8447 7.9927 16.3337 9.19673 15.4252 10.0848C14.5167 10.9728 13.2848 11.4723 12 11.4737ZM12 4.10526C11.4675 4.10526 10.947 4.2596 10.5042 4.54877C10.0615 4.83793 9.71641 5.24892 9.51263 5.72978C9.30886 6.21064 9.25554 6.73976 9.35942 7.25024C9.46331 7.76072 9.71973 8.22962 10.0963 8.59765C10.4728 8.96568 10.9525 9.21632 11.4748 9.31786C11.997 9.4194 12.5383 9.36728 13.0303 9.16811C13.5223 8.96893 13.9427 8.63163 14.2386 8.19887C14.5344 7.76611 14.6923 7.25732 14.6923 6.73684C14.6923 6.03891 14.4087 5.36955 13.9037 4.87604C13.3988 4.38252 12.714 4.10526 12 4.10526Z"
                        fill="#E74694"
                      />
                      <path
                        d="M17.9231 22H6.07692C5.79131 22 5.51739 21.8891 5.31542 21.6917C5.11346 21.4943 5 21.2265 5 20.9474V17.7895C5.00171 16.3941 5.56957 15.0564 6.57901 14.0697C7.58845 13.083 8.95705 12.528 10.3846 12.5263H13.6154C15.0429 12.528 16.4116 13.083 17.421 14.0697C18.4304 15.0564 18.9983 16.3941 19 17.7895V20.9474C19 21.2265 18.8865 21.4943 18.6846 21.6917C18.4826 21.8891 18.2087 22 17.9231 22ZM7.15385 19.8947H16.8462V17.7895C16.8462 16.9519 16.5058 16.1487 15.8999 15.5565C15.294 14.9643 14.4722 14.6316 13.6154 14.6316H10.3846C9.52776 14.6316 8.706 14.9643 8.10012 15.5565C7.49423 16.1487 7.15385 16.9519 7.15385 17.7895V19.8947Z"
                        fill="#E74694"
                      />
                    </svg>
                  </div>

                  <!-- Angka 5 ditaruh di tengah -->
                  <p class="text-[18] font-bold text-center">{{ data?.checkupMother }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-xs text-center font-normal">Monitoring Ibu</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- tampilan desktop -->
      <div>
        <div class="lg:grid grid-cols-4 gap-4 mb-4 hidden">
          <div class="rounded-lg">
            <div
              id="card"
              class="bg-white p-6 rounded-lg shadow-md border border-grey-200"
              style="background: white"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-sm">Profil Pengguna</h3>
                <router-link to="/user/setting-account">
                  <n-button
                    class="text-black bg-white border text-xs border-pink-500 px-2 py-2 rounded-lg"
                  >
                    Ubah Profil
                  </n-button>
                </router-link>
              </div>
              <div class="md:flex md:items-center md:space-x-4">
                <ui-avatar :seed="user?.fullName" />
                <div>
                  <p class="font-medium text-xl">{{ profile?.fullName }}</p>
                  <p class="text-gray-500">{{ profile?.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-lg">
            <div
              id="perkembangan anak"
              class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full border border-grey-200"
              style="
                background: linear-gradient(
                  135deg,
                  white 60%,
                  /* Warna putih mengisi hingga 60% area */ #e4f1fc 80%,
                  /* Gradasi ke warna pink muda dimulai dari 60% hingga 70% */ #d1e8fa 100%
                    /* Warna pink penuh pada 100% area */
                );
              "
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_518_2954)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.513 2.452C3.69337 2.37806 3.83786 2.23679 3.91585 2.05814C3.99385 1.87948 3.99922 1.67748 3.93083 1.49493C3.86244 1.31239 3.72566 1.16364 3.54948 1.08021C3.3733 0.996785 3.17155 0.985233 2.987 1.048L1.96 1.433C1.53126 1.59378 1.16177 1.88153 0.90089 2.25785C0.640009 2.63416 0.500153 3.08111 0.5 3.539V6C0.499774 7.17753 0.936931 8.31316 1.72666 9.1866C2.5164 10.06 3.6024 10.609 4.774 10.727C4.89633 11.9393 5.47985 13.0582 6.40391 13.8524C7.32797 14.6466 8.52189 15.0554 9.7388 14.9941C10.9557 14.9328 12.1026 14.4063 12.9422 13.5233C13.7818 12.6403 14.25 11.4685 14.25 10.25V9.886C14.8201 9.70681 15.3071 9.32943 15.623 8.82218C15.9389 8.31494 16.0627 7.71136 15.9721 7.12072C15.8814 6.53007 15.5823 5.9914 15.1288 5.60223C14.6754 5.21306 14.0976 4.99911 13.5 4.99911C12.9024 4.99911 12.3246 5.21306 11.8712 5.60223C11.4177 5.9914 11.1186 6.53007 11.0279 7.12072C10.9373 7.71136 11.0611 8.31494 11.377 8.82218C11.6929 9.32943 12.1799 9.70681 12.75 9.886V10.25C12.751 11.0788 12.4354 11.8768 11.8675 12.4805C11.2997 13.0843 10.5227 13.4484 9.69534 13.4982C8.868 13.548 8.05289 13.2798 7.41673 12.7485C6.78056 12.2172 6.37143 11.463 6.273 10.64C7.3299 10.4069 8.27551 9.81987 8.95328 8.97607C9.63105 8.13227 10.0003 7.0823 10 6V3.54C10.0001 3.08194 9.86029 2.63477 9.59939 2.25826C9.3385 1.88175 8.9689 1.59384 8.54 1.433L7.513 1.048C7.32845 0.985233 7.1267 0.996785 6.95052 1.08021C6.77434 1.16364 6.63756 1.31239 6.56917 1.49493C6.50078 1.67748 6.50615 1.87948 6.58415 2.05814C6.66214 2.23679 6.80663 2.37806 6.987 2.452L8.013 2.837C8.15598 2.89054 8.27921 2.98644 8.36623 3.11188C8.45326 3.23732 8.49992 3.38633 8.5 3.539V6C8.5 6.86196 8.15759 7.68861 7.5481 8.2981C6.9386 8.90759 6.11195 9.25 5.25 9.25C4.38805 9.25 3.5614 8.90759 2.9519 8.2981C2.34241 7.68861 2 6.86196 2 6V3.54C1.99987 3.38716 2.04645 3.23793 2.13348 3.11229C2.22052 2.98665 2.34386 2.8906 2.487 2.837L3.513 2.452ZM13.5 8.5C13.7652 8.5 14.0196 8.39465 14.2071 8.20711C14.3946 8.01957 14.5 7.76522 14.5 7.5C14.5 7.23479 14.3946 6.98043 14.2071 6.7929C14.0196 6.60536 13.7652 6.5 13.5 6.5C13.2348 6.5 12.9804 6.60536 12.7929 6.7929C12.6054 6.98043 12.5 7.23479 12.5 7.5C12.5 7.76522 12.6054 8.01957 12.7929 8.20711C12.9804 8.39465 13.2348 8.5 13.5 8.5Z"
                        fill="#E74694"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_518_2954">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <h3 class="font-bold text-2xl">Total Periksa</h3>
                </div>
                <div class="flex items-center space-x-4">
                  <p class="text-3xl font-extrabold">{{ data?.checkupTotal }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between"></div>
            </div>
          </div>
          <div class="rounded-lg">
            <div
              id="monitoring anak"
              class="bg-white border border-grey-200 p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
              style="
                background: linear-gradient(
                  135deg,
                  white 60%,
                  /* Warna putih mengisi hingga 60% area */ #e4f1fc 80%,
                  /* Gradasi ke warna pink muda dimulai dari 60% hingga 70% */ #d1e8fa 100%
                    /* Warna pink penuh pada 100% area */
                );
              "
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="26"
                    viewBox="0 0 15 18"
                    fill="none"
                  >
                    <path
                      d="M0.404541 15.412V12.206C0.404541 11.0973 0.795404 10.1523 1.57713 9.37116C2.35885 8.58997 3.30382 8.1991 4.41202 8.19857H13.0081C13.5157 8.19857 13.9466 8.37223 14.3009 8.71954C14.6551 9.06686 14.832 9.49432 14.8315 10.0019C14.8315 10.416 14.7046 10.7869 14.4508 11.1144C14.1969 11.442 13.8763 11.6589 13.489 11.7652L11.6255 12.3062V15.412C11.6255 15.6926 11.5622 15.9464 11.4355 16.1735C11.3089 16.4005 11.1384 16.5876 10.9242 16.7345C10.7099 16.8814 10.4761 16.9717 10.2229 17.0054C9.96959 17.0391 9.7091 17.0022 9.4414 16.8948L5.65434 15.412H0.404541ZM10.0225 13.0075H5.51408C5.42057 13.0075 5.35057 13.0343 5.30408 13.0877C5.2576 13.1411 5.22741 13.2012 5.21352 13.268C5.19962 13.3348 5.20977 13.3984 5.24397 13.4588C5.27817 13.5192 5.33481 13.5624 5.41389 13.5886L10.0225 15.412V13.0075ZM2.00753 13.809H3.69067C3.66396 13.7289 3.64392 13.6487 3.63056 13.5686C3.6172 13.4884 3.61052 13.4016 3.61052 13.3081C3.61052 12.7871 3.79754 12.3396 4.17157 11.9656C4.5456 11.5916 4.9931 11.4046 5.51408 11.4046H8.78017L13.0682 10.2223C13.135 10.1956 13.1817 10.1622 13.2084 10.1222C13.2352 10.0821 13.2418 10.0353 13.2285 9.9819C13.2151 9.92846 13.1916 9.88518 13.1579 9.85205C13.1243 9.81893 13.0743 9.80209 13.0081 9.80156H4.41202C3.74411 9.80156 3.17638 10.0353 2.70884 10.5029C2.2413 10.9704 2.00753 11.5381 2.00753 12.206V13.809ZM6.01501 7.39707C5.13337 7.39707 4.37862 7.08315 3.75079 6.45532C3.12295 5.82748 2.80903 5.07274 2.80903 4.19109C2.80903 3.30944 3.12295 2.5547 3.75079 1.92686C4.37862 1.29903 5.13337 0.985107 6.01501 0.985107C6.89666 0.985107 7.6514 1.29903 8.27924 1.92686C8.90707 2.5547 9.22099 3.30944 9.22099 4.19109C9.22099 5.07274 8.90707 5.82748 8.27924 6.45532C7.6514 7.08315 6.89666 7.39707 6.01501 7.39707ZM6.01501 5.79408C6.45583 5.79408 6.83334 5.63726 7.14752 5.3236C7.46171 5.00995 7.61854 4.63245 7.618 4.19109C7.61747 3.74973 7.46064 3.3725 7.14752 3.05938C6.83441 2.74626 6.4569 2.58917 6.01501 2.5881C5.57312 2.58703 5.19588 2.74412 4.8833 3.05938C4.57072 3.37463 4.41362 3.75187 4.41202 4.19109C4.41042 4.63031 4.56751 5.00781 4.8833 5.3236C5.19909 5.63939 5.57633 5.79622 6.01501 5.79408Z"
                      fill="#E74694"
                    />
                  </svg>
                  <h3 class="text-2xl font-bold">Monitoring Anak</h3>
                </div>
                <div class="flex items-center space-x-4">
                  <p class="text-3xl font-extrabold">{{ data?.checkupChild }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <router-link to="/user/checkup-child">
                  <p class="text-sm text-gray-500">Lihat Detail</p>
                </router-link>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M8.90991 19.9201L15.4299 13.4001C16.1999 12.6301 16.1999 11.3701 15.4299 10.6001L8.90991 4.08008"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="rounded-lg">
            <div
              id="monitoring ibu"
              class="bg-white border border-grey-200 p-6 rounded-lg shadow-md flex flex-col justify-between h-full"
              style="
                background: linear-gradient(
                  135deg,
                  white 60%,
                  /* Warna putih mengisi hingga 60% area */ #e4f1fc 80%,
                  /* Gradasi ke warna pink muda dimulai dari 60% hingga 70% */ #d1e8fa 100%
                    /* Warna pink penuh pada 100% area */
                );
              "
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 11.4737C11.0415 11.4737 10.1046 11.1959 9.30762 10.6754C8.51068 10.1549 7.88953 9.4151 7.52274 8.54955C7.15594 7.68401 7.05997 6.73159 7.24696 5.81273C7.43395 4.89387 7.89551 4.04985 8.57325 3.38739C9.251 2.72493 10.1145 2.27379 11.0546 2.09102C11.9946 1.90825 12.969 2.00205 13.8545 2.36057C14.7401 2.71909 15.4969 3.32623 16.0294 4.1052C16.5619 4.88416 16.8462 5.79998 16.8462 6.73684C16.8447 7.9927 16.3337 9.19673 15.4252 10.0848C14.5167 10.9728 13.2848 11.4723 12 11.4737ZM12 4.10526C11.4675 4.10526 10.947 4.2596 10.5042 4.54877C10.0615 4.83793 9.71641 5.24892 9.51263 5.72978C9.30886 6.21064 9.25554 6.73976 9.35942 7.25024C9.46331 7.76072 9.71973 8.22962 10.0963 8.59765C10.4728 8.96568 10.9525 9.21632 11.4748 9.31786C11.997 9.4194 12.5383 9.36728 13.0303 9.16811C13.5223 8.96893 13.9427 8.63163 14.2386 8.19887C14.5344 7.76611 14.6923 7.25732 14.6923 6.73684C14.6923 6.03891 14.4087 5.36955 13.9037 4.87604C13.3988 4.38252 12.714 4.10526 12 4.10526Z"
                      fill="#E74694"
                    />
                    <path
                      d="M17.9231 22H6.07692C5.79131 22 5.51739 21.8891 5.31542 21.6917C5.11346 21.4943 5 21.2265 5 20.9474V17.7895C5.00171 16.3941 5.56957 15.0564 6.57901 14.0697C7.58845 13.083 8.95705 12.528 10.3846 12.5263H13.6154C15.0429 12.528 16.4116 13.083 17.421 14.0697C18.4304 15.0564 18.9983 16.3941 19 17.7895V20.9474C19 21.2265 18.8865 21.4943 18.6846 21.6917C18.4826 21.8891 18.2087 22 17.9231 22ZM7.15385 19.8947H16.8462V17.7895C16.8462 16.9519 16.5058 16.1487 15.8999 15.5565C15.294 14.9643 14.4722 14.6316 13.6154 14.6316H10.3846C9.52776 14.6316 8.706 14.9643 8.10012 15.5565C7.49423 16.1487 7.15385 16.9519 7.15385 17.7895V19.8947Z"
                      fill="#E74694"
                    />
                  </svg>
                  <h3 class="text-2xl font-bold">Monitoring Ibu</h3>
                </div>
                <div class="flex items-center space-x-4">
                  <p class="text-3xl font-extrabold">{{ data?.checkupMother }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <router-link to="/user/health-mom">
                  <p class="text-sm text-gray-500">Lihat Detail</p>
                </router-link>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M8.90991 19.9201L15.4299 13.4001C16.1999 12.6301 16.1999 11.3701 15.4299 10.6001L8.90991 4.08008"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <!-- jadwal mobile -->
        <div class="w-full md:hidden">
          <div class="">
            <!-- Jadwal Posyandu di samping Total Kunjungan Posyandu -->
            <div class="bg-white p-4 rounded-lg shadow-md flex flex-col overflow-y-auto">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold">Jadwal Posyandu</h3>
                <router-link to="/user/schedule" class="text-gray-500 text-sm"
                  >Lihat Semua</router-link
                >
              </div>
              <ul class="flex-grow">
                <li
                  v-for="item in data?.schedule"
                  :key="item.id"
                  class="mb-3 border-b border-gray-300 pb-3"
                >
                  <div class="flex justify-between">
                    <p class="font-medium">{{ item.healthPost?.name }}</p>
                    <span class="text-black">
                      {{ DateTime.fromISO(item.date).toFormat('dd LLL yyyy') }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <p class="text-gray-500">{{ item.address }}</p>
                    <span class="text-gray-500">
                      {{ DateTime.fromISO(item.open).toFormat('HH:mm') }} -
                      {{ DateTime.fromISO(item.close).toFormat('HH:mm') }}</span
                    >
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- artikel mobile -->

        <div class="flex w-full h-10 md:hidden">
          <div class="w-full h-10">
            <div>
              <div class="flex justify-between items-center mb-2 w-full">
                <h2 class="text-xl font-bold text-black pb-4" style="padding-top: 10px">
                  Artikel Kesehatan
                </h2>
                <router-link to="/user/article" class="text-grey-500 pb-6" style="padding-top: 10px"
                  >Lihat Semua</router-link
                >
              </div>
              <div class="flex overflow-x-auto gap-4 mb-4 h-56 w-full" style="">
                <!-- Card 1 -->
                <div
                  v-for="item in data?.article.slice(0, 3)"
                  :key="item.id"
                  class="bg-white h-56 p-2 rounded-lg shadow-md flex flex-col justify-between"
                >
                  <img
                    class="w-full h-32 object-cover rounded-lg mb-2"
                    :src="item.image?.path"
                    alt="Gambar Artikel"
                  />
                  <div class="flex-grow">
                    <h3 class="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                      {{ item.title }}
                    </h3>
                    <p class="text-xs text-gray-500 text-ellipsis truncate w-60 h-10">
                      {{ item.description }}
                    </p>
                    <div class="flex mb-4 items-center space-x-2">
                      <a
                        :href="`/user/article/${item.id}`"
                        class="text-xs overflow-hidden text-ellipsis text-blue-500 hover:underline"
                      >
                        Baca Selengkapnya
                      </a>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.4184 10.4452C17.4996 10.2325 17.5208 9.99846 17.4794 9.77267C17.438 9.54689 17.3359 9.33951 17.1859 9.17677L12.8999 4.52201C12.8011 4.41086 12.6829 4.32221 12.5521 4.26122C12.4214 4.20024 12.2808 4.16813 12.1385 4.16679C11.9963 4.16545 11.8552 4.19489 11.7235 4.2534C11.5918 4.31192 11.4722 4.39832 11.3716 4.50758C11.271 4.61685 11.1914 4.74678 11.1375 4.88979C11.0836 5.0328 11.0565 5.18604 11.0578 5.34055C11.059 5.49506 11.0886 5.64776 11.1447 5.78974C11.2009 5.93171 11.2825 6.06012 11.3848 6.16747L13.8429 8.83697H3.5715C3.28732 8.83697 3.01478 8.95958 2.81383 9.17781C2.61289 9.39604 2.5 9.69203 2.5 10.0007C2.5 10.3093 2.61289 10.6053 2.81383 10.8235C3.01478 11.0418 3.28732 11.1644 3.5715 11.1644H13.8429L11.3859 13.8327C11.2836 13.94 11.202 14.0684 11.1458 14.2104C11.0896 14.3524 11.0601 14.5051 11.0588 14.6596C11.0576 14.8141 11.0847 14.9674 11.1386 15.1104C11.1925 15.2534 11.272 15.3833 11.3726 15.4926C11.4732 15.6018 11.5929 15.6882 11.7246 15.7468C11.8562 15.8053 11.9973 15.8347 12.1396 15.8334C12.2819 15.832 12.4225 15.7999 12.5532 15.7389C12.6839 15.6779 12.8022 15.5893 12.901 15.4782L17.187 10.8234C17.2863 10.7151 17.3649 10.5865 17.4184 10.4452Z"
                          fill="#E74694"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- tampilan desktop -->
        <div class="w-full hidden md:flex">
          <div class="w-3/4">
            <div>
              <div class="flex justify-between items-center mb-2 w-full">
                <h2 class="text-base font-medium text-black pb-4" style="padding-top: 10px">
                  Artikel Kesehatan
                </h2>
                <router-link to="/user/article" class="text-grey-500 pb-6" style="padding-top: 10px"
                  >Lihat Semua</router-link
                >
              </div>
              <div class="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-4" style="">
                <!-- Card 1 -->
                <div
                  v-for="item in data?.article.slice(0, 3)"
                  :key="item.id"
                  class="bg-white border border-gray-200 p-4 rounded-lg w-[253.67] h-[242] shadow-md flex flex-col justify-between"
                >
                  <img
                    class="w-full h-32 object-cover rounded-lg mb-2"
                    :src="item.image?.path"
                    alt="Gambar Artikel"
                  />
                  <div>
                    <h3 class="font-bold text-base">{{ item.title }}</h3>
                    <p class="text-gray-500 text-xs truncate">
                      {{ item.description }}
                    </p>
                    <div class="flex text-xs items-center space-x-2">
                      <a :href="`/user/article/${item.id}`" class="text-blue-500 hover:underline">
                        Baca Selengkapnya
                      </a>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M17.4184 10.4452C17.4996 10.2325 17.5208 9.99846 17.4794 9.77267C17.438 9.54689 17.3359 9.33951 17.1859 9.17677L12.8999 4.52201C12.8011 4.41086 12.6829 4.32221 12.5521 4.26122C12.4214 4.20024 12.2808 4.16813 12.1385 4.16679C11.9963 4.16545 11.8552 4.19489 11.7235 4.2534C11.5918 4.31192 11.4722 4.39832 11.3716 4.50758C11.271 4.61685 11.1914 4.74678 11.1375 4.88979C11.0836 5.0328 11.0565 5.18604 11.0578 5.34055C11.059 5.49506 11.0886 5.64776 11.1447 5.78974C11.2009 5.93171 11.2825 6.06012 11.3848 6.16747L13.8429 8.83697H3.5715C3.28732 8.83697 3.01478 8.95958 2.81383 9.17781C2.61289 9.39604 2.5 9.69203 2.5 10.0007C2.5 10.3093 2.61289 10.6053 2.81383 10.8235C3.01478 11.0418 3.28732 11.1644 3.5715 11.1644H13.8429L11.3859 13.8327C11.2836 13.94 11.202 14.0684 11.1458 14.2104C11.0896 14.3524 11.0601 14.5051 11.0588 14.6596C11.0576 14.8141 11.0847 14.9674 11.1386 15.1104C11.1925 15.2534 11.272 15.3833 11.3726 15.4926C11.4732 15.6018 11.5929 15.6882 11.7246 15.7468C11.8562 15.8053 11.9973 15.8347 12.1396 15.8334C12.2819 15.832 12.4225 15.7999 12.5532 15.7389C12.6839 15.6779 12.8022 15.5893 12.901 15.4782L17.187 10.8234C17.2863 10.7151 17.3649 10.5865 17.4184 10.4452Z"
                          fill="#E74694"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:w-1/4 md:flex">
            <div class="pl-3 w-full">
              <!-- Jadwal Posyandu di samping Total Kunjungan Posyandu -->
              <div
                class="bg-white p-4 rounded-lg shadow-md flex flex-col py-4 overflow-y-auto w-full"
              >
                <div class="flex justify-between items-center mb-2">
                  <h3 class="font-bold text-base">Jadwal Posyandu</h3>
                  <router-link to="/user/schedule" class="text-gray-500 text-sm text-right"
                    >Lihat Semua</router-link
                  >
                </div>
                <ul class="flex-grow">
                  <li
                    v-for="item in data?.schedule"
                    :key="item.id"
                    class="border-b border-gray-300 pb-4 pt-4"
                  >
                    <div class="flex justify-between">
                      <p class="font-medium text-sm">{{ item.healthPost?.name }}</p>
                      <span class="text-black text-sm text-right">{{
                        DateTime.fromISO(item.startAt).toFormat('dd LLL yyyy')
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <p class="text-gray-500 text-xs">{{ item.address }}</p>
                      <div class="flex items-center">
                        <p class="text-gray-500 text-xs text-right">
                          {{ DateTime.fromISO(item.startAt).toFormat('HH:mm') }} -
                          {{ DateTime.fromISO(item.endAt).toFormat('HH:mm') }}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Artikel -->

        <!-- Seksi Artikel -->
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
}
</style>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
