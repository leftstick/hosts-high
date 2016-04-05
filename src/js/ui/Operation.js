'use strict';

var HostsService = require('../service/HostsService');

var operation = function(refreshData) {

    return function(params) {
        var button = document.createElement('span');

        button.innerHTML = '<button id="removeBtn">-</button>';

        button.querySelector('#removeBtn').addEventListener('click', function(e) {
            HostsService
                .remove(params.data)
                .then(refreshData)
                .catch(alert);
        });

        return button;
    };
};

module.exports = operation;
