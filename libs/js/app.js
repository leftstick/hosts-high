'use strict';

require('jquery');
require('materialize-css/js/global');
require('materialize-css/js/forms');
require('materialize-css/dist/css/materialize.css');
require('../../css/icons.css');

var addHosts = require('./ui/addHosts');
var addFilter = require('./ui/AddFilter');
var copyCell = require('./ui/CopyCell');
var editAlias = require('./ui/EditAlias');

var hostsTable = require('./ui/hostsTable');

document.body.style.display = 'block';


var app = hostsTable();

addFilter(app.api);
addHosts(app.refreshData);
copyCell(app.api);
editAlias(app.api);
