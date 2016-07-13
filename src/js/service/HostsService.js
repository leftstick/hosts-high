'use strict';

var hostile = require('hostile');

var ALIAS_PREFIX = 'hosts_alias_';

var HostsService = {
    get: function() {
        return new Promise(function(resolve, reject) {
            hostile.get(false, function(error, lines) {
                if (error) {
                    return reject(error.message);
                }
                var rowData = lines.map(line => {
                    var ip = line[0];
                    var domain = line[1];
                    return {
                        alias: localStorage.getItem(ALIAS_PREFIX + ip),
                        ip: ip,
                        domain: domain
                    };
                });
                resolve(rowData.reverse());
            });
        });
    },

    add: function(host) {
        return new Promise(function(resolve, reject) {
            hostile.set(host.ip, host.domain, function(err) {
                if (err) {
                    return reject('failed adding ' + host.ip +
                        '\n\n Please Make sure you have permission to modify /etc/hosts file');
                }
                if (host.alias) {
                    localStorage.setItem(ALIAS_PREFIX + host.ip, host.alias);
                }
                resolve(host);
            });
        });
    },

    remove: function(host) {
        return new Promise(function(resolve, reject) {
            hostile.remove(host.ip, host.domain, function(err) {
                if (err) {
                    return reject('failed deleting ' + host.ip +
                        '\n\n Please Make sure you have permission to modify /etc/hosts file');
                }
                localStorage.removeItem(ALIAS_PREFIX + host.ip);
                resolve(host);
            });
        });
    },

    addPermission: function() {
        localStorage.setItem(ALIAS_PREFIX + 'permission', 'true');
    },

    isPermissionSet: function() {
        return !!localStorage.getItem(ALIAS_PREFIX + 'permission');
    }
};

module.exports = HostsService;
