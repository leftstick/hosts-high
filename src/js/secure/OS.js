'use strict';

var isWindows = process.platform === 'win32';

var hosts = isWindows
    ? 'C:/Windows/System32/drivers/etc/hosts'
    : '/etc/hosts';

module.exports.HOSTS = hosts;

module.exports.PERMISSION_CMD = isWindows ? 'cacls ' + hosts + ' /g f' : 'chmod u+rw ' + hosts;

module.exports.USER = process.env.USER || process.env.USERPROFILE.split(require('path').sep)[2];
