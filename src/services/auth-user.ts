import { API } from '@/composable/http/api-constant'
import { useHttp, useHttpMutation } from '@/composable/http/http'
import { createDiscreteApi } from 'naive-ui'
import { useRouter } from 'vue-router'

const { message } = createDiscreteApi(['message'])

export interface Data {
  id: string
  identityNumber: any
  email: any
  password: any
  pin: string
  phone: string
  otp: any
  fullName: string
  address: string
  dateOfBirth: string
  placeOfBirth: string
  status: string
  subDistrictId: string
  districtId: string
  regencyId: string
  provinceId: any
  userPictureId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  Otp: Otp[]
  userPicture: UserPicture
  province: any
  regency: Regency
  district: District
  subDistrict: SubDistrict
}

export interface Otp {
  id: string
  otp: string
  userId: string
  adminId: any
  createdAt: string
  expiresAt: string
  isVerified: boolean
}

export interface UserPicture {
  id: string
  fileName: string
  path: string
  mimeType: string
  size: number
  type: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Regency {
  id: string
  name: string
  provinceId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface District {
  id: string
  name: string
  regencyId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface SubDistrict {
  id: string
  name: string
  districtId: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export const useUserSignin = () => {
  const router = useRouter()
  return useHttpMutation<{
    data: { token: string; user: { identityNumber: string; status: string } }
  }>(API.AUTH_USER_LOGIN, {
    method: 'POST',
    queryOptions: {
      onSuccess: ({ data }) => {
        console.log(data)
        message.success('Berhasil masuk')
        localStorage.setItem('userToken', data.token)
        console.log(data.token)
        if (data.user.status == 'INACTIVE') {
          return router.push('/auth/input-otp')
        }
        if (data.user.status == 'ACTIVE') {
          return router.push('/user/dashboard')
        }
        // if (!data.user.identityNumber) {
        //   return router.push('/auth/registration-parent')
        // }
      },
      onError: (error) => {
        // message.error('Password atau email anda salah')
        message.error(error.data.message)
      }
    }
  })
}
export const useUserSignup = () => {
  const router = useRouter()
  return useHttpMutation(API.AUTH_USER_SIGNUP, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Registrasi berhasil')
        router.push('/auth/user-login')
      },
      onError: () => {
        message.error('Password atau email anda salah')
      }
    }
  })
}

export const useAuthProfile = () => useHttp(API.AUTH_GET_PROFILE, {})
export const useAuthProfileAdmin = () => useHttp(API.AUTH_GET_PROFILE_ADMIN, {})

// export const useUserAccountRegistration = () => {
//   const router = useRouter()
//   return useHttpMutation(API.AUTH_USER_REGISTRATION, {
//     method: 'PUT',
//     queryOptions: {
//       onSuccess: () => {
//         message.success('Registrasi Data Diri Berhasil')
//         router.push('/auth/list-data-child')
//       },
//       onError: () => {
//         message.error('Registrasi Data Diri Gagal')
//       }
//     }
//   })
// }

export const useUserOTPVerification = () => {
  const router = useRouter()
  return useHttpMutation(API.AUTH_POST_VERIFY_OTP, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Kode OTP Benar')
        router.push('/auth/registration-parent')
      },
      onError: () => {
        message.error('Kode OTP Salah')
      }
    }
  })
}

export const useUserResendOTP = () => {
  return useHttpMutation(API.AUTH_POST_RESEND_OTP, {
    method: 'POST'
  })
}

// export const useUserDelete = (id: Ref<string>) => {
//   const router = useRouter()
//   // const url = computed(() => {
//   //   return API.USER_DELETE_BYID.replace('{id}', unref(id))
//   // })
//   return useHttpMutation(API.USER_DELETE_BYID.replace('{id}', unref(id)), {
//     method: 'DELETE',
//     queryOptions: {
//       onSuccess: () => {
//         message.success('Akun berhasil dihapus')
//         router.push('/auth/user-login')
//       },
//       onError: (error) => {
//         message.error(error.data.message)
//       }
//     }
//   })
// }
// export const useUserById = (id: Ref<string>) => {
//   const url = computed(() => {
//     return API.USER_GET_USER_BYID.replace('{id}', unref(id))
//   })

//   return useHttp(url)
// }

// forgot password
export const useUserRequestOTP = () => {
  const router = useRouter()
  return useHttpMutation(API.AUTH_POST_REQUEST_FORGOT_OTP, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Nomor Telepon Terverifikasi')
        // router.push('/auth/input-otp-forgotpass')
      },
      onError: () => {
        message.error('Nomor Telepon Salah')
      }
    }
  })
}

export const useUserOTPForgotPassword = () => {
  const router = useRouter()
  return useHttpMutation(API.AUTH_POST_VERIFY_FORGOT_OTP, {
    method: 'POST',
    queryOptions: {
      onSuccess: () => {
        message.success('Kode OTP Benar')
        router.push('/auth/user-login')
      },
      onError: () => {
        message.error('Kode OTP Salah')
      }
    }
  })
}

export const useUserResendOTPForgotPassword = () => {
  return useHttpMutation(API.AUTH_POST_RESEND_FORGOT_OTP, {
    method: 'POST'
  })
}

// export const useUserNewPasswordForgotPassword = () => {
//   const router = useRouter()
//   return useHttpMutation(API.AUTH_POST_NEW_PASSWORD, {
//     method: 'POST',
//     queryOptions: {
//       onSuccess: () => {
//         message.success('Password Berhasil')
//         router.push('/auth/login')
//       },
//       onError: () => {
//         message.error('Password Gagal')
//       }
//     }
//   })
// }
