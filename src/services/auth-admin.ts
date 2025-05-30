import { API } from '@/composable/http/api-constant'
import { useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { useRouter } from 'vue-router'

const { message } = createDiscreteApi(['message'])

export const useAdminSignin = () => {
  const router = useRouter()
  return useHttpMutation(API.AUTH_ADMIN_SIGNIN, {
    method: 'POST',
    queryOptions: {
      onSuccess: ({ data }) => {
        localStorage.setItem('adminToken', data.token)
        message.success('Login berhasil')
        router.push('/admin/dashboard')
      },
      onError: (error) => {
        message.error(error.data.message || 'Password atau email Anda salah')
      }
    }
  })
}

//forgot password
// export const useUserRequestOTP = () => {
//   const router = useRouter()
//   return useHttpMutation(API.AUTH_POST_ADMIN_REQUEST_FORGOT_OTP, {
//     method: 'POST',
//     queryOptions: {
//       onSuccess: () => {
//         message.success('Nomor Telepon Terverifikasi')
//         // router.push('/auth/input-otp-forgotpass')
//       },
//       onError: () => {
//         message.error('Nomor Telepon Salah')
//       }
//     }
//   })
// }

// export const useUserOTPForgotPassword = () => {
//   const router = useRouter()
//   return useHttpMutation(API.AUTH_POST_ADMIN_VERIFY_FORGOT_OTP, {
//     method: 'POST',
//     queryOptions: {
//       onSuccess: () => {
//         message.success('Kode OTP Benar')
//         router.push('/auth/admin-login')
//       },
//       onError: () => {
//         message.error('Kode OTP Salah')
//       }
//     }
//   })
// }

// export const useUserResendOTPForgotPassword = () => {
//   return useHttpMutation(API.AUTH_POST_RESEND_FORGOT_OTP, {
//     method: 'POST'
//   })
// }

// export const useUserNewPasswordForgotPassword = () => {
//   const router = useRouter()
//   return useHttpMutation(API.AUTH_POST_ADMIN_RESEND_FORGOT_OTP, {
//     method: 'POST',
//     queryOptions: {
//       onSuccess: () => {
//         message.success('Password Berhasil')
//         router.push('/auth/admin-login')
//       },
//       onError: () => {
//         message.error('Password Gagal')
//       }
//     }
//   })
// }
