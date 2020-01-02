import { useEffect, useCallback } from 'react'
import { createModel } from 'hox'
import { R_OK, W_OK, access } from 'fs'
import sudo from 'sudo-prompt'
import { useLocalStorageState } from '@umijs/hooks'

import { HOSTS, PERMISSION_CMD } from '@/helpers/os'

const ALIAS_PREFIX = 'hosts_alias'

function usePermissionModel() {
  const [acquired, setAcquired] = useLocalStorageState(`${ALIAS_PREFIX}_permission_acquired`, false)

  const checkAcquired = useCallback(() => {
    return new Promise(function(resolve, reject) {
      access(HOSTS, R_OK | W_OK, err => {
        setAcquired(!err)
        return resolve(!err)
      })
    })
  }, [setAcquired])

  useEffect(() => {
    checkAcquired()
  }, [checkAcquired])

  function permissionAcquired() {
    return checkAcquired().then(hasPermission => {
      if (hasPermission) {
        return
      }
      return requestPermission().then(
        () => {
          setAcquired(true)
          return true
        },
        () => {
          setAcquired(false)
          return false
        }
      )
    })
  }

  return {
    acquired,
    permissionAcquired
  }
}

export default createModel(usePermissionModel)

function requestPermission() {
  const options = {
    name: 'Hosts Master'
  }
  return new Promise(function(resolve, reject) {
    sudo.exec(PERMISSION_CMD, options, function(err) {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}
