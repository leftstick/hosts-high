'use strict';

var hostile = require('hostile');

var os = require('../secure/OS');

var ALIAS_PREFIX = 'hosts_alias_';

var HostsService = {
    get: function() {
        var str = localStorage.getItem(ALIAS_PREFIX + 'disabledList');
        var list = str ? JSON.parse(str) : [];
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
                resolve(rowData.concat(list).reverse());
            });
        });
    },

    add: function(host) {
        return new Promise(function(resolve, reject) {
            hostile.set(host.ip, host.domain, function(err) {
                if (err) {
                    return reject('failed adding ' + host.ip +
                        '\n\n Please Make sure you have permission to modify ' + os.HOSTS + ' file');
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
                        '\n\n Please Make sure you have permission to modify ' + os.HOSTS + ' file');
                }
                localStorage.removeItem(ALIAS_PREFIX + host.ip);
                resolve(host);
            });
        });
    },

    toggleDisable: function(host) {
        var promise;
        if (host.disabled) {
            promise = this
                .add(host)
                .then(function() {
                    delete host.disabled;
                    var list = JSON.parse(localStorage.getItem(ALIAS_PREFIX + 'disabledList'));
                    var filteredList = list.filter(function(item) {
                        return item.ip !== host.ip || item.domain !== host.domain;
                    });
                    localStorage.setItem(ALIAS_PREFIX + 'disabledList', JSON.stringify(filteredList));
                    return host;
                });
        } else {
            promise = this
                .remove(host)
                .then(function() {
                    host.disabled = true;
                    var str = localStorage.getItem(ALIAS_PREFIX + 'disabledList');
                    var list = str ? JSON.parse(str) : [];
                    list.push(host);
                    localStorage.setItem(ALIAS_PREFIX + 'disabledList', JSON.stringify(list));
                    return host;
                });
        }
        return promise;
    },

    addPermission: function() {
        localStorage.setItem(ALIAS_PREFIX + 'permission', 'true');
    },

    isPermissionSet: function() {
        return !!localStorage.getItem(ALIAS_PREFIX + 'permission');
    }
};

module.exports = HostsService;
