'use strict';

var HostsService = require('../service/HostsService');
var permission = require('../secure/Permission');

var CellRenderer = function(refreshData) {

    return function(params) {
        var opers = document.createElement('div');

        opers.innerHTML = '<button id="removeBtn">-</button>&nbsp;&nbsp;<button id="statusBtn" class="'
            + (params.data.disabled ? 'disabled' : '') +
            '"></button>';

        opers.querySelector('#removeBtn').addEventListener('click', function(e) {
            if(!confirm("Are you sure to delete?"))
                return;
            e.stopPropagation();
            e.preventDefault();
            HostsService
                .remove(params.data)
                .then(refreshData, function() {
                    return permission.prompt();
                })
                .then(function() {
                    if (!HostsService.isPermissionSet()) {
                        HostsService.addPermission();
                    }
                })
                .catch(alert);
        });

        opers.querySelector('#statusBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var _this = this;
            HostsService
                .toggleDisable(params.data)
                .then(function(host) {
                    if (host.disabled) {
                        _this.classList.add('disabled');
                    } else {
                        _this.classList.remove('disabled');
                    }
                    refreshData();
                }, function() {
                    return permission.prompt();
                })
                .then(function() {
                    if (!HostsService.isPermissionSet()) {
                        HostsService.addPermission();
                    }
                })
                .catch(alert);
        });

        return opers;
    };
};

module.exports = CellRenderer;
