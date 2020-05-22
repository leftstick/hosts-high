import { useEffect, useCallback } from 'react'
import { constants, access } from 'fs'
import sudo from 'sudo-prompt'
import { useLocalStorageState } from '@umijs/hooks'

import { HOSTS, PERMISSION_CMD } from '@/helpers'

const ALIAS_PREFIX = 'hosts_alias'

const { R_OK, W_OK } = constants

function usePermissionModel() {
  const [acquired, setAcquired] = useLocalStorageState(`${ALIAS_PREFIX}_permission_acquired`, false)

  const checkAcquired = useCallback(() => {
    return new Promise(function (resolve, reject) {
      access(HOSTS, R_OK | W_OK, (err) => {
        setAcquired(!err)
        return resolve(!err)
      })
    })
  }, [setAcquired])

  useEffect(() => {
    checkAcquired()
  }, [checkAcquired])

  const permissionAcquired = useCallback(() => {
    return checkAcquired().then((hasPermission) => {
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
  }, [checkAcquired, setAcquired])

  return {
    acquired,
    permissionAcquired,
  }
}

export default usePermissionModel

function requestPermission() {
  const options = {
    name: 'Hosts Master',
  }
  return new Promise(function (resolve, reject) {
    sudo.exec(PERMISSION_CMD, options, function (err) {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}
