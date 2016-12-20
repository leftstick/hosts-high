
const isWindows = process.platform === 'win32';

const hosts = isWindows ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';

const user = process.env.USER || process.env.USERPROFILE.split(require('path').sep)[2];

export const HOSTS = hosts;

export const PERMISSION_CMD = isWindows ? 'icacls ' + hosts + ' /grant "Users":F' : 'chmod ugo+rw ' + hosts;

export const USER = user;
