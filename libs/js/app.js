'use strict';

require('jquery');
require('materialize-css/js/global');
require('materialize-css/js/forms');
require('materialize-css/dist/css/materialize.css');
require('../../css/icons.css');

var AgGrid = require('ag-grid/dist/ag-grid');

var HostsService = require('./service/HostsService');
var addHosts = require('./ui/addHosts');
var addFilter = require('./ui/AddFilter');
var copyCell = require('./ui/CopyCell');
var editAlias = require('./ui/EditAlias');
var operation = require('./ui/Operation');

document.body.style.display = 'block';

var gridOptions,
    rowData = [];

var refreshData = function(data) {
    rowData.length = 0;
    rowData.push(...data);
    gridOptions.api.setRowData(rowData);
    setTimeout(function() {
        gridOptions.api.sizeColumnsToFit();
    });
};

var cellStyle = {'line-height': '27px'};

var columnDefs = [
    {
        headerName: 'Alias',
        field: 'alias',
        width: 60,
        cellStyle: cellStyle,
        editable: true
    },
    {
        headerName: 'IP Address',
        field: 'ip',
        width: 120,
        cellStyle: cellStyle
    },
    {
        headerName: 'Domain',
        field: 'domain',
        cellStyle: cellStyle
    },
    {
        headerName: 'Operation',
        field: 'oper',
        width: 50,
        cellRenderer: operation(rowData, refreshData),
        cellStyle: {
            'text-align': 'center'
        }
    }
];

gridOptions = {
    enableColResize: true,
    enableSorting: true,
    columnDefs: columnDefs,
    rowData: null,
    rowHeight: 30,
    enableRangeSelection: true
};

new AgGrid.Grid(document.querySelector('#hosts'), gridOptions);

HostsService
    .get()
    .then(refreshData)
    .catch(alert);

addFilter(gridOptions);
addHosts(rowData, refreshData);
copyCell(gridOptions);
editAlias(gridOptions);
