'use strict';

var HostsService = require('../service/HostsService');

var operation = function(rowData, refreshData) {

    return function(params) {
        var button = document.createElement('span');

        button.innerHTML = '<button id="removeBtn">-</button>';

        button.querySelector('#removeBtn').addEventListener('click', function(e) {
            HostsService
                .remove(params.data)
                .then(host => {
                    refreshData(rowData.filter(d => d.ip !== host.ip));
                })
                .catch(alert);
        });

        return button;
    };
};

module.exports = operation;
