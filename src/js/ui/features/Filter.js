'use strict';

var addFilter = function(api) {
    document.querySelector('#filter').addEventListener('input', function(e) {
        api.setQuickFilter(e.target.value);
    }, false);
};

module.exports = addFilter;
