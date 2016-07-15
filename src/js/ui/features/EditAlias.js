'use strict';

var ALIAS_PREFIX = 'hosts_alias_';

var editAlias = function(api) {
    api.addEventListener('cellValueChanged', function(e) {
        if (e.colDef.field !== 'alias') {
            return;
        }
        if (e.data.alias) {
            localStorage.setItem(ALIAS_PREFIX + e.data.ip, e.data.alias);
        } else {
            localStorage.removeItem(ALIAS_PREFIX + e.data.ip);
        }
    });
};

module.exports = editAlias;
