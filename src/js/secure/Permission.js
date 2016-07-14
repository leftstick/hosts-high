'use strict';

var fs = require('fs');
var path = require('path');
var os = require('./OS');

var sudo = require('sudo-prompt');

module.exports.hasPermission = function() {

    return new Promise(function(resolve, reject) {
        fs.access(os.HOSTS, fs.R_OK | fs.W_OK, function(err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
};


module.exports.prompt = function() {
    var options = {name: 'Hosts High'};
    return new Promise(function(resolve, reject) {
        sudo.exec(os.PERMISSION_CMD, options, function(err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });

};
