'use strict';

var addFilter = function(opts) {
    document.querySelector('#filter').addEventListener('input', function(e) {
        opts.api.setQuickFilter(e.target.value);
    }, false);
};

module.exports = addFilter;
