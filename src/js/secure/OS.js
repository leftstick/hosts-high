'use strict';

var isWindows = process.platform === 'win32';

var hosts = isWindows ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';

var user = process.env.USER || process.env.USERPROFILE.split(require('path').sep)[2];

module.exports.HOSTS = hosts;

module.exports.PERMISSION_CMD = isWindows ? 'icacls ' + hosts + ' /grant "Users":F' : 'chmod ugo+rw ' + hosts;

module.exports.USER = user;
