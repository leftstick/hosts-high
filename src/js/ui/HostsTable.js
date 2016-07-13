'use strict';

var HostsService = require('../service/HostsService');
var AgGrid = require('ag-grid/dist/ag-grid');
var operation = require('./Operation');

var addHosts = require('./addHosts');
var addFilter = require('./AddFilter');
var copyCell = require('./CopyCell');
var editAlias = require('./EditAlias');

var createTable = function() {
    var gridOptions;

    var refreshData = function() {
        HostsService
            .get()
            .then(function(data) {
                return gridOptions.api.setRowData(data);
            })
            .then(function() {
                setTimeout(function() {
                    gridOptions.api.sizeColumnsToFit();
                });
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
            width: 100,
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
            width: 70,
            cellRenderer: operation(refreshData),
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

    refreshData();

    addFilter(gridOptions.api);
    addHosts(refreshData);
    copyCell(gridOptions.api);
    editAlias(gridOptions.api);
};

module.exports = createTable;
