const { ipcMain } = require('electron');
const { spawn } = require('child_process');
const { readFile, writeFile, access, constants } = require('node:fs/promises');
const { toSuccess, toFailure } = require('./_util');

module.exports.getHostsContent = function () {
  ipcMain.handle('read_hosts', async (e, { filePath }) => {
    try {
      const content = await readFile(filePath, { encoding: 'utf-8' });
      const lines = content.split('\n');

      const hosts = lines.map((line) => {
        if (line.startsWith('#') || line === '') {
          return {
            ip: line,
            domain: line,
            disabled: false,
            invalid: true,
            alias: '',
          };
        }
        const firstSpaceIndex = line.indexOf(' ');
        return {
          ip: line.slice(0, firstSpaceIndex),
          domain: line.slice(firstSpaceIndex).trim(),
          disabled: false,
          invalid: false,
          alias: '',
        };
      });

      return toSuccess(hosts);
    } catch (error) {
      return toFailure(error.message);
    }
  });
};

module.exports.saveHostsFile = function () {
  ipcMain.handle('write_hosts', async (e, { filePath, content }) => {
    try {
      await writeFile(filePath, content, { encoding: 'utf-8' });
      return toSuccess(null);
    } catch (error) {
      return toFailure(error.message);
    }
  });
};

module.exports.isFileReadonly = function () {
  ipcMain.handle('is_file_readonly', async (e, { filePath, content }) => {
    try {
      await access(filePath, constants.R_OK | constants.W_OK);
      return toSuccess(false);
    } catch (error) {
      return toSuccess(true);
    }
  });
};

module.exports.changeHostFileMode = function () {
  ipcMain.handle(
    'change_file_writable',
    async (e, { filePath, password, isWindows }) => {
      try {
        if (isWindows) {
          throw new Error('windows is not supported yet');
        }

        await new Promise((resolve, reject) => {
          const shell = spawn('sudo', ['-S', 'chmod', 'ugo+rw', filePath]);
          shell.stdout.setEncoding('utf-8');
          shell.stderr.setEncoding('utf-8');

          let output = '';
          let errput = '';

          shell.stdout.on('data', (data) => {
            output = data.toString();

            if (output.match(/[pP]assword/)) {
              shell.stdin.cork();
              shell.stdin.write(password);
              shell.stdin.uncork();
              shell.stdin.end();
            }
          });

          shell.stderr.on('data', (data) => {
            errput = data.toString();

            if (errput.match(/[pP]assword/)) {
              shell.stdin.cork();
              shell.stdin.write(password);
              shell.stdin.uncork();
              shell.stdin.end();
            }
          });

          shell.on('exit', (code) => {
            if (code === 0) {
              resolve(true);
              return;
            }
            reject(new Error('Password is incorrect!'));
          });
        });

        return toSuccess(true);
      } catch (error) {
        return toFailure(error.message);
      }
    },
  );
};
