'use strict';

var HostsService = require('../service/HostsService');
var AgGrid = require('ag-grid/dist/ag-grid');
var operation = require('./Operation');

var hostsTable = function() {
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

    return {api: gridOptions.api, refreshData};
};

module.exports = hostsTable;
