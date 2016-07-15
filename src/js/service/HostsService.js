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
                var hosts = rowData.concat(list);
                hosts.sort(
                    function(a, b) {
                        var aa = a.ip.split('.');
                        var bb = b.ip.split('.');
                        return (aa[0] * 0x1000000 + aa[1] * 0x10000 + aa[2] * 0x100 + aa[3] * 1)
                            - (bb[0] * 0x1000000 + bb[1] * 0x10000 + bb[2] * 0x100 + bb[3] * 1);
                    }
                );
                resolve(hosts);
            });
        });
    },

    add: function(host) {
        var _this = this;

        return this
            .get()
            .then(function(data) {
                var filtered = data.filter(function(item) {
                    return !item.disabled && item.domain === host.domain;
                });
                if (filtered.length > 0) {
                    return _this.toggleDisable(filtered[0]);
                }
            })
            .then(function() {
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
            });
    },

    remove: function(host) {
        if (host.disabled) {
            return new Promise(function(resolve) {
                var list = JSON.parse(localStorage.getItem(ALIAS_PREFIX + 'disabledList'));
                var filteredList = list.filter(function(item) {
                    return item.ip !== host.ip || item.domain !== host.domain;
                });
                localStorage.setItem(ALIAS_PREFIX + 'disabledList', JSON.stringify(filteredList));
                resolve(host);
            });
        }
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
