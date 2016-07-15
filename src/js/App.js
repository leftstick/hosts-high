'use strict';

var permission = require('./secure/Permission');

var container = require('./ui/HostsContainer');

var setHostsForm = require('./ui/features/HostsForm');
var setFilter = require('./ui/features/Filter');
var setCopyCell = require('./ui/features/CopyCell');
var setEditAlias = require('./ui/features/EditAlias');

var service = require('./service/HostsService');

class App {
    constructor() {}

    loadExtraAssets() {
        require('jquery');
        require('materialize-css/js/global');
        require('materialize-css/js/forms');
        require('materialize-css/dist/css/materialize.css');
        require('../../css/icons.css');
    }

    displayView() {
        document.body.style.display = 'block';
    }

    createContainer() {
        this.options = container.create();
    }

    registerFeatures(options) {
        setFilter(options.gridApi);
        setHostsForm(options.refresher);
        setCopyCell(options.gridApi);
        setEditAlias(options.gridApi);
    }

    verifyPermission() {
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
    }

    start() {
        this.loadExtraAssets();
        this.displayView();
        this.createContainer();
        this.registerFeatures(this.options);
        this.options.refresher();

        this.verifyPermission();
    }
}

module.exports = App;
