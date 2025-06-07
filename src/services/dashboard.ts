import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'

import { computed, unref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

// export const useUserReadUserById = (id: Ref<string>) => {
//   const url = computed(() => {
//     return API.USER_GET_USER_BYID.replace('{id}', unref(id))
//   })
//   return useHttp(url)
// }

// const { message } = createDiscreteApi(
//     ['message'],
//   )

//   console.log(API.USER_POST)

//   export const useUserPost = () => useHttpMutation(API.USER_POST, {
//     method: 'POST',
//     queryOptions: {
//       onSuccess: () => {
//         message.success('Login berhasil')
//       },
//       onError: (error) => {
//         // message.error('Password atau email anda salah')
//         message.error(error.data.message)
//       }
//     }
//   })

//   export const useUserPutEditProfile = () => {
//     const router = useRouter()
//     return useHttpMutation(API.USER_PUT_PROFILE, {
//       method: 'PUT',
//       queryOptions: {
//         onSuccess: () => {
//           message.success('Update Profile berhasil')
//           router.push('/user/setting-account')
//         },
//         onError: () => {
//           message.error('Update Profile gagal')
//         }
//       }
//     })
//   }

export const useReadDashboard = (params: Ref<Record<string, any>>) =>
  useHttp(API.USER_GET_DASHBOARD, {
    params
  })

export const useReadProfileDashboard = (params: Ref<Record<string, any>>) =>
  useHttp(API.USER_GET_PROFILE_DASHBOARD, {
    params
  })
