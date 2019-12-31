import { useEffect } from 'react'

import { destoryGlobalSpinner } from '@/helpers/view'
import usePermissionModel from '@/hooks/usePermissionModel'

export default ({ children }) => {
  const { permissionAcquired } = usePermissionModel()

  useEffect(() => {
    destoryGlobalSpinner()
  }, [])

  useEffect(() => {
    permissionAcquired()
  }, [permissionAcquired])

  return children
}
