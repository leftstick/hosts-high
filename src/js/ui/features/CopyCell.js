'use strict';

var copyCell = function(api) {
    var toast = document.querySelector('#toast span');

    api.addEventListener('cellDoubleClicked', function(e) {
        if (e.colDef.field === 'alias' || e.colDef.field === 'oper') {
            return;
        }
        toast.innerText = 'Copied: ' + e.value;
        toast.style.opacity = 0;
        setTimeout(function() {
            toast.innerText = '';
            toast.style.opacity = 1;
        }, 1500);
        require('electron').clipboard.writeText(e.value);
    });
};

module.exports = copyCell;
