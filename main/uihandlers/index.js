const { ipcMain } = require('electron');
const { resolve } = require('path');
const { readdir } = require('fs');

module.exports = function () {
  readdir(__dirname, (err, files) => {
    const handlerFiles = files.filter(
      (f) => !f.endsWith('index.js') && !f.startsWith('_'),
    );

    const handlerModules = handlerFiles.map((m) =>
      require(resolve(__dirname, m)),
    );
    handlerModules.forEach((mod) => {
      const methods = Object.keys(mod);
      methods.forEach((method) => {
        mod[method]();
      });
    });
  });
};
