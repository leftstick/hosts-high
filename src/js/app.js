'use strict';

require('jquery');
require('materialize-css/js/global');
require('materialize-css/js/forms');
require('materialize-css/dist/css/materialize.css');
require('../../css/icons.css');

var permission = require('./secure/Permission');

var createTable = require('./ui/HostsTable');

var service = require('./service/HostsService');

document.body.style.display = 'block';

createTable();

permission
    .hasPermission()
    .then(function() {}, function(err) {
        return permission.prompt();
    })
    .then(function() {
        if (!service.isPermissionSet()) {
            service.addPermission();
            require('electron').remote.getCurrentWindow().reload();
        }
    })
    .catch(alert);
