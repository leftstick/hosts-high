'use strict';

require('jquery');
require('materialize-css/js/global');
require('materialize-css/js/forms');
require('materialize-css/dist/css/materialize.css');
require('../../css/icons.css');
var hostile = require('hostile');
var AgGrid = require('ag-grid/dist/ag-grid');

document.body.style.display = 'block';

var gridOptions;

var rowData;

var refreshData = function(data) {
    gridOptions.api.setRowData(data);
    setTimeout(function() {
        gridOptions.api.sizeColumnsToFit();
    });
};

var cellRenderer = function(params) {
    var button = document.createElement('span');

    button.innerHTML = '<button id="removeBtn">-</button>';

    button.querySelector('#removeBtn').addEventListener('click', function(e) {
        hostile.remove(params.data.ip, params.data.domain, function(err) {
            if (err) {
                return alert('failed deleting ' + params.data.ip +
                    '\n\n Please Make sure you have permission to modify /etc/hosts file');
            }
            rowData = rowData.filter(d => d.ip !== params.data.ip);
            localStorage.removeItem('hosts_alias_' + params.data.ip);
            refreshData(rowData);
        });
    });

    return button;
};

var cellStyle = {'line-height': '27px'};

var columnDefs = [
    {
        headerName: 'Alias',
        field: 'alias',
        width: 60,
        cellStyle: cellStyle
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
        cellRenderer: cellRenderer,
        cellStyle: {
            'text-align': 'center'
        }
    }
];

var getContextMenuItems = function(params) {
    var result = ['copy'];
    return result;
};

gridOptions = {
    enableColResize: true,
    enableSorting: true,
    columnDefs: columnDefs,
    rowData: null,
    rowHeight: 30,
    enableRangeSelection: true,
    getContextMenuItems: getContextMenuItems
};

new AgGrid.Grid(document.querySelector('#hosts'), gridOptions);

hostile.get(false, function(error, lines) {
    if (error) {
        console.error(error.message)
    }
    rowData = lines.map(line => {
        var ip = line[0];
        var domain = line[1];
        return {
            alias: localStorage.getItem('hosts_alias_' + ip),
            ip: ip,
            domain: domain
        };
    });
    refreshData(rowData);
});

document.querySelector('#filter').addEventListener('input', function(e) {
    gridOptions.api.setQuickFilter(e.target.value);
}, false);

var aliasInput = document.querySelector('#alias');
var ipInput = document.querySelector('#ipaddress');
var domainInput = document.querySelector('#domain');
var addHostBtn = document.querySelector('#addHostBtn');

var toggleClass = function(node, bool) {
    node.classList.remove(bool ? 'invalid' : 'valid');
    node.classList.add(bool ? 'valid' : 'invalid');

    if (aliasInput.classList.contains('invalid') || ipInput.classList.contains('invalid') || domainInput.classList.contains('invalid')) {
        addHostBtn.classList.add('disabled');
    } else {
        addHostBtn.classList.remove('disabled');
    }
};

var aliasReg = /^\w{0,10}$/;
aliasInput.addEventListener('input', function(e) {
    toggleClass(e.target, aliasReg.test(e.target.value));
}, false);

var ipReg = /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
ipInput.addEventListener('input', function(e) {
    toggleClass(e.target, ipReg.test(e.target.value));
}, false);

domainInput.addEventListener('input', function(e) {
    toggleClass(e.target, /^[\w\.\s]{1,50}$/.test(e.target.value));
}, false);


addHostBtn.addEventListener('click', function() {
    var d = {
        alias: aliasInput.value,
        ip: ipInput.value,
        domain: domainInput.value
    };
    hostile.set(d.ip, d.domain, function(err) {
        if (err) {
            return alert('failed adding ' + d.ip +
                '\n\n Please Make sure you have permission to modify /etc/hosts file');
        }
        if (d.alias) {
            localStorage.setItem('hosts_alias_' + d.ip, d.alias);
        }
        rowData.unshift(d);
        refreshData(rowData);
        aliasInput.value = '';
        ipInput.value = '';
        domainInput.value = '';
    });
}, false);

var toast = document.querySelector('#toast span');

gridOptions.api.addEventListener('cellDoubleClicked', function(e) {
    toast.innerText = 'Copied: ' + e.value;
    toast.style.opacity = 0;
    setTimeout(function() {
        toast.innerText = '';
        toast.style.opacity = 1;
    }, 1500);
    require('electron').clipboard.writeText(e.value);
});
