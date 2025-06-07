import { API } from '@/composable/http/api-constant'
import { useHttp } from '@/composable/http/http'
import { type Ref } from 'vue'

export const useAdminReadDashboard = (params: Ref<Record<string, any>>) =>
    useHttp(API.ADMIN_GET_DASHBOARD_ADMIN, {
      params
    })