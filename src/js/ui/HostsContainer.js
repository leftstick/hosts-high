'use strict';

var HostsService = require('../service/HostsService');
var AgGrid = require('ag-grid/dist/ag-grid');
var cellRenderer = require('./CellRenderer');

var getRefresher = function(options) {
    return function() {
        HostsService
            .get()
            .then(function(data) {
                return options.api.setRowData(data);
            })
            .then(function() {
                setTimeout(function() {
                    options.api.sizeColumnsToFit();
                });
            });
    };
};

var initOptions = function(options, columnDefs) {
    options.enableColResize = true;
    options.enableSorting = true;
    options.columnDefs = columnDefs;
    options.rowData = null;
    options.rowHeight = 30;
    options.enableRangeSelection = true;
};

var create = function() {
    var gridOptions = {};

    var refresher = getRefresher(gridOptions);

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
            cellRenderer: cellRenderer(refresher),
            cellStyle: {
                'text-align': 'center'
            }
        }
    ];

    initOptions(gridOptions, columnDefs);

    // eslint-disable-next-line
    new AgGrid.Grid(document.querySelector('#hosts'), gridOptions);

    return {gridApi: gridOptions.api, refresher: refresher};
};

module.exports.create = create;
