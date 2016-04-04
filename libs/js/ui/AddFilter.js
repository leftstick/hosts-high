'use strict';

var addFilter = function(app) {
    document.querySelector('#filter').addEventListener('input', function(e) {
        api.setQuickFilter(e.target.value);
    }, false);
};

module.exports = addFilter;
