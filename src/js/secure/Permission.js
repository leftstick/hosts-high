import { HOSTS, PERMISSION_CMD } from './OS'
import { R_OK, W_OK, access } from 'fs'

import sudo from 'sudo-prompt'

export function hasPermission() {
  return new Promise(function(resolve, reject) {
    access(HOSTS, R_OK | W_OK, function(err) {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

export function prompt() {
  const options = {
    name: 'Hosts High'
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
