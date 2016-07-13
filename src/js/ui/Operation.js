'use strict';

var HostsService = require('../service/HostsService');
var permission = require('../secure/Permission');

var operation = function(refreshData) {

    return function(params) {
        var opers = document.createElement('div');

        opers.innerHTML = '<button id="removeBtn">-</button>&nbsp;&nbsp;<button id="statusBtn"></button>';

        opers.querySelector('#removeBtn').addEventListener('click', function(e) {
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
                .catch(alert);;
        });

        opers.querySelector('#statusBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (this.classList.contains('enabled')) {
                this.classList.remove('enabled');
            } else {
                this.classList.add('enabled');
            }
        });

        return opers;
    };
};

module.exports = operation;
