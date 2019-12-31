import os from 'os'

const isWindows = process.platform === 'win32'

export const HOSTS = isWindows ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts'

export const PERMISSION_CMD = isWindows ? 'icacls ' + HOSTS + ' /grant "Users":F' : 'chmod ugo+rw ' + HOSTS

export const USER =
  process.env.USER ||
  (process.env.USERPROFILE && process.env.USERPROFILE.split(require('path').sep)[2]) ||
  os.userInfo({ encoding: 'utf8' })
