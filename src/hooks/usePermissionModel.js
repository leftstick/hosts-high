import { createModel } from 'hox'
import { R_OK, W_OK, access } from 'fs'
import sudo from 'sudo-prompt'
import { useLocalStorageState } from '@umijs/hooks'

import { HOSTS, PERMISSION_CMD } from '@/helpers/os'

const ALIAS_PREFIX = 'hosts_alias'

function usePermissionModel() {
  const [acquired, setAcquired] = useLocalStorageState(`${ALIAS_PREFIX}_permission_acquired`, false)

  console.log('acquired', acquired)
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

  function permissionAcquired() {
    return new Promise(function(resolve, reject) {
      access(HOSTS, R_OK | W_OK, function(err) {
        if (!err) {
          return resolve(true)
        }

        requestPermission().then(
          () => {
            setAcquired(true)
            resolve(true)
          },
          () => {
            setAcquired(false)
            resolve(false)
          }
        )
      })
    })
  }

  return {
    acquired,
    permissionAcquired
  }
}

export default createModel(usePermissionModel)
